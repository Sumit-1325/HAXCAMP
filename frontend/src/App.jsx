import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { StoreLayout } from './components/layout/StoreLayout.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Cart from './pages/store/Cart.jsx';
import Landing from './pages/store/Landing.jsx';
import NotFound from './pages/store/NotFound.jsx';
import ProductDetails from './pages/store/ProductDetails.jsx';
import ProductListing from './pages/store/ProductListing.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <Routes>
            <Route element={<StoreLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
