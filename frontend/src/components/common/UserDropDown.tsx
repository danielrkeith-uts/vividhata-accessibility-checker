import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserDropDown.css';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

interface UserDropDownProps {
  onRescan?: () => void;
  onExportPDF?: () => void;
  onScanNewSite?: () => void;
  isRescanning?: boolean;
  isExporting?: boolean;
  showDashboardActions?: boolean;
}

export const UserDropDown: React.FC<UserDropDownProps> = ({
  onRescan,
  onExportPDF,
  onScanNewSite,
  isRescanning = false,
  isExporting = false,
  showDashboardActions = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is currently on the scan page
  const isOnScanPage = location.pathname === '/enter-url';

  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close dropdown after logout
  };

  const handleManageSites = () => {
    navigate('/manage-sites');
    setIsOpen(false);
  };

  const handleProfile = () => {
    navigate('/edit-profile'); // Assuming this is your edit profile route
    setIsOpen(false);
  };

  const handleScanNewSite = () => {
    navigate('/enter-url');
    setIsOpen(false);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render if no user
  if (!user) {
    return null;
  }

  // Create display name from user data
  const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;

  return (
    <div 
      className="user-profile" 
      ref={dropdownRef} 
      onClick={() => setIsOpen(!isOpen)} 
      tabIndex={0} 
      role="button" 
      aria-haspopup="menu" 
      aria-expanded={isOpen}
      aria-label={`User menu for ${displayName}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(!isOpen);
        }
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      }}
    >
      <div className='user-avatar'>
        <AccountCircleIcon fontSize='medium' />
      </div>
      
      <div className="user-details">
        <span className="user-name">{displayName}</span>
        <span className="user-role">{user.ocupation}</span>
      </div>
      
      <button className="user-dropdown" aria-hidden="true">{!isOpen ? <ArrowDropDownIcon fontSize='large'/> : <ArrowDropUpIcon fontSize='large' />}</button>

      {isOpen && (
        <ul className="user-dropdown-menu" role="menu" aria-label="User menu">
          <li onClick={handleProfile} className="user-dropdown-item" role="menuitem">
            <span className="action-icon"><PersonIcon /></span>
            Profile
          </li>
          <li onClick={handleManageSites} className="user-dropdown-item" role="menuitem">
            <span className="action-icon"><ManageAccountsIcon /></span>
            Manage Sites
          </li>
          {!isOnScanPage && (
            <li onClick={handleScanNewSite} className="user-dropdown-item" role="menuitem">
              <span className="action-icon"><AddIcon /></span>
              Scan New Site
            </li>
          )}
          
          {showDashboardActions && (
            <>
              <li className="user-dropdown-divider" role="separator"></li>
              <li 
                onClick={() => onRescan && handleAction(onRescan)} 
                className={`user-dropdown-item ${isRescanning ? 'disabled' : ''}`} 
                role="menuitem"
                aria-disabled={isRescanning}
              >
                <span className="action-icon"><FindReplaceIcon /></span>
                {isRescanning ? 'Rescanning...' : 'Rescan Site'}
              </li>
              <li 
                onClick={() => onExportPDF && handleAction(onExportPDF)} 
                className={`user-dropdown-item ${isExporting ? 'disabled' : ''}`} 
                role="menuitem"
                aria-disabled={isExporting}
              >
                <span className="action-icon"><ExitToAppIcon /></span>
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </li>
            </>
          )}
          
          <li className="user-dropdown-divider" role="separator"></li>
          <li onClick={handleLogout} className="user-dropdown-item logout-item" role="menuitem">
            Logout
          </li>
        </ul>
      )}
    </div>
  );
};