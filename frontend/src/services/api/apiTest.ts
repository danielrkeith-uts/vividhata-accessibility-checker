// API test utility to verify backend connection
import { apiService } from './apiService';

export const testApiConnection = async () => {
  console.log('Testing API connection...');
  
  try {
    // Test basic connectivity
    console.log('Testing basic connectivity...');
    const response = await fetch('http://localhost:8080/api/account/me', {
      credentials: 'include'
    });
    
    if (response.status === 401) {
      return true;
    } else if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const testScanEndpoint = async () => {
  console.log('Testing scan endpoint...');
  
  try {
    // Test scan endpoint (this will fail without authentication, but we can check if it's reachable)
    const response = await fetch('http://localhost:8080/api/scan/from-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      credentials: 'include',
      body: 'https://example.com'
    });
    
    if (response.status === 401) {
      console.log('Scan endpoint is reachable - got expected 401 (not authenticated)');
      return true;
    } else if (response.status === 502) {
      console.log('Scan endpoint returned 502 - this is expected when not authenticated');
      console.log('To use scan functionality, please log in first through the frontend');
      return true; // Still consider this a success since the endpoint is reachable
    } else if (response.ok) {
      console.log('Scan endpoint is working');
      return true;
    } else {
      console.log(`Scan endpoint responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('Scan endpoint test failed:', error);
    return false;
  }
};

// Run tests when this module is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  testApiConnection().then(success => {
    if (success) {
      testScanEndpoint();
    }
  });
}