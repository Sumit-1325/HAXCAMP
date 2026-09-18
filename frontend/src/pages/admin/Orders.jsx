import { useState } from 'react';

import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { Select } from '../../components/ui/Input.jsx';
import { Card, PageHeader } from '../../components/ui/Card.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { updateOrderStatus } from '../../api/orders.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAdminOrders } from '../../hooks/useAdminData.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { ORDER_STATUSES } from '../../lib/constants.js';
import { formatDate, formatPrice, pluralize } from '../../lib/format.js';

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const { data, error, isLoading, reload } = useAdminOrders({ status: statusFilter, page });
  const toast = useToast();

  useDocumentTitle('Orders');

  const orders = data?.items ?? [];

  const changeStatus = async (order, nextStatus) => {
    if (nextStatus === order.status) return;

    setUpdatingId(order._id);
    try {
      await updateOrderStatus(order._id, nextStatus);
      toast.success(`${order.orderNumber} marked ${nextStatus}`);
      reload();
    } catch (updateError) {
      toast.error(updateError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      key: 'orderNumber',
      header: 'Order',
      render: (order) => (
        <div>
          <p className="font-medium text-ink-900">{order.orderNumber}</p>
          <p className="mt-0.5 text-xs text-ink-500">{formatDate(order.createdAt)}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (order) => (
        <div className="min-w-0">
          <p className="truncate text-ink-900">{order.customer.name}</p>
          <p className="mt-0.5 truncate text-xs text-ink-500">{order.customer.phone}</p>
        </div>
      ),
    },
    {
      key: 'shipping',
      header: 'Ship to',
      render: (order) => (
        <div className="min-w-0">
          <p className="truncate text-ink-700">{order.shippingAddress.city}</p>
          <p className="mt-0.5 text-xs text-ink-500">{order.shippingAddress.postalCode}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (order) => {
        const units = order.items.reduce((count, item) => count + item.qty, 0);
        return (
          <div>
            <p className="text-ink-700">{pluralize(units, 'unit')}</p>
            <p className="mt-0.5 truncate text-xs text-ink-500">
              {order.items[0]?.name}
              {order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
            </p>
          </div>
        );
      },
    },
    {
      key: 'totalAmount',
      header: 'Total',
      className: 'text-right font-medium text-ink-900 tabular-nums',
      headerClassName: 'text-right',
      render: (order) => formatPrice(order.totalAmount),
    },
    {
      key: 'status',
      header: 'Status',
      render: (order) => (
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <label htmlFor={`status-${order._id}`} className="sr-only">
            Update status for {order.orderNumber}
          </label>
          <select
            id={`status-${order._id}`}
            value={order.status}
            disabled={updatingId === order._id}
            onChange={(event) => changeStatus(order, event.target.value)}
            className="h-9 rounded-lg border border-ink-200 bg-white px-2 text-sm text-ink-800 transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/15 focus:outline-none disabled:opacity-50"
          >
            {ORDER_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Every order placed through the storefront, newest first."
      />

      <Card className="mb-6" bodyClassName="p-4">
        <div className="sm:w-56">
          <Select
            label="Filter by status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {error ? (
        <ErrorState title="We couldn't load the orders" message={error.message} onRetry={reload} />
      ) : (
        <>
          <Table
            columns={columns}
            rows={orders}
            getRowKey={(order) => order._id}
            isLoading={isLoading}
            skeletonRows={8}
            emptyState={
              <EmptyState
                title="No orders yet"
                description="Orders placed in the storefront appear here. Run npm run seed to load demo history."
              />
            }
          />

          <Pagination
            className="mt-6"
            page={data?.page ?? 1}
            totalPages={data?.totalPages ?? 1}
            onChange={setPage}
          />
        </>
      )}
    </>
  );
}
