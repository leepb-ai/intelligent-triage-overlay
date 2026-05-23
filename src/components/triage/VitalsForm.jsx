// src/components/triage/VitalsForm.jsx
import React from 'react';
import BigButton from '../common/BigButton';

const VitalsForm = ({ 
  vitals, 
  setVitals, 
  redFlags, 
  setRedFlags, 
  age, 
  setAge, 
  onNext, 
  result 
}) => {

  const updateVital = (field, value) => {
    setVitals(prev => ({ ...prev, [field]: value ? Number(value) : undefined }));
  };

  const toggleFlag = (flag) => {
    setRedFlags(prev => {
      const newFlags = { ...prev, [flag]: !prev[flag] };
      console.log(`Red Flag Toggled → ${flag}: ${newFlags[flag]}`); // Debug
      return newFlags;
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '720px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '25px', color: '#1e40af' }}>Quick Triage Assessment</h2>

      {/* Age */}
      <div style={{ marginBottom: '20px' }}>
        <label>Patient Age (years)</label>
        <input
          type="number"
          value={age || ''}
          onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)}
          style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          placeholder="Enter age"
        />
      </div>

      {/* Vitals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '30px' }}>
        <div>
          <label>Heart Rate (bpm)</label>
          <input type="number" value={vitals.heart_rate || ''} onChange={(e) => updateVital('heart_rate', e.target.value)} style={{ width: '100%', padding: '12px' }} />
        </div>
        <div>
          <label>Respiratory Rate</label>
          <input type="number" value={vitals.respiratory_rate || ''} onChange={(e) => updateVital('respiratory_rate', e.target.value)} style={{ width: '100%', padding: '12px' }} />
        </div>
        <div>
          <label>SpO₂ (%)</label>
          <input type="number" value={vitals.oxygen_saturation || ''} onChange={(e) => updateVital('oxygen_saturation', e.target.value)} style={{ width: '100%', padding: '12px' }} />
        </div>
        <div>
          <label>Systolic BP</label>
          <input type="number" value={vitals.systolic_bp || ''} onChange={(e) => updateVital('systolic_bp', e.target.value)} style={{ width: '100%', padding: '12px' }} />
        </div>
        <div>
          <label>Temperature (°C)</label>
          <input type="number" step="0.1" value={vitals.temperature || ''} onChange={(e) => updateVital('temperature', e.target.value)} style={{ width: '100%', padding: '12px' }} />
        </div>
      </div>

      {/* Mobility */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>Mobility</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {["Walking", "Walking with help", "Stretcher / Immobile"].map(opt => (
            <button
              key={opt}
              onClick={() => setVitals(prev => ({ ...prev, mobility: opt }))}
              style={{
                flex: '1 1 200px',
                padding: '14px',
                border: vitals.mobility === opt ? '2px solid #3b82f6' : '2px solid #ccc',
                background: vitals.mobility === opt ? '#eff6ff' : 'white',
                borderRadius: '8px'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Life Threats - FIXED */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#dc2626', marginBottom: '12px' }}>Immediate Life Threats?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <BigButton 
            active={!!redFlags.active_seizure} 
            onClick={() => toggleFlag('active_seizure')}
          >
            Active Seizure
          </BigButton>
          <BigButton 
            active={!!redFlags.airway_obstruction} 
            onClick={() => toggleFlag('airway_obstruction')}
          >
            Airway Obstruction
          </BigButton>
          <BigButton 
            active={!!redFlags.uncontrolled_bleeding} 
            onClick={() => toggleFlag('uncontrolled_bleeding')}
          >
            Uncontrolled Bleeding
          </BigButton>
          <BigButton 
            active={!!redFlags.chest_pain} 
            onClick={() => toggleFlag('chest_pain')}
          >
            Severe Chest Pain
          </BigButton>
        </div>
      </div>

      {/* Live Result */}
      {result && (
        <div style={{
          padding: '20px',
          backgroundColor: result.priority === 'Red' ? '#fee2e2' : 
                           result.priority === 'Orange' ? '#fef3c7' : 
                           result.priority === 'Yellow' ? '#fef9c3' : '#ecfdf5',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '30px',
          fontWeight: 'bold',
          fontSize: '1.4rem'
        }}>
          Priority: <strong>{result.priority}</strong><br />
          <small>Base Score: {result.base_score}</small>
        </div>
      )}

      <button 
        onClick={onNext}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}
      >
        Continue to Detailed Assessment →
      </button>
    </div>
  );
};

export default VitalsForm;