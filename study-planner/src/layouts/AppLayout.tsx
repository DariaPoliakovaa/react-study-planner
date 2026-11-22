import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { useThemeContext } from '../hooks/useThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTaskContext } from '../hooks/useTaskContext';
import { Toast } from '../components/Toast';

export const AppLayout = () => {
  const { theme, toggleTheme } = useThemeContext();
  const { isAuthenticated, user, logout } = useAuthContext();
  const { showToast } = useTaskContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Ви вийшли з облікового запису', 'info');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white shadow-xs'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700'
    }`;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors flex flex-col">
      {/* Спільна шапка та навігація */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/tasks"
            className="flex items-center gap-2 text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            <span>📚 Study Planner</span>
          </Link>

          <nav aria-label="Головна навігація" className="flex items-center gap-2">
            <NavLink to="/tasks" className={navLinkClass}>
              Tasks
            </NavLink>

            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                <span className="hidden sm:inline text-xs font-medium text-slate-500 dark:text-slate-400">
                  @{user?.username}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer text-base"
              title={theme === 'dark' ? 'Світла тема' : 'Темна тема'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      {/* Основна область контенту */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>

      <Toast />
    </div>
  );
};
