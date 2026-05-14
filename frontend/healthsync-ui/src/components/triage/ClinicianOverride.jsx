// src/components/triage/ClinicianOverride.jsx
import React from 'react';

const ClinicianOverride = ({
  result,
  clinicianOverride,
  setClinicianOverride,
  overrideReason,
  setOverrideReason
}) => {
  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-4">Clinician Override</h3>
      <p className="text-sm text-gray-600 mb-4">
        If you disagree with the automated priority, you can override it here.
      </p>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {["Red", "Orange", "Yellow", "Green"].map((level) => (
          <button
            key={level}
            onClick={() => setClinicianOverride(level)}
            className={`py-3 rounded-xl font-medium text-sm transition-all
              ${clinicianOverride === level 
                ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            {level}
          </button>
        ))}
      </div>

      {clinicianOverride && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Reason for override (recommended)
          </label>
          <textarea
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            placeholder="E.g., Suspected internal bleeding, patient looks very unwell..."
            className="w-full p-3 border rounded-xl h-24 resize-y"
          />
        </div>
      )}

      {clinicianOverride && (
        <button
          onClick={() => {
            setClinicianOverride(null);
            setOverrideReason("");
          }}
          className="mt-3 text-red-600 text-sm hover:underline"
        >
          Clear Override
        </button>
      )}
    </div>
  );
};

export default ClinicianOverride;