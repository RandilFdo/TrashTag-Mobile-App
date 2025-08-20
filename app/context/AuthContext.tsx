import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../backend/supabase/client';

interface AuthContextProps {
  session: any;
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session:', data?.session?.user?.email);
          setSession(data?.session || null);
          setUser(data?.session?.user || null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes with more frequent checks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session || null);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Also poll for session changes every 2 seconds as backup
    const pollSession = setInterval(async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Polling session error:', error);
          return;
        }
        
        if (data?.session && !user) {
          console.log('Polling detected session:', data.session.user?.email);
          setSession(data.session);
          setUser(data.session.user);
          setLoading(false);
        }
      } catch (error) {
        console.error('Polling session failed:', error);
      }
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearInterval(pollSession);
    };
  }, [user]);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
