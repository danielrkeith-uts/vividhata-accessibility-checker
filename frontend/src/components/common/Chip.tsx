import React, { useState, useRef, useEffect } from 'react';
import './Chip.css';

export type ChipVariant =
  | 'green'
  | 'blue'
  | 'orange'
  | 'red'
  | 'purple'
  | 'yellow'
  | 'gray'
  | 'default';

export type ChipSize = 'small' | 'medium';

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  onClick?: () => void;
  // Filter dropdown props
  isFilter?: boolean;
  filterOptions?: string[];
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}

export const Chip: React.FC<ChipProps> = ({ 
  children, 
  variant = 'default', 
  size = 'small',
  className = '',
  style = {},
  title,
  onClick,
  isFilter = false,
  filterOptions = [],
  selectedValue,
  onValueChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFilter) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilter]);

  const handleFilterClick = () => {
    if (isFilter) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  const handleOptionClick = (option: string) => {
    if (onValueChange) {
      onValueChange(option);
    }
    setIsOpen(false);
  };

  const baseClasses = 'chip';
  const variantClass = `chip-${variant}`;
  const sizeClass = `chip-${size}`;
  
  const combinedClassName = [baseClasses, variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  if (isFilter) {
    return (
      <div className={`chip-filter-container ${className}`} ref={dropdownRef} style={{ position: 'relative', ...style }}>
        <span 
          className={combinedClassName} 
          title={title}
          onClick={handleFilterClick}
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`Filter by ${children}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFilterClick();
            }
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
        >
          {children} ▼
        </span>
        
        {isOpen && (
          <div className="chip-filter-dropdown" role="listbox" aria-label={`Filter options for ${children}`}>
            {filterOptions.map((option) => (
              <button
                key={option}
                className="chip-filter-option"
                onClick={() => handleOptionClick(option)}
                style={{
                  background: selectedValue === option ? 'var(--brand)' : 'transparent',
                  color: selectedValue === option ? 'white' : 'var(--text)',
                }}
                role="option"
                aria-selected={selectedValue === option}
                aria-label={`Select ${option}`}
                onMouseEnter={(e) => {
                  if (selectedValue !== option) {
                    e.currentTarget.style.background = 'var(--panel-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedValue !== option) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <span 
      className={combinedClassName} 
      style={style} 
      title={title}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={title}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </span>
  );
};

export default Chip;
