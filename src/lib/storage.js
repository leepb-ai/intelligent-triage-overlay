// src/lib/storage.js
const STORAGE_KEY = 'healthsync_triage_records';

export const saveTriageRecord = (record) => {
  try {
    const records = getAllRecords();
    const newRecord = {
      ...record,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    records.unshift(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return newRecord;
  } catch (e) {
    console.error("Failed to save record", e);
    return null;
  }
};

export const getAllRecords = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load records", e);
    return [];
  }
};

export const deleteRecord = (id) => {
  try {
    const records = getAllRecords();
    const filtered = records.filter(record => record.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error("Failed to delete record", e);
    return false;
  }
};