import { createContext, useContext, useState, ReactNode } from 'react';
import useAAuth, {AuthState} from "@/hooks/useAuth.tsx";

interface AuthContextType {
  user: AuthState | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, image: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async (u,p)=>{},
  register: async (u,p, i)=>{},
  signOut: async () => {}
});


export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);
  const {logout, login: handleLogin, auth: user, signup} = useAAuth()


  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      await handleLogin(username, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string, image: string) => {
    setLoading(true);
    try {
      await signup(username, password, image);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      logout();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = { user, register, loading, login, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
