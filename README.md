# NEXORA

**Smart gear for modern workspaces.** An e-commerce storefront with an admin dashboard, built as a monorepo.

Storefront (browse → cart → checkout → order) and admin dashboard (products, orders, analytics) share one
Express + MongoDB backend.

## Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite, Tailwind CSS, React Router, Axios (Context for cart + auth) |
| Backend | Node.js + Express |
| Database | MongoDB (Atlas) |
| Auth | JWT — admin only, seeded accounts, no registration |
| Deploy | Frontend → Vercel · Backend → Render · DB → Atlas |

## Status

- **Day 1 (backend core):** complete — models, product/order/auth APIs, seed script, error handling.
- **Day 2 (storefront):** complete — landing, listing (search / filter / sort / pagination), product
  details, cart, checkout, confirmation. Vercel deploy pending.
- **Day 3 (admin + analytics), Day 4 (polish):** pending.

## Repository layout

```
HAXCAMP/
├── backend/
│   ├── src/
│   │   ├── config/        env.js (validated config), db.js (Mongoose connection)
│   │   ├── constants/     CATEGORIES, ORDER_STATUSES, PAYMENT_METHODS, page sizes
│   │   ├── controllers/   productController, orderController, authController
│   │   ├── middleware/    errorMiddleware (asyncHandler + single error shape), authMiddleware (JWT)
│   │   ├── models/        Product, Order, Admin, Counter
│   │   ├── routes/        productRoutes, orderRoutes, authRoutes
│   │   ├── utils/         ApiError, query helpers, seed.js, seedData.js
│   │   └── server.js
│   ├── .env.example       committed template — safe to read
│   └── .env               real secrets — gitignored, never committed
├── frontend/
│   ├── src/
│   │   ├── api/           single Axios instance (VITE_API_URL, token, 401 interceptor) + resource modules
│   │   ├── components/    ui/ primitives · layout/ shell · product/ · cart/ · order/ · common/
│   │   ├── context/       CartContext (localStorage), ToastContext
│   │   ├── hooks/         useApiResource, useProducts, useDebounce, useServerHealth, useAddToCart
│   │   ├── lib/           constants, formatters, validation, cart/order storage, cn
│   │   └── pages/store/   Landing, ProductListing, ProductDetails, Cart, Checkout, OrderConfirmation
│   ├── .env.example       VITE_API_URL template
│   └── vercel.json        SPA rewrite + workspace-aware install command
├── .gitignore
├── .npmrc                 forces devDependencies to install (see note below)
├── package.json           npm workspaces root
├── render.yaml            backend blueprint for Render
└── plan-final.md
```

> **Why `.npmrc`?** npm omits `devDependencies` when `NODE_ENV=production` is set in the ambient
> environment. Vite and Tailwind are devDependencies and are required to *build* the frontend, so
> installs would silently skip them and fail with `vite: not recognized`. `include=dev` pins the
> behaviour everywhere, including host builds.

## Running the backend

```bash
npm install                 # from the repo root (installs all workspaces)

cp backend/.env.example backend/.env   # Windows: copy backend\.env.example backend\.env
# then edit backend/.env and set MONGODB_URI + JWT_SECRET

npm run seed                # resets products + admins, inserts 13 demo products
npm run dev                 # http://localhost:5000
```

From the root: `npm run dev`, `npm run start`, `npm run seed` all delegate to the `backend` workspace.

### Environment variables

Everything sensitive lives in `backend/.env` (gitignored). `.env.example` is the committed template.

| Variable | Required | Default | Notes |
|---|---|---|---|
| `MONGODB_URI` | yes | — | Atlas connection string |
| `JWT_SECRET` | yes | — | Long random string used to sign admin tokens |
| `PORT` | no | `5000` | |
| `NODE_ENV` | no | `development` | `production` hides stack traces |
| `JWT_EXPIRES_IN` | no | `1d` | |
| `CORS_ORIGINS` | no | `http://localhost:5173` | Comma-separated allow-list — no wildcard |
| `LOW_STOCK_THRESHOLD` | no | `5` | Used by analytics (Day 3) |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | no | see `.env.example` | Private admin, created by seed |
| `DEMO_ADMIN_NAME` / `DEMO_ADMIN_EMAIL` / `DEMO_ADMIN_PASSWORD` | no | see `.env.example` | Demo admin published in this README |

The server exits immediately on boot if `MONGODB_URI` or `JWT_SECRET` is missing.

## Running the frontend

```bash
npm install                 # from the repo root
npm run dev:web             # http://localhost:5173
npm run build:web           # production build → frontend/dist
```

`VITE_API_URL` in `frontend/.env` points at the API (default `http://localhost:5000`).

### Storefront routes

