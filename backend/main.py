from fastapi import FastAPI
from scoring import calculate_triage_score
from database import init_db

app = FastAPI()

@app.on_event("startup")
def startup():
    init_db()

@app.post("/triage/calculate")
def calculate_triage(data: dict):
    result = calculate_triage_score(
        vitals=data["vitals"],
        red_flags=data["red_flags"],
        age=data.get("age"),
        clinician_priority=data.get("clinician_priority")
    )
    return result