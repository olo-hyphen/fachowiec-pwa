import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as auth from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: auth.User | null;
  session: auth.Session | null;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<auth.User | null>(null);
  const [session, setSession] = useState<auth.Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentSession = auth.getSession();
    if (currentSession) {
      setSession(currentSession);
      setUser(currentSession.user);
    }
    setLoading(false);
  }, []);

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await auth.signUp(email, password, fullName);

    if (error) {
      toast({
        title: "Błąd rejestracji",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Sukces!",
        description: "Konto zostało utworzone. Możesz się teraz zalogować.",
      });
    }

    return { error };
  };

  const handleSignIn = async (email: string, password: string) => {
    const { session: newSession, error } = await auth.signIn(email, password);

    if (error) {
      toast({
        title: "Błąd logowania",
        description: error.message,
        variant: "destructive"
      });
    } else if (newSession) {
      setSession(newSession);
      setUser(newSession.user);
      navigate('/');
    }

    return { error };
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setSession(null);
    setUser(null);
    navigate('/auth');
    toast({
      title: "Wylogowano",
      description: "Zostałeś pomyślnie wylogowany.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signUp: handleSignUp, 
      signIn: handleSignIn, 
      signOut: handleSignOut, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
