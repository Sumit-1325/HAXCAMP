import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Container } from '../ui/Container.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { cn } from '../../lib/cn.js';

const NAV_LINKS = [
  { to: '/products', label: 'All products' },
  { to: '/products?category=Audio', label: 'Audio' },
  { to: '/products?category=Keyboards', label: 'Keyboards' },
  { to: '/products?category=Monitors', label: 'Monitors' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = `${location.pathname}${location.search}`;
  const isActive = (to) => currentPath === to;

  const submitSearch = (event) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/products?search=${encodeURIComponent(term)}` : '/products');
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/85 backdrop-blur">
      <Container className="flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="NEXORA home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-950 text-sm font-bold text-white">
            N
          </span>
          <span className="text-base font-semibold tracking-tight text-ink-950">NEXORA</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={cn(
                'rounded-full px-3 py-2 text-sm transition',
                isActive(link.to)
                  ? 'bg-ink-100 font-medium text-ink-900'
                  : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} role="search" className="ml-auto hidden max-w-xs flex-1 md:block">
          <label htmlFor="navbar-search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400"
            />
            <input
              id="navbar-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search gear…"
              className="h-10 w-full rounded-full border border-ink-200 bg-ink-50 pr-3 pl-9 text-sm text-ink-900 transition placeholder:text-ink-400 focus:border-accent-500 focus:bg-white focus:ring-4 focus:ring-accent-500/15 focus:outline-none"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            to="/cart"
            className="relative inline-flex h-10 items-center gap-2 rounded-full border border-ink-200 px-4 text-sm font-medium text-ink-800 transition hover:border-ink-300 hover:bg-ink-50"
          >
            <ShoppingBag aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 ? (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-ink-950 px-1.5 text-xs font-semibold text-white tabular-nums">
                {itemCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition hover:bg-ink-50 lg:hidden"
          >
            {isOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </Container>

      {isOpen ? (
        <div className="border-t border-ink-200 bg-white lg:hidden">
          <Container className="space-y-3 py-4">
            <form onSubmit={submitSearch} role="search" className="md:hidden">
              <label htmlFor="mobile-search" className="sr-only">
                Search products
              </label>
              <input
                id="mobile-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search gear…"
                className="h-11 w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 text-sm focus:border-accent-500 focus:bg-white focus:ring-4 focus:ring-accent-500/15 focus:outline-none"
              />
            </form>

            <nav className="grid gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-sm transition',
                    isActive(link.to)
                      ? 'bg-ink-100 font-medium text-ink-900'
                      : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
