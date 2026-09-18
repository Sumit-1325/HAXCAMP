import {
  ArrowRight,
  BadgeIndianRupee,
  Boxes,
  Layers,
  ShieldCheck,
  Sparkles,
  UserRoundX,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '../../components/ui/Button.jsx';
import { Container } from '../../components/ui/Container.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { ProductGridSkeleton } from '../../components/ui/Skeleton.jsx';
import { ProductGrid } from '../../components/product/ProductGrid.jsx';
import { CATEGORIES } from '../../lib/constants.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { useProducts } from '../../hooks/useProducts.js';

const FEATURED_COUNT = 4;

const VALUE_PROPS = [
  {
    Icon: BadgeIndianRupee,
    title: 'Cash on delivery',
    body: 'Pay when the parcel reaches you — no card details needed to try the store.',
  },
  {
    Icon: UserRoundX,
    title: 'No account required',
    body: 'Browse, add to cart and check out in under a minute. Nothing to sign up for.',
  },
  {
    Icon: Boxes,
    title: 'Live stock levels',
    body: 'Stock is reserved the moment you order, so what you see available really is available.',
  },
  {
    Icon: ShieldCheck,
    title: 'We only keep what works',
    body: 'A short catalogue of gear we would put on our own desks, not an endless list.',
  },
];

export default function Landing() {
  useDocumentTitle();
  const { data, error, isLoading, reload } = useProducts({ sort: 'newest', limit: FEATURED_COUNT });

  const featured = data?.items ?? [];

  return (
    <>
      <section className="border-b border-ink-200 bg-white">
        <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium tracking-wide text-ink-600">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-accent-600" />
              Smart gear for modern workspaces
            </span>

            <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
              Everything your desk needs, and nothing it doesn&rsquo;t.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-ink-500">
              NEXORA curates audio, input and display equipment built for focused work — chosen for how
              they feel after eight hours, not how they look on a spec sheet.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/products" size="lg">
                Shop the collection
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Button>
              <Button href="#story" variant="secondary" size="lg">
                Our story
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-card border border-ink-200 bg-ink-100">
            <img
              src="https://picsum.photos/seed/nexora-hero/1200/900"
              alt="A tidy workspace set up with NEXORA equipment"
              className="aspect-4/3 w-full object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-ink-200 bg-white">
        <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map(({ Icon, title, body }) => (
            <div key={title}>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-100 text-ink-700">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-sm font-semibold text-ink-900">{title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-ink-500">{body}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
                New this week
              </h2>
              <p className="mt-2 text-sm text-ink-500">The latest additions to the NEXORA desk.</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 transition hover:text-accent-800"
            >
              View all products
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8">
            {isLoading ? <ProductGridSkeleton count={FEATURED_COUNT} /> : null}

            {!isLoading && error ? (
              <ErrorState
                title="We couldn't load the latest products"
                message={error.message}
                onRetry={reload}
              />
            ) : null}

            {!isLoading && !error && featured.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No products yet"
                description="The catalogue is empty. Run the seed script to load the demo products."
              />
            ) : null}

            {!isLoading && !error && featured.length > 0 ? (
              <ProductGrid products={featured} />
            ) : null}
          </div>
        </Container>
      </section>

      <section className="border-y border-ink-200 bg-white py-16">
        <Container>
          <h2 className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
            Shop by category
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-700 transition hover:border-ink-900 hover:bg-ink-950 hover:text-white"
              >
                {category}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section id="story" className="scroll-mt-24 py-16">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-card border border-ink-200 bg-ink-100">
            <img
              src="https://picsum.photos/seed/nexora-story/1200/900"
              alt="Detail of a NEXORA desk setup"
              className="aspect-4/3 w-full object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <p className="text-xs font-medium tracking-[0.24em] text-ink-400 uppercase">Our story</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
              Built around the hours you actually work.
            </h2>
            <p className="mt-5 text-base leading-7 text-ink-500">
              Most desk gear is designed to look good in a photograph. We start from the opposite end: a
              keyboard that still feels right after a long afternoon, a monitor that doesn&rsquo;t make you
              lean forward, headphones you forget you&rsquo;re wearing.
            </p>
            <p className="mt-4 text-base leading-7 text-ink-500">
              That means a deliberately small catalogue. If a product isn&rsquo;t clearly better than what
              we already stock, it doesn&rsquo;t go on the shelf.
            </p>

            <Button to="/products" className="mt-8">
              Browse everything
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
