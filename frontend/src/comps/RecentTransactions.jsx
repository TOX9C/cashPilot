const transactions = [
  {
    date: "12 Jul 2024",
    amount: 13,
    name: "Youtube",
    category: "Subscription",
    type: "expense",
  },
  {
    date: "14 Jul 2024",
    amount: 222,
    name: "Dinner",
    category: "Food & Drink",
    type: "expense",
  },
  {
    date: "15 Jul 2024",
    amount: 450,
    name: "Freelance Project",
    category: "Income",
    type: "income",
  },
  {
    date: "16 Jul 2024",
    amount: 89,
    name: "Groceries",
    category: "Food & Drink",
    type: "expense",
  },
  {
    date: "18 Jul 2024",
    amount: 35,
    name: "Netflix",
    category: "Subscription",
    type: "expense",
  },
];
const RecentTransations = () => {
  return (
    <div className="bg-white/80 shadow-sm backdrop-blur-3xl border border-slate-200/60 flex-1 rounded-3xl p-5">
      <div className="flex justify-between">
        <p className="text-2xl text-slate-900 font-semibold ">
          Recent Transactions
        </p>
        <button className="text-blue-500">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200/60">
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
              Catagory
            </th>
          </thead>
          <tbody>
            {transactions.map((transaction, i) => (
              <tr
                key={i}
                className="border-b border-slate-100 hover:bg-slate-50 transition-all"
              >
                <td className="py-5 px-4 text-sm text-slate-600">
                  {transaction.date}
                </td>
                <td
                  className={`py-5 px-4 text-sm font-semibold ${transaction.type === "income" ? "text-green-600" : "text-slate-900"}`}
                >
                  {transaction.type === "income" ? "+" : ""}$
                  {transaction.amount}
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
      </div>
    </div>
  );
};
export default RecentTransations;
