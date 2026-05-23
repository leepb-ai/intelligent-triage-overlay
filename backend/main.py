from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import triage

app = FastAPI(
    title="HealthSync Triage API",
    description="Offline-first triage intelligence layer for Ghanaian hospitals",
    version="1.0.0"
)

# CORS - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(triage.router)

@app.get("/")
async def root():
    return {
        "message": "HealthSync Backend is running",
        "status": "healthy",
        "version": "1.0.0"
    }