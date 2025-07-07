import json
import re
from typing import List, Dict, Any, Optional
from models.medical_models import PrescriptionResponse, Medication

class PrescriptionGenerator:
    def __init__(self):
        self.medication_db = self._load_medication_database()
        self.drug_interactions = self._load_drug_interactions()
        self.dosage_rules = self._load_dosage_rules()
        
    def _load_medication_database(self) -> Dict[str, Dict[str, Any]]:
        """Load medication database with details"""
        return {
            "paracetamol": {
                "generic_name": "Acetaminophen",
                "brand_names": ["Crocin", "Dolo", "Panadol"],
                "type": "tablet",
                "indications": ["fever", "headache", "pain", "body_ache"],
                "contraindications": ["liver_disease", "alcohol_dependency"],
                "side_effects": ["nausea", "skin_rash", "liver_damage_overdose"],
                "dosage": {
                    "adult": {"min": 500, "max": 1000, "unit": "mg"},
                    "child": {"min": 10, "max": 15, "unit": "mg/kg"}
                },
                "frequency": "6-8 hours",
                "max_daily": 4000,
                "before_food": False
            },
            "ibuprofen": {
                "generic_name": "Ibuprofen",
                "brand_names": ["Brufen", "Advil", "Combiflam"],
                "type": "tablet",
                "indications": ["pain", "inflammation", "fever", "headache", "joint_pain"],
                "contraindications": ["peptic_ulcer", "kidney_disease", "heart_disease"],
                "side_effects": ["stomach_upset", "nausea", "dizziness"],
                "dosage": {
                    "adult": {"min": 200, "max": 400, "unit": "mg"},
                    "child": {"min": 5, "max": 10, "unit": "mg/kg"}
                },
                "frequency": "6-8 hours",
                "max_daily": 1200,
                "before_food": False
            },
            "amoxicillin": {
                "generic_name": "Amoxicillin",
                "brand_names": ["Amoxil", "Novamox", "Clavam"],
                "type": "capsule",
                "indications": ["bacterial_infection", "respiratory_infection", "uti"],
                "contraindications": ["penicillin_allergy"],
                "side_effects": ["diarrhea", "nausea", "skin_rash", "allergic_reaction"],
                "dosage": {
                    "adult": {"min": 250, "max": 500, "unit": "mg"},
                    "child": {"min": 20, "max": 40, "unit": "mg/kg"}
                },
                "frequency": "8 hours",
                "max_daily": 1500,
                "before_food": False
            },
            "azithromycin": {
                "generic_name": "Azithromycin",
                "brand_names": ["Azee", "Zithromax", "Azithral"],
                "type": "tablet",
                "indications": ["respiratory_infection", "skin_infection", "uti"],
                "contraindications": ["liver_disease", "heart_rhythm_disorders"],
                "side_effects": ["nausea", "diarrhea", "abdominal_pain"],
                "dosage": {
                    "adult": {"min": 250, "max": 500, "unit": "mg"},
                    "child": {"min": 10, "max": 12, "unit": "mg/kg"}
                },
                "frequency": "24 hours",
                "max_daily": 500,
                "before_food": True
            },
            "omeprazole": {
                "generic_name": "Omeprazole",
                "brand_names": ["Prilosec", "Omez", "Ocid"],
                "type": "capsule",
                "indications": ["acidity", "gastritis", "peptic_ulcer", "gerd"],
                "contraindications": ["liver_disease"],
                "side_effects": ["headache", "nausea", "diarrhea", "abdominal_pain"],
                "dosage": {
                    "adult": {"min": 20, "max": 40, "unit": "mg"},
                    "child": {"min": 1, "max": 2, "unit": "mg/kg"}
                },
                "frequency": "24 hours",
                "max_daily": 40,
                "before_food": True
            },
            "cetirizine": {
                "generic_name": "Cetirizine",
                "brand_names": ["Zyrtec", "Alerid", "Cetcip"],
                "type": "tablet",
                "indications": ["allergy", "skin_rash", "itching", "runny_nose"],
                "contraindications": ["kidney_disease"],
                "side_effects": ["drowsiness", "dry_mouth", "fatigue"],
                "dosage": {
                    "adult": {"min": 5, "max": 10, "unit": "mg"},
                    "child": {"min": 0.25, "max": 0.5, "unit": "mg/kg"}
                },
                "frequency": "24 hours",
                "max_daily": 10,
                "before_food": False
            },
            "dextromethorphan": {
                "generic_name": "Dextromethorphan",
                "brand_names": ["Benadryl", "Robitussin", "Ascoril"],
                "type": "syrup",
                "indications": ["cough", "dry_cough"],
                "contraindications": ["respiratory_depression", "asthma"],
                "side_effects": ["drowsiness", "nausea", "dizziness"],
                "dosage": {
                    "adult": {"min": 10, "max": 20, "unit": "ml"},
                    "child": {"min": 5, "max": 10, "unit": "ml"}
                },
                "frequency": "6-8 hours",
                "max_daily": 60,
                "before_food": False
            },
            "metformin": {
                "generic_name": "Metformin",
                "brand_names": ["Glucophage", "Glycomet", "Obimet"],
                "type": "tablet",
                "indications": ["diabetes", "high_blood_sugar"],
                "contraindications": ["kidney_disease", "liver_disease", "heart_failure"],
                "side_effects": ["nausea", "diarrhea", "metallic_taste"],
                "dosage": {
                    "adult": {"min": 500, "max": 1000, "unit": "mg"},
                    "child": {"min": 500, "max": 500, "unit": "mg"}
                },
                "frequency": "12 hours",
                "max_daily": 2000,
                "before_food": False
            },
            "amlodipine": {
                "generic_name": "Amlodipine",
                "brand_names": ["Norvasc", "Amlong", "Stamlo"],
                "type": "tablet",
                "indications": ["hypertension", "high_blood_pressure", "chest_pain"],
                "contraindications": ["severe_hypotension", "cardiogenic_shock"],
                "side_effects": ["ankle_swelling", "dizziness", "flushing"],
                "dosage": {
                    "adult": {"min": 2.5, "max": 10, "unit": "mg"},
                    "child": {"min": 2.5, "max": 5, "unit": "mg"}
                },
                "frequency": "24 hours",
                "max_daily": 10,
                "before_food": False
            },
            "atorvastatin": {
                "generic_name": "Atorvastatin",
                "brand_names": ["Lipitor", "Atorva", "Storvas"],
                "type": "tablet",
                "indications": ["high_cholesterol", "cardiovascular_risk"],
                "contraindications": ["liver_disease", "pregnancy", "breastfeeding"],
                "side_effects": ["muscle_pain", "liver_enzyme_elevation", "nausea"],
                "dosage": {
                    "adult": {"min": 10, "max": 80, "unit": "mg"},
                    "child": {"min": 10, "max": 20, "unit": "mg"}
                },
                "frequency": "24 hours",
                "max_daily": 80,
                "before_food": False
            }
        }
    
    def _load_drug_interactions(self) -> Dict[str, List[str]]:
        """Load drug interaction database"""
        return {
            "paracetamol": ["warfarin", "alcohol"],
            "ibuprofen": ["warfarin", "aspirin", "methotrexate", "lithium"],
            "amoxicillin": ["methotrexate", "warfarin"],
            "azithromycin": ["warfarin", "digoxin", "ergotamine"],
            "omeprazole": ["warfarin", "clopidogrel", "digoxin"],
            "cetirizine": ["alcohol", "sedatives"],
            "metformin": ["alcohol", "contrast_dye"],
            "amlodipine": ["simvastatin", "grapefruit"],
            "atorvastatin": ["cyclosporine", "gemfibrozil", "niacin"]
        }
    
    def _load_dosage_rules(self) -> Dict[str, Any]:
        """Load dosage calculation rules"""
        return {
            "age_groups": {
                "infant": {"min": 0, "max": 2},
                "child": {"min": 2, "max": 12},
                "adolescent": {"min": 12, "max": 18},
                "adult": {"min": 18, "max": 65},
                "elderly": {"min": 65, "max": 120}
            },
            "weight_adjustments": {
                "underweight": {"factor": 0.8, "threshold": 45},
                "normal": {"factor": 1.0, "min": 45, "max": 90},
                "overweight": {"factor": 1.2, "threshold": 90}
            },
            "duration_guidelines": {
                "acute": {"min": 3, "max": 7, "unit": "days"},
                "subacute": {"min": 7, "max": 14, "unit": "days"},
                "chronic": {"min": 30, "max": 90, "unit": "days"}
            }
        }
    
    async def generate_prescription(
        self,
        symptoms: List[str],
        diagnosis: str = "",
        allergies: List[str] = None,
        current_medications: List[str] = None,
        medical_history: str = "",
        age: int = 30,
        weight: float = 70.0,
        user_id: str = ""
    ) -> PrescriptionResponse:
        """Generate prescription based on symptoms and patient info"""
        
        if allergies is None:
            allergies = []
        if current_medications is None:
            current_medications = []
        
        # Determine medications based on symptoms
        recommended_medications = self._select_medications(symptoms, diagnosis, allergies)
        
        # Calculate dosages
        medications = []
        for med_name in recommended_medications:
            medication = self._create_medication_prescription(
                med_name, age, weight, symptoms, allergies
            )
            if medication:
                medications.append(medication)
        
        # Generate instructions
        instructions = self._generate_instructions(symptoms, medications, medical_history)
        
        # Generate follow-up plan
        follow_up = self._generate_follow_up(symptoms, diagnosis, medications)
        
        # Check for warnings
        warnings = self._generate_warnings(medications, allergies, current_medications, age)
        
        # Determine diagnosis if not provided
        if not diagnosis:
            diagnosis = self._infer_diagnosis(symptoms)
        
        return PrescriptionResponse(
            diagnosis=diagnosis,
            medications=medications,
            instructions=instructions,
            followUp=follow_up,
            warnings=warnings,
            model="prescription-generator-v1.0"
        )
    
    def _select_medications(self, symptoms: List[str], diagnosis: str, allergies: List[str]) -> List[str]:
        """Select appropriate medications based on symptoms"""
        
        selected_meds = []
        symptoms_lower = [s.lower().replace(" ", "_") for s in symptoms]
        allergies_lower = [a.lower() for a in allergies]
        
        # Check each medication for symptom match
        for med_name, med_info in self.medication_db.items():
            # Skip if allergic
            if any(allergy in med_name or allergy in med_info.get("generic_name", "").lower() 
                   for allergy in allergies_lower):
                continue
            
            # Check if medication treats any of the symptoms
            indications = med_info.get("indications", [])
            if any(symptom in indications for symptom in symptoms_lower):
                selected_meds.append(med_name)
        
        # Prioritize based on symptom severity and common treatments
        priority_order = [
            "paracetamol",  # First line for fever/pain
            "ibuprofen",    # Anti-inflammatory
            "omeprazole",   # Gastric protection
            "cetirizine",   # Antihistamine
            "amoxicillin",  # Antibiotic if infection suspected
            "dextromethorphan"  # Cough suppressant
        ]
        
        # Sort selected medications by priority
        prioritized_meds = []
        for med in priority_order:
            if med in selected_meds:
                prioritized_meds.append(med)
        
        # Add remaining medications
        for med in selected_meds:
            if med not in prioritized_meds:
                prioritized_meds.append(med)
        
        return prioritized_meds[:4]  # Limit to 4 medications
    
    def _create_medication_prescription(
        self, 
        med_name: str, 
        age: int, 
        weight: float, 
        symptoms: List[str],
        allergies: List[str]
    ) -> Optional[Medication]:
        """Create detailed medication prescription"""
        
        med_info = self.medication_db.get(med_name)
        if not med_info:
            return None
        
        # Determine age group
        age_group = self._get_age_group(age)
        
        # Calculate dosage
        dosage_info = med_info["dosage"].get(age_group, med_info["dosage"]["adult"])
        dosage = f"{dosage_info['min']}-{dosage_info['max']} {dosage_info['unit']}"
        
        # Determine frequency
        frequency = self._format_frequency(med_info["frequency"])
        
        # Determine duration
        duration = self._determine_duration(symptoms, med_name)
        
        # Generate instructions
        instructions = self._generate_medication_instructions(med_info, symptoms)
        
        return Medication(
            name=med_info.get("brand_names", [med_name.title()])[0],
            genericName=med_info["generic_name"],
            dosage=dosage,
            frequency=frequency,
            duration=duration,
            instructions=instructions,
            type=med_info["type"],
            beforeFood=med_info.get("before_food", False),
            sideEffects=med_info.get("side_effects", []),
            contraindications=med_info.get("contraindications", [])
        )
    
    def _get_age_group(self, age: int) -> str:
        """Determine age group for dosage calculation"""
        
        age_groups = self.dosage_rules["age_groups"]
        
        for group, range_info in age_groups.items():
            if range_info["min"] <= age < range_info["max"]:
                return group
        
        return "adult"  # Default
    
    def _format_frequency(self, frequency_str: str) -> str:
        """Format frequency string for prescription"""
        
        frequency_map = {
            "6-8 hours": "3 times daily",
            "8 hours": "3 times daily", 
            "12 hours": "2 times daily",
            "24 hours": "Once daily"
        }
        
        return frequency_map.get(frequency_str, frequency_str)
    
    def _determine_duration(self, symptoms: List[str], med_name: str) -> str:
        """Determine treatment duration"""
        
        # Default durations based on medication type
        duration_map = {
            "paracetamol": "3-5 days",
            "ibuprofen": "3-5 days",
            "amoxicillin": "7 days",
            "azithromycin": "5 days",
            "omeprazole": "14 days",
            "cetirizine": "7 days",
            "dextromethorphan": "5-7 days",
            "metformin": "As directed by doctor",
            "amlodipine": "As directed by doctor",
            "atorvastatin": "As directed by doctor"
        }
        
        return duration_map.get(med_name, "5-7 days")
    
    def _generate_medication_instructions(self, med_info: Dict, symptoms: List[str]) -> str:
        """Generate specific instructions for medication"""
        
        instructions = []
        
        # Food instructions
        if med_info.get("before_food"):
            instructions.append("Take 30 minutes before meals")
        else:
            instructions.append("Take after meals")
        
        # Specific instructions based on medication
        med_name = med_info.get("generic_name", "").lower()
        
        if "paracetamol" in med_name or "acetaminophen" in med_name:
            instructions.append("Do not exceed 4 tablets in 24 hours")
        elif "ibuprofen" in med_name:
            instructions.append("Take with plenty of water")
        elif "antibiotic" in str(med_info.get("indications", [])):
            instructions.append("Complete the full course even if feeling better")
        elif "omeprazole" in med_name:
            instructions.append("Swallow whole, do not crush or chew")
        elif "cetirizine" in med_name:
            instructions.append("May cause drowsiness, avoid driving")
        
        return ". ".join(instructions)
    
    def _generate_instructions(self, symptoms: List[str], medications: List[Medication], medical_history: str) -> List[str]:
        """Generate general prescription instructions"""
        
        instructions = []
        
        # General care instructions based on symptoms
        symptoms_lower = [s.lower() for s in symptoms]
        
        if any(symptom in symptoms_lower for symptom in ["fever", "temperature"]):
            instructions.extend([
                "Rest and stay well hydrated",
                "Monitor temperature regularly",
                "Use cold compress if fever is high"
            ])
        
        if any(symptom in symptoms_lower for symptom in ["cough", "sore throat"]):
            instructions.extend([
                "Drink warm liquids like tea with honey",
                "Avoid cold drinks and ice cream",
                "Gargle with warm salt water"
            ])
        
        if any(symptom in symptoms_lower for symptom in ["nausea", "vomiting", "stomach"]):
            instructions.extend([
                "Eat light, easily digestible food",
                "Avoid spicy and oily foods",
                "Take small frequent meals"
            ])
        
        if any(symptom in symptoms_lower for symptom in ["headache", "dizziness"]):
            instructions.extend([
                "Ensure adequate sleep and rest",
                "Avoid bright lights and loud noises",
                "Stay hydrated"
            ])
        
        # Medication compliance
        instructions.extend([
            "Take medications at the same time each day",
            "Do not skip doses",
            "Store medications in a cool, dry place"
        ])
        
        return instructions
    
    def _generate_follow_up(self, symptoms: List[str], diagnosis: str, medications: List[Medication]) -> Dict[str, Any]:
        """Generate follow-up recommendations"""
        
        # Determine follow-up timeline
        has_antibiotics = any("antibiotic" in str(med.contraindications).lower() or 
                             "amoxicillin" in med.name.lower() or 
                             "azithromycin" in med.name.lower() 
                             for med in medications)
        
        if has_antibiotics:
            follow_up_days = 7
        elif any(symptom in ["fever", "severe pain"] for symptom in symptoms):
            follow_up_days = 3
        else:
            follow_up_days = 5
        
        return {
            "required": True,
            "timeline": f"{follow_up_days} days",
            "conditions": [
                "If symptoms worsen or do not improve",
                "If new symptoms develop",
                "If side effects occur"
            ],
            "emergency_signs": [
                "High fever above 103°F (39.4°C)",
                "Difficulty breathing",
                "Severe allergic reaction",
                "Persistent vomiting"
            ]
        }
    
    def _generate_warnings(
        self, 
        medications: List[Medication], 
        allergies: List[str], 
        current_medications: List[str],
        age: int
    ) -> List[str]:
        """Generate warnings and precautions"""
        
        warnings = []
        
        # Age-specific warnings
        if age < 18:
            warnings.append("Pediatric dosing - ensure correct weight-based calculation")
        elif age > 65:
            warnings.append("Elderly patient - monitor for increased side effects")
        
        # Allergy warnings
        if allergies:
            warnings.append(f"Patient allergic to: {', '.join(allergies)}")
        
        # Drug interaction warnings
        med_names = [med.name.lower() for med in medications]
        for i, med1 in enumerate(med_names):
            for j, med2 in enumerate(med_names[i+1:], i+1):
                if self._check_interaction(med1, med2):
                    warnings.append(f"Potential interaction between {medications[i].name} and {medications[j].name}")
        
        # Specific medication warnings
        for med in medications:
            if "ibuprofen" in med.name.lower():
                warnings.append("Monitor for gastric irritation with Ibuprofen")
            elif "paracetamol" in med.name.lower():
                warnings.append("Do not exceed maximum daily dose of Paracetamol")
            elif any(term in med.name.lower() for term in ["amoxicillin", "azithromycin"]):
                warnings.append("Complete antibiotic course to prevent resistance")
        
        # General warnings
        warnings.extend([
            "Inform doctor about all current medications",
            "Stop medication and consult doctor if severe side effects occur",
            "This is an AI-generated prescription - consult doctor for serious conditions"
        ])
        
        return warnings
    
    def _check_interaction(self, med1: str, med2: str) -> bool:
        """Check for drug interactions between two medications"""
        
        # Simple interaction checking
        interactions = self.drug_interactions
        
        for med_name, interacting_drugs in interactions.items():
            if med_name in med1:
                if any(drug in med2 for drug in interacting_drugs):
                    return True
            if med_name in med2:
                if any(drug in med1 for drug in interacting_drugs):
                    return True
        
        return False
    
    def _infer_diagnosis(self, symptoms: List[str]) -> str:
        """Infer diagnosis from symptoms"""
        
        symptoms_lower = [s.lower() for s in symptoms]
        
        # Common diagnosis patterns
        if any(s in symptoms_lower for s in ["fever", "headache", "body_ache"]):
            return "Viral Fever"
        elif any(s in symptoms_lower for s in ["cough", "sore_throat", "runny_nose"]):
            return "Upper Respiratory Tract Infection"
        elif any(s in symptoms_lower for s in ["nausea", "vomiting", "diarrhea"]):
            return "Gastroenteritis"
        elif any(s in symptoms_lower for s in ["headache", "dizziness"]):
            return "Headache Disorder"
        elif any(s in symptoms_lower for s in ["joint_pain", "muscle_pain"]):
            return "Musculoskeletal Pain"
        else:
            return "Symptomatic Treatment"
    
    async def check_drug_interactions(self, medications: List[str]) -> List[Dict[str, Any]]:
        """Check for drug interactions in a list of medications"""
        
        interactions = []
        
        for i, med1 in enumerate(medications):
            for j, med2 in enumerate(medications[i+1:], i+1):
                if self._check_interaction(med1.lower(), med2.lower()):
                    interactions.append({
                        "medication1": med1,
                        "medication2": med2,
                        "severity": "moderate",
                        "description": f"Potential interaction between {med1} and {med2}",
                        "recommendation": "Monitor patient closely and consult doctor"
                    })
        
        return interactions