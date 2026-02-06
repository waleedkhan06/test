'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api';
import { Task } from '@/types/api-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TaskCard from '@/components/task/task-card';
import TaskForm from '@/components/task/task-form';
import AuthGuard from '@/components/auth/auth-guard';
import { motion } from 'framer-motion';
import { Plus, CheckCircle2, Clock, ListTodo, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Use a ref to track the current user value
  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    // When the component mounts, check if user is authenticated
    // If authenticated but user is not yet loaded, set up polling
    if (isAuthenticated) {
      if (user?.id) {
        // User object is already populated, fetch tasks immediately
        fetchTasks();
      } else {
        // User object is not yet populated, poll until it is
        const pollForUser = async () => {
          let attempts = 0;
          const maxAttempts = 25; // 25 attempts * 200ms = 5 seconds

          while (attempts < maxAttempts) {
            // Check if user is now available using the ref
            if (userRef.current?.id) {
              fetchTasks();
              return; // Exit the polling function
            }

            // Wait 200ms before next attempt
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
          }

          // After max attempts, try to fetch anyway if user is now available
          if (isAuthenticated && userRef.current?.id) {
            fetchTasks();
          }
        };

        pollForUser();
      }
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      setLoading(true);
      const response = await apiClient.getTasks(user.id);
      setTasks(response);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      // Even if fetching fails, we shouldn't stay in loading state indefinitely
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    setShowForm(false);
  };

  const handleTaskUpdated = async (updatedTask: Task) => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const response = await apiClient.updateTask(user.id, updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description || undefined,
        completed: updatedTask.completed
      });

      setTasks(prev => prev.map(task => task.id === updatedTask.id ? response : task));
    } catch (error) {
      console.error('Failed to update task in backend:', error);
    }
  };

  const handleTaskDeleted = async (taskId: number) => {
    if (!isAuthenticated || !user?.id) return;

    try {
      await apiClient.deleteTask(user.id, taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task in backend:', error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!isAuthenticated || !user?.id) return;

    try {
      const response = await apiClient.toggleTaskCompletion(user.id, task.id);

      if (response) {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleLogout = async () => {
    signOut();
    router.push('/');
    router.refresh();
  };

  // Calculate stats
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <AuthGuard requireAuth={true} redirectTo="/sign-in">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                Outstanding Todo
              </Link>
            </motion.div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                Welcome, <span className="font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</span>
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 border-gray-300 dark:border-slate-600 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Your Tasks
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Stay organized and track your progress
              </p>
            </div>

            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              {showForm ? 'Cancel' : 'Add New Task'}
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            {/* Total Tasks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalTasks}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 flex items-center justify-center">
                  <ListTodo className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
            </motion.div>

            {/* Completed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{completedTasks}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            {/* Pending */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{pendingTasks}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </motion.div>

            {/* Completion Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completion</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{completionPercentage}%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">📊</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Task Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-slate-700"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Create New Task</h2>
              <TaskForm
                onSubmit={handleTaskCreated}
                onCancel={() => setShowForm(false)}
                userId={user?.id || ''}
              />
            </motion.div>
          )}

          {/* Tasks Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 animate-pulse border border-gray-100 dark:border-slate-700"
                >
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                </motion.div>
              ))}
            </div>
          ) : tasks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TaskCard
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onUpdate={handleTaskUpdated}
                    onDelete={handleTaskDeleted}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-gray-100 dark:border-slate-700">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No tasks yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Your task list is empty! Create your first task to get started.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white flex items-center justify-center gap-2 w-full"
                >
                  <Plus className="w-5 h-5" />
                  Create First Task
                </Button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
