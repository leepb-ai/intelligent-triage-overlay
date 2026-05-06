from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    age = Column(Integer)
    gender = Column(String(10))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class VitalSigns(Base):
    __tablename__ = "vital_signs"

    id= Column(Integer, primary_key=True)
    patient_id= Column(Integer,ForeignKey("patients.id") )
    heart_rate= Column(Float)
    systolic_bp= Column(Float)
    respiratory_rate= Column(Float)
    oxygen_saturation= Column(Float)
    temperature= Column(Float)
    mobility= Column(String)
    recorded_at= Column(DateTime, default=datetime.datetime.utcnow)

class TriageRecord(Base):
    __tablename__= "triage_records"

    id= Column(Integer, primary_key= True) 
    patient_id= Column(Integer, ForeignKey("patients.id"))
    priority_score= Column(Float)
    color_code= Column(String)
    created_at= Column(DateTime, default=datetime.datetime.utcnow)