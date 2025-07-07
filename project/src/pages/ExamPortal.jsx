import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Mic, 
  MicOff, 
  AlertTriangle, 
  Clock, 
  User,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';

const ExamPortal = () => {
  const [examState, setExamState] = useState('verification'); // verification, instructions, exam, completed
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [violations, setViolations] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true);
  const [examData, setExamData] = useState({
    examName: 'Medical Entrance Exam',
    studentName: 'John Doe',
    studentId: 'MED2024001',
    duration: 60,
    questions: 100
  });

  useEffect(() => {
    let interval;
    if (examState === 'exam' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setExamState('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examState, timeRemaining]);

  useEffect(() => {
    // Simulate AI monitoring
    if (examState === 'exam') {
      const monitoringInterval = setInterval(() => {
        // Random violation simulation
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
          const violationTypes = [
            'Face not detected',
            'Multiple faces detected',
            'Looking away from screen',
            'Suspicious object detected'
          ];
          const violation = {
            id: Date.now(),
            type: violationTypes[Math.floor(Math.random() * violationTypes.length)],
            timestamp: new Date().toISOString(),
            severity: Math.random() > 0.7 ? 'high' : 'medium'
          };
          
          setViolations(prev => [...prev, violation]);
          
          if (violation.severity === 'high') {
            toast.error(`Warning: ${violation.type}`);
          } else {
            toast.warning(`Alert: ${violation.type}`);
          }
        }
      }, 5000);

      return () => clearInterval(monitoringInterval);
    }
  }, [examState]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    setExamState('exam');
    setIsRecording(true);
    toast.success('Exam started. AI monitoring is now active.');
  };

  const submitExam = () => {
    setExamState('completed');
    setIsRecording(false);
    toast.success('Exam submitted successfully.');
  };

  if (examState === 'verification') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h1>
            <p className="text-gray-600">Please verify your identity to proceed</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <User className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900">Student Information</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{examData.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">{examData.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exam:</span>
                  <span className="font-medium">{examData.examName}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Camera className="w-5 h-5 text-green-500" />
                <span className="font-medium text-gray-900">Camera Check</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="bg-black rounded-lg h-32 flex items-center justify-center">
                <span className="text-white text-sm">Camera feed would appear here</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">Face recognition verified</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">ID document validated</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-700">Environment check passed</span>
              </div>
            </div>

            <button
              onClick={() => setExamState('instructions')}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Proceed to Instructions
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (examState === 'instructions') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Instructions</h1>
            <p className="text-gray-600">Please read carefully before starting</p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">AI Monitoring Guidelines</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Keep your face visible to the camera at all times</li>
                <li>• Do not look away from the screen for extended periods</li>
                <li>• Ensure you are alone in the room</li>
                <li>• No mobile phones or external devices allowed</li>
                <li>• Do not switch tabs or applications</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">Exam Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-yellow-700">Duration:</span>
                  <span className="font-medium ml-2">{examData.duration} minutes</span>
                </div>
                <div>
                  <span className="text-yellow-700">Questions:</span>
                  <span className="font-medium ml-2">{examData.questions}</span>
                </div>
                <div>
                  <span className="text-yellow-700">Type:</span>
                  <span className="font-medium ml-2">Multiple Choice</span>
                </div>
                <div>
                  <span className="text-yellow-700">Passing Score:</span>
                  <span className="font-medium ml-2">70%</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Violation Consequences</h3>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• Minor violations: Warning messages</li>
                <li>• Major violations: Exam termination</li>
                <li>• All activities are recorded for review</li>
                <li>• Suspicious behavior will be flagged</li>
              </ul>
            </div>

            <div className="flex items-center space-x-4">
              <input type="checkbox" id="agree" className="w-4 h-4 text-blue-600" />
              <label htmlFor="agree" className="text-sm text-gray-700">
                I have read and agree to the exam guidelines and AI monitoring terms
              </label>
            </div>

            <button
              onClick={startExam}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Start Exam
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (examState === 'exam') {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">{examData.examName}</h1>
              <span className="text-sm text-gray-500">Question 1 of {examData.questions}</span>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* AI Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600">AI Monitoring</span>
              </div>

              {/* Timer */}
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-mono font-semibold text-gray-900">
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Camera Status */}
              <div className="flex items-center space-x-2">
                <Camera className={`w-5 h-5 ${faceDetected ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm ${faceDetected ? 'text-green-600' : 'text-red-600'}`}>
                  {faceDetected ? 'Face Detected' : 'Face Not Detected'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Main Exam Area */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Question 1</h2>
                <p className="text-gray-700 mb-6">
                  Which of the following is the most common cause of chest pain in young adults?
                </p>
                
                <div className="space-y-3">
                  {[
                    'Myocardial infarction',
                    'Costochondritis',
                    'Pulmonary embolism',
                    'Aortic dissection'
                  ].map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="question1" value={option} className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            {/* Camera Feed */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Live Camera</h3>
              <div className="bg-black rounded-lg h-32 flex items-center justify-center">
                <span className="text-white text-xs">Camera feed</span>
              </div>
            </div>

            {/* Violations */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">AI Alerts</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {violations.slice(-5).map((violation) => (
                  <div key={violation.id} className={`p-2 rounded text-xs ${
                    violation.severity === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <div className="font-medium">{violation.type}</div>
                    <div className="text-xs opacity-75">
                      {new Date(violation.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {violations.length === 0 && (
                  <div className="text-xs text-gray-500 text-center py-4">
                    No violations detected
                  </div>
                )}
              </div>
            </div>

            {/* Question Navigator */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }, (_, i) => (
                  <button
                    key={i}
                    className={`w-8 h-8 text-xs rounded ${
                      i === 0 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={submitExam}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (examState === 'completed') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Exam Completed</h1>
          <p className="text-gray-600 mb-6">
            Your exam has been submitted successfully. Results will be available shortly.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Session Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formatTime(3600 - timeRemaining)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Violations:</span>
                <span className="font-medium">{violations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AI Confidence:</span>
                <span className="font-medium">95%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default ExamPortal;