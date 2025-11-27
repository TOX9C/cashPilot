const SavingCard = () => {
  return (
    <div className="flex flex-col justify-start flex-1">
      <div className="flex justify-between items-center ">
        <p className="text-slate-600 font-medium text-sm">MacBook Pro</p>
        <p className=" font-semibold text-sm">$1399.99</p>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`bg-blue-500 h-2.5 rounded-full transition-all shadow-sm`}
          style={{ width: `50%` }}
        ></div>
      </div>
      <p className="text-slate-400 text-sm">59% completed</p>
    </div>
  );
};
export default SavingCard;
