import { AlertCircle, ArrowRight, Lock, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/Button.jsx';
import { Container } from '../../components/ui/Container.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { CartSummary } from '../../components/cart/CartSummary.jsx';
import { createOrder } from '../../api/orders.js';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { saveLastOrder } from '../../lib/orderSession.js';
import { validateCheckout } from '../../lib/validation.js';

const INITIAL_VALUES = {
  name: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

export default function Checkout() {
  const { items, itemCount, subtotal, toOrderItems, clearCart } = useCart();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  useDocumentTitle('Checkout');

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  // The cart is only emptied after the server confirms the order, so a failed
  // request never loses what the customer chose.
  if (items.length === 0 && !isPlaced) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add a product before checking out."
          action={<Button to="/products">Shop the collection</Button>}
        />
      </Container>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    const validationErrors = validateCheckout(values);
    setErrors(validationErrors);

    const firstInvalid = Object.keys(validationErrors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        items: toOrderItems(),
        customer: {
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
        },
        shippingAddress: {
          line1: values.line1.trim(),
          line2: values.line2.trim(),
          city: values.city.trim(),
          state: values.state.trim(),
          postalCode: values.postalCode.trim(),
          country: values.country.trim(),
        },
      });

      setIsPlaced(true);
      saveLastOrder(order);
      clearCart();
      toast.success(`Order ${order.orderNumber} placed`);
      navigate('/confirmation', { replace: true });
    } catch (error) {
      setSubmitError(error);
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-ink-950">Checkout</h1>
      <p className="mt-2 text-sm text-ink-500">
        No account needed — we only ask for what is required to deliver your order.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <form
          id="checkout-form"
          onSubmit={handleSubmit}
          noValidate
          className="min-w-0 space-y-8"
        >
          {submitError ? (
            <div role="alert" className="rounded-card border border-red-200 bg-red-50 p-4">
              <div className="flex gap-3">
                <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {submitError.status === 409
                      ? 'Some items are no longer available'
                      : 'We could not place your order'}
                  </p>
                  <p className="mt-1 text-sm text-red-700">{submitError.message}</p>
                  {submitError.status === 409 ? (
                    <Button to="/cart" variant="secondary" size="sm" className="mt-3">
                      Review your cart
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <fieldset className="rounded-card border border-ink-200 bg-white p-5">
            <legend className="px-1 text-base font-semibold text-ink-900">Contact details</legend>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="name"
                label="Full name"
                required
                autoComplete="name"
                className="sm:col-span-2"
                value={values.name}
                onChange={updateField('name')}
                error={errors.name}
                placeholder="Riya Sharma"
              />
              <Input
                id="email"
                type="email"
                label="Email"
                required
                autoComplete="email"
                value={values.email}
                onChange={updateField('email')}
                error={errors.email}
                placeholder="riya@example.com"
              />
              <Input
                id="phone"
                type="tel"
                label="Phone"
                required
                autoComplete="tel"
                inputMode="numeric"
                value={values.phone}
                onChange={updateField('phone')}
                error={errors.phone}
                placeholder="9876543210"
              />
            </div>
          </fieldset>

          <fieldset className="rounded-card border border-ink-200 bg-white p-5">
            <legend className="px-1 text-base font-semibold text-ink-900">Shipping address</legend>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="line1"
                label="Address"
                required
                autoComplete="address-line1"
                className="sm:col-span-2"
                value={values.line1}
                onChange={updateField('line1')}
                error={errors.line1}
                placeholder="12 Palm Road, Flat 4B"
              />
              <Input
                id="line2"
                label="Landmark"
                autoComplete="address-line2"
                className="sm:col-span-2"
                value={values.line2}
                onChange={updateField('line2')}
                error={errors.line2}
                placeholder="Optional"
              />
              <Input
                id="city"
                label="City"
                required
                autoComplete="address-level2"
                value={values.city}
                onChange={updateField('city')}
                error={errors.city}
                placeholder="Navi Mumbai"
              />
              <Input
                id="state"
                label="State"
                required
                autoComplete="address-level1"
                value={values.state}
                onChange={updateField('state')}
                error={errors.state}
                placeholder="Maharashtra"
              />
              <Input
                id="postalCode"
                label="PIN code"
                required
                autoComplete="postal-code"
                inputMode="numeric"
                value={values.postalCode}
                onChange={updateField('postalCode')}
                error={errors.postalCode}
                placeholder="400705"
              />
              <Input
                id="country"
                label="Country"
                required
                autoComplete="country-name"
                value={values.country}
                onChange={updateField('country')}
                error={errors.country}
              />
            </div>
          </fieldset>

          <div className="flex items-center gap-2 text-sm text-ink-500">
            <Lock aria-hidden="true" className="h-4 w-4" />
            Payment is cash on delivery — no card details are collected.
          </div>
        </form>

        <CartSummary itemCount={itemCount} subtotal={subtotal}>
          <Button
            type="submit"
            form="checkout-form"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing order…' : 'Place order'}
            {isSubmitting ? null : <ArrowRight aria-hidden="true" className="h-4 w-4" />}
          </Button>

          {isSubmitting ? null : (
            <Button to="/cart" variant="ghost" size="sm" className="mt-3 w-full">
              Back to cart
            </Button>
          )}
        </CartSummary>
      </div>
    </Container>
  );
}
