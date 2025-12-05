import { formatCurrency } from "../utils/currency";

const CategoryPrecent = ({
  name = "Category",
  amount = 0,
  percentage = 0,
}) => {
  return (
    <div className="flex flex-col justify-start">
      <div className="flex justify-between items-center ">
        <p className="text-slate-600 font-medium text-sm">{name}</p>
        <p className="font-semibold text-sm">{formatCurrency(amount)}</p>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all shadow-sm"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <p className="text-slate-400 text-sm">
        {percentage.toFixed(1)}% of total
      </p>
    </div>
  );
};
export default CategoryPrecent;
