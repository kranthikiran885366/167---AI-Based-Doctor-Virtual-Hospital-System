const express = require('express');
const axios = require('axios');
const Prescription = require('../models/Prescription');
const MedicalRecord = require('../models/MedicalRecord');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate prescription
router.post('/generate', auth, async (req, res) => {
  try {
    const { 
      symptoms, 
      diagnosis, 
      allergies, 
      currentMedications, 
      medicalHistory,
      age,
      weight 
    } = req.body;

    // Call AI service for prescription generation
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/prescription/generate`, {
      symptoms,
      diagnosis,
      allergies: allergies || [],
      currentMedications: currentMedications || [],
      medicalHistory: medicalHistory || '',
      age: age || 30,
      weight: weight || 70,
      userId: req.userId
    });

    const prescriptionData = aiResponse.data;

    // Create prescription record
    const prescription = new Prescription({
      userId: req.userId,
      diagnosis: diagnosis || prescriptionData.diagnosis,
      medications: prescriptionData.medications,
      instructions: prescriptionData.instructions,
      followUp: prescriptionData.followUp,
      doctorInfo: {
        name: 'Dr. AI Assistant',
        id: 'AI001',
        signature: 'AI Generated Prescription'
      }
    });

    await prescription.save();

    // Also save to medical records
    const medicalRecord = new MedicalRecord({
      userId: req.userId,
      type: 'prescription',
      diagnosis: {
        condition: diagnosis || prescriptionData.diagnosis,
        description: `Prescription generated for ${diagnosis || prescriptionData.diagnosis}`
      },
      aiAnalysis: {
        model: 'prescription-generator-v1',
        recommendations: prescriptionData.instructions,
        followUpRequired: prescriptionData.followUp?.required || false
      }
    });

    await medicalRecord.save();

    res.json({
      success: true,
      message: 'Prescription generated successfully',
      prescription,
      recordId: medicalRecord._id
    });
  } catch (error) {
    console.error('Prescription generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Prescription generation failed',
      error: error.message
    });
  }
});

// Get prescription history
router.get('/history', auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      userId: req.userId
    }).sort({ issuedAt: -1 });

    res.json({
      success: true,
      prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get prescription history',
      error: error.message
    });
  }
});

// Get specific prescription
router.get('/:prescriptionId', auth, async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.prescriptionId,
      userId: req.userId
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.json({
      success: true,
      prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get prescription',
      error: error.message
    });
  }
});

// Update prescription status
router.put('/:prescriptionId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.prescriptionId, userId: req.userId },
      { status },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.json({
      success: true,
      message: 'Prescription status updated',
      prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update prescription status',
      error: error.message
    });
  }
});

// Get medication interactions
router.post('/interactions', auth, async (req, res) => {
  try {
    const { medications } = req.body;

    const response = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/prescription/interactions`, {
      medications
    });

    res.json({
      success: true,
      interactions: response.data.interactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check medication interactions',
      error: error.message
    });
  }
});

module.exports = router;