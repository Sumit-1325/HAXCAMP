import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

// Wraps "add to cart" with the feedback every call site would otherwise
// repeat, so product cards and the details page behave identically.
export const useAddToCart = () => {
  const { addItem } = useCart();
  const toast = useToast();

  return (product, qty = 1) => {
    const result = addItem(product, qty);

    if (result.ok) {
      toast.success(`${product.name} added to your cart`);
    } else if (result.reason === 'out-of-stock') {
      toast.error(`${product.name} is out of stock`);
    } else {
      toast.info(`Only ${product.stock} in stock — your cart is already at the limit`);
    }

    return result;
  };
};
