const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['diagnosis', 'report_analysis', 'prescription', 'emergency', 'consultation'],
    required: true
  },
  symptoms: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    duration: String,
    description: String
  }],
  diagnosis: {
    condition: String,
    confidence: Number,
    icd10Code: String,
    description: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'critical']
    }
  },
  vitals: {
    temperature: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    weight: Number,
    height: Number
  },
  labResults: [{
    testName: String,
    value: String,
    unit: String,
    normalRange: String,
    status: {
      type: String,
      enum: ['normal', 'high', 'low', 'critical']
    },
    notes: String
  }],
  images: [{
    type: String,
    description: String,
    analysisResult: String
  }],
  aiAnalysis: {
    model: String,
    confidence: Number,
    recommendations: [String],
    riskFactors: [String],
    followUpRequired: Boolean
  },
  doctorNotes: String,
  status: {
    type: String,
    enum: ['active', 'resolved', 'follow_up_required'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

medicalRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);