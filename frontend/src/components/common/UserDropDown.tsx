import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserDropDown.css';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';



// TODO: replace with mui
export const UserDropDown: React.FC = ({ 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
      aria-haspopup="true" 
      aria-expanded={isOpen}
    >
      <div className='user-avatar'>
        <AccountCircleIcon fontSize='large' />
      </div>
      
      <div className="user-details">
        <span className="user-name">{displayName}</span>
        <span className="user-role">{user.ocupation}</span>
      </div>
      
      <button className="user-dropdown">▼</button>

      {isOpen && (
        <ul className="user-dropdown-menu">
          <li onClick={handleProfile} className="user-dropdown-item">
            Profile
          </li>
          <li onClick={handleManageSites} className="user-dropdown-item">
            Manage Sites
          </li>
          <li onClick={handleLogout} className="user-dropdown-item">
            Logout
          </li>
        </ul>
      )}
    </div>
  );
};