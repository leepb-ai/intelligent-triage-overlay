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
    setVitals(prev => ({ ...prev, [field]: value ? String(value).toUpperCase() : undefined }));
  };

  const toggleFlag = (flag) => {
  setRedFlags(prev => {
    const newFlags = { ...prev, [flag]: !prev[flag] };
    console.log(`Toggled ${flag} → ${newFlags[flag]}`); // Debug
    return newFlags;
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '720px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '25px', color: '#1e40af' }}>Quick Triage Assessment</h2>

      {/* Patient Identification */}
<div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
  <h3 style={{ marginBottom: '16px', color: '#1e40af' }}>Patient Information</h3>
  
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
    <div>
      <label>Full Name</label>
      <input
        type="text"
        value={vitals.patientName || ''}
        onChange={(e) => setVitals(prev => ({ ...prev, patientName: e.target.value }))}
        style={{ width: '100%', padding: '12px', marginTop: '6px' }}
        placeholder="Enter patient name"
      />
    </div>
    <div>
      <label>Hospital ID (optional)</label>
      <input
        type="text"
        value={vitals.patientId || ''}
        onChange={(e) => setVitals(prev => ({ ...prev, patientId: e.target.value }))}
        style={{ width: '100%', padding: '12px', marginTop: '6px' }}
        placeholder="e.g. GH-23451"
      />
    </div>
  </div>

  <div style={{ marginTop: '16px' }}>
    <label>Gender</label>
    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
      {['Male', 'Female', 'Other'].map(g => (
        <button
          key={g}
          onClick={() => setVitals(prev => ({ ...prev, gender: g }))}
          style={{
            padding: '10px 20px',
            border: vitals.gender === g ? '2px solid #3b82f6' : '2px solid #ccc',
            background: vitals.gender === g ? '#eff6ff' : 'white',
            borderRadius: '8px'
          }}
        >
          {g}
        </button>
      ))}
    </div>
  </div>

  <div style={{ marginTop: '20px' }}>
    <label>Chief Complaint / Reason for Visit</label>
    <textarea
      value={vitals.chiefComplaint || ''}
      onChange={(e) => setVitals(prev => ({ ...prev, chiefComplaint: e.target.value }))}
      style={{ width: '100%', padding: '12px', marginTop: '6px', minHeight: '80px' }}
      placeholder="e.g. Severe headache, difficulty breathing..."
    />
   </div>
  </div>

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

      

      {/* Vitals Grid */}
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
          <label>Systolic BP (mmHg)</label>
          <input type="number" value={vitals.systolic_bp || ''} onChange={(e) => updateVital('systolic_bp', e.target.value)} style={{ width: '100%', padding: '12px' }} />
        </div>
        <div>
          <label>Temperature (°C)</label>
          <input type="number" step="0.1" value={vitals.temperature || ''} onChange={(e) => updateVital('temperature', e.target.value)} style={{ width: '100%', padding: '12px' }} />
        </div>
      </div>

      {/* AVPU - FIXED */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>AVPU (Consciousness Level)</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { value: "A", label: "A - Alert" },
            { value: "V", label: "V - Voice" },
            { value: "P", label: "P - Pain" },
            { value: "U", label: "U - Unresponsive" }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => updateVital('avpu', opt.value)}
              style={{
                flex: '1 1 140px',
                padding: '14px',
                border: vitals.avpu === opt.value ? '2px solid #3b82f6' : '2px solid #ccc',
                background: vitals.avpu === opt.value ? '#eff6ff' : 'white',
                borderRadius: '8px',
                fontSize: '15px'
              }}
            >
              {opt.label}
            </button>
          ))}
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

      {/* Life Threats */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#dc2626', marginBottom: '12px' }}>Immediate Life Threats?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <BigButton active={redFlags.active_seizure} onClick={() => toggleFlag('active_seizure')}>Active Seizure</BigButton>
          <BigButton active={redFlags.airway_obstruction} onClick={() => toggleFlag('airway_obstruction')}>Airway Obstruction</BigButton>
          <BigButton active={redFlags.uncontrolled_bleeding} onClick={() => toggleFlag('uncontrolled_bleeding')}>Uncontrolled Bleeding</BigButton>
          <BigButton active={redFlags.chest_pain} onClick={() => toggleFlag('chest_pain')}>Severe Chest Pain</BigButton>
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