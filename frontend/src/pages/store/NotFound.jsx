import { Compass } from 'lucide-react';

import { Button } from '../../components/ui/Button.jsx';
import { Container } from '../../components/ui/Container.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function NotFound() {
  useDocumentTitle('Page not found');

  return (
    <Container className="py-24">
      <EmptyState
        icon={Compass}
        title="We couldn't find that page"
        description="The link may be out of date, or the product may have been removed from the store."
        action={<Button to="/products">Browse the collection</Button>}
      />
    </Container>
  );
}
