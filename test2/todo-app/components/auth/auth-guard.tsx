'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // If true, requires user to be authenticated; if false, requires user to be unauthenticated
  redirectTo?: string; // Where to redirect if auth requirement isn't met
  fallback?: React.ReactNode; // What to show while checking auth status
}

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/sign-in',
  fallback = (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Skeleton className="h-12 w-64 mb-4" />
      <Skeleton className="h-80 w-full max-w-md" />
    </div>
  )
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // If auth is required but user is not authenticated, redirect
      if (requireAuth && !isAuthenticated) {
        router.replace(redirectTo);
      }
      // If auth is NOT required but user IS authenticated, redirect to dashboard
      else if (!requireAuth && isAuthenticated) {
        router.replace('/tasks');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  // Show fallback while loading or if auth requirement isn't met
  if (isLoading || (requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return fallback;
  }

  // Only render children if auth requirements are satisfied
  return <>{children}</>;
}