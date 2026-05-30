// src/lib/scoring.js
// SATS-compliant triage scoring
// Based on: Rosedale et al. (2011), Twomey et al. (2012)
//
// TEWS parameters (7 official):
//   HR, RR, SBP, Temperature, AVPU, Mobility, Trauma
//
// SpO2 is NOT a TEWS parameter — it is handled as a discriminator.
// A SpO2 < 92% triggers an Orange discriminator (acute respiratory compromise),
// consistent with the SATS discriminator list.


// ─── STEP 1: TEWS SCORE ──────────────────────────────────────────────────────

function calculateTEWS(vitals = {}) {
  let score = 0;

  // Heart Rate
  // ≤40 = 2, 41–50 = 1, 51–100 = 0, 101–110 = 1, 111–129 = 2, ≥130 = 3
  const hr = vitals.heart_rate;
  if (hr !== undefined && hr !== null) {
    if (hr <= 40) score += 2;
    else if (hr <= 50) score += 1;
    else if (hr <= 100) score += 0;
    else if (hr <= 110) score += 1;
    else if (hr <= 129) score += 2;
    else score += 3;
  }

  // Respiratory Rate
  // <9 = 2, 9–14 = 0, 15–20 = 0, 21–29 = 2, ≥30 = 3
  // Note: 9–20 both score 0; only extremes score points
  const rr = vitals.respiratory_rate;
  if (rr !== undefined && rr !== null) {
    if (rr < 9) score += 2;
    else if (rr <= 20) score += 0;
    else if (rr <= 29) score += 2;
    else score += 3;
  }

  // Systolic BP
  // ≤70 = 3, 71–80 = 2, 81–100 = 1, 101–199 = 0, ≥200 = 2
  const sbp = vitals.systolic_bp;
  if (sbp !== undefined && sbp !== null) {
    if (sbp <= 70) score += 3;
    else if (sbp <= 80) score += 2;
    else if (sbp <= 100) score += 1;
    else if (sbp <= 199) score += 0;
    else score += 2;
  }

  // Temperature
  // Cold/<35 = 2, 35–38.4 = 0, Hot/≥38.5 = 2
  // Note: official table uses binary hot/cold, not gradient
  const temp = vitals.temperature;
  if (temp !== undefined && temp !== null) {
    if (temp < 35) score += 2;
    else if (temp <= 38.4) score += 0;
    else score += 2;
  }

  // AVPU (Level of Consciousness)
  // Alert = 0, Voice = 1, Pain = 2, Unresponsive = 3
  // Confused is treated as equivalent to Voice (scores 1) per SATS table
  const avpu = String(vitals.avpu || "").trim().toUpperCase();
  if (avpu === "A" || avpu === "ALERT") score += 0;
  else if (avpu === "C" || avpu === "CONFUSED") score += 1;
  else if (avpu === "V" || avpu === "VOICE") score += 1;
  else if (avpu === "P" || avpu === "PAIN") score += 2;
  else if (avpu === "U" || avpu === "UNRESPONSIVE") score += 3;
  // If AVPU not recorded, default 0 — but flag as incomplete

  // Mobility
  // Walking = 0, Walking with help = 1, Stretcher/Immobile = 2
  const mobility = String(vitals.mobility || "").toLowerCase();
  if (mobility.includes("stretcher") || mobility.includes("immobile")) score += 2;
  else if (mobility.includes("help") || mobility.includes("assisted")) score += 1;
  else if (mobility.includes("walk")) score += 0;
  // If not recorded, default 0

  // Trauma
  // No = 0, Yes = 1
  if (vitals.trauma === true || vitals.trauma === "yes") score += 1;

  return score;
}


// ─── STEP 2: TEWS SCORE → COLOUR ─────────────────────────────────────────────

function tewsToColour(score) {
  if (score >= 7) return "Red";
  if (score >= 5) return "Orange";
  if (score >= 3) return "Yellow";
  return "Green";
}


// ─── STEP 3: DISCRIMINATOR CHECK ─────────────────────────────────────────────
//
// Discriminators override the TEWS colour upward only — never downward.
// Organised by upgrade target per the official SATS discriminator list.

