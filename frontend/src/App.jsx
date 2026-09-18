import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { StoreLayout } from './components/layout/StoreLayout.jsx';
import { Spinner } from './components/ui/Spinner.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Cart from './pages/store/Cart.jsx';
import Checkout from './pages/store/Checkout.jsx';
import Landing from './pages/store/Landing.jsx';
import NotFound from './pages/store/NotFound.jsx';
import OrderConfirmation from './pages/store/OrderConfirmation.jsx';
import ProductDetails from './pages/store/ProductDetails.jsx';
import ProductListing from './pages/store/ProductListing.jsx';

// The dashboard ships as its own chunk: shoppers never download Recharts.
const AdminRoutes = lazy(() => import('./pages/admin/AdminRoutes.jsx'));

function AdminFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      <Spinner label="Loading dashboard…" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminRoutes />
                  </Suspense>
                }
              />

              <Route element={<StoreLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/products" element={<ProductListing />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<OrderConfirmation />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
