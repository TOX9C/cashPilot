import AccountButton from "./AccountButton";
import { useNavigate } from "react-router-dom";

const AccountCard = ({ accounts = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="w-[25%] bg-gradient-to-br from-white/90 to-slate-50/90 border border-slate-200/60 shadow-lg select-none backdrop-blur-xl gap-5 flex flex-col rounded-3xl px-5 py-5">
      <div className="flex justify-between items-center">
      <p className="text-2xl text-slate-900 font-semibold">Accounts</p>
        <button
          onClick={() => navigate("/accounts")}
          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
          View all
        </button>
      </div>
      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">No accounts yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {accounts.slice(0, 3).map((account, index) => (
            <AccountButton
              key={account.id}
              id={account.id}
              name={account.name}
              balance={account.cash}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default AccountCard;
