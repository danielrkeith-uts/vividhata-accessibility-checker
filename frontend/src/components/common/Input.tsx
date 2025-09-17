import React, { forwardRef } from 'react';
import './Input.css';

export interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  endAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  fullWidth = false,
  className = '',
  id,
  name,
  autoComplete,
  maxLength,
  minLength,
  endAdornment,
}, ref) => {
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`;
  
  const inputClass = `input ${fullWidth ? 'input--full-width' : ''} ${error ? 'input--error' : ''} ${className}`.trim();
  const containerClass = `input-container ${endAdornment ? 'input-container--with-adornment' : ''}`.trim();

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label}
          {required && <span className="input__required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClass}
          name={name}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {endAdornment && (
            <div className="input__adornment" aria-hidden="true">
              {endAdornment}
            </div>
        )}
      </div>
      {error && (
        <div id={`${inputId}-error`} className="input__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
