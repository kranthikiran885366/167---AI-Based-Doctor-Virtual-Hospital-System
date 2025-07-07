// AI Service utilities for the AI Doctor system
export class AIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000';
  }

  // Diagnosis AI
  async getDiagnosis(symptoms, severity = 'moderate', additionalInfo = '') {
    try {
      const response = await fetch(`${this.baseURL}/diagnosis/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms,
          severity,
          additionalInfo,
          userId: this.getUserId()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get diagnosis');
      }

      return await response.json();
    } catch (error) {
      console.error('Diagnosis error:', error);
      // Return mock data for demo
      return this.getMockDiagnosis(symptoms);
    }
  }

  // Report Analysis AI
  async analyzeReport(file, fileType) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);
      formData.append('userId', this.getUserId());

      const response = await fetch(`${this.baseURL}/reports/analyze`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to analyze report');
      }

      return await response.json();
    } catch (error) {
      console.error('Report analysis error:', error);
      // Return mock data for demo
      return this.getMockReportAnalysis(file.name);
    }
  }

  // Prescription AI
  async generatePrescription(symptoms, diagnosis, allergies = [], medicalHistory = '') {
    try {
      const response = await fetch(`${this.baseURL}/prescription/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms,
          diagnosis,
          allergies,
          medicalHistory,
          userId: this.getUserId()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate prescription');
      }

      return await response.json();
    } catch (error) {
      console.error('Prescription error:', error);
      // Return mock data for demo
      return this.getMockPrescription(symptoms, diagnosis);
    }
  }

  // Emergency AI
  async getEmergencyGuidance(emergencyType, symptoms = []) {
    try {
      const response = await fetch(`${this.baseURL}/emergency/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emergencyType,
          symptoms,
          severity: 'critical'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get emergency guidance');
      }

      return await response.json();
    } catch (error) {
      console.error('Emergency guidance error:', error);
      // Return mock data for demo
      return this.getMockEmergencyGuidance(emergencyType);
    }
  }

  // Voice Processing
  async processVoiceInput(audioBlob, language = 'en') {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', language);

      const response = await fetch(`${this.baseURL}/voice/speech-to-text`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to process voice input');
      }

      return await response.json();
    } catch (error) {
      console.error('Voice processing error:', error);
      return { text: 'Voice processing not available in demo mode' };
    }
  }

  // Text to Speech
  async textToSpeech(text, language = 'en') {
    try {
      const response = await fetch(`${this.baseURL}/voice/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language })
      });

      if (!response.ok) {
        throw new Error('Failed to convert text to speech');
      }

      const data = await response.json();
      return data.audioData;
    } catch (error) {
      console.error('Text-to-speech error:', error);
      return null;
    }
  }

  // Health Tips AI
  async getHealthTips(category = 'general', userProfile = {}) {
    try {
      const response = await fetch(`${this.baseURL}/ai/health-tips`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        params: { category, ...userProfile }
      });

      if (!response.ok) {
        throw new Error('Failed to get health tips');
      }

      return await response.json();
    } catch (error) {
      console.error('Health tips error:', error);
      return this.getMockHealthTips(category);
    }
  }

  // AI Chat
  async chatWithAI(message, context = {}) {
    try {
      const response = await fetch(`${this.baseURL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
          userId: this.getUserId()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to chat with AI');
      }

      return await response.json();
    } catch (error) {
      console.error('AI chat error:', error);
      return this.getMockChatResponse(message);
    }
  }

  // Utility methods
  getUserId() {
    const user = JSON.parse(localStorage.getItem('aiDoctorUser') || '{}');
    return user.id || 'demo-user';
  }

  // Mock data methods for demo purposes
  getMockDiagnosis(symptoms) {
    const symptomsStr = symptoms.join(' ').toLowerCase();
    
    if (symptomsStr.includes('fever') || symptomsStr.includes('temperature')) {
      return {
        condition: 'Viral Fever',
        confidence: 85,
        description: 'Common viral infection causing elevated body temperature',
        severity: 'moderate',
        recommendations: [
          'Rest and stay hydrated',
          'Take paracetamol for fever reduction',
          'Monitor temperature regularly',
          'Consult doctor if symptoms worsen'
        ],
        riskFactors: ['Weak immunity', 'Seasonal changes', 'Close contact with infected person'],
        followUpRequired: true,
        model: 'ai-diagnosis-v1.0'
      };
    }

    if (symptomsStr.includes('headache') || symptomsStr.includes('head pain')) {
      return {
        condition: 'Tension Headache',
        confidence: 78,
        description: 'Common type of headache caused by stress or muscle tension',
        severity: 'mild',
        recommendations: [
          'Apply cold or warm compress',
          'Practice relaxation techniques',
          'Ensure adequate sleep',
          'Stay hydrated'
        ],
        riskFactors: ['Stress', 'Poor posture', 'Dehydration', 'Lack of sleep'],
        followUpRequired: false,
        model: 'ai-diagnosis-v1.0'
      };
    }

    if (symptomsStr.includes('cough')) {
      return {
        condition: 'Upper Respiratory Infection',
        confidence: 82,
        description: 'Viral infection affecting the upper respiratory tract',
        severity: 'mild',
        recommendations: [
          'Drink warm liquids',
          'Use honey for cough relief',
          'Avoid cold drinks',
          'Rest your voice'
        ],
        riskFactors: ['Viral exposure', 'Weak immunity', 'Cold weather'],
        followUpRequired: true,
        model: 'ai-diagnosis-v1.0'
      };
    }

    return {
      condition: 'General Malaise',
      confidence: 65,
      description: 'General feeling of discomfort or uneasiness',
      severity: 'mild',
      recommendations: [
        'Monitor symptoms closely',
        'Ensure adequate rest',
        'Maintain healthy diet',
        'Consult healthcare provider if symptoms persist'
      ],
      riskFactors: ['Stress', 'Poor lifestyle', 'Underlying conditions'],
      followUpRequired: true,
      model: 'ai-diagnosis-v1.0'
    };
  }

  getMockReportAnalysis(fileName) {
    const fileNameLower = fileName.toLowerCase();
    
    if (fileNameLower.includes('blood') || fileNameLower.includes('cbc')) {
      return {
        type: 'Blood Test Report',
        findings: [
          {
            parameter: 'Hemoglobin',
            value: '11.2 g/dL',
            unit: 'g/dL',
            normalRange: '12-15 g/dL',
            status: 'low',
            concern: 'Mild anemia detected'
          },
          {
            parameter: 'WBC Count',
            value: '12,500/μL',
            unit: '/μL',
            normalRange: '4,000-11,000/μL',
            status: 'high',
            concern: 'Possible infection'
          },
          {
            parameter: 'Platelet Count',
            value: '250,000/μL',
            unit: '/μL',
            normalRange: '150,000-450,000/μL',
            status: 'normal',
            concern: null
          }
        ],
        diagnosis: 'Mild anemia with possible infection. Blood sugar levels normal.',
        recommendations: [
          'Consult hematologist for anemia treatment',
          'Take iron supplements as prescribed',
          'Monitor for signs of infection',
          'Follow up in 2 weeks'
        ],
        urgency: 'moderate',
        confidence: 88,
        model: 'report-analyzer-v1.0'
      };
    }

    return {
      type: 'Medical Report',
      findings: [
        {
          parameter: 'Overall Assessment',
          value: 'Normal',
          unit: '',
          normalRange: 'Normal',
          status: 'normal',
          concern: null
        }
      ],
      diagnosis: 'Report appears normal with no significant abnormalities detected.',
      recommendations: [
        'Continue regular health monitoring',
        'Maintain healthy lifestyle',
        'Follow up as recommended by doctor'
      ],
      urgency: 'low',
      confidence: 75,
      model: 'report-analyzer-v1.0'
    };
  }

  getMockPrescription(symptoms, diagnosis) {
    const medications = [];
    const symptomsStr = symptoms.join(' ').toLowerCase();

    if (symptomsStr.includes('fever')) {
      medications.push({
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '5 days',
        instructions: 'Take after meals with water',
        type: 'tablet',
        beforeFood: false,
        sideEffects: ['Nausea', 'Skin rash'],
        contraindications: ['Liver disease', 'Alcohol dependency']
      });
    }

    if (symptomsStr.includes('cough')) {
      medications.push({
        name: 'Dextromethorphan',
        genericName: 'Dextromethorphan HBr',
        dosage: '10ml',
        frequency: '3 times daily',
        duration: '7 days',
        instructions: 'Take with warm water',
        type: 'syrup',
        beforeFood: false,
        sideEffects: ['Drowsiness', 'Dizziness'],
        contraindications: ['Respiratory depression']
      });
    }

    if (medications.length === 0) {
      medications.push({
        name: 'Multivitamin',
        genericName: 'Multivitamin Complex',
        dosage: '1 tablet',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with breakfast',
        type: 'tablet',
        beforeFood: false,
        sideEffects: ['Mild stomach upset'],
        contraindications: ['Hypervitaminosis']
      });
    }

    return {
      diagnosis: diagnosis || 'Symptomatic Treatment',
      medications,
      instructions: [
        'Take medications as prescribed',
        'Complete the full course',
        'Stay hydrated',
        'Get adequate rest'
      ],
      followUp: {
        required: true,
        timeline: '1 week',
        conditions: ['If symptoms persist', 'If new symptoms develop']
      },
      warnings: [
        'Consult doctor if symptoms worsen',
        'This is an AI-generated prescription',
        'Seek professional medical advice for serious conditions'
      ],
      model: 'prescription-generator-v1.0'
    };
  }

  getMockEmergencyGuidance(emergencyType) {
    const emergencyGuides = {
      heart_attack: {
        urgencyLevel: 'critical',
        immediateActions: [
          'Call emergency services (108) immediately',
          'Help person sit down and stay calm',
          'Loosen tight clothing around neck and chest',
          'Give aspirin if person is conscious and not allergic',
          'Monitor breathing and pulse'
        ],
        instructions: [
          'Keep the person calm and reassured',
          'Do not leave the person alone',
          'Be prepared to perform CPR if needed',
          'Note the time symptoms started'
        ],
        emergencyContacts: ['108 - Emergency Services', '102 - Ambulance'],
        estimatedResponseTime: '8-12 minutes'
      },
      choking: {
        urgencyLevel: 'critical',
        immediateActions: [
          'Ask "Are you choking?" If cannot speak, act immediately',
          'Give 5 sharp back blows between shoulder blades',
          'Give 5 abdominal thrusts (Heimlich maneuver)',
          'Continue alternating back blows and abdominal thrusts',
          'Call 108 if object does not dislodge'
        ],
        instructions: [
          'Stand behind the person',
          'Place heel of hand between shoulder blades',
          'For abdominal thrusts: place hands above navel',
          'Push hard inward and upward'
        ],
        emergencyContacts: ['108 - Emergency Services'],
        estimatedResponseTime: '6-10 minutes'
      }
    };

    return emergencyGuides[emergencyType] || {
      urgencyLevel: 'high',
      immediateActions: [
        'Call emergency services (108) immediately',
        'Stay calm and assess the situation',
        'Provide first aid if trained',
        'Do not move person unless in immediate danger'
      ],
      instructions: [
        'Ensure scene safety',
        'Check for responsiveness',
        'Monitor breathing and pulse',
        'Stay with person until help arrives'
      ],
      emergencyContacts: ['108 - Emergency Services'],
      estimatedResponseTime: '8-15 minutes'
    };
  }

  getMockHealthTips(category) {
    const tips = {
      general: [
        'Drink at least 8 glasses of water daily',
        'Get 7-9 hours of sleep each night',
        'Exercise for at least 30 minutes daily',
        'Eat a balanced diet with fruits and vegetables',
        'Practice stress management techniques'
      ],
      nutrition: [
        'Include colorful fruits and vegetables in every meal',
        'Choose whole grains over refined grains',
        'Limit processed and sugary foods',
        'Eat lean proteins like fish, chicken, and legumes'
      ],
      exercise: [
        'Start with 10-15 minutes of daily activity',
        'Include both cardio and strength training',
        'Take the stairs instead of elevators',
        'Find activities you enjoy to stay motivated'
      ],
      mental_health: [
        'Practice mindfulness and meditation',
        'Stay connected with friends and family',
        'Take breaks from work and technology',
        'Seek professional help when needed'
      ]
    };

    return {
      tips: tips[category] || tips.general,
      category: category || 'general'
    };
  }

  getMockChatResponse(message) {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('hello') || messageLower.includes('hi')) {
      return {
        response: "Hello! I'm your AI doctor assistant. How can I help you today? You can describe your symptoms, ask health questions, or request emergency guidance.",
        timestamp: new Date().toISOString()
      };
    }
    
    if (messageLower.includes('pain') || messageLower.includes('hurt')) {
      return {
        response: "I understand you're experiencing pain. Can you tell me more about: 1) Where is the pain located? 2) How severe is it on a scale of 1-10? 3) When did it start? 4) What makes it better or worse?",
        timestamp: new Date().toISOString()
      };
    }
    
    if (messageLower.includes('fever') || messageLower.includes('temperature')) {
      return {
        response: "Fever can be concerning. Please tell me: 1) What's your current temperature? 2) How long have you had the fever? 3) Any other symptoms like headache, body aches, or chills? 4) Have you taken any medication?",
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      response: "I understand your concern. Could you provide more specific details about your symptoms? This will help me give you a more accurate assessment. You can also use the voice input feature or select from common symptoms.",
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;