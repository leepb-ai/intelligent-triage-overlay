// src/components/triage/DetailedAssessment.jsx
import React from 'react';

const DetailedAssessment = ({ redFlags, setRedFlags, age, result, onBack }) => {
    const isPediatric = age && age < 12;

    const toggleFlag = (flag) => {
        setRedFlags(prev => ({
            ...prev,
            [flag]: !prev[flag]
        }));
    };

    return (
        <div className="space-y-8">
            <div>
                <button 
                    onClick={onBack}
                    className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
                >
                    ← Back to Vitals
                </button>

                <h2 className="text-2xl font-semibold mb-6">Additional Clinical Findings</h2>

                {/* Red Flag Section */}
                <div className="mb-8">
                    <h3 className="text-red-600 font-medium mb-4">Critical Discriminators (Red Flags)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button 
                            onClick={() => toggleFlag('active_seizure')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${redFlags.active_seizure ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                        >
                            <strong>Active Seizure / Convulsing</strong>
                        </button>

                        <button 
                            onClick={() => toggleFlag('airway_obstruction')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${redFlags.airway_obstruction ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                        >
                            <strong>Airway Obstruction / Severe Distress</strong>
                        </button>

                        <button 
                            onClick={() => toggleFlag('uncontrolled_bleeding')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${redFlags.uncontrolled_bleeding ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                        >
                            <strong>Uncontrolled Bleeding</strong>
                        </button>

                        <button 
                            onClick={() => toggleFlag('chest_pain')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${redFlags.chest_pain ? 'border-orange-600 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}
                        >
                            <strong>Severe Chest Pain</strong>
                        </button>

                        {isPediatric && (
                            <button 
                                onClick={() => toggleFlag('central_cyanosis')}
                                className={`p-4 rounded-2xl border-2 text-left transition-all ${redFlags.central_cyanosis ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                            >
                                <strong>Central Cyanosis (Paediatric)</strong>
                            </button>
                        )}
                    </div>
                </div>

                <div className="text-center text-sm text-gray-500 mt-8">
                    These flags can automatically upgrade priority to <strong>Red</strong> or <strong>Orange</strong>
                </div>
            </div>
        </div>
    );
};

export default DetailedAssessment;