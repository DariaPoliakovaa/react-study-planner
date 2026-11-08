import { useState, useEffect, type FormEvent } from 'react';
import type { Priority } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

export const TaskForm = () => {
  const { addTask, updateTask, editingTask, setEditingTask } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setError('');
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
    }
  }, [editingTask]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Назва завдання є обов’язковою!');
      return;
    }

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'Загальне',
        priority,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'Загальне',
        priority,
      });
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
    }
    setError('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4 transition-colors"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          {editingTask ? '✏️ Редагувати завдання' : '➕ Додати нове завдання'}
        </h2>
        {editingTask && (
          <button
            type="button"
            onClick={() => setEditingTask(null)}
            className="text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
          >
            Скасувати редагування
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Назва завдання *
          </label>
          <input
            type="text"
            placeholder="Наприклад: Опрацювати useContext"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Опис
          </label>
          <textarea
            rows={2}
            placeholder="Короткий опис завдання..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Категорія
            </label>
            <input
              type="text"
              placeholder="Наприклад: React"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Пріоритет
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
        {editingTask ? 'Зберегти зміни' : 'Додати завдання'}
      </button>
    </form>
  );
};
