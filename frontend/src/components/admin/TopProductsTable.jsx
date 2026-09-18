import { Table } from '../ui/Table.jsx';
import { formatPrice } from '../../lib/format.js';

export function TopProductsTable({ products }) {
  const columns = [
    {
      key: 'rank',
      header: '#',
      className: 'w-10 text-ink-400',
      render: (product) => products.indexOf(product) + 1,
    },
    {
      key: 'name',
      header: 'Product',
      render: (product) => (
        <div>
          <p className="font-medium text-ink-900">{product.name}</p>
          <p className="mt-0.5 text-xs text-ink-500">{product.category}</p>
        </div>
      ),
    },
    {
      key: 'units',
      header: 'Units',
      className: 'text-right tabular-nums',
      headerClassName: 'text-right',
    },
    {
      key: 'revenue',
      header: 'Revenue',
      className: 'text-right font-medium text-ink-900 tabular-nums',
      headerClassName: 'text-right',
      render: (product) => formatPrice(product.revenue),
    },
  ];

  return (
    <Table
      columns={columns}
      rows={products}
      getRowKey={(product) => String(product.productId)}
      emptyState={<p className="text-sm text-ink-500">No sales recorded yet.</p>}
    />
  );
}
