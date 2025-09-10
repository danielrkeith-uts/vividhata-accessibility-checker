import React from 'react';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  name?: string;
  size?: 'small' | 'medium'; 
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  disabled = false,
  required = false,
  fullWidth = false,
  className = '',
  id,
  name,
  size,
  placeholder,
}) => {


  const selectId = id || `select-${name || Math.random().toString(36).substr(2, 9)}`;
  
  const selectClass = `select ${fullWidth ? 'select--full-width' : ''} ${error ? 'select--error' : ''} ${size === 'small' ? 'select--small' : ''} ${className}`.trim();

  return (
    <div className="select-container">
      {label && (
        <label htmlFor={selectId} className="select__label">
          {label}
          {required && <span className="select__required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <div id={`${selectId}-error`} className="select__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
