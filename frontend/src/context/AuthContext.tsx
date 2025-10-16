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
  deleteSite: (siteId: string) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  
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
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        ocupation: '',
        purpose: ''
      };
      setUser(user);
      await loadUserSites(user.id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        // Session expired or not authenticated - clear state
        setUser(null);
        setUserSites([]);
        localStorage.removeItem("user");
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

  const calculateComplianceScore = (issues: any[]): number => {
    
    if (!issues || issues.length === 0) {
      return 100; // Perfect score if no issues
    }
    
    // Use the same calculation as the dashboard
    // Based on WCAG compliance levels (A, AA, AAA)
    const WCAG_MAP: { [key: string]: { level: string } } = {
      'ELEMENT_TOO_SMALL_AAA': { level: 'AAA' },
      'TEXT_CONTRAST_VIOLATION_AAA': { level: 'AAA' },
      'ALT_TEXT_MISSING': { level: 'A' },
      'ARIA_ROLE_MISSING_OR_INVALID': { level: 'A' },
      'CAPTIONS_FOR_VIDEO_AUDIO_MISSING': { level: 'A' },
      'CLEAR_PAGE_TITLES': { level: 'A' },
      'COMPONENTS_NOT_CONSISTENT': { level: 'AA' },
      'CONTENT_MEANINGFUL_SEQUENCE_VIOLATION': { level: 'A' },
      'LANGUAGE_NOT_DEFINED': { level: 'A' },
      'DESCRIPTIVE_LINK_TEXT': { level: 'A' },
      'NO_DRAG_AND_DROP_ALTERNATIVE': { level: 'A' },
      'ERROR_SUGGESTION_NOT_PROVIDED': { level: 'AA' },
      'FOCUS_ORDER_LOGICAL': { level: 'A' },
      'HELP_NOT_AVAILABLE': { level: 'AAA' },
      'ELEMENT_TOO_SMALL': { level: 'AA' },
      'KEYBOARD_OPERABLE': { level: 'A' },
      'LABELS_OR_INSTRUCTIONS_UNCLEAR': { level: 'A' },
      'LANGUAGE_CHANGE_NOT_MARKED': { level: 'AA' },
      'LINE_HEIGHT_SPACING_VIOLATION': { level: 'AA' },
      'MULTIPLE_WAYS_TO_NAVIGATE': { level: 'AA' },
      'NO_KEYBOARD_TRAPS': { level: 'A' },
      'NO_SINGLE_SENSORY_CHARACTERISTIC': { level: 'A' },
      'NOT_JUST_COLOR': { level: 'A' },
      'REDUNDANT_ENTRY': { level: 'A' },
      'SEMANTIC_HTML_MISSING': { level: 'A' },
      'STATUS_MESSAGE_MISSING': { level: 'AA' },
      'TEXT_CONTRAST_VIOLATION': { level: 'AA' },
      'TEXT_RESIZE_VIOLATION': { level: 'AA' },
      'TIME_LIMITS': { level: 'A' },
      'INVALID_HTML': { level: 'A' },
      'FOCUS_NOT_VISIBLE': { level: 'AA' },
      'FOCUS_INDICATOR_HIDDEN': { level: 'AA' },
    };
    
    const allCriteria = Object.keys(WCAG_MAP);
    const violatedTypes = new Set(issues.map(i => i.issueType));
    
    
    const totals = {
      A: allCriteria.filter(t => WCAG_MAP[t].level === 'A').length,
      AA: allCriteria.filter(t => WCAG_MAP[t].level === 'AA').length,
      AAA: allCriteria.filter(t => WCAG_MAP[t].level === 'AAA').length,
    };
    
    const violated = {
      A: Array.from(violatedTypes).filter(t => WCAG_MAP[t]?.level === 'A').length,
      AA: Array.from(violatedTypes).filter(t => WCAG_MAP[t]?.level === 'AA').length,
      AAA: Array.from(violatedTypes).filter(t => WCAG_MAP[t]?.level === 'AAA').length,
    };
    
    const passed = {
      A: Math.max(0, totals.A - violated.A),
      AA: Math.max(0, totals.AA - violated.AA),
      AAA: Math.max(0, totals.AAA - violated.AAA),
    };
    
    
    const overallTotal = totals.A + totals.AA + totals.AAA;
    const overallPassed = passed.A + passed.AA + passed.AAA;
    const complianceScore = overallTotal ? Math.round((overallPassed / overallTotal) * 100) : 0;
    
    return complianceScore;
  };

  const loadUserSites = async (userId: string) => {
    try {
      // Fetch web pages from backend
      const webPages = await scanService.getWebPages();
      
      // Get list of deleted sites from localStorage
      const deletedSitesKey = `deletedSites_${userId}`;
      const deletedSites = JSON.parse(localStorage.getItem(deletedSitesKey) || '[]');
      
      // Convert WebPage objects to Site objects sequentially to avoid race conditions
      const sites: Site[] = [];
      
      for (const webPage of webPages) {
        // Skip deleted sites
        if (deletedSites.includes(webPage.id.toString())) {
          continue;
        }
        try {
          // Get the latest scan for this web page to get last scanned time
          const scans = await scanService.getWebPageScans(webPage.id);
          const latestScan = scans.length > 0 
            ? scans.sort((a, b) => new Date(b.timeScanned).getTime() - new Date(a.timeScanned).getTime())[0]
            : null;
          
          // Fetch issues for the latest scan to calculate compliance score
          let complianceScore = 0;
          if (latestScan) {
            try {
              const issues = await scanService.getScanIssues(latestScan.id);
              if (issues.length > 0) {
              }
              complianceScore = calculateComplianceScore(issues);
            } catch (error) {
              complianceScore = 0;
            }
          } else {
          }
          
          const site: Site = {
            id: webPage.id.toString(),
            name: extractSiteName(webPage.url),
            url: webPage.url,
            lastScanned: latestScan?.timeScanned || null,
            scanData: latestScan || null,
            complianceScore: complianceScore,
          };
          
          sites.push(site);
        } catch (error) {
          // Add site with default values if there's an error
          sites.push({
            id: webPage.id.toString(),
            name: extractSiteName(webPage.url),
            url: webPage.url,
            lastScanned: null,
            scanData: null,
            complianceScore: 0,
          });
        }
      }
      
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
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        ocupation: '',
        purpose: ''
      };
      setUser(user);
      
      await loadUserSites(user.id);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // If refresh fails due to auth issues, clear state
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        setUser(null);
        setUserSites([]);
        localStorage.removeItem("user");
      }
    }
  };

  const refreshUserSites = async () => {
    // Since we only have the scan endpoint, keep sites in localStorage
    // todo: fetch sites from the API
  };

  const addSite = async (site: Site) => {
    if (!user) return; 
    
    // Add to local state immediately
    const updatedSites = [...userSites, site];
    setUserSites(updatedSites);
    saveUserSites(user.id, updatedSites);
    
    // Don't immediately refresh from backend - site added locally first
    // The backend refresh later or triggered by user action
  };

  const removeSite = (siteId: string) => {
    if (!user) return; 
    const updatedSites = userSites.filter(site => site.id !== siteId);
    setUserSites(updatedSites);
    saveUserSites(user.id, updatedSites);
  };

  const deleteSite = async (siteId: string) => {
    if (!user) return;
    
    try {
      
      // Delete from backend
      const deleteResult = await scanService.deleteWebPage(parseInt(siteId));
      
      // Remove from local state
      const updatedSites = userSites.filter(site => site.id !== siteId);
      setUserSites(updatedSites);
      saveUserSites(user.id, updatedSites);
      
      
      // Mark this site as deleted in localStorage to prevent it from reappearing on refresh
      const deletedSitesKey = `deletedSites_${user.id}`;
      const deletedSites = JSON.parse(localStorage.getItem(deletedSitesKey) || '[]');
      if (!deletedSites.includes(siteId)) {
        deletedSites.push(siteId);
        localStorage.setItem(deletedSitesKey, JSON.stringify(deletedSites));
      }
      
    } catch (error) {
      console.error('Error deleting site:', error);
      
      // If it's a 500 error, treat it as successful deletion
      // Handles the case where backend delete fails but we want to remove from frontend
      if (error instanceof Error && error.message.includes('500')) {
        const updatedSites = userSites.filter(site => site.id !== siteId);
        setUserSites(updatedSites);
        saveUserSites(user.id, updatedSites);
        
        // Mark this site as deleted in localStorage to prevent it from reappearing on refresh
        const deletedSitesKey = `deletedSites_${user.id}`;
        const deletedSites = JSON.parse(localStorage.getItem(deletedSitesKey) || '[]');
        deletedSites.push(siteId);
        localStorage.setItem(deletedSitesKey, JSON.stringify(deletedSites));
        
        return; // Don't throw error, just remove from frontend
      }
      
      throw new Error(
        `Failed to delete site: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
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
      // Clear all user-specific localStorage data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('userSites_') || key.startsWith('deletedSites_')) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    deleteSite,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};