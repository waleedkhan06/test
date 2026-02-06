'use client';

import { useState } from 'react';
import { Task } from '@/types/api-types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TrashIcon, PencilIcon } from 'lucide-react';
import TaskForm from './task-form';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveEdit = async (updatedTask: Task) => {
    try {
      onUpdate(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(task.id);
    }, 300);
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${
        task.completed ? 'opacity-70 border-l-4 border-green-500' : ''
      } ${isDeleting ? 'animate-fade-out' : ''}`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task)}
          className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="pb-4">
              <TaskForm
                initialData={{
                  id: task.id,
                  title: task.title,
                  description: task.description || '',
                  completed: task.completed,
                }}
                onSubmit={handleSaveEdit}
                onCancel={() => setIsEditing(false)}
                userId={task.user_id}
              />
            </div>
          ) : (
            <>
              <label
                htmlFor={`task-${task.id}`}
                className={`text-lg font-medium cursor-pointer break-words block ${
                  task.completed
                    ? 'line-through text-gray-500 dark:text-gray-500'
                    : 'text-gray-900 dark:text-gray-200'
                }`}
              >
                {task.title}
              </label>

              {task.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
                <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                {task.updated_at && task.updated_at !== task.created_at && (
                  <span>
                    • Updated: {new Date(task.updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
