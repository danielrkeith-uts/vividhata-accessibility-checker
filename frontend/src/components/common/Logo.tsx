import React from 'react';
import './Logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  className = '', 
  imageSrc = '/vividhata.png', // Default logo path
  imageAlt = 'vividhata logo',
  showText = true
}) => {
  return (
    <div className={`logo logo-${size} ${className}`}>
      <div className="logo-icon">
        <img 
          src={imageSrc} 
          alt={imageAlt}
          className="logo-image"
          onError={(e) => {
            // Fallback to SVG if image fails to load
            e.currentTarget.style.display = 'none';
            const svgFallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (svgFallback) {
              svgFallback.style.display = 'block';
            }
          }}
        />
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="logo-svg-fallback"
          style={{ display: 'none' }}
        >
          <path 
            d="M12 2L2 7L12 12L22 7L12 2Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M2 17L12 22L22 17" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M2 12L12 17L22 12" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showText && <span className="logo-text">Vividhata</span>}
    </div>
  );
};

export default Logo;
