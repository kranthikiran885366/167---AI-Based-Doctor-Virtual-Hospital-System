const express = require('express');
const MedicalRecord = require('../models/MedicalRecord');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Get recent medical records
    const recentRecords = await MedicalRecord.find({
      userId: req.userId
    }).sort({ createdAt: -1 }).limit(5);
    
    // Get recent prescriptions
    const recentPrescriptions = await Prescription.find({
      userId: req.userId
    }).sort({ issuedAt: -1 }).limit(5);
    
    // Calculate health metrics
    const totalConsultations = await MedicalRecord.countDocuments({ userId: req.userId });
    const totalPrescriptions = await Prescription.countDocuments({ userId: req.userId });
    
    // Get health trends (simplified)
    const healthTrends = await generateHealthTrends(req.userId);
    
    res.json({
      success: true,
      data: {
        user,
        recentRecords,
        recentPrescriptions,
        metrics: {
          totalConsultations,
          totalPrescriptions,
          lastVisit: recentRecords[0]?.createdAt || null
        },
        healthTrends
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
});

// Get complete medical history
router.get('/medical-history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    
    const query = { userId: req.userId };
    if (type) {
      query.type = type;
    }
    
    const records = await MedicalRecord.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await MedicalRecord.countDocuments(query);
    
    res.json({
      success: true,
      records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get medical history',
      error: error.message
    });
  }
});

// Get health analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const { period = '6months' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 6);
    }
    
    // Get records in date range
    const records = await MedicalRecord.find({
      userId: req.userId,
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });
    
    // Generate analytics
    const analytics = {
      consultationTrends: generateConsultationTrends(records, period),
      symptomFrequency: generateSymptomFrequency(records),
      diagnosisDistribution: generateDiagnosisDistribution(records),
      healthScore: calculateHealthScore(records)
    };
    
    res.json({
      success: true,
      analytics,
      period,
      dateRange: { startDate, endDate }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message
    });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { language, notifications, theme } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          'preferences.language': language,
          'preferences.notifications': notifications,
          'preferences.theme': theme
        }
      },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
});

// Export medical data
router.get('/export', auth, async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const user = await User.findById(req.userId);
    const records = await MedicalRecord.find({ userId: req.userId }).sort({ createdAt: -1 });
    const prescriptions = await Prescription.find({ userId: req.userId }).sort({ issuedAt: -1 });
    
    const exportData = {
      user: {
        name: user.name,
        email: user.email,
        exportDate: new Date().toISOString()
      },
      medicalRecords: records,
      prescriptions: prescriptions
    };
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="medical-data-${Date.now()}.json"`);
      res.json(exportData);
    } else {
      // For other formats, you could implement CSV, PDF export
      res.status(400).json({
        success: false,
        message: 'Unsupported export format'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: error.message
    });
  }
});

// Delete user account and all data
router.delete('/account', auth, async (req, res) => {
  try {
    const { confirmPassword } = req.body;
    
    const user = await User.findById(req.userId);
    const isMatch = await user.comparePassword(confirmPassword);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password'
      });
    }
    
    // Delete all user data
    await MedicalRecord.deleteMany({ userId: req.userId });
    await Prescription.deleteMany({ userId: req.userId });
    await User.findByIdAndDelete(req.userId);
    
    res.json({
      success: true,
      message: 'Account and all data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
});

// Helper functions
async function generateHealthTrends(userId) {
  // This is a simplified version - in a real app you'd have more sophisticated analytics
  const records = await MedicalRecord.find({ userId }).sort({ createdAt: -1 }).limit(30);
  
  const trends = {
    consultationFrequency: records.length,
    commonSymptoms: [],
    healthScore: 85 // Placeholder
  };
  
  return trends;
}

function generateConsultationTrends(records, period) {
  // Group records by time period
  const trends = {};
  
  records.forEach(record => {
    const date = new Date(record.createdAt);
    const key = period === '1month' ? 
      `${date.getDate()}/${date.getMonth() + 1}` :
      `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    trends[key] = (trends[key] || 0) + 1;
  });
  
  return trends;
}

function generateSymptomFrequency(records) {
  const symptoms = {};
  
  records.forEach(record => {
    if (record.symptoms) {
      record.symptoms.forEach(symptom => {
        symptoms[symptom.name] = (symptoms[symptom.name] || 0) + 1;
      });
    }
  });
  
  return Object.entries(symptoms)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
}

function generateDiagnosisDistribution(records) {
  const diagnoses = {};
  
  records.forEach(record => {
    if (record.diagnosis && record.diagnosis.condition) {
      const condition = record.diagnosis.condition;
      diagnoses[condition] = (diagnoses[condition] || 0) + 1;
    }
  });
  
  return Object.entries(diagnoses)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([condition, count]) => ({ condition, count }));
}

function calculateHealthScore(records) {
  // Simplified health score calculation
  let score = 100;
  
  const recentRecords = records.slice(0, 10);
  const criticalCount = recentRecords.filter(r => 
    r.diagnosis && r.diagnosis.severity === 'critical'
  ).length;
  
  score -= criticalCount * 10;
  score = Math.max(score, 0);
  
  return score;
}

module.exports = router;