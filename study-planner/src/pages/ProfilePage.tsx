import { useNavigate } from 'react-router';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTaskContext } from '../hooks/useTaskContext';

export const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const { showToast } = useTaskContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Сесію завершено', 'info');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
          {user.image ? (
            <img
              src={user.image}
              alt={user.username}
              className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-600 object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-2xl font-bold">
              {user.username[0]?.toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              @{user.username}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <span className="text-slate-500 dark:text-slate-400">Username</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {user.username}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <span className="text-slate-500 dark:text-slate-400">Email</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {user.email}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <span className="text-slate-500 dark:text-slate-400">Статус сесії</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {isAuthenticated ? 'Авторизований (Bearer Token активний)' : 'Гість'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          Logout (Вийти з акаунту)
        </button>
      </div>
    </div>
  );
};
