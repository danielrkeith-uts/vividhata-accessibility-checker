import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterUrlPage.css';
import { useAuth } from '../context/AuthContext';

export const EnterUrlPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addSite, refreshUserData } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Create the site on backend
      const newSite = await createSiteOnBackend(url);
      
      if (!newSite || !newSite.id) {
        throw new Error('Failed to create site');
      }

      // Add to context (optimistic update)
      addSite(newSite);

      // Navigate to dashboard
      navigate(`/dashboard/${newSite.id}`);
    } catch (err) {
      console.error('Error creating site:', err);
      setError('Failed to create site. Please try again.');
      
      // Refresh user data from backend in case of mismatch
      await refreshUserData();
      setIsLoading(false);
    }
  };

  return (
    <div className="enter-url-page">
      <div className="url-box">
        <h1>Enter a Website URL</h1>
        <form onSubmit={handleSubmit} className="url-form">
          <input
            type="url"
            placeholder="https://www.example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="url-input"
            disabled={isLoading}
          />
          <button type="submit" className="url-submit-button" disabled={isLoading}>
            {isLoading ? 'Creating Site...' : 'Go to Dashboard'}
          </button>
        </form>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

// Replace this with actual API call
async function createSiteOnBackend(url: string): Promise<any> {
  try {
    const response = await fetch('http://localhost:8080/api/sites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to create site');
    }

    return await response.json();
  } catch (error) {
    // Fallback to mock data for testing
    console.warn('Backend call failed, using mock data:', error);
    return {
      id: `site_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: extractSiteName(url),
      url: url.trim()
    };
  }
}

function extractSiteName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
  } catch {
    return url;
  }
}