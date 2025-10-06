import React from 'react';
import { Logo } from './Logo';
import { UserDropDown } from './UserDropDown';
import { ActionsDropdown } from './ActionsDropdown';
import './GlobalHeader.css';

interface GlobalHeaderProps {
  siteUrl?: string;
  onRescan?: () => void;
  onExportPDF?: () => void;
  isRescanning?: boolean;
  isExporting?: boolean;
  showLogoText?: boolean;
  showActions?: boolean;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  siteUrl,
  onRescan,
  onExportPDF,
  isRescanning = false,
  isExporting = false,
  showLogoText = true,
  showActions = false
}) => {
  return (
    <header className="global-header" role="banner">
      <div className="global-header-content">
        <div className="header-left">
          <Logo size="xlarge" showText={showLogoText} />
          {siteUrl && !showLogoText && (
            <div className="site-url-inline">
              <span className="url-label">Results for:</span>
              <a 
                href={siteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="url-link"
                aria-label={`View website ${siteUrl} in new tab`}
              >
                {siteUrl}
              </a>
            </div>
          )}
        </div>
        
        <div className="header-right">
          {showActions && (
            <ActionsDropdown
              onRescan={onRescan}
              onExportPDF={onExportPDF}
              isRescanning={isRescanning}
              isExporting={isExporting}
            />
          )}
          
          <UserDropDown />
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
