// Simple utility to test backend connection
export const testBackendConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/api/account/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      
      // 401 is expected when not authenticated
      if (response.status === 401) {
        return true;
      } else if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  };
  
  (window as any).testBackendConnection = testBackendConnection;