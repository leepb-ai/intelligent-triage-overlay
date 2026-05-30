// src/components/triage/TriageResult.jsx
import React from 'react';

const TriageResult = ({ result }) => {
  const copySummary = () => {
    if (!result) return;

    const summary = `
HealthSync Triage Summary
========================
Priority: ${result.priority}
Base Score: ${result.base_score}
Final Score: ${result.final_score || result.base_score}

Time: ${new Date().toLocaleString()}

Ready to hand over to doctor.
    `.trim();

    navigator.clipboard.writeText(summary).then(() => {
      alert("✅ Summary copied to clipboard! Paste into LHIMS/GHIMS.");
    }).catch(() => {
      alert("Failed to copy. Please try again.");
    });
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: 
        result.priority === 'Red' ? '#fee2e2' :
        result.priority === 'Orange' ? '#fef3c7' :
        result.priority === 'Yellow' ? '#fef9c3' : '#ecfdf5',
      borderRadius: '16px',
      margin: '24px 0',
      border: '2px solid',
      borderColor: 
        result.priority === 'Red' ? '#ef4444' :
        result.priority === 'Orange' ? '#f59e0b' :
        result.priority === 'Yellow' ? '#eab308' : '#10b981'
    }}>
      <h3 style={{ margin: '0 0 16px 0', textAlign: 'center' }}>
        Triage Result
      </h3>
      
      <div style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
        {result.priority}
      </div>
      
      <p style={{ textAlign: 'center', margin: '0 0 20px 0' }}>
        Base Score: <strong>{result.base_score}</strong>
      </p>

      <button 
        onClick={copySummary}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#1e40af',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        📋 Copy Summary for Doctor
      </button>
    </div>
  );
};

export default TriageResult;