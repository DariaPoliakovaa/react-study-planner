import { createBrowserRouter, redirect, type LoaderFunctionArgs } from 'react-router';
import { authStorage } from '../api/authStorage';
import { AppLayout } from '../layouts/AppLayout';
import { TasksPage } from '../pages/TasksPage';
import { TaskDetailsPage } from '../pages/TaskDetailsPage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';

function requireUser({ request }: LoaderFunctionArgs) {
  const token = authStorage.getToken();
  const user = authStorage.getUser();

  if (!token || !user) {
    const url = new URL(request.url);
    const redirectTo = encodeURIComponent(`${url.pathname}${url.search}`);
    return redirect(`/login?redirectTo=${redirectTo}`);
  }

  return { user };
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        loader: () => redirect('/tasks'),
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'tasks/:taskId',
        element: <TaskDetailsPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'profile',
        loader: requireUser,
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
