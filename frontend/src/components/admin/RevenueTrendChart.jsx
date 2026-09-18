import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatPrice } from '../../lib/format.js';

const compactFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const AXIS_STYLE = { fill: '#8e8e99', fontSize: 12 };

export function RevenueTrendChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#ececed" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={AXIS_STYLE} />
          <YAxis
            width={68}
            tickLine={false}
            axisLine={false}
            tick={AXIS_STYLE}
            tickFormatter={(value) => `₹${compactFormatter.format(value)}`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #d9d9dd',
              fontSize: 12,
              boxShadow: '0 8px 24px rgb(11 11 15 / 0.08)',
            }}
            formatter={(value) => [formatPrice(value), 'Revenue']}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#5b5bd6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#5b5bd6' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
