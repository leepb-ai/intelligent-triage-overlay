from typing import Dict, Any, Tuple, List
from datetime import datetime

class TriageScore:
    """
    Data container for a completed triage assessment.
    Stores both the raw TEWS score and the final priority decision.
    """
    def __init__(self, base_score: int, final_score: float, priority: str, 
                 override_reason: str = None, clinician_override: bool = False):
        self.base_score = base_score          # Raw TEWS points before any multiplier
        self.final_score = round(final_score, 1)  # Score after discriminator multiplier
        self.priority = priority              # Final color: Red/Orange/Yellow/Green
        self.override_reason = override_reason    # Why it was overridden (if applicable)
        self.clinician_override = clinician_override  # True if a doctor manually changed it
        self.timestamp = datetime.now().isoformat()   # When the triage was done


def calculate_tews_score(vitals: Dict[str, Any]) -> int:
    """
    Step 1: Calculate the Triage Early Warning Score (TEWS).
    
    Each vital sign is scored 0-3 based on how far it deviates from normal.
    0 = normal, 1 = mild concern, 2 = significant concern, 3 = critical
    Maximum possible score = 17 (all vitals at worst)
    """
    score = 0

    # Heart Rate (normal: 51-100 bpm)
    # Bradycardia (<41) or severe tachycardia (>129) = critical (3pts)
    hr = vitals.get("heart_rate")
    if hr is not None:
        if 51 <= hr <= 100: score += 0
        elif 41 <= hr <= 50 or 101 <= hr <= 110: score += 1
        elif 111 <= hr <= 129: score += 2
        else: score += 3

    # Respiratory Rate (normal: 9-14 breaths/min)
    # Bradypnea (<9) or tachypnea (>29) = critical (3pts)
    rr = vitals.get("respiratory_rate")
    if rr is not None:
        if 9 <= rr <= 14: score += 0
        elif 15 <= rr <= 20: score += 1
        elif 21 <= rr <= 29: score += 2
        else: score += 3

    # Systolic Blood Pressure (normal: 101-199 mmHg)
    # Severe hypotension (<71) = critical (3pts)
    sbp = vitals.get("systolic_bp")
    if sbp is not None:
        if 101 <= sbp <= 199: score += 0
        elif 81 <= sbp <= 100: score += 1
        elif sbp >= 200 or 71 <= sbp <= 80: score += 2
        else: score += 3

    # Oxygen Saturation (normal: >=92%)
    # SpO2 <85% = critical hypoxia (3pts)
    # Note: SpO2 is a discriminator — only RED and normal ranges apply
    spo2 = vitals.get("oxygen_saturation")
    if spo2 is not None:
        if spo2 >= 92: score += 0
        elif 85 <= spo2 <= 91: score += 2
        else: score += 3

    # Temperature (normal: 36.0-38.4°C)
    # Hypothermia (<35°C) or hyperthermia (>39°C) = critical
    temp = vitals.get("temperature")
    if temp is not None:
        if 36.0 <= temp <= 38.4: score += 0
        elif (35.0 <= temp < 36.0) or (38.5 <= temp <= 39.0): score += 1
        else: score += 2

    # Mobility — categorical assessment of patient movement
    # Walking independently = normal (0pts)
    # Needs help walking = concern (1pt)
    # Stretcher/immobile = serious (2pts)
    mobility = str(vitals.get("mobility", "")).strip().lower()
    if "walk" in mobility and "help" not in mobility:
        score += 0
    elif "help" in mobility or "assisted" in mobility:
        score += 1
    else:
        score += 2

    return score


def get_clinical_discriminators(red_flags: Dict[str, bool], age: int = None) -> Tuple[str, str]:
    """
    Step 2: Check for clinical discriminators.
    
    Discriminators are high-risk conditions that OVERRIDE the TEWS score entirely.
    A patient can have normal vitals but still be Red/Orange due to a discriminator.
    This is SATS's safety net — ensuring catastrophic conditions are never missed.
    
    Returns: (priority_color, reason) or (None, None) if no discriminator triggered
    """
    is_pediatric = age is not None and age < 12  # Flag for future pediatric-specific logic

    # RED discriminators — immediate life threat, cannot wait
    if (red_flags.get("active_seizure") or       # Active neurological emergency
        red_flags.get("airway_obstruction") or    # ABC: Airway is first priority
        red_flags.get("severe_respiratory_distress") or  # ABC: Breathing compromise
        red_flags.get("uncontrolled_bleeding") or  # ABC: Circulation failure
        red_flags.get("hypoglycaemia")):           # Brain fuel crisis
        return "Red", "Critical Discriminator (Red)"

    # ORANGE discriminators — high risk, treat within 10 minutes
    if (red_flags.get("chest_pain") or           # Possible heart attack
        red_flags.get("shortness_of_breath") or   # Respiratory compromise
        red_flags.get("high_energy_trauma") or    # Internal injury risk (e.g. car crash)
        red_flags.get("severe_burns") or          # Systemic burn response
        red_flags.get("post_ictal")):             # Post-seizure state
        return "Orange", "High-Risk Discriminator (Orange)"

    return None, None  # No discriminator — proceed with TEWS score


