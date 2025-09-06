import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UserDropDown.css'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface UserDropdownProps {
  firstName?: string;
  lastName?: string;
  role?: string;
}
// todo: replace with mui
export const UserDropDown: React.FC<UserDropdownProps> = ({ firstName, lastName, role = 'Web Developer' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
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

  return (
    <div className="user-profile"  ref={dropdownRef} onClick={() => setIsOpen(!isOpen)} tabIndex={0} role="button" aria-haspopup="true" aria-expanded={isOpen} >
     <div className='user-avatar'> <AccountCircleIcon  fontSize='large' /> </div>
      <div className="user-details">
        <span className="user-name">{user?.username} {user?.lastName}</span>
        <span className="user-role">{role}</span>
      </div>
      <button className="user-dropdown">▼</button>

      {isOpen && (
        <ul className="user-dropdown-menu">
            <li onClick={handleLogout} className="user-dropdown-item">Logout</li>
          <li className="user-dropdown-item">Profile</li>
          <li className="user-dropdown-item">Manage Sites</li>
        </ul>
      )}
    </div>
  );
};
