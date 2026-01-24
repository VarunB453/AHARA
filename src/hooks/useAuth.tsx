import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { mockAuth } from '@/lib/mockAuth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Also listen to mock auth changes
    mockAuth.onAuthStateChange((event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        setLoading(false);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        setLoading(false);
      } else {
        // Fallback to check mock session if no Supabase session
        mockAuth.getSession().then(({ data: { session: mockSession } }) => {
          if (mockSession) {
            setSession(mockSession);
            setUser(mockSession.user);
          }
          setLoading(false);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // Try mock sign out
      await mockAuth.signOut();
    }
    // Clear local state
    setSession(null);
    setUser(null);
  };

  return { user, session, loading, signOut };
};