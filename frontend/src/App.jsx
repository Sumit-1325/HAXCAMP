import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <main className="grid min-h-screen place-items-center px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-ink-400">NEXORA</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
              Smart gear for modern workspaces
            </h1>
            <p className="mt-3 text-sm text-ink-500">Storefront is being built.</p>
          </div>
        </main>
      </CartProvider>
    </ToastProvider>
  );
}
