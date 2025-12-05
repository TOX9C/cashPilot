export const Skeleton = ({ className = "", width, height }) => {
  return (
    <div
      className={`bg-slate-200 animate-pulse rounded ${className}`}
      style={{ width, height }}
    ></div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white/80 rounded-3xl border border-slate-200/60 shadow-md backdrop-blur-xl p-6 flex-1">
      <div className="flex gap-4 mb-6 items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-12 rounded-3xl" />
      </div>
      <Skeleton className="h-10 w-32 mb-3" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
};

export const SkeletonTableRow = () => {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-5 px-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="py-5 px-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="py-5 px-4">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="py-5 px-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </td>
      <td className="py-5 px-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="py-5 px-4">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
      </td>
    </tr>
  );
};

export const SkeletonAccountCard = () => {
  return (
    <div className="bg-white/80 rounded-xl p-4">
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-5 w-24" />
    </div>
  );
};

export const SkeletonGoalCard = () => {
  return (
    <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/60">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-2.5 w-full rounded-full mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
};

export default Skeleton;

