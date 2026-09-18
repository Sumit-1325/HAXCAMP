import { ArrowRight } from 'lucide-react';

import { Button } from '../../components/ui/Button.jsx';
import { Container } from '../../components/ui/Container.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function Landing() {
  useDocumentTitle();

  return (
    <section className="border-b border-ink-200 bg-white">
      <Container className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-xs font-medium tracking-[0.24em] text-ink-400 uppercase">
            Smart gear for modern workspaces
          </p>
          <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
            Everything your desk needs, and nothing it doesn&rsquo;t.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-ink-500">
            NEXORA curates audio, input and display equipment built for focused work — chosen for how
            they feel after eight hours, not how they look in a spec sheet.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/products" size="lg">
              Shop the collection
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
            <Button to="#story" variant="secondary" size="lg">
              Our story
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-card border border-ink-200">
            <img
              src="https://picsum.photos/seed/nexora-hero/1200/900"
              alt="A tidy desk with NEXORA equipment"
              className="aspect-4/3 w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
