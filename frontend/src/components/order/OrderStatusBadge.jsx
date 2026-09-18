import { Badge } from '../ui/Badge.jsx';
import { ORDER_STATUS_TONES } from '../../lib/constants.js';

export function OrderStatusBadge({ status, className }) {
  return (
    <Badge tone={ORDER_STATUS_TONES[status] ?? 'neutral'} className={className}>
      {status}
    </Badge>
  );
}