| Route | Page |
|---|---|
| `/` | Landing — hero, value props, four newest products, categories, brand story |
| `/products` | Listing — `?search=&category=&sort=&page=` (URL is the source of truth, so links are shareable) |
| `/products/:id` | Product details |
| `/cart` | Cart — persisted to localStorage |
| `/checkout` | Validated checkout form → creates the order |
| `/confirmation` | Order confirmation — order number kept in sessionStorage so a refresh still shows it |
| `/admin/*` | Admin dashboard (Day 3) |

## API

All responses are `{ "success": true, "data": ... }` or `{ "success": false, "message": "..." }`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | — | Liveness probe (frontend pings this on load) |
| GET | `/api/products` | — | List products. Query: `search`, `category`, `sort`, `page`, `limit` |
| GET | `/api/products/:id` | — | Single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | **Soft delete** (`isActive: false`) |
| POST | `/api/orders` | — | Create order — server-side pricing + atomic stock decrement |
| GET | `/api/orders` | Admin | List orders. Query: `status`, `page`, `limit` |
| PUT | `/api/orders/:id/status` | Admin | `Pending → Processing → Shipped → Delivered` |
| POST | `/api/auth/login` | — | Admin login → JWT (rate limited: 10 / 10 min) |

`sort` accepts `newest`, `oldest`, `price-asc`, `price-desc`, `name-asc`, `name-desc`.
List endpoints return `{ items, total, page, limit, totalPages }`.

Admin routes take `Authorization: Bearer <token>`.

### Order request body

The client sends **only** product ids, quantities and customer details. Prices and totals are looked up
and computed on the server — a client-sent total is ignored.

```json
{
  "items": [{ "productId": "6512...", "qty": 2 }],
  "customer": { "name": "Riya Sharma", "email": "riya@example.com", "phone": "9876543210" },
  "shippingAddress": {
    "line1": "12 Palm Road", "city": "Navi Mumbai",
    "state": "MH", "postalCode": "400705", "country": "India"
  }
}
```

Stock is decremented with a conditional atomic update
(`{ _id, stock: { $gte: qty } }` + `$inc: { stock: -qty }`). If **any** line fails, every decrement
already applied is rolled back and the API returns **409** — so a partial order can never leak stock.

Each order item stores a **snapshot** (`name`, `price`, `category`, `image`) taken at purchase time, so
later product edits never rewrite historical revenue.

## Seeded data

`npm run seed` wipes products, admins and orders, then inserts 13 demo products and the two admin
accounts below. Product images use placeholder URLs (`picsum.photos`) — replace them with real product
image URLs from the admin UI.

Historical demo orders (for the dashboard charts) are added on Day 3. **The dashboard is pre-populated
with seeded demo orders** — they are real database documents aggregated by real queries, not hardcoded
numbers.

### Demo credentials

| Account | Email | Password |
|---|---|---|
| Demo admin | `demo@nexora.dev` | `Demo@12345` |
| Private admin | value of `ADMIN_EMAIL` in `.env` | value of `ADMIN_PASSWORD` in `.env` |

## Deploying the frontend (Vercel)

Import the repo in Vercel and set:

- **Root Directory:** `frontend`
- **Install Command:** `cd .. && npm install` (already set in `frontend/vercel.json`) — the dependency
  tree lives at the repo root because this is an npm workspace
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment variable:** `VITE_API_URL` = your Render URL, e.g. `https://nexora-api.onrender.com`

`frontend/vercel.json` also contains the SPA rewrite, so refreshing `/products/:id` or `/confirmation`
serves `index.html` instead of a 404.

Then add the Vercel URL to the backend's `CORS_ORIGINS` in Render (comma-separated) — the API rejects
unknown origins by design.

## Deploying the backend (Render)

A `render.yaml` blueprint is committed at the repo root. In Render choose **New > Blueprint**, pick this
repo and Apply — it sets up the build/start commands and health check, and prompts for the secret values
(`sync: false` keeps them out of git).

Equivalent manual settings, if you prefer creating the service by hand:

- Root directory: **repository root** — this is an npm workspace monorepo, so the build runs at the root
- Build command: `npm install`
- Start command: `npm start` (delegates to the `backend` workspace)
- Health check path: `/api/health`

`backend/.env` is gitignored and is **not** deployed — Render injects the variables below directly into
the process environment, and the server reads `PORT` from Render.

| Variable | Value |
|---|---|
| `MONGODB_URI` | your Atlas connection string |
| `JWT_SECRET` | the same long random string as local |
| `NODE_ENV` | `production` |
| `CORS_ORIGINS` | your Vercel URL (comma-separated; add localhost during development) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | private admin credentials |
| `DEMO_ADMIN_EMAIL` / `DEMO_ADMIN_PASSWORD` | demo admin credentials |

In Atlas, add `0.0.0.0/0` to Network Access so Render can reach the cluster.

Render free instances sleep when idle; the frontend shows a "waking up the server…" message on the
first request.
