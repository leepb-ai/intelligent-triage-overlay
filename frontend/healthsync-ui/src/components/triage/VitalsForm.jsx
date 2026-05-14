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

  const handleVitalChange = (field, value) => {
    setVitals(prev => ({ ...prev, [field]: value ? Number(value) : undefined }));
  };

  const handleFlagToggle = (flag) => {
    setRedFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Triage Assessment</h2>
        
        {/* Age Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Patient Age (years)</label>
          <input
            type="number"
            value={age || ''}
            onChange={(e) => setAge(e.target.value ? Number(e.target.value) : null)}
            className="w-full p-3 border rounded-lg text-lg"
            placeholder="Enter age"
          />
        </div>

        {/* Vital Signs Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Heart Rate (bpm)</label>
            <input
              type="number"
              value={vitals.heart_rate || ''}
              onChange={(e) => handleVitalChange('heart_rate', e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label>Respiratory Rate</label>
            <input
              type="number"
              value={vitals.respiratory_rate || ''}
              onChange={(e) => handleVitalChange('respiratory_rate', e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label>SpO₂ (%)</label>
            <input
              type="number"
              value={vitals.oxygen_saturation || ''}
              onChange={(e) => handleVitalChange('oxygen_saturation', e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label>Systolic BP (mmHg)</label>
            <input
              type="number"
              value={vitals.systolic_bp || ''}
              onChange={(e) => handleVitalChange('systolic_bp', e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        {/* Mobility */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Mobility</label>
          <div className="flex gap-2">
            {["Walking", "Walking with help", "Stretcher / Immobile"].map((option) => (
              <button
                key={option}
                onClick={() => setVitals(prev => ({ ...prev, mobility: option }))}
                className={`flex-1 py-3 rounded-lg border ${vitals.mobility === option ? 'bg-blue-600 text-white' : 'bg-white'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Red Flags */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-red-600">Immediate Life Threats?</h3>
        <div className="grid grid-cols-2 gap-3">
          <BigButton 
            active={redFlags.active_seizure}
            onClick={() => handleFlagToggle('active_seizure')}
          >
            Active Seizure
          </BigButton>
          <BigButton 
            active={redFlags.airway_obstruction}
            onClick={() => handleFlagToggle('airway_obstruction')}
          >
            Airway Obstruction
          </BigButton>
          <BigButton 
            active={redFlags.uncontrolled_bleeding}
            onClick={() => handleFlagToggle('uncontrolled_bleeding')}
          >
            Uncontrolled Bleeding
          </BigButton>
          <BigButton 
            active={redFlags.chest_pain}
            onClick={() => handleFlagToggle('chest_pain')}
          >
            Severe Chest Pain
          </BigButton>
        </div>
      </div>

      {/* Live Result Preview */}
      {result && (
        <div className={`p-4 rounded-xl text-center font-bold text-xl ${result.priority === 'Red' ? 'bg-red-100 text-red-700' : 
                          result.priority === 'Orange' ? 'bg-orange-100 text-orange-700' :
                          result.priority === 'Yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
          Current Priority: <span className="text-2xl">{result.priority}</span>
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold"
      >
        Continue to Detailed Assessment →
      </button>
    </div>
  );
};

export default VitalsForm;