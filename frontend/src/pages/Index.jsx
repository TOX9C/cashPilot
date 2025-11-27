import AccountCard from "../comps/AccountsCard";
import MoneyCard from "../comps/Card";
import ExpenseAmounts from "../comps/ExpenseAmounts";
import MoneyFlow from "../comps/MoneyFlow";
import Nav from "../comps/Nav";
import RecentTransations from "../comps/RecentTransactions";
import SavingGoalsCard from "../comps/SavingGoalsCard";

const Index = () => {
  return (
    <div className="min-h-screen w-screen select-none transition-all bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Nav />
      <main className="flex-1 px-6 flex flex-col gap-10 mt-5 pb-10 overflow-x-hidden">
        <div className="">
          <p className="text-4xl text-slate-900 font-semibold">
            Welcome back AbdAlruhman
          </p>
          <p className="text-lg text-slate-400">Mange your Expenses</p>
        </div>

        {/* this is ths card div */}
        <div className="flex gap-6 ">
          <MoneyCard />
          <MoneyCard />
          <MoneyCard />
        </div>

        {/* this is ths div for the money flow and accounts */}
        <div className="flex gap-6">
          <MoneyFlow />
          <AccountCard />
        </div>

        {/* this is ths div for the recent transacions and presentage of expenses */}
        <div className="flex gap-6">
          <RecentTransations />
          <ExpenseAmounts />
        </div>
        {/*  saving goals preview */}
        <SavingGoalsCard />
      </main>
    </div>
  );
};

export default Index;
