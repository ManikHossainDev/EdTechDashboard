
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PureComponentChart = () => {
  // Static data as an example (replace with your actual data source)
  const chartData = [
    { name: "January", uv: 120000 },
    { name: "February", uv: 150000 },
    { name: "March", uv: 130000 },
    { name: "April", uv: 160000 },
    { name: "May", uv: 140000 },
    { name: "June", uv: 170000 },
    { name: "July", uv: 180000 },
    { name: "August", uv: 190000 },
    { name: "September", uv: 160000 },
    { name: "October", uv: 200000 },
    { name: "November", uv: 210000 },
    { name: "December", uv: 220000 }
  ];

  return (
    <div className='bg-white shadow-lg  p-6 rounded-3xl '>
      <h1 className='font-bold'>Income Ratio</h1>
      <hr className='my-3 border' />
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="customGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF8133" stopOpacity={0.8} />
              <stop offset="100%" stopColor="rgba(241, 237, 255, 0)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`} />
          <Tooltip
            formatter={(value) => {
              const numericValue = typeof value === 'number' ? value : 0;
              return `$${(numericValue / 1000).toFixed(2)}k`;
            }}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#FF8133"
            fill="url(#customGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PureComponentChart;
