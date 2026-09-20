import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, WorkerSession } from '../types';
import { generateWorkerSessionToken, getStoredWorkerSession, clearWorkerSession, formatTimeRemaining } from '../utils/sessionManager';

interface AuthUser {
  role: UserRole;
  email?: string;
  username?: string;
  name: string;
  id?: string;
  workerSession?: WorkerSession;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  workerSession: WorkerSession | null;
  workerSessionRemaining: string;
  loginCitizen: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  loginWorker: (username: string, pass: string) => Promise<{ success: boolean; message: string }>;
  loginAdmin: (username: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'cityhealth_auth_state';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.role === 'worker') {
          const session = getStoredWorkerSession();
          if (!session) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            return null;
          }
          parsed.workerSession = session;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [workerSession, setWorkerSession] = useState<WorkerSession | null>(() => {
    return getStoredWorkerSession();
  });

  const [workerSessionRemaining, setWorkerSessionRemaining] = useState<string>('24h 00m');

  // Sync remaining worker session time
  useEffect(() => {
    if (!workerSession) return;

    const updateTimer = () => {
      if (Date.now() > workerSession.expiryTime) {
        logout();
      } else {
        setWorkerSessionRemaining(formatTimeRemaining(workerSession.expiryTime));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 30000); // every 30s
    return () => clearInterval(interval);
  }, [workerSession]);

  const saveUserState = (newUser: AuthUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const loginCitizen = async (email: string, pass: string) => {
    // Artificial small delay for realism
    await new Promise((r) => setTimeout(r, 450));
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail === 'citizen@demo.com' && pass === 'citizen123') {
      const citizenUser: AuthUser = {
        role: 'citizen',
        email: trimmedEmail,
        name: 'Sundar Raman',
      };
      saveUserState(citizenUser);
      setWorkerSession(null);
      clearWorkerSession();
      return { success: true, message: 'Citizen authentication successful.' };
    }

    // Also support any citizen demo account for testing ease
    if (trimmedEmail.endsWith('@demo.com') && pass.length >= 6) {
      const citizenUser: AuthUser = {
        role: 'citizen',
        email: trimmedEmail,
        name: trimmedEmail.split('@')[0],
      };
      saveUserState(citizenUser);
      setWorkerSession(null);
      clearWorkerSession();
      return { success: true, message: 'Welcome to Citizen Portal!' };
    }

    return {
      success: false,
      message: 'Invalid citizen credentials. Use demo: citizen@demo.com / citizen123',
    };
  };

  const loginWorker = async (username: string, pass: string) => {
    await new Promise((r) => setTimeout(r, 450));
    const u = username.trim().toLowerCase();

    if ((u === 'worker01' || u === 'wrk-001' || u === 'worker') && pass === 'worker123') {
      const session = generateWorkerSessionToken('WRK-001', 'Arun Kumar');
      const workerUser: AuthUser = {
        role: 'worker',
        username: 'worker01',
        id: 'WRK-001',
        name: 'Arun Kumar',
        workerSession: session,
      };
      setWorkerSession(session);
      setWorkerSessionRemaining('24h 00m');
      saveUserState(workerUser);
      return { success: true, message: 'Worker authentication token generated.' };
    }

    return {
      success: false,
      message: 'Invalid worker credentials. Use demo: worker01 / worker123',
    };
  };

  const loginAdmin = async (username: string, pass: string) => {
    await new Promise((r) => setTimeout(r, 450));
    const u = username.trim().toLowerCase();

    if (u === 'admin' && pass === 'admin123') {
      const adminUser: AuthUser = {
        role: 'admin',
        username: 'admin',
        name: 'Dr. C. Jayaprakash (IAS - Special Officer)',
      };
      setWorkerSession(null);
      clearWorkerSession();
      saveUserState(adminUser);
      return { success: true, message: 'Admin Command Center access authorized.' };
    }

    return {
      success: false,
      message: 'Invalid admin credentials. Use demo: admin / admin123',
    };
  };

  const logout = () => {
    saveUserState(null);
    setWorkerSession(null);
    clearWorkerSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'public',
        isAuthenticated: !!user,
        workerSession,
        workerSessionRemaining,
        loginCitizen,
        loginWorker,
        loginAdmin,
        logout,
      }}
    >
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
