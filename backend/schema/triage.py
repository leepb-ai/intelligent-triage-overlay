from pydantic import BaseModel
from typing import Dict, Optional

class Vitals(BaseModel):
    heart_rate: Optional[int] = None
    respiratory_rate: Optional[int] = None
    oxygen_saturation: Optional[int] = None
    systolic_bp: Optional[int] = None
    temperature: Optional[float] = None
    mobility: Optional[str] = None

class RedFlags(BaseModel):
    active_seizure: bool = False
    airway_obstruction: bool = False
    uncontrolled_bleeding: bool = False
    chest_pain: bool = False
    shortness_of_breath: bool = False
    high_energy_trauma: bool = False
    severe_burns: bool = False
    
class TriageRequest(BaseModel):
    vitals: Vitals
    red_flags: RedFlags
    age: Optional[int] = None
    clinician_override: Optional[str] = None
    override_reason: Optional[str] = None

class TriageResponse(BaseModel):
    base_score: int
    final_score: float
    priority: str
    override_reason: Optional[str] = None
    clinician_override: bool = False
    discriminator_override: bool = False