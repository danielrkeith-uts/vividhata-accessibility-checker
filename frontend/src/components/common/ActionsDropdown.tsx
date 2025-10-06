import React, { useState, useRef, useEffect } from 'react';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import { Button } from './Button';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './ActionsDropdown.css';

interface ActionsDropdownProps {
  onRescan?: () => void;
  onExportPDF?: () => void;
  isRescanning?: boolean;
  isExporting?: boolean;
}

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  onRescan,
  onExportPDF,
  isRescanning = false,
  isExporting = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="actions-dropdown" ref={dropdownRef}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="actions-trigger"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open actions menu"
      >
        <MenuIcon />
      </Button>
      
      {isOpen && (
        <div className="actions-menu" role="menu" aria-label="Actions menu">
          <button
            className="action-item"
            onClick={() => onRescan && handleAction(onRescan)}
            disabled={isRescanning}
            role="menuitem"
            aria-label={isRescanning ? 'Rescanning website' : 'Rescan website for accessibility issues'}
          >
            <span className="action-icon"><FindReplaceIcon /></span>
            <span className="action-text">
              {isRescanning ? 'Rescanning...' : 'Rescan Site'}
            </span>
          </button>
          
          <button
            className="action-item"
            onClick={() => onExportPDF && handleAction(onExportPDF)}
            disabled={isExporting}
            role="menuitem"
            aria-label={isExporting ? 'Exporting PDF report' : 'Export accessibility report as PDF'}
          >
            <span className="action-icon"><ExitToAppIcon /></span>
            <span className="action-text">
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
