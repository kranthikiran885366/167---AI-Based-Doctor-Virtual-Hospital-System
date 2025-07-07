const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const MedicalRecord = require('../models/MedicalRecord');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/reports';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
});

// Upload and analyze report
router.post('/upload', auth, upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let extractedText = '';
    let analysisResult = {};

    // Extract text based on file type
    if (fileType === 'application/pdf') {
      // Extract text from PDF
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else if (fileType.startsWith('image/')) {
      // Process image and extract text using OCR
      const processedImagePath = await processImage(filePath);
      const ocrResult = await Tesseract.recognize(processedImagePath, 'eng');
      extractedText = ocrResult.data.text;
    }

    // Call AI service for report analysis
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/reports/analyze`, {
      text: extractedText,
      fileType: req.file.mimetype,
      fileName: req.file.originalname,
      userId: req.userId
    });

    analysisResult = aiResponse.data;

    // Save to medical records
    const medicalRecord = new MedicalRecord({
      userId: req.userId,
      type: 'report_analysis',
      images: [{
        type: filePath,
        description: req.file.originalname,
        analysisResult: JSON.stringify(analysisResult)
      }],
      labResults: analysisResult.labResults || [],
      aiAnalysis: {
        model: analysisResult.model || 'report-analyzer-v1',
        confidence: analysisResult.confidence || 0,
        recommendations: analysisResult.recommendations || [],
        riskFactors: analysisResult.riskFactors || [],
        followUpRequired: analysisResult.followUpRequired || false
      },
      diagnosis: {
        condition: analysisResult.diagnosis || 'Report Analysis',
        description: analysisResult.summary || 'Medical report analyzed',
        severity: analysisResult.severity || 'mild'
      }
    });

    await medicalRecord.save();

    res.json({
      success: true,
      message: 'Report uploaded and analyzed successfully',
      analysis: analysisResult,
      recordId: medicalRecord._id,
      extractedText: extractedText.substring(0, 500) // First 500 chars for preview
    });
  } catch (error) {
    console.error('Report upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Report analysis failed',
      error: error.message
    });
  }
});

// Process image for better OCR
async function processImage(imagePath) {
  try {
    const processedPath = imagePath.replace(/\.[^/.]+$/, '_processed.png');
    
    await sharp(imagePath)
      .resize(2000, null, { withoutEnlargement: true })
      .greyscale()
      .normalize()
      .sharpen()
      .png()
      .toFile(processedPath);
    
    return processedPath;
  } catch (error) {
    console.error('Image processing error:', error);
    return imagePath; // Return original if processing fails
  }
}

// Get report analysis history
router.get('/history', auth, async (req, res) => {
  try {
    const records = await MedicalRecord.find({
      userId: req.userId,
      type: 'report_analysis'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get report history',
      error: error.message
    });
  }
});

// Get specific report analysis
router.get('/:recordId', auth, async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({
      _id: req.params.recordId,
      userId: req.userId,
      type: 'report_analysis'
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get report',
      error: error.message
    });
  }
});

// Delete report
router.delete('/:recordId', auth, async (req, res) => {
  try {
    const record = await MedicalRecord.findOneAndDelete({
      _id: req.params.recordId,
      userId: req.userId,
      type: 'report_analysis'
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Delete associated files
    if (record.images && record.images.length > 0) {
      record.images.forEach(image => {
        if (fs.existsSync(image.type)) {
          fs.unlinkSync(image.type);
        }
      });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
});

module.exports = router;