// src/pages/NewTriage.jsx
import React, { useState } from 'react';
import VitalsForm from '../components/triage/VitalsForm';
import TriageResult from '../components/triage/TriageResult';
import ClinicianOverride from '../components/triage/ClinicianOverride';
import { calculate_triage_score } from '../lib/scoring';

const NewTriage = () => {
  const [step, setStep] = useState(1);           // 1 = Vitals, 2 = Detailed
  const [vitals, setVitals] = useState({});
  const [redFlags, setRedFlags] = useState({});
  const [age, setAge] = useState(null);
  const [clinicianOverride, setClinicianOverride] = useState(null);
  const [overrideReason, setOverrideReason] = useState("");

  // Calculate score in real-time
  const result = calculate_triage_score(
    vitals, 
    redFlags, 
    age, 
    clinicianOverride, 
    overrideReason
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">New Triage</h1>
          <p className="text-gray-600">Patient Assessment • HealthSync</p>
        </div>

        {step === 1 && (
          <VitalsForm 
            vitals={vitals}
            setVitals={setVitals}
            redFlags={redFlags}
            setRedFlags={setRedFlags}
            age={age}
            setAge={setAge}
            onNext={() => setStep(2)}
            result={result}
          />
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Additional Clinical Findings</h2>
            {/* We'll build DetailedAssessment later */}
            <p className="text-gray-500 mb-6">Detailed discriminators coming soon...</p>
            
            <button 
              onClick={() => setStep(1)}
              className="mr-4 px-6 py-3 border rounded-xl"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Live Result */}
        <TriageResult result={result} />

        {/* Clinician Override */}
        <ClinicianOverride 
          result={result}
          clinicianOverride={clinicianOverride}
          setClinicianOverride={setClinicianOverride}
          overrideReason={overrideReason}
          setOverrideReason={setOverrideReason}
        />
      </div>
    </div>
  );
};

export default NewTriage;