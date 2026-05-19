// src/components/common/BigButton.jsx
import React from 'react';

const BigButton = ({ 
  children, 
  active = false, 
  onClick, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-4 px-4 rounded-2xl text-base font-medium border-2 transition-all duration-200 
        ${active 
          ? 'bg-red-600 text-white border-red-600 shadow-md scale-105' 
          : 'bg-white border-gray-300 hover:border-red-300 hover:bg-red-50 active:bg-red-100'
        } ${className}`}
    >
      {children}
    </button>
  );
};

export default BigButton;