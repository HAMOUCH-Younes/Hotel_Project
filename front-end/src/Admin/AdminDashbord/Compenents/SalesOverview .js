import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Card } from 'react-bootstrap';

const data = [
  { name: 'Jan', sales: 400 },
  { name: 'Feb', sales: 700 },
  { name: 'Mar', sales: 500 },
  { name: 'Apr', sales: 800 },
  { name: 'May', sales: 650 },
  { name: 'Jun', sales: 900 },
  { name: 'Jul', sales: 750 },
];

const SalesOverview = () => {
  const [animatedData, setAnimatedData] = useState([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= data.length) {
        setAnimatedData(data.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      className="pt-4 mb-4 shadow-sm border-0"
      style={{
        borderRadius: '1rem',
        height: '420px',
        overflow: 'hidden',
      }}
    >
      <h5 className="mb-4">Sales Overview</h5>
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer width="95%" height="85%">
          <AreaChart
            data={animatedData}
            margin={{ top:10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007bff" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#007bff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} horizontal strokeDasharray="5 5" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#007bff"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
              isAnimationActive={true}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesOverview;
