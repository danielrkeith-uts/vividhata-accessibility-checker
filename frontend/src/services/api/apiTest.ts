// API test utility to verify backend connection
import { apiService } from './apiService';

export const testApiConnection = async () => {
  console.log('Testing API connection...');
  
  try {
    // Test if the backend is reachable
    const response = await fetch('http://localhost:8080/api/account/me', {
      credentials: 'include',
    });
    
    if (response.status === 401) {
      console.log('API is reachable (401 Unauthorized is expected when not logged in)');
      return true;
    } else if (response.ok) {
      console.log('API is reachable and user is authenticated');
      return true;
    } else {
      console.log(`API responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('API connection failed:', error);
    console.log('Make sure the backend server is running on http://localhost:8080');
    return false;
  }
};

// Test function to verify scan endpoint
export const testScanEndpoint = async (url: string = 'https://example.com') => {
  console.log(`Testing scan endpoint with URL: ${url}`);
  
  try {
    const scan = await apiService.scanFromUrl(url);
    console.log('Scan endpoint working:', scan);
    return scan;
  } catch (error) {
    console.error('Scan endpoint failed:', error);
    return null;
  }
};
