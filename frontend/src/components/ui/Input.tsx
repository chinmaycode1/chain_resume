import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            style={{
              display: 'block',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              fontWeight: 500,
              color: '#666680',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            color: '#ffffff',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s',
            WebkitTextFillColor: '#ffffff',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#00FF94';
            e.currentTarget.style.background = 'rgba(0, 255, 148, 0.04)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 255, 148, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          className={className}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 font-mono">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
