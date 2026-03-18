import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetIncomeRatioQuery } from "../../../redux/features/dashboard/dashboardApi";

const PureComponentChart = () => {
  const { data } = useGetIncomeRatioQuery();
  console.log(data);

  const chartData = [
    { name: "Januar", uv: 120000 },
    { name: "Februar", uv: 150000 },
    { name: "Mars", uv: 130000 },
    { name: "April", uv: 160000 },
    { name: "Mai", uv: 140000 },
    { name: "Juni", uv: 170000 },
    { name: "Juli", uv: 180000 },
    { name: "August", uv: 190000 },
    { name: "September", uv: 160000 },
    { name: "Oktober", uv: 200000 },
    { name: "November", uv: 210000 },
    { name: "Desember", uv: 220000 },
  ];

  return (
    <div className="bg-white shadow-lg  p-6 rounded-3xl ">
      <h1 className="font-bold">Inntektsforhold</h1>
      <hr className="my-3 border" />
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
            <linearGradient
              id="customGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF8133" stopOpacity={0.8} />
              <stop
                offset="100%"
                stopColor="rgba(241, 237, 255, 0)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`} />
          <Tooltip
            formatter={(value) => {
              const numericValue = typeof value === "number" ? value : 0;
              return `$${(numericValue / 1000).toFixed(2)}k`;
            }}
            labelFormatter={(label) => `Tid: ${label}`}
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
