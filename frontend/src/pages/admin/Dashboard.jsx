import { AlertTriangle, IndianRupee, PackageX, ReceiptText, TrendingUp } from 'lucide-react';

import { CategorySalesChart } from '../../components/admin/CategorySalesChart.jsx';
import { RevenueTrendChart } from '../../components/admin/RevenueTrendChart.jsx';
import { StatCard } from '../../components/admin/StatCard.jsx';
import { TopProductsTable } from '../../components/admin/TopProductsTable.jsx';
import { Card, PageHeader } from '../../components/ui/Card.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { formatPrice, pluralize } from '../../lib/format.js';
import { useAnalytics } from '../../hooks/useAdminData.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-96" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, error, isLoading, reload } = useAnalytics();

  useDocumentTitle('Dashboard');

  if (isLoading) {
    return (
      <>
        <PageHeader title="Dashboard" description="Live numbers, computed from the orders in the database." />
        <DashboardSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <ErrorState
          title="We couldn't load the dashboard"
          message={error.message}
          onRetry={reload}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Live numbers, computed from the orders in the database."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={formatPrice(data.totalRevenue)}
          hint={`Across ${pluralize(data.totalOrders, 'order')}`}
          Icon={IndianRupee}
          tone="accent"
        />
        <StatCard
          label="Orders"
          value={data.totalOrders}
          hint="All statuses included"
          Icon={ReceiptText}
        />
        <StatCard
          label="Average order value"
          value={formatPrice(data.averageOrderValue)}
          hint="Revenue ÷ orders"
          Icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Low stock"
          value={data.lowStockCount}
          hint={`Active products at ${data.lowStockThreshold} or fewer`}
          Icon={AlertTriangle}
          tone={data.lowStockCount > 0 ? 'warning' : 'default'}
        />
      </div>

      <Card
        className="mt-6"
        title="Revenue by month"
        description="Last six months, bucketed on the order date."
      >
        <RevenueTrendChart data={data.revenueByMonth} />
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title="Sales by category" description="Revenue per category, all time.">
          <CategorySalesChart data={data.salesByCategory} />
        </Card>

        <Card title="Top products" description="Highest revenue first.">
          <TopProductsTable products={data.topProducts} />
        </Card>
      </div>

      {data.totalOrders === 0 ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-ink-500">
          <PackageX aria-hidden="true" className="h-4 w-4" />
          No orders yet — run <code className="rounded bg-ink-100 px-1.5 py-0.5">npm run seed</code> to load
          demo history.
        </p>
      ) : null}
    </>
  );
}
