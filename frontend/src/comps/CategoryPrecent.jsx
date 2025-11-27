const CategoryPrecent = () => {
  return (
    <div className="flex flex-col justify-start">
      <div className="flex justify-between items-center ">
        <p className="text-slate-600 font-medium text-sm">Food & Drink</p>{" "}
        <p className=" font-semibold text-sm">$311</p>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`bg-blue-500 h-2.5 rounded-full transition-all shadow-sm`}
          style={{ width: `80%` }}
        ></div>
      </div>
      <p className="text-slate-400 text-sm">49% of total</p>
    </div>
  );
};
export default CategoryPrecent;
