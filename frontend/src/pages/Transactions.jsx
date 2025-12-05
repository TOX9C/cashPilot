import { useState, useEffect } from "react";
import Nav from "../comps/Nav";
import { Skeleton, SkeletonCard, SkeletonTableRow } from "../comps/Skeleton";
import api from "../utils/api";
import { formatCurrency } from "../utils/currency";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "food",
    accountId: "",
  });
  const [newAccount, setNewAccount] = useState({ name: "", cash: "" });

  // Map backend transaction types to display categories
  const typeToCategory = {
    rent: "Rent",
    utilities: "Utilities",
    food: "Food & Drink",
    transport: "Transportation",
    personal: "Personal",
    income: "Income",
  };

  // Format date from ISO string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Fetch transactions and accounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionsRes, accountsRes] = await Promise.all([
          api.get("/transaction/get"),
          api.get("/account/get"),
        ]);
        setTransactions(transactionsRes.data.transactions || []);
        setAccounts(accountsRes.data.accounts || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Transform backend transactions to frontend format
  const transformedTransactions = transactions.map((t) => ({
    id: t.id,
    date: formatDate(t.createdAt),
    amount: t.amount,
    name: t.description,
    category: typeToCategory[t.type] || t.type,
    type: t.type === "income" ? "income" : "expense",
    account: t.accountName,
    accountId: t.accountId,
  }));

  const filteredTransactions = transformedTransactions.filter((transaction) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "income" && transaction.type === "income") ||
      (filter === "expense" && transaction.type === "expense");
    const matchesSearch =
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIncome = transformedTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transformedTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDelete = async (transactionId) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    // Note: Backend doesn't have delete endpoint yet, but we can add it
    // For now, just show an alert
    alert("Delete functionality will be implemented when backend endpoint is added");
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const [transactionsRes, accountsRes] = await Promise.all([
        api.get("/transaction/get"),
        api.get("/account/get"),
      ]);
      setTransactions(transactionsRes.data.transactions || []);
      setAccounts(accountsRes.data.accounts || []);
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransactionClick = () => {
    if (accounts.length === 0) {
      setShowCreateAccountModal(true);
      return;
    }
    setShowAddModal(true);
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.accountId) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await api.post("/transaction/add", {
        description: newTransaction.description,
        amount: parseInt(newTransaction.amount),
        type: newTransaction.type,
        accountId: parseInt(newTransaction.accountId),
      });
      setNewTransaction({
        description: "",
        amount: "",
        type: "food",
        accountId: "",
      });
      setShowAddModal(false);
      // Refresh both transactions and accounts to show updated balances
      await handleRefresh();
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert(
        error.response?.data?.message || "Failed to add transaction. Please try again."
      );
    }
  };

  const handleCreateAccount = async () => {
    if (!newAccount.name || newAccount.cash === "") {
      alert("Please fill in all fields");
      return;
    }
    try {
      await api.post("/account/create", {
        name: newAccount.name,
        cash: parseInt(newAccount.cash),
      });
      setNewAccount({ name: "", cash: "" });
      setShowCreateAccountModal(false);
      await handleRefresh();
      // After creating account, open add transaction modal
      setShowAddModal(true);
    } catch (error) {
      console.error("Error creating account:", error);
      alert(
        error.response?.data?.message || "Failed to create account. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen w-screen select-none transition-all bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Nav />
      <main className="flex-1 px-6 flex flex-col gap-10 mt-5 pb-10 overflow-x-hidden">
        <div className="">
          <p className="text-4xl text-slate-900 font-semibold">
            Transactions
          </p>
          <p className="text-lg text-slate-400">View and manage all your transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="flex gap-6">
          <div className="bg-white/80 rounded-3xl backdrop-blur-3xl shadow-md flex flex-col justify-center items-center p-5 flex-1">
            <p className="text-slate-500 text-md">Total Income</p>
            <p className="text-green-600 font-semibold text-2xl">+{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-white/80 rounded-3xl backdrop-blur-3xl shadow-md flex flex-col justify-center items-center p-5 flex-1">
            <p className="text-slate-500 text-md">Total Expenses</p>
            <p className="text-slate-900 font-semibold text-2xl">-{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-white/80 rounded-3xl backdrop-blur-3xl shadow-md flex flex-col justify-center items-center p-5 flex-1">
            <p className="text-slate-500 text-md">Net Balance</p>
            <p className={`font-semibold text-2xl ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5">
          <div className="flex gap-6 items-center flex-wrap">
            <div className="flex gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("income")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  filter === "income"
                    ? "bg-green-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilter("expense")}
                className={`px-4 py-2 rounded-xl transition-all ${
                  filter === "expense"
                    ? "bg-red-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Expenses
              </button>
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] bg-slate-100 rounded-xl px-4 py-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddTransactionClick}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all rounded-xl backdrop-blur-3xl shadow-md px-6 py-2 text-white font-medium"
            >
              Add Transaction
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5">
          <div className="flex justify-between items-center mb-6">
            <p className="text-2xl font-semibold text-slate-950">
              All Transactions
            </p>
            <button
              onClick={handleRefresh}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="overflow-x-auto w-full">
              <table className="w-full">
                <thead className="border-b border-slate-200/60">
                  <tr>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <th key={i} className="text-left text-sm p-4">
                        <Skeleton className="h-4 w-20" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <SkeletonTableRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
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
                    <th className="text-left text-sm p-4 font-medium text-slate-500">
                      Account
                    </th>
                    <th className="text-left text-sm p-4 font-medium text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center text-xl text-slate-400 py-10"
                      >
                        {transactions.length === 0
                          ? "You don't have any transactions yet"
                          : "No transactions match your filters"}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => (
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
                        <td className="py-5 px-4 text-sm text-slate-600">
                          {transaction.account}
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex gap-2">
                            <button className="bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-600 hover:text-blue-700 transition-all rounded-lg px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 shadow-sm hover:shadow">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className="bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 hover:text-red-700 transition-all rounded-lg px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 shadow-sm hover:shadow"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Add Transaction
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Description"
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    description: e.target.value,
                  })
                }
                className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: e.target.value,
                  })
                }
                className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    type: e.target.value,
                  })
                }
                className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rent">Rent</option>
                <option value="utilities">Utilities</option>
                <option value="food">Food & Drink</option>
                <option value="transport">Transportation</option>
                <option value="personal">Personal</option>
                <option value="income">Income</option>
              </select>
              <select
                value={newTransaction.accountId}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    accountId: e.target.value,
                  })
                }
                className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {formatCurrency(account.cash)}
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  onClick={handleAddTransaction}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all rounded-xl px-6 py-2 text-white font-medium"
                >
                  Add Transaction
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTransaction({
                      description: "",
                      amount: "",
                      type: "food",
                      accountId: "",
                    });
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-all rounded-xl px-6 py-2 text-slate-600 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal (shown when no accounts exist) */}
      {showCreateAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Create Account First
            </h2>
            <p className="text-slate-500 mb-4">
              You need to create an account before adding transactions.
            </p>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Account name"
                value={newAccount.name}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, name: e.target.value })
                }
                className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Initial balance"
                value={newAccount.cash}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, cash: e.target.value })
                }
                className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreateAccount}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all rounded-xl px-6 py-2 text-white font-medium"
                >
                  Create Account
                </button>
                <button
                  onClick={() => {
                    setShowCreateAccountModal(false);
                    setNewAccount({ name: "", cash: "" });
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-all rounded-xl px-6 py-2 text-slate-600 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Transactions;
