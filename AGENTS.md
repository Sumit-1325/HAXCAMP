# NEXORA — agent notes

E-commerce storefront + admin dashboard. npm workspace monorepo:
`backend/` (Express 5 + Mongoose 9), `frontend/` (Vite 8 + React 19 + Tailwind v4), MongoDB Atlas.

- **Plan:** `plan-final.md` — section 7 is the day-by-day. Follow it; work phase by phase.
- **Progress checkpoint:** `.commandcode/PROGRESS.md` (gitignored) — **read this first when resuming.**
  It records what is done, what is left, and the environment gotchas.

## Commands

```bash
npm install          # repo root — installs both workspaces
npm run seed         # reset products + admins + 85 historical orders
npm run dev          # API on :5000
npm run dev:web      # storefront on :5173
npm run build:web    # production build → frontend/dist
```

## Conventions

- Install from the **repo root** — this is a workspace monorepo, not two separate projects.
- **Never remove `.npmrc`** (`include=dev`). `NODE_ENV=production` is set globally on this machine, so
  npm otherwise omits devDependencies and vite/tailwind/nodemon silently never install.
- Commit in small logical units — one commit per feature or fix — and push each one.
- **No `Co-authored-by` trailer.** Commits list the author only.
- Conventional commit subjects (`feat(scope):`, `fix(scope):`, `docs:`, `chore(scope):`).
- Secrets live only in `backend/.env` (gitignored). `.env.example` is the committed template.
- On Windows, stop dev servers before `npm ci` — locked native binaries cause `EPERM` mid-install.
- Prefer reusing an existing component, hook or helper over adding a new one; verify changes by
  exercising the app, not just by building it.
