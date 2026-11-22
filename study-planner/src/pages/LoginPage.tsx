import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { type LoginFormData, loginSchema } from '../schemas/authSchema';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTaskContext } from '../hooks/useTaskContext';

export const LoginPage = () => {
  const { login } = useAuthContext();
  const { showToast } = useTaskContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const fromState = (location.state as { from?: { pathname: string; search?: string } } | null)
    ?.from;
  const redirectQuery = searchParams.get('redirectTo');
  const destination = fromState
    ? `${fromState.pathname}${fromState.search ?? ''}`
    : redirectQuery || '/tasks';

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data);
      showToast(`Вітаємо, ${data.username}!`, 'success');
      navigate(destination, { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Невірний логін або пароль';
      setServerError(message);
    }
  };

  const fillDemoCredentials = () => {
    setValue('username', 'emilys', { shouldValidate: true });
    setValue('password', 'emilyspass', { shouldValidate: true });
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Вхід у Study Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Авторизуйтеся для створення, редагування та видалення завдань
          </p>
        </div>

        {serverError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
            >
              Username *
            </label>
            <input
              id="username"
              type="text"
              placeholder="emilys"
              disabled={isSubmitting}
              {...register('username')}
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1"
            >
              Password *
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              disabled={isSubmitting}
              {...register('password')}
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Виконується вхід...' : 'Увійти'}
          </button>
        </form>

        {/* Підказка з тестовими обліковими даними DummyJSON */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs">
          <div className="text-slate-600 dark:text-slate-300">
            Тестовий акаунт: <code className="font-bold">emilys</code> /{' '}
            <code className="font-bold">emilyspass</code>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer whitespace-nowrap"
          >
            Підставити
          </button>
        </div>
      </div>
    </div>
  );
};
