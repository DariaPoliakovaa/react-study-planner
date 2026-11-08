import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const { filteredTasks, stats } = useTaskContext();

  if (stats.total === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400 space-y-1 transition-colors">
        <p className="font-semibold text-slate-700 dark:text-slate-200">Завдань поки немає.</p>
        <p className="text-sm">Додайте перше навчальне завдання вище.</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
        <p className="text-sm font-medium">За цим фільтром/пошуком завдань немає.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};
