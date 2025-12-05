import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

const typeToCategory = {
  rent: "Rent",
  utilities: "Utilities",
  food: "Food & Drink",
  transport: "Transportation",
  personal: "Personal",
  income: "Income",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const RecentTransations = ({ transactions = [] }) => {
  const navigate = useNavigate();

  // Transform transactions to display format
  const transformedTransactions = transactions.map((t) => ({
    id: t.id,
    date: formatDate(t.createdAt),
    amount: t.amount,
    name: t.description,
    category: typeToCategory[t.type] || t.type,
    type: t.type === "income" ? "income" : "expense",
  }));

  return (
    <div className="bg-white/80 shadow-sm backdrop-blur-3xl border border-slate-200/60 flex-1 rounded-3xl p-5">
      <div className="flex justify-between">
        <p className="text-2xl text-slate-900 font-semibold ">
          Recent Transactions
        </p>
        <button
          onClick={() => navigate("/transactions")}
          className="text-blue-500 hover:text-blue-600"
        >
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        {transformedTransactions.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            No recent transactions
          </div>
        ) : (
        <table className="w-full">
          <thead className="border-b border-slate-200/60">
              <tr>
            <th className="text-left text-sm p-4 font-medium text-slate-500">
              Date
            </th>
            <th className="text-left text-sm p-4 font-medium text-slate-500">
              Amount
            </th>
            <th className="text-left text-sm p-4 font-medium text-slate-500">
              Payment Name
            </th>
            <th className="text-left text-sm p-4 font-medium text-slate-500">
              Category
            </th>
              </tr>
          </thead>
          <tbody>
              {transformedTransactions.map((transaction) => (
              <tr
                  key={transaction.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-all"
              >
                <td className="py-5 px-4 text-sm text-slate-600">
                  {transaction.date}
                </td>
                <td
                    className={`py-5 px-4 text-sm font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-slate-900"
                    }`}
                >
                    {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="py-5 px-4 text-sm font-medium">
                  {transaction.name}
                </td>
                <td className="py-5 px-4">
                  <span className="inline-block px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium">
                    {transaction.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};
export default RecentTransations;
