from typing import Dict, Any, Tuple, List
from datetime import datetime

class TriageScore:
    def __init__(self, base_score: int, final_score: float, priority: str, 
                 override_reason: str = None, clinician_override: bool = False):
        self.base_score = base_score
        self.final_score = round(final_score, 1)
        self.priority = priority
        self.override_reason = override_reason
        self.clinician_override = clinician_override
        self.timestamp = datetime.now().isoformat()


def calculate_tews_score(vitals: Dict[str, Any]) -> int:
    """Calculate Triage Early Warning Score (TEWS)"""
    score = 0

    # Heart Rate
    hr = vitals.get("heart_rate")
    if hr is not None:
        if 51 <= hr <= 100: score += 0
        elif 41 <= hr <= 50 or 101 <= hr <= 110: score += 1
        elif 111 <= hr <= 129: score += 2
        else: score += 3

    # Respiratory Rate
    rr = vitals.get("respiratory_rate")
    if rr is not None:
        if 9 <= rr <= 14: score += 0
        elif 15 <= rr <= 20: score += 1
        elif 21 <= rr <= 29: score += 2
        else: score += 3

    # Systolic BP
    sbp = vitals.get("systolic_bp")
    if sbp is not None:
        if 101 <= sbp <= 199: score += 0
        elif 81 <= sbp <= 100: score += 1
        elif sbp >= 200 or 71 <= sbp <= 80: score += 2
        else: score += 3

    # Oxygen Saturation
    spo2 = vitals.get("oxygen_saturation")
    if spo2 is not None:
        if spo2 >= 92: score += 0
        elif 85 <= spo2 <= 91: score += 2
        else: score += 3

    # Temperature
    temp = vitals.get("temperature")
    if temp is not None:
        if 36.0 <= temp <= 38.4: score += 0
        elif (35.0 <= temp < 36.0) or (38.5 <= temp <= 39.0): score += 1
        else: score += 2

    # Mobility
    mobility = str(vitals.get("mobility", "")).strip().lower()
    if "walk" in mobility and "help" not in mobility:
        score += 0
    elif "help" in mobility or "assisted" in mobility:
        score += 1
    else:
        score += 2

    return score


def get_clinical_discriminators(red_flags: Dict[str, bool], age: int = None) -> Tuple[str, str]:
    """Return (priority, reason) if any discriminator is triggered"""
    is_pediatric = age is not None and age < 12

    # RED - Emergency
    if (red_flags.get("active_seizure") or 
        red_flags.get("airway_obstruction") or 
        red_flags.get("severe_respiratory_distress") or 
        red_flags.get("uncontrolled_bleeding") or 
        red_flags.get("hypoglycaemia")):
        return "Red", "Critical Discriminator (Red)"

    # ORANGE - Very Urgent
    if (red_flags.get("chest_pain") or 
        red_flags.get("shortness_of_breath") or 
        red_flags.get("high_energy_trauma") or 
        red_flags.get("severe_burns") or 
        red_flags.get("post_ictal")):
        return "Orange", "High-Risk Discriminator (Orange)"

    return None, None


def calculate_triage_score(
    vitals: Dict[str, Any], 
    red_flags: Dict[str, bool], 
    age: int = None,
    clinician_override: str = None,           # ← New: Accepts real input
    override_reason: str = None               # Optional note from clinician
) -> Dict:
    
    base_score = calculate_tews_score(vitals)
    discriminator_priority, disc_reason = get_clinical_discriminators(red_flags, age)

    # === CLINICIAN OVERRIDE (Highest Priority) ===
    if clinician_override and clinician_override in ["Red", "Orange", "Yellow", "Green"]:
        return {
            "base_score": base_score,
            "final_score": base_score,
            "priority": clinician_override,
            "override_reason": override_reason or "Senior Clinician Override",
            "clinician_override": True,
            "discriminator_override": False
        }

    # === DISCRIMINATOR OVERRIDE ===
    if discriminator_priority:
        return {
            "base_score": base_score,
            "final_score": base_score * 2.0,
            "priority": discriminator_priority,
            "override_reason": disc_reason,
            "clinician_override": False,
            "discriminator_override": True
        }

    # === Normal TEWS-based Priority ===
    if base_score >= 7:
        priority = "Red"
    elif base_score >= 4:
        priority = "Orange"
    elif base_score >= 2:
        priority = "Yellow"
    else:
        priority = "Green"

    return {
        "base_score": base_score,
        "final_score": base_score,
        "priority": priority,
        "override_reason": None,
        "clinician_override": False,
        "discriminator_override": False
    }


def run_tests():
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


# Run the tests
if __name__ == "__main__":
    run_tests()