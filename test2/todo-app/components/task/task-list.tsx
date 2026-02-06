'use client';

import { Task } from '@/types/api-types';
import TaskCard from '@/components/task/task-card';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskList({ tasks, onToggleComplete, onUpdate, onDelete }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div className="text-center py-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 max-w-md mx-auto">
            <div className="text-indigo-500 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tasks yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add your first task to get started
            </p>
          </div>
        </div>
      )}
    </div>
  );
}