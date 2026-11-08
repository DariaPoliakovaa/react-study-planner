import { useThemeContext } from '../hooks/useThemeContext';

export const Header = () => {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Study Planner
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm sm:text-base">
          Планувальник навчальних завдань
        </p>
      </div>
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xl shadow-xs"
        title={theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
      >
        {theme === 'dark' ? 'light' : 'dark'}
      </button>
    </header>
  );
};
