import React from 'react';
import { Card } from 'react-bootstrap';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const data = [
  { name: 'Apr', sales: 300 },
  { name: 'May', sales: 400 },
  { name: 'Jun', sales: 500 },
  { name: 'Jul', sales: 600 },
  { name: 'Aug', sales: 700 },
  { name: 'Sep', sales: 650 },
  { name: 'Oct', sales: 800 },
  { name: 'Nov', sales: 750 },
  { name: 'Dec', sales: 900 },
];

const SalesOverview = () => {
  const [animatedData, setAnimatedData] = React.useState([]);

  React.useEffect(() => {
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
      className="mb-4 shadow-sm"
      style={{ borderRadius: '1rem', overflow: 'hidden', height: '400px' }}
    >
      <Card.Body>
        <h5 className="text-muted mb-3">Sales Overview</h5>
        <small className="text-success mb-3 d-block">↑ 4% more in 2022</small>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={animatedData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#17c1e8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#17c1e8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 14 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 14 }}
              domain={[0, 1000]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '0.5rem', border: 'none' }}
              itemStyle={{ color: '#fff', fontSize: 14 }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#17c1e8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
              isAnimationActive={true}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default SalesOverview;