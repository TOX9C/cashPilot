import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../comps/Nav";
import api from "../utils/api";
import {
  getCurrency,
  setCurrency,
  getAvailableCurrencies,
  formatCurrency,
} from "../utils/currency";

const Options = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(getCurrency());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleCurrencyChange = (currency) => {
    setCurrency(currency);
    setSelectedCurrency(currency);
    // Trigger a page reload to update all currency displays
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      // Clear any local storage items if needed
      localStorage.removeItem("currency");
      // Redirect to login page
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen w-screen select-none transition-all bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Nav />
      <main className="flex-1 px-6 flex flex-col gap-10 mt-5 pb-10 overflow-x-hidden">
        <div className="">
          <p className="text-4xl text-slate-900 font-semibold">Settings</p>
          <p className="text-lg text-slate-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Account Settings */}
        <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5">
          <p className="text-2xl font-semibold text-slate-950 mb-6">
            Account Settings
          </p>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={user?.username || ""}
                disabled
                className="w-full bg-slate-100 rounded-xl px-4 py-3 text-slate-600 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-2">
                Username cannot be changed
              </p>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="w-full bg-slate-800 hover:bg-slate-900 active:bg-slate-950 transition-all rounded-xl px-6 py-3 text-white font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5">
          <p className="text-2xl font-semibold text-slate-950 mb-6">
            Preferences
          </p>
          <div className="flex flex-col gap-6">
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Display Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full bg-slate-100 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {getAvailableCurrencies().map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-2">
                All amounts will be displayed in the selected currency. Backend
                transactions are always stored in USD.
              </p>
              <div className="mt-4 p-4 bg-blue-50/80 rounded-xl border border-blue-200/60">
                <p className="text-sm text-blue-900 font-medium mb-1">
                  Preview: {formatCurrency(1000)}
                </p>
                <p className="text-xs text-blue-700">
                  Example: $1,000 USD = {formatCurrency(1000)} in{" "}
                  {selectedCurrency}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl">
              <div>
                <p className="text-slate-900 font-medium">Dark Mode</p>
                <p className="text-sm text-slate-500">Coming soon</p>
              </div>
              <button
                disabled
                className="bg-slate-200 rounded-full w-12 h-6 cursor-not-allowed"
              >
                <div className="bg-white rounded-full w-5 h-5 m-0.5"></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl">
              <div>
                <p className="text-slate-900 font-medium">Email Notifications</p>
                <p className="text-sm text-slate-500">Coming soon</p>
              </div>
              <button
                disabled
                className="bg-slate-200 rounded-full w-12 h-6 cursor-not-allowed"
              >
                <div className="bg-white rounded-full w-5 h-5 m-0.5"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5 border border-red-200/60">
          <p className="text-2xl font-semibold text-slate-950 mb-6 text-red-600">
            Danger Zone
          </p>
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-red-50/80 rounded-xl">
              <p className="text-slate-900 font-medium mb-2">
                Delete Account
              </p>
              <p className="text-sm text-slate-600 mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <button
                disabled
                className="bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-all rounded-xl px-6 py-2 text-white font-medium"
              >
                Delete Account (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Options;
