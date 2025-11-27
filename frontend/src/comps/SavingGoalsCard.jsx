import SavingCard from "./SavingsCard";

const SavingGoalsCard = () => {
  return (
    <div className="bg-white/80 flex flex-col gap-6 shadow-md border px-5 py-5 rounded-3xl border-slate-200/60 w-full backdrop-blur-3xl">
      <p className="text-2xl text-slate-900 font-semibold ">Saving Goals</p>
      <div className="flex w-full gap-10">
        <SavingCard />
        <SavingCard />
      </div>
    </div>
  );
};
export default SavingGoalsCard;
