// src/components/triage/TriageResult.jsx
import React from 'react';

const TriageResult = ({ result }) => {
  if (!result) return null;

  const colorClasses = {
    Red: 'bg-red-100 text-red-700 border-red-300',
    Orange: 'bg-orange-100 text-orange-700 border-orange-300',
    Yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    Green: 'bg-green-100 text-green-700 border-green-300'
  };

  return (
    <div className={`mt-6 p-6 rounded-2xl border-2 text-center ${colorClasses[result.priority] || 'bg-gray-100'}`}>
      <p className="text-sm font-medium">CURRENT PRIORITY</p>
      <p className="text-5xl font-bold mt-2">{result.priority}</p>
      <p className="text-sm mt-2">Base Score: {result.base_score} | Final: {result.final_score}</p>
      {result.override_reason && (
        <p className="text-xs mt-3 opacity-75">{result.override_reason}</p>
      )}
    </div>
  );
};

export default TriageResult;