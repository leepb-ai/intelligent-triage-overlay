// src/pages/NewTriage.jsx
import React, { useState, useEffect } from 'react';
import VitalsForm from '../components/triage/VitalsForm';
import DetailedAssessment from '../components/triage/DetailedAssessment';
import TriageResult from '../components/triage/TriageResult';
import ClinicianOverride from '../components/triage/ClinicianOverride';
import { calculate_triage_score } from '../lib/scoring';

const NewTriage = () => {
  const [step, setStep] = useState(1);
  const [vitals, setVitals] = useState({});
  const [redFlags, setRedFlags] = useState({});
  const [age, setAge] = useState(null);
  const [clinicianOverride, setClinicianOverride] = useState(null);
  const [overrideReason, setOverrideReason] = useState("");

  // Live calculation
  const result = calculate_triage_score(vitals, redFlags, age, clinicianOverride, overrideReason);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">HealthSync - New Triage</h1>

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
          <DetailedAssessment 
            redFlags={redFlags}
            setRedFlags={setRedFlags}
            age={age}
            result={result}
            onBack={() => setStep(1)}
          />
        )}

        <TriageResult result={result} />

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