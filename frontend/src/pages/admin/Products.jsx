import { Archive, Pencil, Plus, Search } from 'lucide-react';
import { useCallback, useState } from 'react';

import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { ProductFormModal } from '../../components/admin/ProductFormModal.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, PageHeader } from '../../components/ui/Card.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Select } from '../../components/ui/Input.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { ProductImage } from '../../components/product/ProductImage.jsx';
import { Table } from '../../components/ui/Table.jsx';
import { archiveProduct } from '../../api/products.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useProducts } from '../../hooks/useProducts.js';
import { CATEGORIES } from '../../lib/constants.js';
import { formatPrice } from '../../lib/format.js';

const PAGE_SIZE = 10;

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [archiving, setArchiving] = useState(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const search = useDebounce(searchTerm, 350);
  const toast = useToast();

  const { data, error, isLoading, reload } = useProducts({
    search,
    category,
    page,
    limit: PAGE_SIZE,
  });

  useDocumentTitle('Products');

  const products = data?.items ?? [];

  const openCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setIsFormOpen(true);
  };

  const changeSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const changeCategory = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const confirmArchive = useCallback(async () => {
    setIsArchiving(true);
    try {
      const archived = await archiveProduct(archiving._id);
      toast.success(`${archived.name} archived`);
      setArchiving(null);
      reload();
    } catch (archiveError) {
      toast.error(archiveError.message);
    } finally {
      setIsArchiving(false);
    }
  }, [archiving, reload, toast]);

  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-ink-200 bg-ink-100">
            <ProductImage product={product} className="h-full w-full" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-ink-900">{product.name}</p>
            <p className="mt-0.5 truncate text-xs text-ink-500">{product.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (product) => <Badge tone="neutral">{product.category}</Badge>,
    },
    {
      key: 'price',
      header: 'Price',
      className: 'tabular-nums',
      render: (product) => formatPrice(product.price),
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (product) => (
        <div className="flex items-center gap-2">
          <span className="tabular-nums">{product.stock}</span>
          {product.stock <= 5 ? <Badge tone="warning">Low</Badge> : null}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (product) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setArchiving(product)}>
            <Archive aria-hidden="true" className="h-4 w-4" />
            Archive
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage the catalogue the storefront reads from."
      >
        <Button onClick={openCreate}>
          <Plus aria-hidden="true" className="h-4 w-4" />
          New product
        </Button>
      </PageHeader>

      <Card className="mb-6" bodyClassName="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="admin-product-search" className="mb-1.5 block text-sm font-medium text-ink-800">
              Search
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400"
              />
              <input
                id="admin-product-search"
                type="search"
                value={searchTerm}
                onChange={changeSearch}
                placeholder="Search by name…"
                className="h-11 w-full rounded-xl border border-ink-200 bg-white pr-3 pl-9 text-sm text-ink-900 transition placeholder:text-ink-400 focus:border-accent-500 focus:ring-4 focus:ring-accent-500/15 focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:w-56">
            <Select label="Category" value={category} onChange={changeCategory}>
              <option value="">All categories</option>
              {CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {error ? (
        <ErrorState title="We couldn't load the products" message={error.message} onRetry={reload} />
      ) : (
        <>
          <Table
            columns={columns}
            rows={products}
            getRowKey={(product) => product._id}
            isLoading={isLoading}
            skeletonRows={PAGE_SIZE}
            emptyState={
              <EmptyState
                title="No products match"
                description="Try a different search, or add a new product to the catalogue."
                action={<Button onClick={openCreate}>New product</Button>}
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

      <ProductFormModal
        isOpen={isFormOpen}
        product={editing}
        onClose={() => setIsFormOpen(false)}
        onSaved={reload}
      />

      <ConfirmDialog
        isOpen={Boolean(archiving)}
        title={`Archive ${archiving?.name ?? 'product'}?`}
        description="The product is hidden from the storefront and can no longer be ordered. Past orders keep their own snapshot, so revenue figures do not change."
        confirmLabel="Archive product"
        isBusy={isArchiving}
        onConfirm={confirmArchive}
        onCancel={() => setArchiving(null)}
      />
    </>
  );
}
