import { formatCurrency } from "../utils/currency";

const SavingCard = ({
  name = "Goal",
  target = 0,
  current = 0,
}) => {
  const progress = target > 0 ? (current / target) * 100 : 0;

  return (
    <div className="flex flex-col justify-start flex-1">
      <div className="flex justify-between items-center ">
        <p className="text-slate-600 font-medium text-sm">{name}</p>
        <p className="font-semibold text-sm">{formatCurrency(target)}</p>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all shadow-sm"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      <p className="text-slate-400 text-sm">{progress.toFixed(1)}% completed</p>
    </div>
  );
};
export default SavingCard;
