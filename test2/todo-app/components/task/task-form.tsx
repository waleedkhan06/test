'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, CreateTaskFormData } from '@/lib/validations';
import { Task } from '@/types/api-types';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  onCancel?: () => void;
  initialData?: Partial<Task>;
  userId: string;
  isLoading?: boolean;
}

export default function TaskForm({
  onSubmit,
  onCancel,
  initialData,
  userId,
  isLoading = false,
}: TaskFormProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
    },
  });

  const handleFormSubmit = async (data: CreateTaskFormData) => {
    setError(null);

    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      let response;
      if (initialData?.id) {
        response = await apiClient.updateTask(userId, initialData.id, {
          title: data.title,
          description: data.description || undefined,
          completed: initialData.completed ?? false,
        });
      } else {
        response = await apiClient.createTask(userId, {
          title: data.title,
          description: data.description || undefined,
          completed: false,
        });
      }

      onSubmit(response);
      reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to save task. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Title Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Task Title
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter your task title..."
          {...register('title')}
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.title
              ? 'border-red-500 dark:border-red-500'
              : 'border-gray-200 dark:border-slate-600'
          } dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
        />
        {errors.title && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium mt-1">{errors.title.message}</p>
        )}
      </motion.div>

      {/* Description Field */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (Optional)
        </Label>
        <Textarea
          id="description"
          placeholder="Add more details about your task..."
          rows={4}
          {...register('description')}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-3 pt-4"
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Create Task
            </>
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-slate-700 bg-transparent"
          >
            Cancel
          </Button>
        )}
      </motion.div>
    </form>
  );
}
