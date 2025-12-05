import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/login", { username, password });
      if (res.data.message === "success") {
        navigate("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen w-screen select-none transition-all bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="bg-white/80 rounded-3xl shadow-lg backdrop-blur-3xl border border-slate-200/60 p-8 w-full max-w-md mx-4">
        <div className="mb-8">
          <h1 className="text-4xl text-slate-900 font-semibold mb-2">
            Welcome Back
          </h1>
          <p className="text-lg text-slate-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username"
              className="w-full bg-slate-100 rounded-xl px-4 py-3 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              className="w-full bg-slate-100 rounded-xl px-4 py-3 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all rounded-xl px-6 py-3 text-white font-medium text-lg mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center mt-4">
            <p className="text-slate-600 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
