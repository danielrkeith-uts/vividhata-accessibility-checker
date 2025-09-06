// src/pages/EnterUrlPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterUrlPage.css'; // optional styling

export const EnterUrlPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    // Navigate to dashboard with URL as query param
    navigate(`/dashboard?url=${encodeURIComponent(url)}`);
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
        />
        <button type="submit" className="url-submit-button">
          Go to Dashboard
        </button>
      </form>
    </div>
    </div>
  );
};
