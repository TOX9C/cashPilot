import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Nav from "../comps/Nav";
import { Skeleton, SkeletonAccountCard, SkeletonTableRow } from "../comps/Skeleton";
import api from "../utils/api";
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

const Accounts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: "", cash: "" });
  const [editAccount, setEditAccount] = useState({ name: "", cash: "" });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    // Handle account selection from URL parameter
    const accountIdParam = searchParams.get("accountId");
    if (accountIdParam && accounts.length > 0) {
      const account = accounts.find(
        (acc) => acc.id === parseInt(accountIdParam)
      );
      if (account) {
        setSelectedAccount(account);
      }
    }
  }, [searchParams, accounts]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/account/get");
      const accountsData = res.data.accounts || [];
      setAccounts(accountsData);
      
      // Check if there's an accountId in URL params
      const accountIdParam = searchParams.get("accountId");
      if (accountIdParam) {
        const account = accountsData.find(
          (acc) => acc.id === parseInt(accountIdParam)
        );
        if (account) {
          setSelectedAccount(account);
        } else if (accountsData.length > 0) {
          setSelectedAccount(accountsData[0]);
        }
      } else if (accountsData.length > 0 && !selectedAccount) {
        setSelectedAccount(accountsData[0]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.cash, 0);
  const accountTransactions = selectedAccount?.transactions || [];

  const handleAddAccount = async () => {
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
      setShowAddModal(false);
      fetchAccounts();
    } catch (error) {
      console.error("Error adding account:", error);
      alert(
        error.response?.data?.message || "Failed to add account. Please try again."
      );
    }
  };

  const handleUpdateAccount = async () => {
    if (!selectedAccount) return;
    try {
      await api.patch("/account/update", {
        accountId: selectedAccount.id,
        name: editAccount.name || selectedAccount.name,
        cash: editAccount.cash !== "" ? parseInt(editAccount.cash) : selectedAccount.cash,
      });
      setShowEditModal(false);
      setEditAccount({ name: "", cash: "" });
      fetchAccounts();
      // Reselect the updated account
      const res = await api.get("/account/get");
      const updatedAccounts = res.data.accounts || [];
      const updated = updatedAccounts.find((a) => a.id === selectedAccount.id);
      if (updated) setSelectedAccount(updated);
    } catch (error) {
      console.error("Error updating account:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update account. Please try again."
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    if (!confirm("Are you sure you want to delete this account? All transactions will be deleted.")) {
      return;
    }
    try {
      await api.delete("/account/delete", {
        data: { accountId: selectedAccount.id },
      });
      setSelectedAccount(null);
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    }
  };

  const openEditModal = () => {
    if (!selectedAccount) return;
    setEditAccount({
      name: selectedAccount.name,
      cash: selectedAccount.cash.toString(),
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen select-none transition-all bg-gradient-to-br from-slate-50 to-slate-100 flex">
        <Nav />
        <div className="flex flex-1 gap-10 p-5 mt-2">
          {/* Left side skeleton */}
          <div className="w-[35%]">
            <Skeleton className="h-10 w-32 mb-2" />
            <Skeleton className="h-5 w-64 mb-6" />
            <div className="flex flex-col gap-10">
              <div className="bg-white/60 rounded-3xl backdrop-blur-3xl shadow-md flex flex-col justify-center items-center p-5">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <SkeletonAccountCard key={i} />
                ))}
              </div>
            </div>
          </div>
          {/* Divider */}
          <div className="h-[90%] self-center w-1 bg-slate-200/60 rounded-full"></div>
          {/* Right side skeleton */}
          <div className="flex w-full gap-10 flex-col">
            <div>
              <Skeleton className="h-8 w-24 mb-6" />
              <div className="flex gap-6">
                <Skeleton className="h-20 w-32 rounded-xl" />
                <Skeleton className="h-20 w-32 rounded-xl" />
              </div>
            </div>
            <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5">
              <Skeleton className="h-8 w-40 mb-6" />
              <div className="overflow-x-auto w-full">
                <table className="w-full">
                  <thead className="border-b border-slate-200/60">
                    <tr>
                      {[1, 2, 3, 4].map((i) => (
                        <th key={i} className="text-left text-sm p-4">
                          <Skeleton className="h-4 w-20" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <SkeletonTableRow key={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen select-none transition-all bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Nav />
      <div className="flex flex-1 gap-10 p-5 mt-2">
        {/* this is the left side of the main window to select the account */}
        <div className="w-[35%]">
          <p className="font-semibold mb-2 text-4xl text-slate-900">Wallet</p>
          <p className="text-slate-400 mb-6">Manage your accounts and view transactions</p>
          <div className="flex flex-col gap-10">
            <div className="bg-white/60 rounded-3xl backdrop-blur-3xl shadow-md flex flex-col justify-center items-center p-5">
              <p className="text-slate-500 text-md">Total Balance</p>
              <p className="text-slate-900 font-semibold text-2xl">
                {formatCurrency(totalBalance)}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowAddModal(true)}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Add new
              </button>
            </div>
            {loading ? (
              <div className="text-center text-slate-500 text-lg mt-5">
                Loading accounts...
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center text-slate-500 text-lg mt-5">
                You have not added any accounts
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    onClick={() => {
                      setSelectedAccount(account);
                      setSearchParams({ accountId: account.id.toString() });
                    }}
                    className={`bg-white/80 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedAccount?.id === account.id
                        ? "ring-2 ring-blue-500 shadow-md"
                        : "hover:shadow-md"
                    }`}
                  >
                    <p className="text-slate-900 font-semibold text-lg">
                      {account.name}
                    </p>
                    <p className="text-slate-600 text-sm">
                      {formatCurrency(account.cash)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* this is the right section where you can see the transactions and edit the accounts */}
        <div className="h-[90%] self-center w-1 bg-slate-200/60 rounded-full"></div>
        <div className="flex w-full gap-10 flex-col">
          {selectedAccount ? (
            <>
              <div>
                <p className="text-2xl text-slate-900 mb-6 font-semibold">
                  Actions
                </p>
                <div className="flex gap-6">
                  <button
                    onClick={openEditModal}
                    className="bg-white/80 hover:bg-slate-50 active:bg-slate-100 transition-all rounded-xl backdrop-blur-3xl shadow-md p-8"
                  >
                    Edit Info
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-50 text-red-500 hover:bg-red-100 active:bg-red-200 transition-all rounded-xl backdrop-blur-3xl shadow-md p-8"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5">
                <p className="text-2xl font-semibold text-slate-950 mb-6">
                  Transactions - {selectedAccount.name}
                </p>
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
                      </tr>
                    </thead>
                    <tbody>
                      {accountTransactions.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center text-xl text-slate-400 py-10"
                          >
                            You don't have any transactions on this account
                          </td>
                        </tr>
                      ) : (
                        accountTransactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                          >
                            <td className="py-5 px-4 text-sm text-slate-600">
                              {formatDate(transaction.createdAt)}
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
                              {transaction.description}
                            </td>
                            <td className="py-5 px-4">
                              <span className="inline-block px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium">
                                {typeToCategory[transaction.type] || transaction.type}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-xl text-slate-400 py-10">
              Select an account to view details
            </div>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Add New Account
            </h2>
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
                  onClick={handleAddAccount}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all rounded-xl px-6 py-2 text-white font-medium"
                >
                  Add Account
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
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

      {/* Edit Account Modal */}
      {showEditModal && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Edit Account
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Account name"
                value={editAccount.name}
                onChange={(e) =>
                  setEditAccount({ ...editAccount, name: e.target.value })
                }
                className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Balance"
                value={editAccount.cash}
                onChange={(e) =>
                  setEditAccount({ ...editAccount, cash: e.target.value })
                }
                className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateAccount}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all rounded-xl px-6 py-2 text-white font-medium"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditAccount({ name: "", cash: "" });
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
export default Accounts;
