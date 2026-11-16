import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Pagination } from './components/Pagination';
import { TaskDetailsModal } from './components/TaskDetailsModal';
import { Toast } from './components/Toast';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 sm:p-6 md:p-8 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        <Header />
        <TaskForm />
        <TaskStats />
        <TaskFilters />
        <TaskList />
        <Pagination />
      </div>

      <TaskDetailsModal />
      <Toast />
    </div>
  );
}
