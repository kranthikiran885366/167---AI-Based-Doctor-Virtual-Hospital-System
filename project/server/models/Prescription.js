const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  },
  prescriptionNumber: {
    type: String,
    unique: true,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  medications: [{
    name: {
      type: String,
      required: true
    },
    genericName: String,
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    instructions: String,
    type: {
      type: String,
      enum: ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler'],
      default: 'tablet'
    },
    beforeFood: Boolean,
    sideEffects: [String],
    contraindications: [String]
  }],
  instructions: [String],
  followUp: {
    required: Boolean,
    date: Date,
    notes: String
  },
  doctorInfo: {
    name: String,
    id: String,
    signature: String
  },
  pharmacy: {
    name: String,
    address: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
  }
});

// Generate prescription number
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionNumber) {
    const count = await this.constructor.countDocuments();
    this.prescriptionNumber = `RX${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Prescription', prescriptionSchema);