function checkDiscriminators(redFlags = {}, vitals = {}) {

  // RED discriminators — immediate, cannot wait
  if (
    redFlags.active_seizure ||
    redFlags.airway_obstruction ||
    redFlags.cardiac_arrest ||
    redFlags.facial_inhalation_burn ||
    redFlags.hypoglycaemia         // glucose < 3 mmol/L
  ) {
    return { colour: "Red", reason: "Critical discriminator — immediate treatment required" };
  }

  // ORANGE discriminators — very urgent, treat within 10 minutes
  if (
    redFlags.shortness_of_breath ||
    redFlags.coughing_blood ||
    redFlags.chest_pain ||
    redFlags.uncontrolled_bleeding ||
    redFlags.focal_neurology ||
    redFlags.reduced_consciousness ||
    redFlags.psychosis_aggression ||
    redFlags.threatened_limb ||
    redFlags.high_energy_trauma ||
    redFlags.burn_over_20_percent ||
    redFlags.burn_electrical ||
    redFlags.burn_circumferential ||
    redFlags.burn_chemical ||
    redFlags.burn_face_inhalation ||
    redFlags.poisoning_overdose ||
    redFlags.vomiting_fresh_blood ||
    redFlags.pregnancy_abdominal_trauma ||
    redFlags.diabetic_glucose_11_ketonuria ||
    redFlags.severe_pain ||
    redFlags.seizure_post_ictal ||
    redFlags.dislocation_other_joint ||
    redFlags.fracture_compound
  ) {
    return { colour: "Orange", reason: "High-risk discriminator — treat within 10 minutes" };
  }

  // SpO2 < 92% — not a TEWS parameter, handled here as respiratory discriminator
  const spo2 = vitals.oxygen_saturation;
  if (spo2 !== undefined && spo2 !== null && spo2 < 92) {
    return { colour: "Orange", reason: "SpO₂ < 92% — acute respiratory compromise" };
  }

  // YELLOW discriminators — urgent, treat within 60 minutes
  if (
    redFlags.controlled_bleeding ||
    redFlags.fracture_closed ||
    redFlags.dislocation_finger_toe ||
    redFlags.burn_other ||
    redFlags.persistent_vomiting ||
    redFlags.abdominal_pain ||
    redFlags.pregnancy_trauma ||
    redFlags.pregnancy_pv_bleed ||
    redFlags.diabetic_glucose_17_no_ketonuria ||
    redFlags.moderate_pain
  ) {
    return { colour: "Yellow", reason: "Urgent discriminator — treat within 60 minutes" };
  }

  return { colour: null, reason: null };
}


// ─── COLOUR RANK HELPER ───────────────────────────────────────────────────────
// Used to ensure discriminators never downgrade a TEWS result

const COLOUR_RANK = { "Green": 0, "Yellow": 1, "Orange": 2, "Red": 3 };

function higherColour(a, b) {
  return COLOUR_RANK[a] >= COLOUR_RANK[b] ? a : b;
}


// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function calculate_triage_score(
  vitals = {},
  redFlags = {},
  age = null,
  clinicianOverride = null,
  overrideReason = ""
) {
  const baseScore = calculateTEWS(vitals);
  const tewsColour = tewsToColour(baseScore);
  const { colour: discColour, reason: discReason } = checkDiscriminators(redFlags, vitals);

  // Discriminator can only upgrade, never downgrade
  const computedColour = discColour
    ? higherColour(tewsColour, discColour)
    : tewsColour;

  const isDiscriminatorOverride = discColour !== null && COLOUR_RANK[discColour] > COLOUR_RANK[tewsColour];

  // Clinician override is always final
  if (clinicianOverride && ["Red", "Orange", "Yellow", "Green"].includes(clinicianOverride)) {
    return {
      base_score: baseScore,
      final_score: baseScore,
      priority: clinicianOverride,
      override_reason: overrideReason || "Senior Clinician Override",
      clinician_override: true,
      discriminator_override: false,
      tews_colour: tewsColour,
      avpu_recorded: !!vitals.avpu,
    };
  }

  return {
    base_score: baseScore,
    final_score: baseScore,
    priority: computedColour,
    override_reason: isDiscriminatorOverride ? discReason : null,
    clinician_override: false,
    discriminator_override: isDiscriminatorOverride,
    tews_colour: tewsColour,
    avpu_recorded: !!vitals.avpu,
  };
}