import { formatCurrency } from "../utils/currency";

const MoneyCard = ({
  title = "Total Money",
  amount = 0,
  subtitle = "vs last month",
  percentageChange = null,
}) => {
  const formattedAmount = formatCurrency(amount);

  const showPercentage = percentageChange !== null;
  const isPositive = percentageChange >= 0;
  const percentageDisplay = Math.abs(percentageChange).toFixed(1);

  return (
    <div className="bg-white/80 rounded-3xl border border-slate-200/60 shadow-md backdrop-blur-xl p-6 flex-1">
      <div className="flex gap-4 mb-6 items-center">
        <p className="text-slate-600 text-sm">{title}</p>
        {showPercentage && (
          <div
            className={`${
              isPositive
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            } rounded-3xl px-2 py-1 text-xs font-medium`}
          >
            {isPositive ? "+" : "-"}
            {percentageDisplay}%
          </div>
        )}
      </div>
      <p className="text-4xl text-slate-900 mb-3">{formattedAmount}</p>
      <p className="text-slate-400">{subtitle}</p>
    </div>
  );
};
export default MoneyCard;
