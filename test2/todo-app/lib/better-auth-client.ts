import { createAuthClient } from 'better-auth/client';
import { API_BASE_URL } from '../config/constants';

// Create a client instance for Better Auth
export const authClient = createAuthClient({
  baseURL: API_BASE_URL || 'http://localhost:8000', // Point to our FastAPI backend
  // Since Better Auth typically has its own endpoints, we may need to adapt our API
});