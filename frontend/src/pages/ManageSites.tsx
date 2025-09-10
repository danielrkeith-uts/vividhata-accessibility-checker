import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { UserDropDown } from "../components/common/UserDropDown";
import { Button } from "../components/common/Button";
import "./ManageSites.css";
import LanguageIcon from "@mui/icons-material/Language";

// TODO: SITES DO NOT PERSIST AFTER LOGOUT
export const ManageSites: React.FC = () => {
  const { user, userSites } = useAuth();
  const navigate = useNavigate();

  const goToDashboard = (siteId: string) => {
    navigate(`/dashboard/${siteId}`);
  };

  return (
    <div className="manage-sites-page">
      <header className="manage-sites-header">
        <div className="manage-sites-header-content">
          <h1 className="manage-sites-title">Manage Your Sites</h1>
          <div className="manage-sites-user-info">
            <UserDropDown />
          </div>
        </div>
      </header>

      <main className="manage-sites-main">
        <div className="manage-sites-actions">
          <Button onClick={() => navigate("/enter-url")} variant="primary">
            + Add New Site
          </Button>
        </div>

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
            {userSites.map((site) => (
              <div key={site.id} className="site-card">
                <div className="site-card-content">
                  <div className="site-row">
                    <div className="site-icon">
                      <LanguageIcon fontSize="large" />
                    </div>
                    <div className="site-text">
                      <h3 className="site-name">{site.name}</h3>
                      <p className="site-url">{site.url}</p>

                      {site.lastScanned && (
                        <p className="site-meta">
                          Last scanned:{" "}
                          {new Date(site.lastScanned).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="site-stats">
                    {/* You can add site stats here later */}
                    <span className="site-status">Active</span>
                  </div>
                </div>
                <div className="site-card-actions">
                  <Button
                    onClick={() => goToDashboard(site.id)}
                    variant="primary"
                  >
                    View Dashboard
                  </Button>
                  <Button
                    onClick={() => {
                      // TODO: Add edit functionality later
                      console.log("Edit site:", site.id);
                    }}
                    variant="outline"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
