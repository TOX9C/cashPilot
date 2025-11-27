import { FaArrowRight } from "react-icons/fa";

const AccountButton = () => {
  return (
    <div className="bg-slate-100/60 flex items-center rounded-xl hover:bg-slate-200/80 py-4 cursor-pointer select-none transition-all justify-between px-5">
      <div className="flex gap-3 items-center">
        <div className="bg-slate-900 w-10 h-10 rounded-md"></div>
        <div>
          <p className="text-slate-500 text-md">Main Account</p>
          <p className="text-slate-900 text-2xl">$12,243.2</p>
        </div>
      </div>

      <FaArrowRight />
    </div>
  );
};

export default AccountButton;
