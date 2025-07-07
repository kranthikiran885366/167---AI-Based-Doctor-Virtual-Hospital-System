from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from enum import Enum

class SeverityLevel(str, Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    CRITICAL = "critical"

class DiagnosisRequest(BaseModel):
    symptoms: List[str]
    severity: Optional[SeverityLevel] = SeverityLevel.MODERATE
    duration: Optional[str] = "recent"
    additionalInfo: Optional[str] = ""
    userId: str

class VoiceDiagnosisRequest(BaseModel):
    audioData: str  # Base64 encoded audio
    language: Optional[str] = "en"
    userId: str

class ReportAnalysisRequest(BaseModel):
    text: str
    fileType: str
    fileName: str
    userId: str

class PrescriptionRequest(BaseModel):
    symptoms: List[str]
    diagnosis: Optional[str] = ""
    allergies: Optional[List[str]] = []
    currentMedications: Optional[List[str]] = []
    medicalHistory: Optional[str] = ""
    age: Optional[int] = 30
    weight: Optional[float] = 70.0
    userId: str

class DrugInteractionRequest(BaseModel):
    medications: List[str]

class EmergencyRequest(BaseModel):
    emergencyType: str
    symptoms: Optional[List[str]] = []
    severity: Optional[SeverityLevel] = SeverityLevel.CRITICAL
    location: Optional[Dict[str, float]] = None

class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "en"

class DiagnosisResponse(BaseModel):
    condition: str
    confidence: float
    description: str
    severity: SeverityLevel
    recommendations: List[str]
    riskFactors: List[str]
    followUpRequired: bool
    model: str

class LabResult(BaseModel):
    parameter: str
    value: str
    unit: str
    normalRange: str
    status: str
    concern: Optional[str] = None

class ReportAnalysisResponse(BaseModel):
    type: str
    findings: List[LabResult]
    diagnosis: str
    recommendations: List[str]
    urgency: str
    confidence: float
    model: str

class Medication(BaseModel):
    name: str
    genericName: Optional[str] = ""
    dosage: str
    frequency: str
    duration: str
    instructions: str
    type: str
    beforeFood: Optional[bool] = False
    sideEffects: Optional[List[str]] = []
    contraindications: Optional[List[str]] = []

class PrescriptionResponse(BaseModel):
    diagnosis: str
    medications: List[Medication]
    instructions: List[str]
    followUp: Dict[str, Any]
    warnings: List[str]
    model: str

class EmergencyResponse(BaseModel):
    urgencyLevel: str
    immediateActions: List[str]
    instructions: List[str]
    emergencyContacts: List[str]
    estimatedResponseTime: Optional[str] = None