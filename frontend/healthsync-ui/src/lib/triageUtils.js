// src/lib/triageUtils.js
export const copySummary = (result, vitals, redFlags, age) => {
    const summary = `HEALTHSYNC TRIAGE SUMMARY
============================
Patient Age: ${age || 'N/A'} years

Priority: ${result.priority}
Base Score: ${result.base_score}
Final Score: ${result.final_score}

Vitals:
• Heart Rate: ${vitals.heart_rate || 'N/A'} bpm
• Respiratory Rate: ${vitals.respiratory_rate || 'N/A'} bpm
• SpO2: ${vitals.oxygen_saturation || 'N/A'}%
• BP: ${vitals.systolic_bp || 'N/A'} mmHg
• Temperature: ${vitals.temperature || 'N/A'}°C
• Mobility: ${vitals.mobility || 'N/A'}

Clinical Discriminators:
${Object.keys(redFlags).filter(key => redFlags[key]).map(key => `• ${key.replace(/_/g, ' ')}`).join('\n') || '• None'}

${result.override_reason ? `Override Reason: ${result.override_reason}` : ''}

Triage Time: ${new Date().toLocaleString()}

-- HealthSync • Offline Triage Tool`;

    navigator.clipboard.writeText(summary).then(() => {
        alert("✅ Summary copied to clipboard!\nPaste it into LHIMS notes or doctor handover.");
    }).catch(() => {
        alert("Failed to copy. Please try again.");
    });
};