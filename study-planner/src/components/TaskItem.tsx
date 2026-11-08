import type { Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const { toggleTask, requestDelete, undoDelete, setEditingTask } = useTaskContext();

  const priorityBadge = {
    low: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    high: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  };

  if (task.isPendingDelete) {
    return (
      <div className="p-4 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-800 flex items-center justify-between text-rose-700 dark:text-rose-300 animate-pulse">
        <span className="text-sm font-medium">
          ⏳ Завдання «{task.title}» буде видалено...
        </span>
        <button
          onClick={() => undoDelete(task.id)}
          className="text-xs font-bold bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors cursor-pointer"
        >
          Скасувати
        </button>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        task.completed
          ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />

          <div className="space-y-1">
            <h3
              className={`font-semibold text-slate-900 dark:text-white ${
                task.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-sm ${
                  task.completed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
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

        <div className="flex items-center gap-1">
          <button
            onClick={() => setEditingTask(task)}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-sm"
            title="Редагувати завдання"
          >
            edit
          </button>
          <button
            onClick={() => requestDelete(task.id)}
            className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-sm"
            title="Видалити завдання"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};
