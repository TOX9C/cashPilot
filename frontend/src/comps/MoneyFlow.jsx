import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const chartData = [
  { month: "2012", income: 120, expense: 45 },
  { month: "2013", income: 67, expense: 85 },
  { month: "2014", income: 98, expense: 75 },
  { month: "2015", income: 105, expense: 22 },
  { month: "2016", income: 43, expense: 115 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-3xl  rounded-2xl p-4 shadow-lg border border-slate-200/60">
        <p className="text-sm font-semibold text-slate-900 mb-2">
          {payload[0].payload.year}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-xs text-slate-600 mt-1 flex items-center gap-2"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.fill }}
            ></span>
            {entry.name}: ${entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MoneyFlow = () => {
  return (
    <div className="flex-1 flex flex-col gap-9 bg-white/80 shadow-md backdrop-blur-xl rounded-3xl select-none px-4 py-5">
      <div className="flex justify-between  ">
        <p className="text-2xl font-semibold text-slate-900">Money Flow</p>
        <div className="flex gap-3 ">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-[50%] bg-slate-900"></div>Income
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-[50%] bg-slate-500"></div>Expense
          </div>
          <select className="bg-slate-50 text-slate-500 rounded-3xl text-center px-3 ">
            <option value="all-accounts">All Accounts</option>
            <option value="main">Main Account</option>
            <option value="shared">Shared Account</option>
          </select>

          <select className="bg-slate-50 text-slate-500 rounded-3xl text-center px-3 ">
            <option value="all-accounts">This year</option>
            <option value="main">Last year</option>
            <option value="shared">2022</option>
          </select>
        </div>
      </div>

      {/* this div is for the chart */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barGap={8}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F172A" stopOpacity={1} />
              <stop offset="100%" stopColor="#334155" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748B" stopOpacity={1} />
              <stop offset="100%" stopColor="#94A3B8" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
            strokeOpacity={0.5}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
            dx={-10}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(148, 163, 184, 0.1)", radius: 8 }}
          />

          <Bar
            dataKey="income"
            fill="url(#incomeGradient)"
            radius={[12, 12, 0, 0]}
            maxBarSize={50}
            name="Income"
          />

          <Bar
            dataKey="expense"
            fill="url(#expenseGradient)"
            radius={[12, 12, 0, 0]}
            maxBarSize={50}
            name="Expense"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default MoneyFlow;
