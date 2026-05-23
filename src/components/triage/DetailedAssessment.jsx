// src/components/triage/DetailedAssessment.jsx
import React from 'react';

const DetailedAssessment = ({ 
  redFlags, 
  setRedFlags, 
  age, 
  result, 
  onBack 
}) => {

  const isPediatric = age && age < 12;

  const toggleFlag = (flag) => {
    setRedFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  return (
    <div style={{ padding: '24px', maxWidth: '720px', margin: '0 auto' }}>
      <button 
        onClick={onBack}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        ← Back to Vitals
      </button>

      <h2 style={{ marginBottom: '24px', color: '#1e40af' }}>Additional Clinical Findings</h2>

      {/* Red Flags Section */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ color: '#b91c1c', marginBottom: '16px' }}>Critical Discriminators (Safety Nets)</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button 
            onClick={() => toggleFlag('active_seizure')}
            style={{
              padding: '16px',
              border: redFlags.active_seizure ? '2px solid #dc2626' : '2px solid #e5e7eb',
              background: redFlags.active_seizure ? '#fee2e2' : 'white',
              borderRadius: '12px',
              textAlign: 'left',
              fontSize: '1rem'
            }}
          >
            <strong>Active Seizure / Convulsing</strong>
          </button>

          <button 
            onClick={() => toggleFlag('airway_obstruction')}
            style={{
              padding: '16px',
              border: redFlags.airway_obstruction ? '2px solid #dc2626' : '2px solid #e5e7eb',
              background: redFlags.airway_obstruction ? '#fee2e2' : 'white',
              borderRadius: '12px',
              textAlign: 'left',
              fontSize: '1rem'
            }}
          >
            <strong>Airway Obstruction</strong>
          </button>

          <button 
            onClick={() => toggleFlag('uncontrolled_bleeding')}
            style={{
              padding: '16px',
              border: redFlags.uncontrolled_bleeding ? '2px solid #dc2626' : '2px solid #e5e7eb',
              background: redFlags.uncontrolled_bleeding ? '#fee2e2' : 'white',
              borderRadius: '12px',
              textAlign: 'left',
              fontSize: '1rem'
            }}
          >
            <strong>Uncontrolled Bleeding</strong>
          </button>

          <button 
            onClick={() => toggleFlag('chest_pain')}
            style={{
              padding: '16px',
              border: redFlags.chest_pain ? '2px solid #f59e0b' : '2px solid #e5e7eb',
              background: redFlags.chest_pain ? '#fef3c7' : 'white',
              borderRadius: '12px',
              textAlign: 'left',
              fontSize: '1rem'
            }}
          >
            <strong>Severe Chest Pain</strong>
          </button>

          {isPediatric && (
            <button 
              onClick={() => toggleFlag('central_cyanosis')}
              style={{
                padding: '16px',
                border: redFlags.central_cyanosis ? '2px solid #dc2626' : '2px solid #e5e7eb',
                background: redFlags.central_cyanosis ? '#fee2e2' : 'white',
                borderRadius: '12px',
                textAlign: 'left',
                fontSize: '1rem'
              }}
            >
              <strong>Central Cyanosis (Child)</strong>
            </button>
          )}
        </div>
      </div>

      <div style={{ 
        padding: '16px', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '12px',
        fontSize: '0.95rem',
        color: '#374151'
      }}>
        <strong>Note:</strong> Selecting any red flag above can automatically upgrade the patient to <strong>Red</strong> or <strong>Orange</strong> priority.
      </div>

      <button 
        onClick={onBack}
        style={{
          marginTop: '30px',
          width: '100%',
          padding: '16px',
          backgroundColor: '#64748b',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.05rem'
        }}
      >
        Finish Assessment
      </button>
    </div>
  );
};

export default DetailedAssessment;