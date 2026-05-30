// src/components/common/BigButton.jsx
import React from 'react';

const BigButton = ({ 
  children, 
  active = false, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '16px 12px',
        border: active ? '3px solid #dc2626' : '2px solid #e5e7eb',
        backgroundColor: active ? '#fee2e2' : 'white',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: active ? '600' : '500',
        color: active ? '#b91c1c' : '#374151',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 4px 12px rgba(220, 38, 38, 0.2)' : 'none'
      }}
    >
      {children}
    </button>
  );
};

export default BigButton;