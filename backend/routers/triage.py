# routers/triage.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.triage import TriageRequest, TriageResponse
from utils.scoring import calculate_triage_score
from database import get_db

router = APIRouter()

@router.post("/triage/calculate", response_model=TriageResponse)
async def calculate_triage(
    request: TriageRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate triage priority using SATS-inspired logic.
    """
    result = calculate_triage_score(
        vitals=request.vitals.dict(),
        red_flags=request.red_flags.dict(),
        age=request.age,
        clinician_override=request.clinician_override,
        override_reason=request.override_reason
    )
    
    return result