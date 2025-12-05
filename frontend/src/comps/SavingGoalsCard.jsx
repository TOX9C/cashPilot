import SavingCard from "./SavingsCard";
import { useNavigate } from "react-router-dom";

const SavingGoalsCard = ({ goals = [] }) => {
  const navigate = useNavigate();
  const displayGoals = goals.slice(0, 2);

  return (
    <div className="bg-white/80 flex flex-col gap-6 shadow-md border px-5 py-5 rounded-3xl border-slate-200/60 w-full backdrop-blur-3xl">
      <div className="flex justify-between items-center">
        <p className="text-2xl text-slate-900 font-semibold">Saving Goals</p>
        <button
          onClick={() => navigate("/goals")}
          className="text-blue-500 hover:text-blue-600"
        >
          View all
        </button>
      </div>
      {displayGoals.length === 0 ? (
        <p className="text-slate-400">No saving goals yet</p>
      ) : (
        <div className="flex w-full gap-10">
          {displayGoals.map((goal) => (
            <SavingCard
              key={goal.id}
              name={goal.name}
              target={goal.finalAmount}
              current={goal.curAmount}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default SavingGoalsCard;
