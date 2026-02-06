'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '@/types/api-types';
import { apiClient } from '@/lib/api';
import { useTheme } from 'next-themes';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Check for existing token on initial load
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      apiClient.setToken(storedToken);
      setToken(storedToken);
      // Optionally fetch user profile to populate user data
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Update theme when user changes
  useEffect(() => {
    if (user?.theme_preference) {
      setTheme(user.theme_preference);
    }
  }, [user, setTheme]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.getUserProfile();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // If token is invalid, clear it
      signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.signIn(email, password);

      if (response.success && response.token) {
        const authToken = response.token;
        apiClient.setToken(authToken);
        setToken(authToken);

        if (response.user) {
          setUser(response.user);
        } else {
          // If user wasn't returned, fetch it separately
          await fetchUserProfile();
        }
      } else {
        throw new Error(response.error || 'Sign in failed');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.signUp(email, password, name);

      if (response.success && response.token) {
        const authToken = response.token;
        apiClient.setToken(authToken);
        setToken(authToken);

        if (response.user) {
          setUser(response.user);
        } else {
          // If user wasn't returned, fetch it separately
          await fetchUserProfile();
        }
      } else {
        throw new Error(response.error || 'Sign up failed');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    apiClient.clearToken();
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await apiClient.updateUserProfile(userData);

      if (response.success && response.data?.user) {
        const updatedUser = response.data.user;
        setUser(updatedUser);

        // If theme preference was updated, apply the new theme
        if (userData.theme_preference) {
          setTheme(userData.theme_preference);
        }
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};