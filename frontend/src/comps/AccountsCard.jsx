import AccountButton from "./AccountButton";

const AccountCard = () => {
  return (
    <div className="w-[25%] bg-white/80 border border-slate-200/60 shadow-md select-none backdrop-blur-xl gap-4 flex flex-col rounded-3xl px-3 py-3">
      <p className="text-2xl text-slate-900 font-semibold">Accounts</p>
      <AccountButton />
      <AccountButton />
      <AccountButton />
    </div>
  );
};
export default AccountCard;
