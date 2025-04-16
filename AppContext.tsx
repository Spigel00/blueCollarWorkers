import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from './api';
import isAxiosError from './api';
import { WorkerProfile, EmployerProfile, User, UserRole } from '../types/models';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  workerProfile: WorkerProfile | null;
  employerProfiles: EmployerProfile[];
  loading: boolean;
  error: string;
  fetchProfiles: () => void;
  getUserRole: () => UserRole | null;
  logout: () => void;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  validatePassword: (password: string) => string | null;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [employerProfiles, setEmployerProfiles] = useState<EmployerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchProfiles = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [workerRes, employerRes] = await Promise.all([
        axios.get('/users/worker/profile', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/users/employer/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setWorkerProfile(workerRes.data);
      setEmployerProfiles(Array.isArray(employerRes.data) ? employerRes.data : [employerRes.data]);
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout(); // Token is invalid, clear it
      } else {
        setError('Failed to fetch profiles');
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = (): UserRole | null => {
    return currentUser?.role || null;
  };

  // Password validation function to match backend requirements
  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    return null; // Valid password
  };

  const registerUser = async (name: string, email: string, password: string) => {
    try {
      const formData = { name, email, password };
      const response = await axios.post("http://localhost:5000/auth/register", formData);
      localStorage.setItem("token", response.data.access_token);
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Registration failed', error);
      // Extract and show the actual error message from the backend
      if (isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.error || 'Registration failed';
        throw new Error(errorMessage);
      } else {
        throw new Error('Registration failed');
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/auth/login", {
        email,
        password
      
      });
      


      const { access_token, user } = response.data;
      
      
      // Set token in localStorage and axios defaults
      localStorage.setItem("token", access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Update current user
      setCurrentUser(user);
      
      return { user, token: access_token };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
  };

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user profile
      axios.get('/users/me')
        .then(response => {
          setCurrentUser(response.data.user);
        })
        .catch(() => {
          logout(); // Clear invalid token
        });
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      workerProfile,
      employerProfiles,
      loading,
      error,
      fetchProfiles,
      getUserRole,
      logout,
      registerUser,
      validatePassword,
      login
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};