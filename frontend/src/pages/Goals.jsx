import { useState, useEffect } from "react";
import Nav from "../comps/Nav";
import { Skeleton, SkeletonCard, SkeletonGoalCard } from "../comps/Skeleton";
import api from "../utils/api";
import { formatCurrency } from "../utils/currency";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({ name: "", finalAmount: "" });
  const [editAmount, setEditAmount] = useState("");

  // Fetch goals from API
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/goal/get");
      setGoals(res.data.goals || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform backend goals to frontend format
  const transformedGoals = goals.map((goal) => ({
    id: goal.id,
    name: goal.name,
    target: goal.finalAmount,
    current: goal.curAmount,
    createdAt: goal.createdAt,
  }));

  const totalTarget = transformedGoals.reduce(
    (sum, goal) => sum + goal.target,
    0
  );
  const totalCurrent = transformedGoals.reduce(
    (sum, goal) => sum + goal.current,
    0
  );
  const overallProgress =
    totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.finalAmount) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await api.post("/goal/add", {
        name: newGoal.name,
        finalAmount: parseInt(newGoal.finalAmount),
      });
      setNewGoal({ name: "", finalAmount: "" });
      setShowAddModal(false);
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      alert(
        error.response?.data?.message || "Failed to add goal. Please try again."
      );
    }
  };

  const handleUpdateGoal = async () => {
    if (!editingGoal || editAmount === "") {
      return;
    }
    try {
      await api.patch("/goal/update", {
        goalId: editingGoal.id,
        curAmount: parseInt(editAmount),
      });
      setShowEditModal(false);
      setEditingGoal(null);
      setEditAmount("");
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update goal. Please try again."
      );
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm("Are you sure you want to delete this goal?")) {
      return;
    }
    try {
      await api.delete("/goal/delete", {
        data: { goalId },
      });
      fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete goal. Please try again."
      );
    }
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setEditAmount(goal.current.toString());
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen select-none transition-all bg-gradient-to-br from-slate-50 to-slate-100 flex">
        <Nav />
        <main className="flex-1 px-6 flex flex-col gap-10 mt-5 pb-10 overflow-x-hidden">
          <div className="">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-80" />
          </div>

          {/* Overall Progress Card Skeleton */}
          <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
            <div className="flex gap-6 mb-4">
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
            <Skeleton className="h-3 w-full rounded-full mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Goals List Skeleton */}
          <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonGoalCard key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen select-none transition-all bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Nav />
      <main className="flex-1 px-6 flex flex-col gap-10 mt-5 pb-10 overflow-x-hidden">
        <div className="">
          <p className="text-4xl text-slate-900 font-semibold">Saving Goals</p>
          <p className="text-lg text-slate-400">
            Track your progress towards your financial goals
          </p>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-2xl font-semibold text-slate-900">
              Overall Progress
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all rounded-xl backdrop-blur-3xl shadow-md px-6 py-2 text-white font-medium"
            >
              Add New Goal
            </button>
          </div>
          <div className="flex gap-6 mb-4">
            <div className="flex-1">
              <p className="text-slate-500 text-sm mb-1">Total Saved</p>
              <p className="text-slate-900 font-semibold text-2xl">
                {formatCurrency(totalCurrent)}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-sm mb-1">Total Target</p>
              <p className="text-slate-900 font-semibold text-2xl">
                {formatCurrency(totalTarget)}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-sm mb-1">Remaining</p>
              <p className="text-slate-900 font-semibold text-2xl">
                {formatCurrency(totalTarget - totalCurrent)}
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all shadow-sm"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {overallProgress.toFixed(1)}% completed
          </p>
        </div>

        {/* Goals List */}
        <div className="bg-white/80 rounded-3xl shadow-md backdrop-blur-3xl p-5">
          <p className="text-2xl font-semibold text-slate-950 mb-6">
            Your Goals
          </p>
          {loading ? (
            <div className="text-center text-xl text-slate-400 py-10">
              Loading goals...
            </div>
          ) : transformedGoals.length === 0 ? (
            <div className="text-center text-xl text-slate-400 py-10">
              You haven't created any saving goals yet
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {transformedGoals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <div
                    key={goal.id}
                    onClick={() => openEditModal(goal)}
                    className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/60 hover:shadow-lg hover:border-blue-300/60 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-slate-900 font-semibold text-lg">
                            {goal.name}
                          </p>
                          <p className="text-slate-500 text-sm">
                            Created: {formatDate(goal.createdAt)}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-slate-600 text-sm">
                            {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                          </p>
                          <p className="text-slate-900 font-semibold">
                            {formatCurrency(goal.target - goal.current)} left
                          </p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mb-2">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all shadow-sm"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-slate-400 text-sm">
                          {progress.toFixed(1)}% completed
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Goal Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Add New Goal
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Goal name"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                  className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Target amount"
                  value={newGoal.finalAmount}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, finalAmount: e.target.value })
                  }
                  className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleAddGoal}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all rounded-xl px-6 py-2 text-white font-medium"
                  >
                    Add Goal
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewGoal({ name: "", finalAmount: "" });
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

        {/* Edit Goal Modal */}
        {showEditModal && editingGoal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Edit Goal: {editingGoal.name}
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  type="number"
                  placeholder="Current amount"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="bg-slate-100 rounded-xl px-4 py-2 text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-slate-500">
                  Target: {formatCurrency(editingGoal.target)}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateGoal}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-all rounded-xl px-6 py-2 text-white font-medium"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this goal? This action cannot be undone."
                        )
                      ) {
                        handleDeleteGoal(editingGoal.id);
                        setShowEditModal(false);
                        setEditingGoal(null);
                        setEditAmount("");
                      }
                    }}
                    className="bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 hover:text-red-700 transition-all rounded-xl px-4 py-2 font-medium flex items-center gap-2"
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
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingGoal(null);
                      setEditAmount("");
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
      </main>
    </div>
  );
};
export default Goals;
