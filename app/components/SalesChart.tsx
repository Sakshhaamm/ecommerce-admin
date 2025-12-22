"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Now accepts "data" as a prop instead of fetching it
export default function SalesChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-full transition-colors">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Real Monthly Sales</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.3} />
            <XAxis dataKey="name" fontSize={12} stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '5px', color: '#fff' }}
            />
            <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}