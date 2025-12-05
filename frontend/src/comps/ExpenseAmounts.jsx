import CategoryPrecent from "./CategoryPrecent";
import { formatCurrency } from "../utils/currency";

const typeToCategory = {
  rent: "Rent",
  utilities: "Utilities",
  food: "Food & Drink",
  transport: "Transportation",
  personal: "Personal",
};

const ExpenseAmounts = ({ categorySpending = {}, totalSpending = 0 }) => {
  const categories = Object.entries(categorySpending)
    .map(([type, amount]) => ({
      type,
      name: typeToCategory[type] || type,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  return (
    <div className="w-[25%] flex flex-col gap-6 rounded-3xl backdrop-blur-3xl border border-slate-200/60 shadow-sm bg-white/80 p-5">
      <h2 className="text-2xl font-semibold tracking-tight">
        Spending by Category
      </h2>
      <div className="flex flex-col gap-6">
        {categories.length === 0 ? (
          <p className="text-slate-400 text-sm">No spending data</p>
        ) : (
          categories.map((category) => (
            <CategoryPrecent
              key={category.type}
              name={category.name}
              amount={category.amount}
              percentage={category.percentage}
            />
          ))
        )}
      </div>

      <div className="pt-8 mt-auto border-t border-slate-200/60">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-600">
            Total Spending
          </span>
          <span className="text-2xl font-semibold tracking-tight">
            {formatCurrency(totalSpending)}
          </span>
        </div>
      </div>
    </div>
  );
};
export default ExpenseAmounts;
