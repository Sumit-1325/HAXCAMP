import { ArrowRight, ShoppingBag } from 'lucide-react';

import { Button } from '../../components/ui/Button.jsx';
import { Container } from '../../components/ui/Container.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { CartLineItem } from '../../components/cart/CartLineItem.jsx';
import { CartSummary } from '../../components/cart/CartSummary.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function Cart() {
  const { items, itemCount, subtotal, setQty, removeItem, clearCart } = useCart();
  const toast = useToast();

  useDocumentTitle('Your cart');

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the collection and add something you'll actually use every day."
          action={<Button to="/products">Shop the collection</Button>}
        />
      </Container>
    );
  }

  const handleRemove = (productId) => {
    const removed = items.find((item) => item.productId === productId);
    removeItem(productId);
    if (removed) toast.info(`${removed.name} removed from your cart`);
  };

  const handleClear = () => {
    clearCart();
    toast.info('Cart cleared');
  };

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink-950">Your cart</h1>
          <p className="mt-2 text-sm text-ink-500">
            Saved on this device, so a refresh won&rsquo;t lose it.
          </p>
        </div>

        <Button variant="ghost" size="sm" onClick={handleClear}>
          Clear cart
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <ul className="min-w-0 divide-y divide-ink-200 rounded-card border border-ink-200 bg-white px-5">
          {items.map((item) => (
            <CartLineItem
              key={item.productId}
              item={item}
              onQuantityChange={setQty}
              onRemove={handleRemove}
            />
          ))}
        </ul>

        <CartSummary
          itemCount={itemCount}
          subtotal={subtotal}
          footer={
            <Button to="/products" variant="ghost" size="sm" className="mt-3 w-full">
              Continue shopping
            </Button>
          }
        >
          <Button to="/checkout" size="lg" fullWidth>
            Proceed to checkout
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </CartSummary>
      </div>
    </Container>
  );
}
