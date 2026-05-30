// src/pages/NewTriage.jsx
import React, { useState, useEffect } from 'react';
import VitalsForm from '../components/triage/VitalsForm';
import DetailedAssessment from '../components/triage/DetailedAssessment';
import TriageResult from '../components/triage/TriageResult';
import ClinicianOverride from '../components/triage/ClinicianOverride';
import Dashboard from '../components/triage/Dashboard';
import { calculate_triage_score } from '../lib/scoring';
import { saveTriageRecord, getAllRecords, deleteRecord } from '../lib/storage';

const NewTriage = () => {
  const [currentView, setCurrentView] = useState('triage');
  const [step, setStep] = useState(1);
  
  const [vitals, setVitals] = useState({});
  const [redFlags, setRedFlags] = useState({});
  const [age, setAge] = useState(null);
  const [clinicianOverride, setClinicianOverride] = useState(null);
  const [overrideReason, setOverrideReason] = useState("");
  
  const [records, setRecords] = useState([]);

  const result = calculate_triage_score(vitals, redFlags, age, clinicianOverride, overrideReason);

  useEffect(() => {
    setRecords(getAllRecords());
  }, []);

  useEffect(() => {
    if (Object.keys(vitals).length > 2) {
      saveTriageRecord({
        vitals,
        redFlags,
        age,
        clinicianOverride,
        overrideReason,
        result
      });
      setRecords(getAllRecords());
    }
  }, [result]);

  const resetForm = () => {
    setVitals({});
    setRedFlags({});
    setAge(null);
    setClinicianOverride(null);
    setOverrideReason("");
    setStep(1);
  };

  const handleDeleteRecord = (id) => {
    deleteRecord(id);
    setRecords(getAllRecords());
  };

  const handleFinishAssessment = () => {
    // Save final record
    saveTriageRecord({
      vitals,
      redFlags,
      age,
      clinicianOverride,
      overrideReason,
      result
    });
    setRecords(getAllRecords());
    
    // Switch to Dashboard
    setCurrentView('dashboard');
    
    // Optional: Show success message
    alert(`✅ Assessment Finalized!\nPriority: ${result.priority}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', justifyContent: 'center' }}>
          <button 
            onClick={() => setCurrentView('triage')}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: currentView === 'triage' ? '#1e40af' : '#e5e7eb',
              color: currentView === 'triage' ? 'white' : 'black',
              border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            New Triage
          </button>
          <button 
            onClick={() => setCurrentView('dashboard')}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: currentView === 'dashboard' ? '#1e40af' : '#e5e7eb',
              color: currentView === 'dashboard' ? 'white' : 'black',
              border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            Dashboard ({records.length})
          </button>
        </div>

        {currentView === 'dashboard' ? (
          <Dashboard 
            records={records} 
            onNewTriage={() => { resetForm(); setCurrentView('triage'); }}
            onDeleteRecord={handleDeleteRecord}
          />
        ) : (
          <>
            <h1 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2.2rem' }}>
              HealthSync - New Triage
            </h1>

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
                onFinish={handleFinishAssessment}
              />
            )}

            {(step === 2 || Object.keys(vitals).length > 0) && (
              <>
                <TriageResult result={result} />
                <ClinicianOverride 
                  result={result}
                  clinicianOverride={clinicianOverride}
                  setClinicianOverride={setClinicianOverride}
                  overrideReason={overrideReason}
                  setOverrideReason={setOverrideReason}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewTriage;