import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

const colors = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-orange-500 to-orange-600",
  "bg-gradient-to-br from-pink-500 to-pink-600",
];

const AccountButton = ({ id, name = "Account", balance = 0, index = 0 }) => {
  const navigate = useNavigate();
  const formattedBalance = formatCurrency(balance);

  const handleClick = () => {
    navigate(`/accounts?accountId=${id}`);
  };

  const gradientColor = colors[index % colors.length];

  return (
    <div
      onClick={handleClick}
      className="bg-white/80 hover:bg-white border border-slate-200/60 hover:border-blue-300/60 shadow-sm hover:shadow-md flex items-center rounded-xl cursor-pointer select-none transition-all justify-between px-4 py-4 group"
    >
      <div className="flex gap-4 items-center">
        <div className={`${gradientColor} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
          <span className="text-white font-bold text-lg">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-slate-600 text-sm font-medium">{name}</p>
          <p className="text-slate-900 text-xl font-semibold">{formattedBalance}</p>
        </div>
      </div>

      <FaArrowRight className="text-slate-400 group-hover:text-blue-500 transition-colors" />
    </div>
  );
};

export default AccountButton;
