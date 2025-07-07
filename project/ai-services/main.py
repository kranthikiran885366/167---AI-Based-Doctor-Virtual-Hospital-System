from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

# Import service modules
from services.diagnosis_service import DiagnosisService
from services.report_analyzer import ReportAnalyzer
from services.prescription_generator import PrescriptionGenerator
from services.voice_processor import VoiceProcessor
from services.emergency_assistant import EmergencyAssistant
from models.medical_models import *

load_dotenv()

app = FastAPI(
    title="AI Doctor Services",
    description="AI-powered medical services for MVK Solutions Virtual Hospital",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
diagnosis_service = DiagnosisService()
report_analyzer = ReportAnalyzer()
prescription_generator = PrescriptionGenerator()
voice_processor = VoiceProcessor()
emergency_assistant = EmergencyAssistant()

@app.get("/")
async def root():
    return {
        "message": "AI Doctor Services - MVK Solutions",
        "version": "1.0.0",
        "status": "running",
        "services": [
            "diagnosis",
            "report-analysis", 
            "prescription-generation",
            "voice-processing",
            "emergency-assistance"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "diagnosis": "active",
            "report_analyzer": "active",
            "prescription_generator": "active",
            "voice_processor": "active",
            "emergency_assistant": "active"
        }
    }

# Diagnosis endpoints
@app.post("/diagnosis/predict")
async def predict_diagnosis(request: DiagnosisRequest):
    try:
        result = await diagnosis_service.predict_diagnosis(
            symptoms=request.symptoms,
            severity=request.severity,
            duration=request.duration,
            additional_info=request.additionalInfo,
            user_id=request.userId
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/symptoms/suggest")
async def suggest_symptoms(query: str):
    try:
        suggestions = await diagnosis_service.suggest_symptoms(query)
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/diagnosis/voice")
async def voice_diagnosis(request: VoiceDiagnosisRequest):
    try:
        # Process voice to text
        transcription = await voice_processor.speech_to_text(
            request.audioData, 
            request.language
        )
        
        # Extract symptoms from transcription
        symptoms = await diagnosis_service.extract_symptoms_from_text(transcription)
        
        # Get diagnosis
        diagnosis = await diagnosis_service.predict_diagnosis(
            symptoms=symptoms,
            user_id=request.userId
        )
        
        return {
            "transcription": transcription,
            "diagnosis": diagnosis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Report analysis endpoints
@app.post("/reports/analyze")
async def analyze_report(request: ReportAnalysisRequest):
    try:
        result = await report_analyzer.analyze_report(
            text=request.text,
            file_type=request.fileType,
            file_name=request.fileName,
            user_id=request.userId
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reports/upload")
async def upload_and_analyze_report(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):
    try:
        # Save uploaded file
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Analyze the file
        result = await report_analyzer.analyze_uploaded_file(file_path, user_id)
        
        # Clean up file
        os.remove(file_path)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Prescription endpoints
@app.post("/prescription/generate")
async def generate_prescription(request: PrescriptionRequest):
    try:
        result = await prescription_generator.generate_prescription(
            symptoms=request.symptoms,
            diagnosis=request.diagnosis,
            allergies=request.allergies,
            current_medications=request.currentMedications,
            medical_history=request.medicalHistory,
            age=request.age,
            weight=request.weight,
            user_id=request.userId
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/prescription/interactions")
async def check_drug_interactions(request: DrugInteractionRequest):
    try:
        interactions = await prescription_generator.check_drug_interactions(
            request.medications
        )
        return {"interactions": interactions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Emergency endpoints
@app.post("/emergency/analyze")
async def analyze_emergency(request: EmergencyRequest):
    try:
        result = await emergency_assistant.analyze_emergency(
            emergency_type=request.emergencyType,
            symptoms=request.symptoms,
            severity=request.severity,
            location=request.location
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/emergency/instructions/{emergency_type}")
async def get_emergency_instructions(emergency_type: str):
    try:
        instructions = await emergency_assistant.get_instructions(emergency_type)
        return {"instructions": instructions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Voice processing endpoints
@app.post("/voice/text-to-speech")
async def text_to_speech(request: TTSRequest):
    try:
        audio_data = await voice_processor.text_to_speech(
            request.text,
            request.language
        )
        return {"audioData": audio_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )