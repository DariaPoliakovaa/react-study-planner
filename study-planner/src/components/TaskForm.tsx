import { useState, type FormEvent } from 'react';
import type { Priority, Task } from '../types/task';

interface TaskFormProps {
  onAddTask: (newTask: Omit<Task, 'id' | 'completed'>) => void;
}

export const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Назва завдання є обов’язковою!');
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'Загальне',
      priority,
    });

    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
    setError('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4"
    >
      <h2 className="text-lg font-bold text-slate-800">Додати нове завдання</h2>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Назва завдання *
          </label>
          <input
            type="text"
            placeholder="Наприклад: Опрацювати useState"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Опис
          </label>
          <textarea
            rows={2}
            placeholder="Короткий опис завдання..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Категорія
            </label>
            <input
              type="text"
              placeholder="Наприклад: React"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Пріоритет
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="low">Низький (Low)</option>
              <option value="medium">Середній (Medium)</option>
              <option value="high">Високий (High)</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer text-sm"
      >
        Додати завдання
      </button>
    </form>
  );
};
