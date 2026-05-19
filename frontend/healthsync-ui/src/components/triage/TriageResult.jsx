// src/components/triage/TriageResult.jsx
import React from 'react';
import { copySummary } from '../../lib/triageUtils';

const TriageResult = ({ result, vitals, redFlags, age }) => {
  if (!result) return null;

  const getColorStyle = (priority) => {
    switch (priority) {
      case 'Red': return { backgroundColor: '#fee2e2', color: '#b91c1c', border: '2px solid #ef4444' };
      case 'Orange': return { backgroundColor: '#fef3c7', color: '#b45309', border: '2px solid #f59e0b' };
      case 'Yellow': return { backgroundColor: '#fef9c3', color: '#854d0e', border: '2px solid #eab308' };
      default: return { backgroundColor: '#ecfdf5', color: '#166534', border: '2px solid #10b981' };
    }
  };

  return (
    <div style={{
      marginTop: '30px',
      padding: '24px',
      borderRadius: '16px',
      textAlign: 'center',
      ...getColorStyle(result.priority)
    }}>
      <p style={{ fontSize: '0.95rem', fontWeight: '500', marginBottom: '8px' }}>
        CURRENT TRIAGE PRIORITY
      </p>
      
      <h2 style={{ fontSize: '2.8rem', fontWeight: '700', margin: '12px 0' }}>
        {result.priority}
      </h2>

      <p style={{ fontSize: '1.1rem' }}>
        Base Score: <strong>{result.base_score}</strong> | 
        Final Score: <strong>{result.final_score}</strong>
      </p>

      {result.override_reason && (
        <p style={{ marginTop: '12px', fontSize: '0.95rem', opacity: 0.9 }}>
          {result.override_reason}
        </p>
      )}

      {/* Copy Summary Button */}
      <button 
        onClick={() => copySummary(result, vitals, redFlags, age)}
        style={{
          marginTop: '20px',
          padding: '14px 32px',
          backgroundColor: '#1e40af',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.05rem',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)'
        }}
      >
        📋 Copy Summary for Doctor
      </button>
    </div>
  );
};

export default TriageResult;