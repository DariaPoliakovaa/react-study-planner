interface TaskStatsProps {
  totalCount: number;
  completedCount: number;
  uncompletedCount: number;
  onClearCompleted: () => void;
}

export const TaskStats = ({
  totalCount,
  completedCount,
  uncompletedCount,
  onClearCompleted,
}: TaskStatsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-6 text-sm font-medium">
        <div>
          <span className="text-slate-500">Всього: </span>
          <span className="text-slate-900 font-bold">{totalCount}</span>
        </div>
        <div>
          <span className="text-slate-500">Невиконано: </span>
          <span className="text-amber-600 font-bold">{uncompletedCount}</span>
        </div>
        <div>
          <span className="text-slate-500">Виконано: </span>
          <span className="text-emerald-600 font-bold">{completedCount}</span>
        </div>
      </div>

      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
        >
          Очистити виконані
        </button>
      )}
    </div>
  );
};
