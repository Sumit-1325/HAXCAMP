import { CheckCircle2, Mail, MapPin, PackageSearch, Phone } from 'lucide-react';
import { useMemo } from 'react';

import { Button } from '../../components/ui/Button.jsx';
import { Container } from '../../components/ui/Container.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ProductImage } from '../../components/product/ProductImage.jsx';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge.jsx';
import { formatDate, formatPrice, pluralize } from '../../lib/format.js';
import { readLastOrder } from '../../lib/orderSession.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function OrderConfirmation() {
  const order = useMemo(() => readLastOrder(), []);

  useDocumentTitle(order ? `Order ${order.orderNumber}` : 'Order confirmation');

  if (!order) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={PackageSearch}
          title="No recent order to show"
          description="Once you place an order, its details appear here — and survive a page refresh."
          action={<Button to="/products">Shop the collection</Button>}
        />
      </Container>
    );
  }

  const itemCount = order.items.reduce((count, item) => count + item.qty, 0);

  return (
    <Container className="max-w-4xl py-12">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
        </span>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-ink-950">
          Thank you, {order.customer.name.split(' ')[0]}
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-6 text-ink-500">
          Your order is confirmed and saved on the server. Keep the order number below handy — it is all
          you need if you get in touch.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 rounded-card border border-ink-200 bg-white p-5 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium tracking-wider text-ink-400 uppercase">Order number</p>
          <p className="mt-1.5 text-lg font-semibold text-ink-950">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wider text-ink-400 uppercase">Placed on</p>
          <p className="mt-1.5 text-sm text-ink-800">{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs font-medium tracking-wider text-ink-400 uppercase">Status</p>
          <div className="mt-1.5">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-card border border-ink-200 bg-white">
        <h2 className="border-b border-ink-200 px-5 py-4 text-base font-semibold text-ink-900">
          {pluralize(itemCount, 'item')}
        </h2>

        <ul className="divide-y divide-ink-200 px-5">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 py-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink-200 bg-ink-100">
                <ProductImage product={item} className="h-full w-full" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-900">{item.name}</p>
                <p className="mt-0.5 text-sm text-ink-500">
                  {item.category} · {formatPrice(item.price)} × {item.qty}
                </p>
              </div>

              <p className="shrink-0 text-sm font-semibold text-ink-950 tabular-nums">
                {formatPrice(item.subtotal)}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-ink-200 px-5 py-4">
          <span className="text-base font-semibold text-ink-900">Total paid on delivery</span>
          <span className="text-lg font-semibold text-ink-950 tabular-nums">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <section className="rounded-card border border-ink-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
            <MapPin aria-hidden="true" className="h-4 w-4 text-ink-400" />
            Delivering to
          </h2>
          <address className="mt-3 text-sm leading-6 text-ink-600 not-italic">
            {order.customer.name}
            <br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? (
              <>
                <br />
                {order.shippingAddress.line2}
              </>
            ) : null}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.postalCode}
            <br />
            {order.shippingAddress.country}
          </address>
        </section>

        <section className="rounded-card border border-ink-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-ink-900">Contact &amp; payment</h2>
          <ul className="mt-3 space-y-2.5 text-sm text-ink-600">
            <li className="flex items-center gap-2">
              <Mail aria-hidden="true" className="h-4 w-4 text-ink-400" />
              {order.customer.email}
            </li>
            <li className="flex items-center gap-2">
              <Phone aria-hidden="true" className="h-4 w-4 text-ink-400" />
              {order.customer.phone}
            </li>
          </ul>
          <p className="mt-4 text-sm text-ink-500">
            {order.paymentMethod === 'COD' ? 'Cash on delivery' : order.paymentMethod} — please have the
            exact amount ready.
          </p>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button to="/products" size="lg">
          Continue shopping
        </Button>
        <Button to="/" variant="secondary" size="lg">
          Back to home
        </Button>
      </div>
    </Container>
  );
}
