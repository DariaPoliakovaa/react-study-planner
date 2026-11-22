import { Link } from 'react-router';

export const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center space-y-4 shadow-sm">
      <div className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
        404
      </div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">
        Сторінку не знайдено
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Запитувана адреса не існує або була переміщена.
      </p>
      <Link
        to="/tasks"
        className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
      >
        Повернутися до завдань
      </Link>
    </div>
  );
};
