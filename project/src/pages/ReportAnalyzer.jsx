import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  Image, 
  Eye, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Activity,
  Heart,
  Thermometer,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const ReportAnalyzer = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { addMedicalRecord } = useUser();

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      uploadTime: new Date().toISOString()
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const analyzeReport = async (file) => {
    setIsAnalyzing(true);
    setSelectedFile(file);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockAnalysis = generateMockAnalysis(file);
      setAnalysisResults(mockAnalysis);
      
      // Save to medical history
      addMedicalRecord({
        type: 'report_analysis',
        fileName: file.name,
        analysis: mockAnalysis,
        timestamp: new Date().toISOString()
      });

      toast.success('Report analysis completed successfully');
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockAnalysis = (file) => {
    const reportTypes = {
      blood: {
        type: 'Blood Test Report',
        findings: [
          { parameter: 'Hemoglobin', value: '11.2 g/dL', normal: '12-15 g/dL', status: 'low', concern: 'Mild anemia detected' },
          { parameter: 'WBC Count', value: '12,500/μL', normal: '4,000-11,000/μL', status: 'high', concern: 'Possible infection' },
          { parameter: 'Platelet Count', value: '250,000/μL', normal: '150,000-450,000/μL', status: 'normal', concern: null },
          { parameter: 'Blood Sugar', value: '140 mg/dL', normal: '70-100 mg/dL', status: 'high', concern: 'Pre-diabetic range' }
        ],
        diagnosis: 'Mild anemia with possible infection. Blood sugar levels elevated.',
        recommendations: [
          'Consult hematologist for anemia treatment',
          'Take iron supplements as prescribed',
          'Monitor blood sugar levels regularly',
          'Follow up in 2 weeks'
        ],
        urgency: 'moderate'
      },
      xray: {
        type: 'X-Ray Report',
        findings: [
          { parameter: 'Lung Fields', value: 'Clear', normal: 'Clear', status: 'normal', concern: null },
          { parameter: 'Heart Size', value: 'Normal', normal: 'Normal', status: 'normal', concern: null },
          { parameter: 'Bone Structure', value: 'Intact', normal: 'Intact', status: 'normal', concern: null }
        ],
        diagnosis: 'Normal chest X-ray with no acute findings.',
        recommendations: [
          'No immediate treatment required',
          'Continue regular health monitoring',
          'Maintain healthy lifestyle'
        ],
        urgency: 'low'
      }
    };

    // Determine report type based on filename
    const fileName = file.name.toLowerCase();
    if (fileName.includes('blood') || fileName.includes('cbc')) {
      return reportTypes.blood;
    } else if (fileName.includes('xray') || fileName.includes('chest')) {
      return reportTypes.xray;
    } else {
      return reportTypes.blood; // Default
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
      setAnalysisResults(null);
    }
  };

  const downloadAnalysis = () => {
    if (!analysisResults) return;
    
    const analysisText = `
Medical Report Analysis
======================

Report Type: ${analysisResults.type}
Analysis Date: ${new Date().toLocaleDateString()}

FINDINGS:
${analysisResults.findings.map(f => 
  `${f.parameter}: ${f.value} (Normal: ${f.normal}) - ${f.status.toUpperCase()}${f.concern ? ` - ${f.concern}` : ''}`
).join('\n')}

DIAGNOSIS:
${analysisResults.diagnosis}

RECOMMENDATIONS:
${analysisResults.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Urgency Level: ${analysisResults.urgency.toUpperCase()}
    `;

    const blob = new Blob([analysisText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${selectedFile.name}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Report Analyzer</h1>
          <p className="text-gray-600">
            Upload your medical reports and get instant AI-powered analysis and insights
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* File Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Medical Reports</h2>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600 font-medium">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop your medical reports here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p className="font-medium mb-2">Supported Report Types:</p>
                <ul className="space-y-1">
                  <li>• Blood Test Reports (CBC, LFT, KFT)</li>
                  <li>• X-Ray and Scan Images</li>
                  <li>• Urine Test Reports</li>
                  <li>• ECG Reports</li>
                  <li>• Pathology Reports</li>
                </ul>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {file.type.startsWith('image/') ? (
                          <Image className="w-6 h-6 text-blue-500" />
                        ) : (
                          <FileText className="w-6 h-6 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => analyzeReport(file)}
                          disabled={isAnalyzing}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                        >
                          {isAnalyzing && selectedFile?.id === file.id ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Analyzing...</span>
                            </div>
                          ) : (
                            'Analyze'
                          )}
                        </button>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {analysisResults ? (
              <>
                {/* Analysis Summary */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
                    <button
                      onClick={downloadAnalysis}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-700">Report Type:</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{analysisResults.type}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Activity className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-700">Key Findings:</span>
                    </div>
                    <div className="space-y-3">
                      {analysisResults.findings.map((finding, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{finding.parameter}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              finding.status === 'normal' ? 'bg-green-100 text-green-800' :
                              finding.status === 'high' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {finding.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Value: <span className="font-medium">{finding.value}</span></p>
                            <p>Normal Range: <span className="font-medium">{finding.normal}</span></p>
                            {finding.concern && (
                              <p className="text-red-600 mt-1">⚠️ {finding.concern}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-gray-700">AI Diagnosis:</span>
                    </div>
                    <p className="text-gray-900 bg-blue-50 p-4 rounded-lg">{analysisResults.diagnosis}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-gray-700">Recommendations:</span>
                    </div>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`w-5 h-5 ${
                        analysisResults.urgency === 'high' ? 'text-red-500' :
                        analysisResults.urgency === 'moderate' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                      <span className="font-medium text-gray-700">Urgency Level:</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysisResults.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      analysisResults.urgency === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {analysisResults.urgency.toUpperCase()}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Yet</h3>
                <p className="text-gray-500">
                  Upload a medical report and click "Analyze" to see AI-powered insights
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            AI-Powered Report Analysis Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">OCR Technology</h4>
              <p className="text-gray-600 text-sm">
                Advanced OCR extracts text and values from scanned reports and images
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Analysis</h4>
              <p className="text-gray-600 text-sm">
                AI compares values with normal ranges and identifies potential issues
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Medical Insights</h4>
              <p className="text-gray-600 text-sm">
                Get professional-level interpretations and actionable recommendations
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportAnalyzer;