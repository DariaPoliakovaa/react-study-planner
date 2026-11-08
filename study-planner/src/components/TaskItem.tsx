import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const priorityBadge = {
    low: 'bg-slate-100 text-slate-700 border-slate-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        task.completed
          ? 'bg-slate-50 border-slate-200 opacity-75'
          : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />

          <div className="space-y-1">
            <h3
              className={`font-semibold text-slate-900 ${
                task.completed ? 'line-through text-slate-500' : ''
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-sm ${
                  task.completed ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                {task.category}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
                  priorityBadge[task.priority]
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer text-sm"
          title="Видалити завдання"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
