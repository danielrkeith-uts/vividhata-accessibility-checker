import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials, Site } from '../types';
import { apiService } from '../services/api/apiService';

interface AuthContextType {
  user: User | null;
  userSites: Site[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  addSite: (site: Site) => void; 
  removeSite: (siteId: string) => void;
  refreshUserData: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  // Sites are stored separately and persist across sessions
  const [userSites, setUserSites] = useState<Site[]>(() => {
    const storedSites = localStorage.getItem("userSites");
    return storedSites ? JSON.parse(storedSites) : [];
  });
  
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      // Map Account to User type
      const user: User = {
        id: userData.id.toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        ocupation: '',
        purpose: ''
      };
      setUser(user);
    } catch (error) {
      // 401 Unauthorized is expected when not logged in - don't log as error
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        console.log('User not authenticated - this is normal');
        setUser(null);
      } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
        console.error('Network error - backend may not be running');
        setUser(null);
      } else {
        console.error('Error checking auth status:', error);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      // Map Account to User type
      const user: User = {
        id: userData.id.toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        ocupation: '',
        purpose: ''
      };
      setUser(user);
      
      // Also refresh user sites from API
      await refreshUserSites();
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const refreshUserSites = async () => {
    // Since we only have the scan endpoint, we'll keep sites in localStorage
    // In a real implementation, you'd fetch sites from the API
    console.log('User sites refreshed from localStorage');
  };

  const addSite = (site: Site) => {
    const updatedSites = [...userSites, site];
    setUserSites(updatedSites);
    localStorage.setItem("userSites", JSON.stringify(updatedSites));
  };

  const removeSite = (siteId: string) => {
    const updatedSites = userSites.filter(site => site.id !== siteId);
    setUserSites(updatedSites);
    localStorage.setItem("userSites", JSON.stringify(updatedSites));
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      await apiService.login(credentials);
      // After successful login, check auth status to get user data
      await checkAuthStatus();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await apiService.createAccount(credentials);
      // After successful registration, check auth status to get user data
      await checkAuthStatus();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      // Note: userSites are NOT removed from localStorage, so they persist after logout
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Persist sites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userSites", JSON.stringify(userSites));
  }, [userSites]);

  const value: AuthContextType = {
    user,
    userSites,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
    addSite,
    removeSite,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};