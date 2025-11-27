const MoneyCard = () => {
  return (
    <div className="bg-white/80 rounded-3xl border border-slate-200/60 shadow-md backdrop-blur-xl p-6 flex-1">
      <div className="flex gap-4 mb-6 items-center">
        <p className="text-slate-600 text-sm">Total Money</p>
        <div className="bg-green-50 text-green-600 rounded-3xl p-1">%6.3</div>
      </div>
      <p className="text-4xl text-slate-900 mb-3">$123,41.33</p>
      <p className="text-slate-400">vs last month</p>
    </div>
  );
};
export default MoneyCard;
