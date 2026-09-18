import { Link } from 'react-router-dom';

import { Container } from '../ui/Container.jsx';
import { CATEGORIES } from '../../lib/constants.js';

const SHOP_LINKS = [
  { label: 'All products', to: '/products' },
  ...CATEGORIES.map((category) => ({
    label: category,
    to: `/products?category=${encodeURIComponent(category)}`,
  })),
];

const ORDER_LINKS = [
  { label: 'Your cart', to: '/cart' },
  { label: 'Checkout', to: '/checkout' },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-200 bg-white">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-950 text-sm font-bold text-white">
                N
              </span>
              <span className="text-base font-semibold tracking-tight text-ink-950">NEXORA</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink-500">
              Smart gear for modern workspaces. Carefully chosen audio, input and display equipment for
              people who spend their day at a desk.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-ink-900">Shop</h2>
            <ul className="mt-4 space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-ink-500 transition hover:text-ink-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-ink-900">Order</h2>
            <ul className="mt-4 space-y-2.5">
              {ORDER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-ink-500 transition hover:text-ink-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-ink-200 pt-6 text-sm text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NEXORA. A demo storefront built for the HAXCAMP technical task.</p>
          <p>Cash on delivery · No account required</p>
        </div>
      </Container>
    </footer>
  );
}
