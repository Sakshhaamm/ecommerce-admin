"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// A nice gradient palette from Teal to Blue to Purple
const COLORS = [
  '#2dd4bf', // Teal
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
];

export default function TopProductsChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-full transition-colors">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Top 5 Best Sellers</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} strokeOpacity={0.3} />
            <XAxis type="number" stroke="#888" fontSize={12} />
            <YAxis dataKey="name" type="category" width={100} stroke="#888" fontSize={12} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '5px', color: '#fff' }}
            />
            {/* The magic happens here: We assign a specific color to each bar */}
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
               {data.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
               ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}