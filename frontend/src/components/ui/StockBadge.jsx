import { Badge } from './Badge.jsx';
import { stockLabel } from '../../lib/format.js';

export function StockBadge({ stock, className }) {
  const { text, tone } = stockLabel(stock);

  return (
    <Badge tone={tone} className={className}>
      {text}
    </Badge>
  );
}
