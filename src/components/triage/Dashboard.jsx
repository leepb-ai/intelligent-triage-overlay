// src/components/triage/Dashboard.jsx
import React from 'react';

const Dashboard = ({ records, onNewTriage, onDeleteRecord }) => {
  if (records.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '80px 20px', 
        color: '#666',
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #e5e7eb'
      }}>
        <h3>No triage records yet</h3>
        <p style={{ marginTop: '12px' }}>Complete your first triage assessment to see records here.</p>
        
        <button 
          onClick={onNewTriage}
          style={{
            marginTop: '30px',
            padding: '14px 32px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Start New Triage
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h2 style={{ margin: 0 }}>Recent Triage Records ({records.length})</h2>
        <button 
          onClick={onNewTriage}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          + New Triage
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {records.map(record => {
          const vitals = record.vitals || {};
          const result = record.result || {};

          return (
            <div
              key={record.id}
              style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                position: 'relative'
              }}
            >
              {/* Delete Button */}
              <button
                onClick={() => {
                  if (window.confirm(`Delete record for ${vitals.patientName || 'this patient'}?`)) {
                    onDeleteRecord(record.id);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
                title="Delete record"
              >
                ×
              </button>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ fontSize: '1.25rem' }}>
                    {vitals.patientName || "Unknown Patient"}
                  </strong>
                  {vitals.patientId && (
                    <span style={{ marginLeft: '12px', color: '#666', fontSize: '0.95rem' }}>
                      {vitals.patientId}
                    </span>
                  )}
                </div>
                
                <small style={{ color: '#888', textAlign: 'right' }}>
                  {new Date(record.timestamp).toLocaleString()}
                </small>
              </div>

              {/* Priority */}
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontSize: '2.1rem',
                  fontWeight: 'bold',
                  color: 
                    result.priority === 'Red' ? '#ef4444' :
                    result.priority === 'Orange' ? '#f59e0b' :
                    result.priority === 'Yellow' ? '#eab308' : '#10b981'
                }}>
                  {result.priority}
                </span>
                <span style={{ color: '#555' }}>
                  Score: <strong>{result.base_score}</strong>
                </span>
              </div>

              {/* Additional Info */}
              <div style={{ marginTop: '12px', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.95rem' }}>
                {vitals.gender && <span><strong>Gender:</strong> {vitals.gender}</span>}
                {vitals.age && <span><strong>Age:</strong> {vitals.age} years</span>}
                {vitals.avpu && <span><strong>AVPU:</strong> {vitals.avpu}</span>}
              </div>

              {/* Chief Complaint */}
              {vitals.chiefComplaint && (
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '10px',
                  fontStyle: 'italic',
                  color: '#444'
                }}>
                  "{vitals.chiefComplaint.length > 120 
                    ? vitals.chiefComplaint.substring(0, 120) + '...' 
                    : vitals.chiefComplaint}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;