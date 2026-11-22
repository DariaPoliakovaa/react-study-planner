import { useContext } from 'react';
import { TaskContext } from '../context/taskContextDefinition';
import type { TaskContextType } from '../context/taskContextDefinition';

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }

  return context;
};
