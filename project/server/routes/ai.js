const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

// Health check for AI services
router.get('/health', async (req, res) => {
  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const response = await axios.get(`${aiServiceUrl}/health`);
    
    res.json({
      success: true,
      aiServices: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI services unavailable',
      error: error.message
    });
  }
});

// Get AI model information
router.get('/models', async (req, res) => {
  try {
    const models = {
      diagnosis: {
        name: 'Symptom Diagnosis Model',
        version: '1.0.0',
        accuracy: '87%',
        lastUpdated: '2024-01-15'
      },
      reportAnalyzer: {
        name: 'Medical Report Analyzer',
        version: '1.0.0',
        accuracy: '92%',
        lastUpdated: '2024-01-15'
      },
      prescriptionGenerator: {
        name: 'Prescription Generator',
        version: '1.0.0',
        accuracy: '89%',
        lastUpdated: '2024-01-15'
      },
      emergencyAssistant: {
        name: 'Emergency Response Assistant',
        version: '1.0.0',
        accuracy: '95%',
        lastUpdated: '2024-01-15'
      }
    };
    
    res.json({
      success: true,
      models
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get model information',
      error: error.message
    });
  }
});

// Chat with AI doctor
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, context, language } = req.body;
    
    // This would integrate with a conversational AI model
    // For now, we'll provide a simple response
    
    const aiResponse = await generateAIResponse(message, context, language);
    
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI chat failed',
      error: error.message
    });
  }
});

// Get health tips
router.get('/health-tips', auth, async (req, res) => {
  try {
    const { category, language = 'en' } = req.query;
    
    const tips = await getHealthTips(category, language);
    
    res.json({
      success: true,
      tips,
      category: category || 'general'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get health tips',
      error: error.message
    });
  }
});

// Symptom checker
router.post('/symptom-checker', auth, async (req, res) => {
  try {
    const { symptoms, duration, severity } = req.body;
    
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const response = await axios.post(`${aiServiceUrl}/diagnosis/predict`, {
      symptoms,
      duration,
      severity,
      userId: req.userId
    });
    
    res.json({
      success: true,
      analysis: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Symptom analysis failed',
      error: error.message
    });
  }
});

// Drug interaction checker
router.post('/drug-interactions', auth, async (req, res) => {
  try {
    const { medications } = req.body;
    
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const response = await axios.post(`${aiServiceUrl}/prescription/interactions`, {
      medications
    });
    
    res.json({
      success: true,
      interactions: response.data.interactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Drug interaction check failed',
      error: error.message
    });
  }
});

// Helper functions
async function generateAIResponse(message, context, language) {
  // This is a simplified AI response generator
  // In a real implementation, you'd use a proper conversational AI model
  
  const responses = {
    greeting: [
      "Hello! I'm your AI doctor assistant. How can I help you today?",
      "Hi there! I'm here to help with your health concerns. What's bothering you?",
      "Welcome! I'm your virtual doctor. Please describe your symptoms."
    ],
    symptoms: [
      "I understand you're experiencing some symptoms. Can you tell me more about when they started?",
      "Thank you for sharing that. Can you describe the severity of your symptoms?",
      "Based on what you've told me, I'd like to ask a few more questions to better understand your condition."
    ],
    general: [
      "I'm here to help with your health concerns. Could you provide more details?",
      "I understand. Let me help you with that. Can you be more specific?",
      "Thank you for reaching out. I'll do my best to assist you."
    ]
  };
  
  // Simple keyword matching for demo purposes
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('hello') || messageLower.includes('hi')) {
    return getRandomResponse(responses.greeting);
  } else if (messageLower.includes('pain') || messageLower.includes('fever') || messageLower.includes('cough')) {
    return getRandomResponse(responses.symptoms);
  } else {
    return getRandomResponse(responses.general);
  }
}

function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

async function getHealthTips(category, language) {
  const tips = {
    general: [
      "Drink at least 8 glasses of water daily",
      "Get 7-9 hours of sleep each night",
      "Exercise for at least 30 minutes daily",
      "Eat a balanced diet with fruits and vegetables",
      "Practice stress management techniques"
    ],
    nutrition: [
      "Include colorful fruits and vegetables in every meal",
      "Choose whole grains over refined grains",
      "Limit processed and sugary foods",
      "Eat lean proteins like fish, chicken, and legumes",
      "Control portion sizes"
    ],
    exercise: [
      "Start with 10-15 minutes of daily activity",
      "Include both cardio and strength training",
      "Take the stairs instead of elevators",
      "Walk or bike for short trips",
      "Find activities you enjoy to stay motivated"
    ],
    mental_health: [
      "Practice mindfulness and meditation",
      "Stay connected with friends and family",
      "Take breaks from work and technology",
      "Engage in hobbies you enjoy",
      "Seek professional help when needed"
    ]
  };
  
  return tips[category] || tips.general;
}

module.exports = router;