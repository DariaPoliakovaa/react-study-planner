import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Priority } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

export const TaskForm = () => {
  const { addTask, updateTask, editingTask, setEditingTask, isCreating, busyTaskIds } =
    useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setError('');
      setSuccessMessage('');
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
    }
  }, [editingTask]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const isSubmitting =
    isCreating || (editingTask ? busyTaskIds.includes(editingTask.id) : false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Назва завдання є обов’язковою!');
      return;
    }

    if (editingTask) {
      await updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'General',
        priority,
      });
    } else {
      const created = await addTask({
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'General',
        priority,
      });

      if (created) {
        setTitle('');
        setDescription('');
        setCategory('');
        setPriority('medium');
        setSuccessMessage('Завдання успішно додано до списку!');
      }
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

      {successMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm rounded-lg">
          ✓ {successMessage}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Назва завдання *
          </label>
          <input
            type="text"
            placeholder="Наприклад: Вивчити Repository Pattern"
            value={title}
            disabled={isSubmitting}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
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
            disabled={isSubmitting}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
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
              disabled={isSubmitting}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Пріоритет
            </label>
            <select
              value={priority}
              disabled={isSubmitting}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-60"
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
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed text-sm"
      >
        {isSubmitting
          ? 'Збереження...'
          : editingTask
          ? 'Зберегти зміни'
          : 'Додати завдання'}
      </button>
    </form>
  );
};
