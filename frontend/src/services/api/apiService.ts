// API Service for connecting to the accessibility checker backend

const API_BASE_URL = 'http://localhost:8080/api';

// Types matching the backend models
export interface Account {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateAccountRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface WebPage {
  id: number;
  accountId: number;
  url: string;
}

export interface Issue {
  id: number;
  scanId: number;
  issueType: string;
  htmlSnippet: string;
}

export interface Scan {
  id: number;
  webPageId: number;
  timeScanned: string;
  htmlContent: string;
  issues: Issue[];
}

export interface ScanRequest {
  url: string;
}

export interface Link {
  id: number;
  scanId: number;
  url: string;
  text: string;
}

export interface ScanFromUrlResponse {
  scan: Omit<Scan, "issues">;
  issues: Issue[];
  links: Link[];
}

class ApiService {
  async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Determine content type based on body type
    const isStringBody = typeof options.body === 'string' && !options.body.startsWith('{');
    const contentType = isStringBody ? 'text/plain' : 'application/json';
    
    const defaultOptions: RequestInit = {
      credentials: 'include', 
      headers: {
        'Content-Type': contentType,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      // Try to parse as JSON, fall back to text if it fails
      try {
        return JSON.parse(text);
      } catch {
        return text as T;
      }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Account endpoints
  async createAccount(request: CreateAccountRequest): Promise<string> {
    return this.makeRequest<string>('/account/create', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async login(request: LoginRequest): Promise<string> {
    return this.makeRequest<string>('/account/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async logout(): Promise<string> {
    return this.makeRequest<string>('/account/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<Account> {
    return this.makeRequest<Account>('/account/me');
  }

  // Scan endpoints
  async scanFromUrl(url: string): Promise<ScanFromUrlResponse> {
    return this.makeRequest<ScanFromUrlResponse>('/scan/from-url', {
      method: 'POST',
      body: url, // plain string
    });
  }

  async getScanIssues(scanId: number): Promise<Issue[]> {
    return this.makeRequest<Issue[]>(`/scan/${scanId}/issues`);
  }

  async getScanLinks(scanId: number): Promise<Link[]> {
    return this.makeRequest<Link[]>(`/scan/${scanId}/links`);
  }

  // Web page endpoints
  async getWebPages(): Promise<WebPage[]> {
    return this.makeRequest<WebPage[]>('/web-pages');
  }

  async getWebPageScans(webPageId: number): Promise<Scan[]> {
    return this.makeRequest<Scan[]>(`/web-page/${webPageId}/scans`);
  }
}

export const apiService = new ApiService();
