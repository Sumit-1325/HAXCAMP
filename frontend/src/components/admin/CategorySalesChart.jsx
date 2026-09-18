import {
  Bar,
  BarChart,
  CartesianGrid,
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

export function CategorySalesChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#ececed" horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#8e8e99', fontSize: 12 }}
            tickFormatter={(value) => `₹${compactFormatter.format(value)}`}
          />
          <YAxis
            type="category"
            dataKey="category"
            width={92}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#6d6d78', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'rgb(91 91 214 / 0.06)' }}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #d9d9dd',
              fontSize: 12,
            }}
            formatter={(value) => [formatPrice(value), 'Revenue']}
          />
          <Bar dataKey="revenue" fill="#5b5bd6" radius={[0, 6, 6, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