def calculate_triage_score(
    vitals: Dict[str, Any], 
    red_flags: Dict[str, bool], 
    age: int = None,
    clinician_override: str = None,
    override_reason: str = None
) -> Dict:
    """
    Step 3: Main orchestrator — combines TEWS + Discriminators + Clinician Override.
    
    Priority order (highest to lowest):
    1. Clinician Override — senior doctor manually sets priority
    2. Discriminator Override — dangerous condition detected
    3. TEWS Score — standard vital signs scoring
    
    Returns a dict with score, priority color, and override details.
    """
    # Calculate raw TEWS score from vitals
    base_score = calculate_tews_score(vitals)
    
    # Check if any discriminator conditions are present
    discriminator_priority, disc_reason = get_clinical_discriminators(red_flags, age)

    # === PRIORITY 1: Clinician Override ===
    # A senior doctor's judgment always takes precedence over the algorithm
    if clinician_override and clinician_override in ["Red", "Orange", "Yellow", "Green"]:
        return {
            "base_score": base_score,
            "final_score": base_score,
            "priority": clinician_override,
            "override_reason": override_reason or "Senior Clinician Override",
            "clinician_override": True,
            "discriminator_override": False
        }

    # === PRIORITY 2: Discriminator Override ===
    # Critical conditions bypass TEWS — score is doubled to reflect urgency
    if discriminator_priority:
        return {
            "base_score": base_score,
            "final_score": base_score * 2.0,  # Multiplier signals severity to dashboard
            "priority": discriminator_priority,
            "override_reason": disc_reason,
            "clinician_override": False,
            "discriminator_override": True
        }

    # === PRIORITY 3: Standard TEWS-based scoring ===
    # No overrides — use raw score to determine color
    # Thresholds based on SATS documentation
    if base_score >= 7:
        priority = "Red"      # Emergency — immediate treatment
    elif base_score >= 4:
        priority = "Orange"   # Very Urgent — treat within 10 mins
    elif base_score >= 2:
        priority = "Yellow"   # Urgent — treat within 60 mins
    else:
        priority = "Green"    # Routine — treat within 4 hours

    return {
        "base_score": base_score,
        "final_score": base_score,
        "priority": priority,
        "override_reason": None,
        "clinician_override": False,
        "discriminator_override": False
    }


def run_tests():
    """
    Test suite — validates scoring engine against known clinical scenarios.
    Run this file directly to verify the engine is working correctly.
    """
    print("🧪 HealthSync Triage Scoring - Test Cases\n")
    
    tests = [
        {
            "name": "1. Normal Adult Patient",
            "vitals": {
                "heart_rate": 78,
                "respiratory_rate": 14,
                "systolic_bp": 125,
                "oxygen_saturation": 97,
                "temperature": 37.0,
                "mobility": "Walking"
            },
            "red_flags": {},
            "age": 34,
            "expected": "Green"
        },
        {
            "name": "2. High Heart Rate + Shortness of Breath",
            "vitals": {
                "heart_rate": 118,
                "respiratory_rate": 26,
                "systolic_bp": 110,
                "oxygen_saturation": 92,
                "temperature": 37.5,
                "mobility": "Walking with help"
            },
            "red_flags": {"shortness_of_breath": True},
            "age": 45,
            "expected": "Orange"
        },
        {
            "name": "3. Critical - Active Seizure",
            "vitals": {
                "heart_rate": 95,
                "respiratory_rate": 18,
                "systolic_bp": 130,
                "oxygen_saturation": 94,
                "temperature": 36.8,
                "mobility": "Stretcher"
            },
            "red_flags": {"active_seizure": True},
            "age": 28,
            "expected": "Red"
        },
        {
            "name": "4. Paediatric Case - High RR + Low SpO2",
            "vitals": {
                "heart_rate": 140,
                "respiratory_rate": 32,
                "systolic_bp": 95,
                "oxygen_saturation": 88,
                "temperature": 38.2,
                "mobility": "Stretcher"
            },
            "red_flags": {},
            "age": 3,
            "expected": "Red"
        },
        {
            "name": "5. Clinician Override Test",
            "vitals": {
                "heart_rate": 82,
                "respiratory_rate": 16,
                "systolic_bp": 118,
                "oxygen_saturation": 96,
                "temperature": 37.1,
                "mobility": "Walking"
            },
            "red_flags": {},
            "age": 52,
            "clinician_override": "Red",
            "override_reason": "Suspected internal bleeding",
            "expected": "Red"
        },
        {
            "name": "6. Moderate Trauma",
            "vitals": {
                "heart_rate": 105,
                "respiratory_rate": 22,
                "systolic_bp": 135,
                "oxygen_saturation": 95,
                "temperature": 37.0,
                "mobility": "Walking with help"
            },
            "red_flags": {"high_energy_trauma": True},
            "age": 31,
            "expected": "Orange"
        }
    ]

    for test in tests:
        result = calculate_triage_score(
            vitals=test["vitals"],
            red_flags=test.get("red_flags", {}),
            age=test.get("age"),
            clinician_override=test.get("clinician_override"),
            override_reason=test.get("override_reason")
        )
        
        status = "✅ PASS" if result["priority"] == test["expected"] else "❌ FAIL"
        print(f"{status} | {test['name']}")
        print(f"   Priority: {result['priority']} | Base: {result['base_score']} | Final: {result['final_score']}")
        if result.get("override_reason"):
            print(f"   Override: {result['override_reason']}")
        print("-" * 60)


if __name__ == "__main__":
    run_tests()