// src/lib/api.js
const API_BASE = 'http://127.0.0.1:8000/api';

export const triageAPI = {
  // Calculate triage score
  calculate: async (data) => {
    const response = await fetch(`${API_BASE}/triage/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Generate summary for doctor
  getSummary: async (data) => {
    const response = await fetch(`${API_BASE}/triage/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Save triage record
  saveRecord: async (data) => {
    const response = await fetch(`${API_BASE}/triage/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Get dashboard
  getDashboard: async () => {
    const response = await fetch(`${API_BASE}/dashboard/`);
    return response.json();
  }
};