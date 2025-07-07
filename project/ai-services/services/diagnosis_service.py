import numpy as np
import pandas as pd
from typing import List, Dict, Any
import json
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from models.medical_models import DiagnosisResponse, SeverityLevel

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class DiagnosisService:
    def __init__(self):
        self.symptoms_db = self._load_symptoms_database()
        self.diseases_db = self._load_diseases_database()
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        self._train_model()
    
    def _load_symptoms_database(self) -> Dict[str, List[str]]:
        """Load symptoms database with disease mappings"""
        return {
            "fever": ["viral_fever", "dengue", "malaria", "typhoid", "flu", "covid19"],
            "headache": ["migraine", "tension_headache", "cluster_headache", "sinusitis", "hypertension"],
            "cough": ["common_cold", "bronchitis", "pneumonia", "asthma", "covid19", "tuberculosis"],
            "sore_throat": ["pharyngitis", "tonsillitis", "common_cold", "flu", "strep_throat"],
            "body_ache": ["viral_fever", "flu", "dengue", "chikungunya", "fibromyalgia"],
            "nausea": ["gastroenteritis", "food_poisoning", "migraine", "pregnancy", "motion_sickness"],
            "vomiting": ["gastroenteritis", "food_poisoning", "migraine", "appendicitis"],
            "diarrhea": ["gastroenteritis", "food_poisoning", "ibs", "inflammatory_bowel_disease"],
            "fatigue": ["anemia", "thyroid_disorder", "depression", "chronic_fatigue_syndrome"],
            "dizziness": ["vertigo", "low_blood_pressure", "anemia", "inner_ear_infection"],
            "chest_pain": ["heart_attack", "angina", "pneumonia", "acid_reflux", "anxiety"],
            "shortness_of_breath": ["asthma", "pneumonia", "heart_failure", "anxiety", "covid19"],
            "abdominal_pain": ["appendicitis", "gastritis", "kidney_stones", "gallstones", "ibs"],
            "back_pain": ["muscle_strain", "herniated_disc", "kidney_stones", "arthritis"],
            "joint_pain": ["arthritis", "rheumatoid_arthritis", "gout", "lupus", "fibromyalgia"],
            "skin_rash": ["eczema", "psoriasis", "allergic_reaction", "chickenpox", "measles"],
            "weight_loss": ["diabetes", "hyperthyroidism", "cancer", "depression", "malabsorption"],
            "weight_gain": ["hypothyroidism", "diabetes", "depression", "hormonal_imbalance"],
            "insomnia": ["anxiety", "depression", "sleep_apnea", "hyperthyroidism"],
            "excessive_thirst": ["diabetes", "dehydration", "kidney_disease", "hyperthyroidism"]
        }
    
    def _load_diseases_database(self) -> Dict[str, Dict[str, Any]]:
        """Load diseases database with detailed information"""
        return {
            "viral_fever": {
                "name": "Viral Fever",
                "symptoms": ["fever", "headache", "body_ache", "fatigue", "sore_throat"],
                "severity": "mild",
                "description": "A common viral infection causing fever and general malaise",
                "recommendations": [
                    "Rest and stay hydrated",
                    "Take paracetamol for fever",
                    "Avoid aspirin in children",
                    "Consult doctor if fever persists beyond 3 days"
                ],
                "risk_factors": ["Weak immunity", "Seasonal changes", "Close contact with infected person"]
            },
            "common_cold": {
                "name": "Common Cold",
                "symptoms": ["cough", "sore_throat", "runny_nose", "sneezing", "mild_fever"],
                "severity": "mild",
                "description": "Viral infection of the upper respiratory tract",
                "recommendations": [
                    "Rest and drink plenty of fluids",
                    "Use saline nasal drops",
                    "Gargle with warm salt water",
                    "Avoid antibiotics unless bacterial infection suspected"
                ],
                "risk_factors": ["Cold weather", "Stress", "Poor hygiene", "Crowded places"]
            },
            "migraine": {
                "name": "Migraine",
                "symptoms": ["severe_headache", "nausea", "vomiting", "light_sensitivity"],
                "severity": "moderate",
                "description": "Recurring headache disorder with moderate to severe pain",
                "recommendations": [
                    "Rest in a dark, quiet room",
                    "Apply cold compress to head",
                    "Take prescribed migraine medication",
                    "Identify and avoid triggers"
                ],
                "risk_factors": ["Stress", "Hormonal changes", "Certain foods", "Sleep disturbances"]
            },
            "gastroenteritis": {
                "name": "Gastroenteritis",
                "symptoms": ["nausea", "vomiting", "diarrhea", "abdominal_pain", "fever"],
                "severity": "moderate",
                "description": "Inflammation of stomach and intestines",
                "recommendations": [
                    "Stay hydrated with ORS",
                    "Eat bland foods (BRAT diet)",
                    "Avoid dairy and fatty foods",
                    "Seek medical help if severe dehydration"
                ],
                "risk_factors": ["Contaminated food/water", "Poor hygiene", "Viral/bacterial infection"]
            },
            "hypertension": {
                "name": "High Blood Pressure",
                "symptoms": ["headache", "dizziness", "chest_pain", "shortness_of_breath"],
                "severity": "moderate",
                "description": "Persistently elevated blood pressure",
                "recommendations": [
                    "Regular blood pressure monitoring",
                    "Low sodium diet",
                    "Regular exercise",
                    "Take prescribed medications",
                    "Manage stress"
                ],
                "risk_factors": ["Age", "Family history", "Obesity", "Sedentary lifestyle", "High salt intake"]
            },
            "diabetes": {
                "name": "Diabetes Mellitus",
                "symptoms": ["excessive_thirst", "frequent_urination", "weight_loss", "fatigue"],
                "severity": "moderate",
                "description": "Metabolic disorder characterized by high blood sugar",
                "recommendations": [
                    "Regular blood sugar monitoring",
                    "Diabetic diet plan",
                    "Regular exercise",
                    "Take prescribed medications",
                    "Regular medical check-ups"
                ],
                "risk_factors": ["Family history", "Obesity", "Sedentary lifestyle", "Age over 45"]
            },
            "heart_attack": {
                "name": "Myocardial Infarction",
                "symptoms": ["severe_chest_pain", "shortness_of_breath", "nausea", "sweating"],
                "severity": "critical",
                "description": "Blockage of blood flow to heart muscle",
                "recommendations": [
                    "Call emergency services immediately",
                    "Chew aspirin if not allergic",
                    "Stay calm and rest",
                    "Do not drive yourself to hospital"
                ],
                "risk_factors": ["Age", "Smoking", "High cholesterol", "Diabetes", "Family history"]
            }
        }
    
    def _train_model(self):
        """Train the diagnosis model using symptoms and diseases data"""
        # Create training data
        symptoms_list = []
        diseases_list = []
        
        for disease, info in self.diseases_db.items():
            symptom_text = " ".join(info["symptoms"])
            symptoms_list.append(symptom_text)
            diseases_list.append(disease)
        
        # Fit vectorizer
        self.symptom_vectors = self.vectorizer.fit_transform(symptoms_list)
        self.disease_labels = diseases_list
    
    async def predict_diagnosis(
        self, 
        symptoms: List[str], 
        severity: str = "moderate",
        duration: str = "recent",
        additional_info: str = "",
        user_id: str = ""
    ) -> DiagnosisResponse:
        """Predict diagnosis based on symptoms"""
        
        # Preprocess symptoms
        symptom_text = " ".join(symptoms).lower()
        symptom_text = re.sub(r'[^a-zA-Z\s]', '', symptom_text)
        
        # Vectorize input symptoms
        input_vector = self.vectorizer.transform([symptom_text])
        
        # Calculate similarity with known diseases
        similarities = cosine_similarity(input_vector, self.symptom_vectors)[0]
        
        # Get top matches
        top_indices = np.argsort(similarities)[::-1][:3]
        top_diseases = [(self.disease_labels[i], similarities[i]) for i in top_indices]
        
        # Select best match
        best_disease, confidence = top_diseases[0]
        disease_info = self.diseases_db.get(best_disease, {})
        
        # Adjust confidence based on symptom match
        matched_symptoms = set(symptoms) & set(disease_info.get("symptoms", []))
        symptom_match_ratio = len(matched_symptoms) / len(symptoms) if symptoms else 0
        adjusted_confidence = (confidence * 0.7 + symptom_match_ratio * 0.3) * 100
        
        # Determine severity
        predicted_severity = self._determine_severity(symptoms, severity, disease_info)
        
        return DiagnosisResponse(
            condition=disease_info.get("name", best_disease.replace("_", " ").title()),
            confidence=min(adjusted_confidence, 95.0),  # Cap at 95%
            description=disease_info.get("description", "Medical condition requiring attention"),
            severity=predicted_severity,
            recommendations=disease_info.get("recommendations", [
                "Consult a healthcare professional",
                "Monitor symptoms closely",
                "Rest and stay hydrated"
            ]),
            riskFactors=disease_info.get("risk_factors", []),
            followUpRequired=predicted_severity in ["moderate", "severe", "critical"],
            model="diagnosis-ai-v1.0"
        )
    
    def _determine_severity(self, symptoms: List[str], user_severity: str, disease_info: Dict) -> SeverityLevel:
        """Determine severity based on symptoms and disease info"""
        critical_symptoms = ["chest_pain", "shortness_of_breath", "severe_headache", "high_fever"]
        severe_symptoms = ["persistent_vomiting", "severe_pain", "difficulty_breathing"]
        
        # Check for critical symptoms
        if any(symptom in critical_symptoms for symptom in symptoms):
            return SeverityLevel.CRITICAL
        
        # Check for severe symptoms
        if any(symptom in severe_symptoms for symptom in symptoms):
            return SeverityLevel.SEVERE
        
        # Use disease default severity
        disease_severity = disease_info.get("severity", "mild")
        
        # Map severity levels
        severity_map = {
            "mild": SeverityLevel.MILD,
            "moderate": SeverityLevel.MODERATE,
            "severe": SeverityLevel.SEVERE,
            "critical": SeverityLevel.CRITICAL
        }
        
        return severity_map.get(disease_severity, SeverityLevel.MODERATE)
    
    async def suggest_symptoms(self, query: str) -> List[str]:
        """Suggest symptoms based on user query"""
        query = query.lower()
        suggestions = []
        
        for symptom in self.symptoms_db.keys():
            if query in symptom or symptom in query:
                suggestions.append(symptom.replace("_", " ").title())
        
        # Add common symptom variations
        symptom_variations = {
            "pain": ["headache", "chest pain", "abdominal pain", "back pain", "joint pain"],
            "fever": ["high fever", "low grade fever", "fever with chills"],
            "cough": ["dry cough", "wet cough", "persistent cough"],
            "tired": ["fatigue", "weakness", "exhaustion"]
        }
        
        for key, variations in symptom_variations.items():
            if key in query:
                suggestions.extend(variations)
        
        return list(set(suggestions))[:10]  # Return top 10 unique suggestions
    
    async def extract_symptoms_from_text(self, text: str) -> List[str]:
        """Extract symptoms from natural language text"""
        text = text.lower()
        extracted_symptoms = []
        
        # Common symptom patterns
        symptom_patterns = {
            r'(head|headache)': 'headache',
            r'(fever|temperature|hot)': 'fever',
            r'(cough|coughing)': 'cough',
            r'(throat|sore throat)': 'sore_throat',
            r'(nausea|nauseous|sick)': 'nausea',
            r'(vomit|vomiting|throw up)': 'vomiting',
            r'(diarrhea|loose motion)': 'diarrhea',
            r'(tired|fatigue|exhausted)': 'fatigue',
            r'(dizzy|dizziness)': 'dizziness',
            r'(chest pain|chest)': 'chest_pain',
            r'(breath|breathing|shortness)': 'shortness_of_breath',
            r'(stomach|abdominal|belly)': 'abdominal_pain',
            r'(back pain|backache)': 'back_pain',
            r'(joint|joints)': 'joint_pain',
            r'(rash|skin)': 'skin_rash'
        }
        
        for pattern, symptom in symptom_patterns.items():
            if re.search(pattern, text):
                extracted_symptoms.append(symptom)
        
        return list(set(extracted_symptoms))