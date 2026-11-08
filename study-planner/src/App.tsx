import { useState } from 'react';
import { initialTasks } from './data/initialTasks';
import type { FilterStatus, Task } from './types/task';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now(),
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleToggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  const totalTasksCount = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const uncompletedCount = totalTasksCount - completedCount;

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'completed'
        ? task.completed
        : !task.completed;

    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Header />

        <TaskForm onAddTask={handleAddTask} />

        <TaskStats
          totalCount={totalTasksCount}
          completedCount={completedCount}
          uncompletedCount={uncompletedCount}
          onClearCompleted={handleClearCompleted}
        />

        <TaskFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <TaskList
          tasks={filteredTasks}
          totalTasksCount={totalTasksCount}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </div>
  );
}
