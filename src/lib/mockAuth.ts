import { User, Session } from '@supabase/supabase-js';

// Mock user for local development
const MOCK_USER: User = {
  id: 'mock-user-id',
  app_metadata: {},
  user_metadata: {
    username: 'Demo User'
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@example.com',
  phone: '',
  role: 'authenticated',
  updated_at: new Date().toISOString()
};

const MOCK_SESSION: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: MOCK_USER
};

// Simple in-memory storage for mock auth state
let currentSession: Session | null = null;

export const mockAuth = {
  signInWithPassword: async ({ email, password }: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Accept any credentials for demo purposes
    currentSession = {
      ...MOCK_SESSION,
      user: {
        ...MOCK_USER,
        email
      }
    };
    
    // Trigger auth state change (simplified for mock)
    localStorage.setItem('sb-mock-session', JSON.stringify(currentSession));
    
    return { data: { session: currentSession, user: currentSession.user }, error: null };
  },

  signUp: async ({ email, password, options }: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    currentSession = {
      ...MOCK_SESSION,
      user: {
        ...MOCK_USER,
        email,
        user_metadata: {
          ...MOCK_USER.user_metadata,
          ...options?.data
        }
      }
    };
    
    localStorage.setItem('sb-mock-session', JSON.stringify(currentSession));
    
    return { data: { session: currentSession, user: currentSession.user }, error: null };
  },

  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    currentSession = null;
    localStorage.removeItem('sb-mock-session');
    return { error: null };
  },

  getSession: async () => {
    const stored = localStorage.getItem('sb-mock-session');
    if (stored) {
      currentSession = JSON.parse(stored);
    }
    return { data: { session: currentSession }, error: null };
  },
  
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    // Check initial state
    const stored = localStorage.getItem('sb-mock-session');
    if (stored) {
      currentSession = JSON.parse(stored);
      callback('SIGNED_IN', currentSession);
    }

    // Return a mock subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
};
