const express = require('express');
const MedicalRecord = require('../models/MedicalRecord');
const auth = require('../middleware/auth');
const { io } = require('../index');

const router = express.Router();

// Emergency alert
router.post('/alert', auth, async (req, res) => {
  try {
    const { 
      emergencyType, 
      location, 
      symptoms, 
      severity, 
      contactInfo 
    } = req.body;

    // Create emergency record
    const emergencyRecord = new MedicalRecord({
      userId: req.userId,
      type: 'emergency',
      symptoms: symptoms ? symptoms.map(symptom => ({
        name: symptom,
        severity: severity || 'severe'
      })) : [],
      diagnosis: {
        condition: emergencyType,
        severity: 'critical',
        description: `Emergency: ${emergencyType}`
      },
      aiAnalysis: {
        model: 'emergency-response-v1',
        recommendations: getEmergencyInstructions(emergencyType),
        followUpRequired: true
      }
    });

    await emergencyRecord.save();

    // Emit real-time emergency alert
    io.to(`emergency-${req.userId}`).emit('emergency-alert', {
      type: emergencyType,
      location,
      timestamp: new Date(),
      recordId: emergencyRecord._id
    });

    // Get emergency response instructions
    const instructions = getEmergencyInstructions(emergencyType);

    res.json({
      success: true,
      message: 'Emergency alert sent',
      instructions,
      recordId: emergencyRecord._id,
      emergencyNumber: '108' // India emergency number
    });
  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emergency alert',
      error: error.message
    });
  }
});

// Get emergency instructions
router.get('/instructions/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const instructions = getEmergencyInstructions(type);

    res.json({
      success: true,
      instructions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get emergency instructions',
      error: error.message
    });
  }
});

// Get emergency history
router.get('/history', auth, async (req, res) => {
  try {
    const emergencyRecords = await MedicalRecord.find({
      userId: req.userId,
      type: 'emergency'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      records: emergencyRecords
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get emergency history',
      error: error.message
    });
  }
});

// Emergency contact notification
router.post('/notify-contacts', auth, async (req, res) => {
  try {
    const { emergencyType, location, message } = req.body;
    
    // Here you would integrate with SMS/Email service
    // For now, we'll just log the notification
    console.log('Emergency contact notification:', {
      userId: req.userId,
      type: emergencyType,
      location,
      message
    });

    res.json({
      success: true,
      message: 'Emergency contacts notified'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to notify emergency contacts',
      error: error.message
    });
  }
});

// Helper function to get emergency instructions
function getEmergencyInstructions(emergencyType) {
  const instructions = {
    heart_attack: [
      'Call emergency services (108) immediately',
      'Help the person sit down and stay calm',
      'Loosen tight clothing around neck and chest',
      'If person is conscious and not allergic, give aspirin to chew',
      'Monitor breathing and be ready to perform CPR',
      'Do not leave the person alone'
    ],
    choking: [
      'Ask "Are you choking?" If they cannot speak, act immediately',
      'Give 5 sharp back blows between shoulder blades',
      'Give 5 abdominal thrusts (Heimlich maneuver)',
      'Continue alternating back blows and abdominal thrusts',
      'Call 108 if object does not dislodge after 3 cycles',
      'Be ready to perform CPR if person becomes unconscious'
    ],
    seizure: [
      'Stay calm and time the seizure',
      'Clear the area of dangerous objects',
      'Do NOT restrain the person or put anything in their mouth',
      'Gently turn person to their side to prevent choking',
      'Place something soft under their head',
      'Call 108 if seizure lasts more than 5 minutes'
    ],
    severe_bleeding: [
      'Call 108 immediately for severe bleeding',
      'Apply direct pressure to the wound with clean cloth',
      'Elevate the injured area above heart level if possible',
      'Do not remove objects embedded in the wound',
      'Add more bandages if blood soaks through',
      'Treat for shock - keep person warm and lying down'
    ],
    burns: [
      'Remove person from heat source immediately',
      'Cool the burn with running water for 10-20 minutes',
      'Remove jewelry before swelling starts',
      'Do not break blisters or apply ice',
      'Cover with sterile gauze loosely',
      'Call 108 for large burns or burns on face/hands/feet'
    ],
    poisoning: [
      'Call 108 or Poison Control immediately',
      'Do NOT induce vomiting unless told by poison control',
      'If poison is on skin or clothes, remove contaminated clothing',
      'If poison is in eyes, flush with water for 15 minutes',
      'Keep the poison container for identification',
      'Monitor breathing and be ready to perform CPR'
    ]
  };

  return instructions[emergencyType] || [
    'Call emergency services (108) immediately',
    'Stay calm and follow dispatcher instructions',
    'Provide first aid if trained to do so',
    'Do not move the person unless in immediate danger'
  ];
}

module.exports = router;