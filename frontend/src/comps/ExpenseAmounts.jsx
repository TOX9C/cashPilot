import CategoryPrecent from "./CategoryPrecent";

const ExpenseAmounts = () => {
  return (
    <div className="w-[25%] flex flex-col gap-6 rounded-3xl backdrop-blur-3xl border border-slate-200/60 shadow-sm bg-white/80 p-5">
      <h2 className="text-2xl font-semibold tracking-tight">
        Spending by Category
      </h2>
      <div className="flex flex-col gap-6">
        <CategoryPrecent />
        <CategoryPrecent />
        <CategoryPrecent />
        <CategoryPrecent />
      </div>

      <div className="pt-8 border-t border-slate-200/60">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-600">
            Total Spending
          </span>
          <span className="text-2xl font-semibold tracking-tight">$630.54</span>
        </div>
      </div>
    </div>
  );
};
export default ExpenseAmounts;
