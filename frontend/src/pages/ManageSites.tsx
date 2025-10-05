import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserDropDown } from "../components/common/UserDropDown";
import { Button } from "../components/common/Button";
import "./ManageSites.css";

export const ManageSites: React.FC = () => {
  const { user, userSites, removeSite } = useAuth();
  const navigate = useNavigate();

  const goToDashboard = (siteId: string) => {
    navigate(`/dashboard/${siteId}`);
  };

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

  return (
    <div className="manage-sites-page">
      <header className="manage-sites-header">
        <div className="manage-sites-header-content">
          <h1 className="manage-sites-title">vividhata</h1>
          <div className="manage-sites-user-info">
            <UserDropDown />
          </div>
        </div>
      </header>

      <main className="manage-sites-main">
        <div className="sites-section">
          <h1>Manage your sites</h1>

          {userSites.length === 0 ? (
            <div className="no-sites-container">
              <div className="no-sites-content">
                <h2>No Sites Yet</h2>
                <p>
                  Start monitoring your website's accessibility by adding your
                  first site.
                </p>
                <Button onClick={() => navigate("/enter-url")} variant="primary">
                  Add Your First Site
                </Button>
              </div>
            </div>
          ) : (
            <div className="sites-grid">
              {userSites.map((site) => {
                // Get actual accessibility score from scan data
                // Adjust this path based on your actual data structure
                const accessibilityScore = site.scanData?.complianceScore || 
                                          site.complianceScore || 
                                          0;
                const level = getAccessibilityLevel(accessibilityScore);
                
                return (
                  <div 
                    key={site.id} 
                    className="site-card"
                    onClick={() => goToDashboard(site.id)}
                  >
                    <button
                      className="site-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete ${site.name}?`)) {
                          removeSite(site.id);
                        }
                      }}
                      aria-label={`Delete ${site.name}`}
                    >
                      ✕
                    </button>
                    
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
                      
                      {site.lastScanned && (
                        <p className="site-meta">
                          {formatTimeAgo(site.lastScanned)}
                        </p>
                      )}
                      
                      <div className="site-accessibility">
                        <span className="accessibility-percent">
                          {accessibilityScore}% accessible
                        </span>
                        <div 
                          className={`accessibility-pill ${level}`}
                        >
                          <div 
                            style={{ 
                              width: `${accessibilityScore}%`,
                              height: '100%',
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              borderRadius: '5px'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="marketing-section">
          {/* Add marketing billboard here */}
          <div style={{
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af'
          }}>
            Marketing Billboard Area
          </div>
        </div>
      </main>
    </div>
  );
};