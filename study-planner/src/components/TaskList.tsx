import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  totalTasksCount: number;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskList = ({
  tasks,
  totalTasksCount,
  onToggle,
  onDelete,
}: TaskListProps) => {
  if (totalTasksCount === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">Завдань поки немає.</p>
        <p className="text-sm">Додайте перше навчальне завдання вище.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <p className="text-sm font-medium">За цим фільтром/пошуком завдань немає.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
