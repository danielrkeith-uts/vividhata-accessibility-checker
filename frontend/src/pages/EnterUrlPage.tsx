import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterUrlPage.css';
import { useAuth } from '../context/AuthContext';
import { scanService } from '../services/scan/scanService';

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
      // Perform accessibility scan
      const scanResult = await scanService.scanUrl(url);
      
      // Create site object with scan data
      const newSite = {
        id: scanResult.siteId,
        name: extractSiteName(url),
        url: url.trim(),
        lastScanned: scanResult.scan.timeScanned,
        scanData: scanResult.scan,
      };

      // Add to context
      addSite(newSite);

      // Navigate to dashboard with the site ID
      navigate(`/dashboard/${scanResult.siteId}`);
    } catch (err) {
      console.error('Error scanning URL:', err);
      setError(err instanceof Error ? err.message : 'Failed to scan URL. Please try again.');
    } finally {
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
            {isLoading ? 'Scanning Website...' : 'Scan Website'}
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


function extractSiteName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
  } catch {
    return url;
  }
}