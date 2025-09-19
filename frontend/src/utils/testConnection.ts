// Simple utility to test backend connection
export const testBackendConnection = async (): Promise<boolean> => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch('http://localhost:8080/api/account/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // 401 is expected when not authenticated
      if (response.status === 401) {
        console.log('Backend is reachable and responding correctly');
        return true;
      } else if (response.ok) {
        console.log('Backend is reachable and user is authenticated');
        return true;
      } else {
        console.log(`Backend responded with unexpected status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      console.log('Make sure the backend server is running on http://localhost:8080');
      return false;
    }
  };
  
  (window as any).testBackendConnection = testBackendConnection;