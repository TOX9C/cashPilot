import { useState, useEffect } from "react";
import AccountCard from "../comps/AccountsCard";
import MoneyCard from "../comps/Card";
import ExpenseAmounts from "../comps/ExpenseAmounts";
import MoneyFlow from "../comps/MoneyFlow";
import Nav from "../comps/Nav";
import RecentTransations from "../comps/RecentTransactions";
import SavingGoalsCard from "../comps/SavingGoalsCard";
import { SkeletonCard, SkeletonAccountCard, SkeletonGoalCard, Skeleton } from "../comps/Skeleton";
import api from "../utils/api";

const Index = () => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, accountsRes, transactionsRes, goalsRes] =
          await Promise.all([
            api.get("/auth/me"),
            api.get("/account/get"),
            api.get("/transaction/get"),
            api.get("/goal/get"),
          ]);
        setUser(userRes.data.user);
        setAccounts(accountsRes.data.accounts || []);
        setTransactions(transactionsRes.data.transactions || []);
        setGoals(goalsRes.data.goals || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.cash, 0);
  
  // Get current date info
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Calculate this month's totals
  const thisMonthIncome = transactions
    .filter((t) => {
      const date = new Date(t.createdAt);
      return (
        t.type === "income" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpenses = transactions
    .filter((t) => {
      const date = new Date(t.createdAt);
      return (
        t.type !== "income" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate last month's totals
  const lastMonthIncome = transactions
    .filter((t) => {
      const date = new Date(t.createdAt);
      return (
        t.type === "income" &&
        date.getMonth() === lastMonth &&
        date.getFullYear() === lastMonthYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpenses = transactions
    .filter((t) => {
      const date = new Date(t.createdAt);
      return (
        t.type !== "income" &&
        date.getMonth() === lastMonth &&
        date.getFullYear() === lastMonthYear
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate percentage changes
  // For income: increase is positive (good)
  const incomePercentageChange =
    lastMonthIncome > 0
      ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
      : thisMonthIncome > 0
      ? 100
      : 0;

  // For expenses: decrease is positive (good), so we flip the sign
  const expensesPercentageChange =
    lastMonthExpenses > 0
      ? ((lastMonthExpenses - thisMonthExpenses) / lastMonthExpenses) * 100
      : thisMonthExpenses > 0
      ? -100
      : 0;

  // For display purposes, use all-time totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type !== "income")
    .reduce((sum, t) => sum + t.amount, 0);

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  // Calculate spending by category
  const categorySpending = transactions
    .filter((t) => t.type !== "income")
    .reduce((acc, t) => {
      const category = t.type;
      acc[category] = (acc[category] || 0) + t.amount;
      return acc;
    }, {});

  const totalSpending = Object.values(categorySpending).reduce(
    (sum, val) => sum + val,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen w-screen select-none transition-all bg-gradient-to-br from-slate-50 to-slate-100 flex">
        <Nav />
        <main className="flex-1 px-6 flex flex-col gap-10 mt-5 pb-10 overflow-x-hidden">
          <div className="">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>

          {/* Skeleton cards */}
          <div className="flex gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>

          {/* Skeleton money flow and accounts */}
          <div className="flex gap-6">
            <div className="flex-1 bg-white/80 rounded-3xl shadow-md backdrop-blur-xl p-5">
              <Skeleton className="h-8 w-32 mb-6" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="w-[25%] bg-white/80 rounded-3xl border border-slate-200/60 shadow-md backdrop-blur-xl p-5">
              <Skeleton className="h-8 w-24 mb-4" />
              <div className="flex flex-col gap-3">
                <SkeletonAccountCard />
                <SkeletonAccountCard />
                <SkeletonAccountCard />
              </div>
            </div>
          </div>

          {/* Skeleton recent transactions and expenses */}
          <div className="flex gap-6">
            <div className="flex-1 bg-white/80 rounded-3xl shadow-md backdrop-blur-xl p-5">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            </div>
            <div className="w-[25%] bg-white/80 rounded-3xl shadow-md backdrop-blur-xl p-5">
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skeleton goals */}
          <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-xl p-5">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="flex gap-10">
              <SkeletonGoalCard />
              <SkeletonGoalCard />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen select-none transition-all bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Nav />
      <main className="flex-1 px-6 flex flex-col gap-10 mt-5 pb-10 overflow-x-hidden">
        <div className="">
          <p className="text-4xl text-slate-900 font-semibold">
            Welcome back {user?.username || "User"}
          </p>
          <p className="text-lg text-slate-400">Manage your Expenses</p>
        </div>

        {/* this is ths card div */}
        <div className="flex gap-6 ">
          <MoneyCard
            title="Total Balance"
            amount={totalBalance}
            subtitle="All accounts"
          />
          <MoneyCard
            title="Total Income"
            amount={thisMonthIncome}
            subtitle="vs last month"
            percentageChange={incomePercentageChange}
          />
          <MoneyCard
            title="Total Expenses"
            amount={thisMonthExpenses}
            subtitle="vs last month"
            percentageChange={expensesPercentageChange}
          />
        </div>

        {/* this is ths div for the money flow and accounts */}
        <div className="flex gap-6">
          <MoneyFlow transactions={transactions} accounts={accounts} />
          <AccountCard accounts={accounts} />
        </div>

        {/* this is ths div for the recent transacions and presentage of expenses */}
        <div className="flex gap-6">
          <RecentTransations transactions={recentTransactions} />
          <ExpenseAmounts
            categorySpending={categorySpending}
            totalSpending={totalSpending}
          />
        </div>
        {/*  saving goals preview */}
        <SavingGoalsCard goals={goals} />
      </main>
    </div>
  );
};

export default Index;
