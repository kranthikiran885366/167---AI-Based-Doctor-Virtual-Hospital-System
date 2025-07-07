from typing import List, Dict, Any, Optional
from models.medical_models import EmergencyResponse

class EmergencyAssistant:
    def __init__(self):
        self.emergency_protocols = self._load_emergency_protocols()
        self.emergency_contacts = self._load_emergency_contacts()
    
    def _load_emergency_protocols(self) -> Dict[str, Dict[str, Any]]:
        """Load emergency response protocols"""
        return {
            "heart_attack": {
                "urgency": "critical",
                "immediate_actions": [
                    "Call emergency services (108) immediately",
                    "Help person sit down and stay calm",
                    "Loosen tight clothing around neck and chest",
                    "If conscious and not allergic, give aspirin to chew",
                    "Monitor breathing and pulse"
                ],
                "detailed_instructions": [
                    "Keep the person calm and reassured",
                    "Do not leave the person alone",
                    "Be prepared to perform CPR if person becomes unconscious",
                    "Note the time symptoms started",
                    "Gather medical history and current medications"
                ],
                "warning_signs": [
                    "Severe chest pain or pressure",
                    "Pain radiating to arm, jaw, or back", 
                    "Shortness of breath",
                    "Nausea or vomiting",
                    "Cold sweats",
                    "Dizziness or lightheadedness"
                ],
                "contraindications": [
                    "Do not give aspirin if allergic",
                    "Do not give water or food",
                    "Do not let person drive themselves"
                ]
            },
            "choking": {
                "urgency": "critical",
                "immediate_actions": [
                    "Ask 'Are you choking?' If cannot speak, act immediately",
                    "Give 5 sharp back blows between shoulder blades",
                    "Give 5 abdominal thrusts (Heimlich maneuver)",
                    "Continue alternating back blows and abdominal thrusts",
                    "Call 108 if object doesn't dislodge after 3 cycles"
                ],
                "detailed_instructions": [
                    "Stand behind the person",
                    "Place heel of hand between shoulder blades",
                    "Give sharp upward blows",
                    "For abdominal thrusts: place hands above navel",
                    "Push hard inward and upward",
                    "Check mouth for dislodged object"
                ],
                "warning_signs": [
                    "Cannot speak, cough, or breathe",
                    "Clutching throat with hands",
                    "Blue lips or face",
                    "Loss of consciousness"
                ],
                "contraindications": [
                    "Do not perform on pregnant women",
                    "Do not use abdominal thrusts on infants",
                    "Do not try to remove object with fingers unless visible"
                ]
            },
            "seizure": {
                "urgency": "high",
                "immediate_actions": [
                    "Stay calm and time the seizure",
                    "Clear area of dangerous objects",
                    "Do NOT restrain the person",
                    "Gently turn person to their side",
                    "Place something soft under their head"
                ],
                "detailed_instructions": [
                    "Remove glasses if wearing any",
                    "Loosen tight clothing around neck",
                    "Stay with the person until fully conscious",
                    "Speak calmly and reassuringly",
                    "Note duration and characteristics of seizure"
                ],
                "warning_signs": [
                    "Seizure lasting more than 5 minutes",
                    "Multiple seizures without recovery",
                    "Difficulty breathing after seizure",
                    "Injury during seizure",
                    "First-time seizure"
                ],
                "contraindications": [
                    "Do not put anything in mouth",
                    "Do not hold down or restrain",
                    "Do not give water or food immediately after"
                ]
            },
            "severe_bleeding": {
                "urgency": "critical",
                "immediate_actions": [
                    "Call 108 immediately",
                    "Apply direct pressure to wound with clean cloth",
                    "Elevate injured area above heart level if possible",
                    "Do not remove embedded objects",
                    "Add more bandages if blood soaks through"
                ],
                "detailed_instructions": [
                    "Use sterile gauze or clean cloth",
                    "Apply firm, steady pressure",
                    "Maintain pressure continuously",
                    "Secure bandage with tape or cloth strips",
                    "Monitor for signs of shock"
                ],
                "warning_signs": [
                    "Rapid, weak pulse",
                    "Pale, cool, clammy skin",
                    "Rapid breathing",
                    "Weakness or dizziness",
                    "Nausea or vomiting"
                ],
                "contraindications": [
                    "Do not remove embedded objects",
                    "Do not use tourniquet unless trained",
                    "Do not give food or water"
                ]
            },
            "burns": {
                "urgency": "high",
                "immediate_actions": [
                    "Remove person from heat source",
                    "Cool burn with running water for 10-20 minutes",
                    "Remove jewelry before swelling starts",
                    "Do not break blisters",
                    "Cover with sterile gauze loosely"
                ],
                "detailed_instructions": [
                    "Use cool, not cold water",
                    "Remove non-stuck clothing from burn area",
                    "Do not use ice, butter, or ointments",
                    "Protect burn from further injury",
                    "Monitor for signs of infection"
                ],
                "warning_signs": [
                    "Burns larger than palm of hand",
                    "Burns on face, hands, feet, or genitals",
                    "Chemical or electrical burns",
                    "Signs of infection",
                    "Difficulty breathing"
                ],
                "contraindications": [
                    "Do not use ice or very cold water",
                    "Do not apply butter, oil, or ointments",
                    "Do not break blisters"
                ]
            },
            "poisoning": {
                "urgency": "critical",
                "immediate_actions": [
                    "Call 108 or Poison Control immediately",
                    "Do NOT induce vomiting unless told by poison control",
                    "If poison on skin, remove contaminated clothing",
                    "If poison in eyes, flush with water for 15 minutes",
                    "Keep poison container for identification"
                ],
                "detailed_instructions": [
                    "Gather information about the poison",
                    "Note time of exposure",
                    "Monitor breathing and consciousness",
                    "Follow poison control instructions exactly",
                    "Be prepared to perform CPR if needed"
                ],
                "warning_signs": [
                    "Difficulty breathing",
                    "Loss of consciousness",
                    "Severe nausea or vomiting",
                    "Burns around mouth",
                    "Unusual odor on breath"
                ],
                "contraindications": [
                    "Do not induce vomiting for corrosive substances",
                    "Do not give activated charcoal unless instructed",
                    "Do not give anything by mouth if unconscious"
                ]
            },
            "allergic_reaction": {
                "urgency": "high",
                "immediate_actions": [
                    "Remove or avoid the allergen",
                    "Give antihistamine if available",
                    "Use epinephrine auto-injector if prescribed",
                    "Call 108 for severe reactions",
                    "Monitor breathing and consciousness"
                ],
                "detailed_instructions": [
                    "Help person sit upright if breathing difficulty",
                    "Loosen tight clothing",
                    "Be prepared to perform CPR",
                    "Note time of exposure and symptoms",
                    "Stay with person until help arrives"
                ],
                "warning_signs": [
                    "Difficulty breathing or wheezing",
                    "Swelling of face, lips, or throat",
                    "Rapid pulse",
                    "Dizziness or fainting",
                    "Widespread rash or hives"
                ],
                "contraindications": [
                    "Do not give anything by mouth if swallowing difficulty",
                    "Do not leave person alone",
                    "Do not assume mild symptoms will not worsen"
                ]
            }
        }
    
    def _load_emergency_contacts(self) -> Dict[str, List[str]]:
        """Load emergency contact numbers by region"""
        return {
            "india": [
                "108 - Emergency Services",
                "102 - Ambulance", 
                "101 - Fire Department",
                "100 - Police"
            ],
            "international": [
                "911 - USA Emergency",
                "999 - UK Emergency", 
                "112 - European Emergency"
            ],
            "poison_control": [
                "1066 - India Poison Control",
                "1-800-222-1222 - USA Poison Control"
            ]
        }
    
    async def analyze_emergency(
        self,
        emergency_type: str,
        symptoms: List[str] = None,
        severity: str = "critical",
        location: Dict[str, float] = None
    ) -> EmergencyResponse:
        """Analyze emergency situation and provide response"""
        
        if symptoms is None:
            symptoms = []
        
        # Get emergency protocol
        protocol = self.emergency_protocols.get(emergency_type.lower())
        
        if not protocol:
            # Generic emergency response
            return EmergencyResponse(
                urgencyLevel="high",
                immediateActions=[
                    "Call emergency services (108) immediately",
                    "Stay calm and assess the situation",
                    "Provide first aid if trained",
                    "Do not move person unless in immediate danger"
                ],
                instructions=[
                    "Ensure scene safety",
                    "Check for responsiveness",
                    "Monitor breathing and pulse",
                    "Stay with person until help arrives"
                ],
                emergencyContacts=self.emergency_contacts["india"],
                estimatedResponseTime="8-12 minutes"
            )
        
        # Calculate estimated response time based on location
        response_time = self._estimate_response_time(location)
        
        return EmergencyResponse(
            urgencyLevel=protocol["urgency"],
            immediateActions=protocol["immediate_actions"],
            instructions=protocol["detailed_instructions"],
            emergencyContacts=self.emergency_contacts["india"],
            estimatedResponseTime=response_time
        )
    
    async def get_instructions(self, emergency_type: str) -> List[str]:
        """Get detailed instructions for specific emergency type"""
        
        protocol = self.emergency_protocols.get(emergency_type.lower())
        
        if not protocol:
            return [
                "Call emergency services immediately",
                "Ensure scene safety",
                "Provide basic first aid if trained",
                "Monitor vital signs",
                "Stay with person until help arrives"
            ]
        
        # Combine immediate actions and detailed instructions
        all_instructions = []
        all_instructions.extend(protocol["immediate_actions"])
        all_instructions.extend(protocol["detailed_instructions"])
        
        # Add warnings and contraindications
        if "warning_signs" in protocol:
            all_instructions.append("WARNING SIGNS:")
            all_instructions.extend([f"• {sign}" for sign in protocol["warning_signs"]])
        
        if "contraindications" in protocol:
            all_instructions.append("DO NOT:")
            all_instructions.extend([f"• {item}" for item in protocol["contraindications"]])
        
        return all_instructions
    
    def _estimate_response_time(self, location: Dict[str, float] = None) -> str:
        """Estimate emergency response time based on location"""
        
        if not location:
            return "8-12 minutes"
        
        # This is a simplified estimation
        # In a real system, you would use actual emergency services data
        
        # Urban areas typically have faster response times
        # Rural areas may have longer response times
        
        # For demo purposes, return a range
        return "6-15 minutes"
    
    async def get_cpr_instructions(self) -> List[str]:
        """Get step-by-step CPR instructions"""
        
        return [
            "1. Check responsiveness - tap shoulders and shout 'Are you okay?'",
            "2. Call 108 immediately or have someone else call",
            "3. Position person on firm, flat surface",
            "4. Tilt head back, lift chin to open airway",
            "5. Check for breathing for no more than 10 seconds",
            "6. Place heel of hand on center of chest between nipples",
            "7. Place other hand on top, interlace fingers",
            "8. Push hard and fast at least 2 inches deep",
            "9. Allow complete chest recoil between compressions",
            "10. Compress at rate of 100-120 per minute",
            "11. Give 30 compressions, then 2 rescue breaths",
            "12. Continue cycles of 30:2 until help arrives",
            "13. Switch with another person every 2 minutes if possible"
        ]
    
    async def get_heimlich_instructions(self) -> List[str]:
        """Get step-by-step Heimlich maneuver instructions"""
        
        return [
            "1. Stand behind the person",
            "2. Place arms around their waist",
            "3. Make a fist with one hand",
            "4. Place fist above navel, below ribcage",
            "5. Grasp fist with other hand",
            "6. Give quick upward thrusts",
            "7. Each thrust should be separate and distinct",
            "8. Continue until object is expelled or person becomes unconscious",
            "9. If person becomes unconscious, begin CPR",
            "10. Check mouth for visible object before rescue breaths"
        ]