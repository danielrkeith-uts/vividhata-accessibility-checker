import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials, Site } from '../types';
import { apiService } from '../services/api/apiService';
import { scanService } from '../services/scan/scanService';

interface AuthContextType {
  user: User | null;
  userSites: Site[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  addSite: (site: Site) => Promise<void>; 
  removeSite: (siteId: string) => void;
  refreshUserData: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//extract site name from URL
const extractSiteName = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

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
  
  const [userSites, setUserSites] = useState<Site[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  const updateSiteComplianceScore = (siteId: string, score: number) => {
    setUserSites(prev => 
      prev.map(site => 
        site.id === siteId 
          ? { ...site, complianceScore: score }
          : site
      )
    );
  };

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
      await loadUserSites(user.id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        console.log('User not authenticated - this is normal');
        setUser(null);
        setUserSites([]);
      } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
        console.error('Network error - backend may not be running');
        setUser(null);
        setUserSites([]);
      } else {
        console.error('Error checking auth status:', error);
        setUser(null);
        setUserSites([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserSites = async (userId: string) => {
    try {
      // Fetch web pages from backend
      const webPages = await scanService.getWebPages();
      
      // Convert WebPage objects to Site objects
      const sites: Site[] = await Promise.all(
        webPages.map(async (webPage) => {
          // Get the latest scan for this web page to get last scanned time
          const scans = await scanService.getWebPageScans(webPage.id);
          const latestScan = scans.length > 0 
            ? scans.sort((a, b) => new Date(b.timeScanned).getTime() - new Date(a.timeScanned).getTime())[0]
            : null;
          
          return {
            id: webPage.id.toString(),
            name: extractSiteName(webPage.url),
            url: webPage.url,
            lastScanned: latestScan?.timeScanned || new Date().toISOString(),
            scanData: latestScan || null,
          };
        })
      );
      
      setUserSites(sites);
      
      // Also save to localStorage as backup
      const userSpecificKey = `userSites_${userId}`;
      localStorage.setItem(userSpecificKey, JSON.stringify(sites));
    } catch (error) {
      console.error('Error loading user sites:', error);
      // Fallback to localStorage if backend fails
      const userSpecificKey = `userSites_${userId}`;
      const storedSites = localStorage.getItem(userSpecificKey);
      const sites = storedSites ? JSON.parse(storedSites) : [];
      setUserSites(sites);
    }
  };

  const saveUserSites = (userId: string, sites: Site[]) => {
    const userSpecificKey = `userSites_${userId}`;
    localStorage.setItem(userSpecificKey, JSON.stringify(sites));
  };

  const refreshUserData = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      const user: User = {
        id: userData.id.toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        ocupation: '',
        purpose: ''
      };
      setUser(user);
      
      await loadUserSites(user.id);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const refreshUserSites = async () => {
    // Since we only have the scan endpoint, keep sites in localStorage
    // todo: fetch sites from the API
    console.log('User sites refreshed from localStorage');
  };

  const addSite = async (site: Site) => {
    if (!user) return; 
    
    // Add to local state immediately
    const updatedSites = [...userSites, site];
    setUserSites(updatedSites);
    saveUserSites(user.id, updatedSites);
    
    // Refresh from backend to get the actual data
    try {
      await loadUserSites(user.id);
    } catch (error) {
      console.error('Error refreshing sites after adding:', error);
    }
  };

  const removeSite = (siteId: string) => {
    if (!user) return; 
    const updatedSites = userSites.filter(site => site.id !== siteId);
    setUserSites(updatedSites);
    saveUserSites(user.id, updatedSites);
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      await apiService.login(credentials);
      await checkAuthStatus();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      await apiService.createAccount(credentials);
      await apiService.login({
        email: credentials.email,
        password: credentials.password
      });
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
      setUserSites([]); 
      localStorage.removeItem("user");
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