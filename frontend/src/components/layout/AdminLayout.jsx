import { LayoutDashboard, LogOut, Package, ReceiptText, Store } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

import { Container } from '../ui/Container.jsx';
import { cn } from '../../lib/cn.js';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', Icon: Package },
  { to: '/admin/orders', label: 'Orders', Icon: ReceiptText },
];

const navLinkClass = ({ isActive }) =>
  cn(
    'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition',
    isActive
      ? 'bg-ink-950 font-medium text-white'
      : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
  );

export function AdminLayout() {
  const { admin, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/90 backdrop-blur">
        <Container className="flex h-16 items-center gap-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-950 text-sm font-bold text-white">
              N
            </span>
            <span className="text-base font-semibold tracking-tight text-ink-950">NEXORA</span>
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">
              Admin
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 sm:inline-flex"
            >
              <Store aria-hidden="true" className="h-4 w-4" />
              View store
            </Link>

            <span className="hidden text-sm text-ink-500 lg:inline">{admin?.name}</span>

            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-50"
            >
              <LogOut aria-hidden="true" className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </Container>
      </header>

      <Container className="flex gap-8 py-8">
        <nav
          aria-label="Admin sections"
          className="hidden w-52 shrink-0 lg:sticky lg:top-24 lg:block lg:self-start"
        >
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink to={to} className={navLinkClass}>
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          <nav
            aria-label="Admin sections"
            className="mb-6 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden"
          >
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm whitespace-nowrap transition',
                    isActive
                      ? 'border-ink-950 bg-ink-950 font-medium text-white'
                      : 'border-ink-200 bg-white text-ink-600',
                  )
                }
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <Outlet />
        </div>
      </Container>
    </div>
  );
}
