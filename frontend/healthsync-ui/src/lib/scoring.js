// src/lib/scoring.js

export function calculate_triage_score(vitals = {}, redFlags = {}, age = null, clinicianOverride = null, overrideReason = "") {
    
    let baseScore = 0;

    // Heart Rate
    const hr = vitals.heart_rate;
    if (hr !== undefined) {
        if (51 <= hr && hr <= 100) baseScore += 0;
        else if ((41 <= hr && hr <= 50) || (101 <= hr && hr <= 110)) baseScore += 1;
        else if (111 <= hr && hr <= 129) baseScore += 2;
        else baseScore += 3;
    }

    // Respiratory Rate
    const rr = vitals.respiratory_rate;
    if (rr !== undefined) {
        if (9 <= rr && rr <= 14) baseScore += 0;
        else if (15 <= rr && rr <= 20) baseScore += 1;
        else if (21 <= rr && rr <= 29) baseScore += 2;
        else baseScore += 3;
    }

    // Mobility
    const mobility = vitals.mobility ? vitals.mobility.toLowerCase() : "";
    if (mobility.includes("help") || mobility.includes("assisted")) baseScore += 1;
    else if (mobility.includes("stretcher") || mobility.includes("immobile")) baseScore += 2;

    // Temperature (bonus)
    const temp = vitals.temperature;
    if (temp !== undefined) {
        if (temp < 35 || temp > 39) baseScore += 2;
        else if ((temp >= 38.5 && temp <= 39) || (temp >= 35 && temp < 36)) baseScore += 1;
    }

    let priority = "Green";
    if (baseScore >= 7) priority = "Red";
    else if (baseScore >= 4) priority = "Orange";
    else if (baseScore >= 2) priority = "Yellow";

    // Clinician Override
    if (clinicianOverride && ["Red", "Orange", "Yellow", "Green"].includes(clinicianOverride)) {
        return {
            base_score: baseScore,
            final_score: baseScore,
            priority: clinicianOverride,
            override_reason: overrideReason || "Clinician Override",
            clinician_override: true
        };
    }

    return {
        base_score: baseScore,
        final_score: baseScore,
        priority: priority,
        override_reason: null,
        clinician_override: false
    };
}