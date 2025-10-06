import React, { useState, useRef, useEffect } from 'react';

interface DropdownFilterProps {
  label: string;
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const DropdownFilter: React.FC<DropdownFilterProps> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  const handleOptionClick = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`dropdown-filter ${className}`} ref={dropdownRef}>
      <div className="dropdown-label" style={{ fontSize: '10px', marginBottom: '2px' }}>{label}:</div>
      <div className="dropdown-container">
        <button
          className="dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '3px 6px',
            fontSize: '11px',
            border: '1px solid var(--panel-border)',
            borderRadius: '4px',
            background: 'white',
            color: 'var(--text)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            minWidth: '50px',
            justifyContent: 'space-between',
            height: '24px'
          }}
        >
          <span>{selectedValue}</span>
          <span style={{ fontSize: '8px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            ▼
          </span>
        </button>
        
        {isOpen && (
          <div
            className="dropdown-menu"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid var(--panel-border)',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              marginTop: '4px'
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                className="dropdown-option"
                onClick={() => handleOptionClick(option)}
                style={{
                  width: '100%',
                  padding: '4px 6px',
                  fontSize: '11px',
                  border: 'none',
                  background: selectedValue === option ? 'var(--brand)' : 'transparent',
                  color: selectedValue === option ? 'white' : 'var(--text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderRadius: '2px',
                  margin: '1px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}
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
    </div>
  );
};

export default DropdownFilter;
