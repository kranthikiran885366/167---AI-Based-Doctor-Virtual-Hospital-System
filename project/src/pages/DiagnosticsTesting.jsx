import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TestTube, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Circle, 
  Square, 
  ArrowRight, 
  Zap, 
  FileText, 
  Video, 
  Camera, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Share, 
  Users, 
  Bell, 
  Star, 
  Flag, 
  RefreshCw,
  Plus,
  Minus,
  Maximize,
  X,
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';

const DiagnosticsTesting = () => {
  const [activeTab, setActiveTab] = useState('order');
  const [selectedTests, setSelectedTests] = useState([]);
  const [priority, setPriority] = useState('normal');
  const [labResults, setLabResults] = useState([]);
  const [annotationMode, setAnnotationMode] = useState('none');
  const [annotations, setAnnotations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [videoUploads, setVideoUploads] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Lab test categories and options
  const testCategories = {
    'Blood Work': [
      { id: 'cbc', name: 'Complete Blood Count (CBC)', urgency: 'normal', cost: 45, turnaround: '2-4 hours' },
      { id: 'bmp', name: 'Basic Metabolic Panel', urgency: 'normal', cost: 35, turnaround: '2-4 hours' },
      { id: 'lipid', name: 'Lipid Panel', urgency: 'normal', cost: 55, turnaround: '4-6 hours' },
      { id: 'hba1c', name: 'Hemoglobin A1C', urgency: 'normal', cost: 40, turnaround: '4-8 hours' },
      { id: 'troponin', name: 'Troponin I (Cardiac)', urgency: 'urgent', cost: 65, turnaround: '30-60 minutes' },
      { id: 'bnp', name: 'B-type Natriuretic Peptide', urgency: 'urgent', cost: 75, turnaround: '1-2 hours' }
    ],
    'Microbiology': [
      { id: 'culture', name: 'Blood Culture', urgency: 'high', cost: 85, turnaround: '24-48 hours' },
      { id: 'urine', name: 'Urine Culture', urgency: 'normal', cost: 45, turnaround: '24-48 hours' },
      { id: 'strep', name: 'Strep Throat Rapid Test', urgency: 'normal', cost: 25, turnaround: '15-30 minutes' },
      { id: 'covid', name: 'COVID-19 PCR', urgency: 'high', cost: 95, turnaround: '2-4 hours' }
    ],
    'Imaging': [
      { id: 'xray', name: 'Chest X-Ray', urgency: 'normal', cost: 120, turnaround: '30-60 minutes' },
      { id: 'ct', name: 'CT Scan (Chest)', urgency: 'high', cost: 450, turnaround: '1-2 hours' },
      { id: 'mri', name: 'MRI Brain', urgency: 'normal', cost: 850, turnaround: '2-4 hours' },
      { id: 'echo', name: 'Echocardiogram', urgency: 'high', cost: 350, turnaround: '1-2 hours' }
    ],
    'Specialty': [
      { id: 'thyroid', name: 'Thyroid Function Panel', urgency: 'normal', cost: 65, turnaround: '4-8 hours' },
      { id: 'vitamin', name: 'Vitamin D Level', urgency: 'normal', cost: 45, turnaround: '4-8 hours' },
      { id: 'psa', name: 'Prostate Specific Antigen', urgency: 'normal', cost: 55, turnaround: '4-8 hours' },
      { id: 'pregnancy', name: 'Pregnancy Test (Quantitative)', urgency: 'high', cost: 35, turnaround: '2-4 hours' }
    ]
  };

  // AI prioritization logic
  const aiSuggestedTests = [
    { testId: 'troponin', reason: 'Patient presenting with chest pain', confidence: 0.92, urgency: 'urgent' },
    { testId: 'bnp', reason: 'Suspected heart failure based on symptoms', confidence: 0.87, urgency: 'urgent' },
    { testId: 'cbc', reason: 'Routine screening for infection', confidence: 0.75, urgency: 'normal' },
    { testId: 'covid', reason: 'Current respiratory symptoms', confidence: 0.68, urgency: 'high' }
  ];

  // Sample lab results with flags
  const sampleLabResults = [
    {
      id: 1,
      testName: 'Complete Blood Count',
      orderDate: '2024-01-15',
      resultDate: '2024-01-15',
      status: 'completed',
      flagged: true,
      flagReason: 'WBC count significantly elevated',
      results: {
        'WBC': { value: 15.2, unit: 'K/uL', range: '4.5-11.0', abnormal: true },
        'RBC': { value: 4.2, unit: 'M/uL', range: '4.2-5.4', abnormal: false },
        'Hemoglobin': { value: 12.1, unit: 'g/dL', range: '12.0-15.5', abnormal: false },
        'Platelets': { value: 280, unit: 'K/uL', range: '150-450', abnormal: false }
      }
    },
    {
      id: 2,
      testName: 'Basic Metabolic Panel',
      orderDate: '2024-01-14',
      resultDate: '2024-01-14',
      status: 'completed',
      flagged: false,
      results: {
        'Glucose': { value: 95, unit: 'mg/dL', range: '70-100', abnormal: false },
        'Sodium': { value: 140, unit: 'mEq/L', range: '136-145', abnormal: false },
        'Potassium': { value: 4.0, unit: 'mEq/L', range: '3.5-5.0', abnormal: false },
        'Creatinine': { value: 1.1, unit: 'mg/dL', range: '0.6-1.2', abnormal: false }
      }
    }
  ];

  const [currentLabResults, setCurrentLabResults] = useState(sampleLabResults);

  // Image annotation functions
  const handleCanvasClick = (e) => {
    if (annotationMode === 'none' || !selectedImage) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAnnotation = {
      id: Date.now(),
      type: annotationMode,
      x,
      y,
      color: '#ff0000',
      size: annotationMode === 'circle' ? 30 : 20
    };

    setAnnotations([...annotations, newAnnotation]);
  };

  const drawAnnotations = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    annotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      switch (annotation.type) {
        case 'circle':
          ctx.arc(annotation.x, annotation.y, annotation.size, 0, 2 * Math.PI);
          break;
        case 'square':
          ctx.rect(annotation.x - annotation.size/2, annotation.y - annotation.size/2, annotation.size, annotation.size);
          break;
        case 'arrow':
          ctx.moveTo(annotation.x, annotation.y);
          ctx.lineTo(annotation.x + annotation.size, annotation.y + annotation.size);
          break;
      }
      ctx.stroke();
    });
  };

  useEffect(() => {
    drawAnnotations();
  }, [annotations]);

  // Video recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks(chunks => [...chunks, event.data]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording');
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      toast.success('Recording stopped');
    }
  };

  const saveRecording = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    
    const newVideo = {
      id: Date.now(),
      name: `Symptom Recording ${new Date().toLocaleString()}`,
      url,
      uploadDate: new Date().toISOString(),
      type: 'recorded',
      size: blob.size
    };

    setVideoUploads([...videoUploads, newVideo]);
    setRecordedChunks([]);
    toast.success('Recording saved');
  };

  const handleTestSelection = (test) => {
    const isSelected = selectedTests.some(t => t.id === test.id);
    if (isSelected) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const submitTestOrder = () => {
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test');
      return;
    }

    const orderData = {
      tests: selectedTests,
      priority,
      orderDate: new Date().toISOString(),
      estimatedCost: selectedTests.reduce((sum, test) => sum + test.cost, 0)
    };

    toast.success(`Order submitted: ${selectedTests.length} tests ordered`);
    setSelectedTests([]);
  };

  const flagLabResult = (resultId, reason) => {
    setCurrentLabResults(results => 
      results.map(result => 
        result.id === resultId 
          ? { ...result, flagged: true, flagReason: reason }
          : result
      )
    );
    toast.success('Lab result flagged for review');
  };

  const requestRetest = (resultId) => {
    toast.success('Re-test requested and scheduled');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setAnnotations([]);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newVideo = {
        id: Date.now(),
        name: file.name,
        url,
        uploadDate: new Date().toISOString(),
        type: 'upload',
        size: file.size
      };
      setVideoUploads([...videoUploads, newVideo]);
      toast.success('Video uploaded successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Diagnostics & Testing Center
          </h1>
          <p className="text-gray-600">
            Order tests, analyze results, annotate images, and manage patient uploads
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8 bg-white rounded-xl shadow-lg p-2">
          {[
            { id: 'order', label: 'Order Tests', icon: TestTube },
            { id: 'results', label: 'Lab Results', icon: FileText },
            { id: 'imaging', label: 'Image Analysis', icon: Eye },
            { id: 'videos', label: 'Patient Videos', icon: Video }
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Order Tests Tab */}
        {activeTab === 'order' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* AI Suggested Tests */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2" />
                AI Suggested Tests
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {aiSuggestedTests.map((suggestion, index) => {
                  const test = Object.values(testCategories).flat().find(t => t.id === suggestion.testId);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{test?.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          suggestion.urgency === 'urgent' ? 'bg-red-500' :
                          suggestion.urgency === 'high' ? 'bg-orange-500' : 'bg-green-500'
                        }`}>
                          {suggestion.urgency}
                        </span>
                      </div>
                      <p className="text-sm opacity-90 mb-2">{suggestion.reason}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Confidence: {Math.round(suggestion.confidence * 100)}%</span>
                        <button
                          onClick={() => test && handleTestSelection(test)}
                          className="px-3 py-1 bg-white text-purple-500 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                          Add Test
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Test Categories */}
            <div className="grid lg:grid-cols-2 gap-6">
              {Object.entries(testCategories).map(([category, tests]) => (
                <div key={category} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{category}</h3>
                  <div className="space-y-3">
                    {tests.map(test => (
                      <motion.div
                        key={test.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedTests.some(t => t.id === test.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTestSelection(test)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{test.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs text-white ${
                            test.urgency === 'urgent' ? 'bg-red-500' :
                            test.urgency === 'high' ? 'bg-orange-500' : 'bg-green-500'
                          }`}>
                            {test.urgency}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>${test.cost}</span>
                          <span>{test.turnaround}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            {selectedTests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  {selectedTests.map(test => (
                    <div key={test.id} className="flex justify-between items-center py-2 border-b">
                      <span>{test.name}</span>
                      <div className="flex items-center space-x-4">
                        <span>${test.cost}</span>
                        <button
                          onClick={() => handleTestSelection(test)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-4 text-lg font-semibold">
                  <span>Total Cost:</span>
                  <span>${selectedTests.reduce((sum, test) => sum + test.cost, 0)}</span>
                </div>
                <div className="flex space-x-4">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <button
                    onClick={submitTestOrder}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Submit Order
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Lab Results Tab */}
        {activeTab === 'results' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {currentLabResults.map(result => (
              <div key={result.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{result.testName}</h3>
                    <p className="text-gray-600">Ordered: {result.orderDate} | Results: {result.resultDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.flagged && (
                      <span className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        <Flag className="w-4 h-4 mr-1" />
                        Flagged
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      result.status === 'completed' ? 'bg-green-100 text-green-800' :
                      result.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                </div>

                {result.flagged && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-medium">Flag Reason: {result.flagReason}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {Object.entries(result.results).map(([test, data]) => (
                    <div key={test} className={`p-4 rounded-lg border ${
                      data.abnormal ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <h4 className="font-medium text-gray-900">{test}</h4>
                      <p className={`text-lg font-semibold ${
                        data.abnormal ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {data.value} {data.unit}
                      </p>
                      <p className="text-sm text-gray-600">Range: {data.range}</p>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  {!result.flagged && (
                    <button
                      onClick={() => {
                        const reason = prompt('Enter flag reason:');
                        if (reason) flagLabResult(result.id, reason);
                      }}
                      className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Flag Result
                    </button>
                  )}
                  <button
                    onClick={() => requestRetest(result.id)}
                    className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Request Re-test
                  </button>
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Image Analysis Tab */}
        {activeTab === 'imaging' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Medical Image Annotation</h3>
              
              {/* Upload Image */}
              <div className="mb-6">
                <label className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <span className="text-gray-600">Upload medical image for annotation</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Annotation Tools */}
              {selectedImage && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Annotation Tools</h4>
                  <div className="flex space-x-3 mb-4">
                    <button
                      onClick={() => setAnnotationMode('circle')}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        annotationMode === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Circle className="w-4 h-4 mr-2" />
                      Circle
                    </button>
                    <button
                      onClick={() => setAnnotationMode('square')}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        annotationMode === 'square' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Square
                    </button>
                    <button
                      onClick={() => setAnnotationMode('arrow')}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        annotationMode === 'arrow' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Arrow
                    </button>
                    <button
                      onClick={() => {
                        setAnnotationMode('none');
                        setAnnotations([]);
                      }}
                      className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {/* Image Display with Canvas Overlay */}
              {selectedImage && (
                <div className="relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Medical scan"
                    className="max-w-full h-auto rounded-lg"
                    style={{ maxHeight: '500px' }}
                  />
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="absolute top-0 left-0 cursor-crosshair"
                    width="800"
                    height="500"
                    style={{
                      width: '100%',
                      height: '100%',
                      maxHeight: '500px'
                    }}
                  />
                </div>
              )}

              {/* Save Annotations */}
              {selectedImage && annotations.length > 0 && (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => toast.success('Annotations saved')}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Annotations
                  </button>
                  <button
                    onClick={() => toast.success('Image shared with team')}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share with Team
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Patient Videos Tab */}
        {activeTab === 'videos' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Video Recording */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Record Patient Symptoms</h3>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full rounded-lg bg-gray-100"
                    style={{ height: '300px' }}
                  />
                  <div className="flex space-x-3 mt-4">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Start Recording
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Stop Recording
                      </button>
                    )}
                    {recordedChunks.length > 0 && (
                      <button
                        onClick={saveRecording}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Recording
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Upload Existing Video</h4>
                  <label className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors">
                    <Video className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <span className="text-gray-600">Upload symptom video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Video Library */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Patient Video Library</h3>
              
              {videoUploads.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No videos uploaded yet</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videoUploads.map(video => (
                    <div key={video.id} className="border rounded-lg p-4">
                      <video
                        src={video.url}
                        className="w-full h-32 object-cover rounded mb-3"
                        controls
                      />
                      <h4 className="font-medium text-gray-900 truncate">{video.name}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(video.uploadDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Size: {(video.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      <div className="flex space-x-2 mt-3">
                        <button className="flex-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
                          Analyze
                        </button>
                        <button className="flex-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticsTesting;
