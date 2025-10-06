import React from "react";
import { Site } from "../../types";
import "./SiteCard.css";

interface SiteCardProps {
  site: Site;
  onCardClick: (siteId: string) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({ 
  site, 
  onCardClick
}) => {
  const getAccessibilityLevel = (score: number) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const scanned = new Date(date);
    const diffInDays = Math.floor((now.getTime() - scanned.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Last scanned today';
    if (diffInDays === 1) return 'Last scanned 1 day ago';
    if (diffInDays < 7) return `Last scanned ${diffInDays} days ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Last scanned ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    return 'Last scanned over a month ago';
  };

  const accessibilityScore = site.complianceScore || 0;
  const level = getAccessibilityLevel(accessibilityScore);

  return (
    <div 
      className="site-card"
      onClick={() => onCardClick(site.id)}
    >
      <div className="site-card-content">
        <div className="site-logo">
          <img 
            src={`https://www.google.com/s2/favicons?domain=${site.url}&sz=128`}
            alt={`${site.name} favicon`}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        
        <div className="site-info">
          <div className="site-url-row">
            <a 
              href={site.url} 
              className="site-url"
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.url}
            </a>
          </div>
        </div>
        
        {site.lastScanned ? (
          <p className="site-meta">
            {formatTimeAgo(site.lastScanned)}
          </p>
        ) : (
          <p className="site-meta">
            Never scanned
          </p>
        )}
        
        <div className="site-accessibility">
          <span className="accessibility-percent">
            {accessibilityScore}% accessible
          </span>
          <div 
            className={`accessibility-pill ${level}`}
            style={{ 
              '--progress-width': `${accessibilityScore}%`
            } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  );
};
