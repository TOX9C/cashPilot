import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatCurrency } from "../utils/currency";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-3xl rounded-2xl p-4 shadow-lg border border-slate-200/60">
        <p className="text-sm font-semibold text-slate-900 mb-2">
          {payload[0].payload.month}
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
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const MoneyFlow = ({ transactions = [], accounts = [] }) => {
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [selectedYear, setSelectedYear] = useState("this-year");

  // Get current year
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  // Filter transactions by account
  let filteredTransactions = transactions;
  if (selectedAccountId !== "all") {
    filteredTransactions = transactions.filter(
      (t) => t.accountId === parseInt(selectedAccountId)
    );
  }

  // Filter transactions by year
  const getYearFilter = () => {
    switch (selectedYear) {
      case "this-year":
        return (date) => date.getFullYear() === currentYear;
      case "last-year":
        return (date) => date.getFullYear() === lastYear;
      case "2023":
        return (date) => date.getFullYear() === 2023;
      default:
        return () => true;
    }
  };

  const yearFilter = getYearFilter();
  filteredTransactions = filteredTransactions.filter((t) => {
    const date = new Date(t.createdAt);
    return yearFilter(date);
  });

  // Group transactions by month
  const monthlyData = {};

  filteredTransactions.forEach((t) => {
    const date = new Date(t.createdAt);
    const monthKey = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
    }

    if (t.type === "income") {
      monthlyData[monthKey].income += t.amount;
    } else {
      monthlyData[monthKey].expense += t.amount;
    }
  });

  // Convert to array and sort by date
  let chartData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA - dateB;
  });

  // If no data, show placeholder
  if (chartData.length === 0) {
    chartData = [{ month: "No data", income: 0, expense: 0 }];
  }

  return (
    <div className="flex-1 flex flex-col gap-6 bg-white/80 shadow-md backdrop-blur-xl rounded-3xl select-none px-4 py-5">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <p className="text-2xl font-semibold text-slate-900">Money Flow</p>
        <div className="flex gap-3 flex-wrap items-center">
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="bg-slate-50 text-slate-700 rounded-xl text-sm px-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Accounts</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-50 text-slate-700 rounded-xl text-sm px-3 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="this-year">This Year ({currentYear})</option>
            <option value="last-year">Last Year ({lastYear})</option>
            <option value="2023">2023</option>
          </select>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-[50%] bg-slate-900"></div>
              Income
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-[50%] bg-slate-500"></div>
              Expense
            </div>
          </div>
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
