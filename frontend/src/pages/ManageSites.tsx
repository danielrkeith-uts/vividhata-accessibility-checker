import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GlobalHeader } from "../components/common/GlobalHeader";
import { Button } from "../components/common/Button";
import { SiteCard } from "../components/dashboard";
import { ConfirmModal } from "../components/common/ConfirmModal";
import "./ManageSites.css";

export const ManageSites: React.FC = () => {
  const { user, userSites, deleteSite } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const goToDashboard = (siteId: string) => {
    navigate(`/dashboard/${siteId}`);
  };

  const handleDeleteClick = (siteId: string) => {
    setSiteToDelete(siteId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteSite || !siteToDelete) return;
    
    setIsDeleting(siteToDelete);
    setShowDeleteModal(false);
    
    try {
      await deleteSite(siteToDelete);
    } catch (error) {
      console.error('Error deleting site:', error);
      setErrorMessage('Failed to delete site. Please try again.');
      setShowErrorModal(true);
    } finally {
      setIsDeleting(null);
      setSiteToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSiteToDelete(null);
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
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
      <GlobalHeader />

      <main className="manage-sites-main">
        <div className="sites-section">
          <div className="sites-header">
            <h1>Manage your sites</h1>
            {userSites.length > 0 && (
              <Button onClick={() => navigate("/enter-url")} variant="primary">
                Scan new site
              </Button>
            )}
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
                    <SiteCard
                      key={site.id}
                      site={site}
                      onCardClick={goToDashboard}
                      onDelete={handleDeleteClick}
                      isDeleting={isDeleting === site.id}
                    />
                  ))}
            </div>
          )}
        </div>

        <div className="marketing-section">
          <div className="marketing-billboard">
            <div className="vividhata-story">
              <div className="story-image">
                <img src="/about-us.png" alt="Vividhata Story - Diversity and Inclusion" />
              </div>
              
              <div className="story-content">
                <h2>The Vividhata Story</h2>
                <p className="story-intro">
                  Vividhata means "diversity" in Sanskrit, and that's exactly what drives our mission.
                </p>
                <p className="story-text">
                  We believe the web should be accessible to everyone, regardless of their abilities, 
                  background, or circumstances. Our accessibility checker helps you create inclusive 
                  digital experiences that welcome all users.
                </p>
                <p className="story-text">
                  Every scan brings us closer to a more inclusive internet—one where diversity 
                  isn't just celebrated, but built into the very foundation of our digital world.
                </p>
              </div>
            </div>
            
           
          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Site"
        message="Are you sure you want to delete this site? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting === siteToDelete}
      />

      <ConfirmModal
        isOpen={showErrorModal}
        title="Error"
        message={errorMessage}
        confirmText="OK"
        onConfirm={handleErrorClose}
        onCancel={handleErrorClose}
      />
    </div>
  );
};