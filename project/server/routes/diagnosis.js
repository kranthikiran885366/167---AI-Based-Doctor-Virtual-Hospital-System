const express = require('express');
const axios = require('axios');
const MedicalRecord = require('../models/MedicalRecord');
const auth = require('../middleware/auth');

const router = express.Router();

// AI Diagnosis endpoint
router.post('/analyze', auth, async (req, res) => {
  try {
    const { symptoms, severity, duration, additionalInfo } = req.body;

    // Call Python AI service for diagnosis
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/diagnosis/predict`, {
      symptoms,
      severity,
      duration,
      additionalInfo,
      userId: req.userId
    });

    const diagnosis = aiResponse.data;

    // Save to medical records
    const medicalRecord = new MedicalRecord({
      userId: req.userId,
      type: 'diagnosis',
      symptoms: symptoms.map(symptom => ({
        name: symptom,
        severity: severity || 'moderate',
        duration: duration || 'recent'
      })),
      diagnosis: {
        condition: diagnosis.condition,
        confidence: diagnosis.confidence,
        description: diagnosis.description,
        severity: diagnosis.severity
      },
      aiAnalysis: {
        model: diagnosis.model,
        confidence: diagnosis.confidence,
        recommendations: diagnosis.recommendations,
        riskFactors: diagnosis.riskFactors,
        followUpRequired: diagnosis.followUpRequired
      }
    });

    await medicalRecord.save();

    res.json({
      success: true,
      diagnosis,
      recordId: medicalRecord._id
    });
  } catch (error) {
    console.error('Diagnosis error:', error);
    res.status(500).json({
      success: false,
      message: 'Diagnosis failed',
      error: error.message
    });
  }
});

// Get symptom suggestions
router.get('/symptoms/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    
    // Call AI service for symptom suggestions
    const response = await axios.get(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/symptoms/suggest`, {
      params: { query }
    });

    res.json({
      success: true,
      suggestions: response.data.suggestions
    });
  } catch (error) {
    console.error('Symptom suggestion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get symptom suggestions',
      error: error.message
    });
  }
});

// Get diagnosis history
router.get('/history', auth, async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      userId: req.userId,
      type: 'diagnosis'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get diagnosis history',
      error: error.message
    });
  }
});

// Voice-to-text diagnosis
router.post('/voice-analyze', auth, async (req, res) => {
  try {
    const { audioData, language } = req.body;

    // Call AI service for speech-to-text and diagnosis
    const response = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/diagnosis/voice`, {
      audioData,
      language: language || 'en',
      userId: req.userId
    });

    res.json({
      success: true,
      transcription: response.data.transcription,
      diagnosis: response.data.diagnosis
    });
  } catch (error) {
    console.error('Voice diagnosis error:', error);
    res.status(500).json({
      success: false,
      message: 'Voice diagnosis failed',
      error: error.message
    });
  }
});

module.exports = router;