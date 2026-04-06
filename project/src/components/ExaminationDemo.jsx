import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope,
  Camera,
  Brain,
  Monitor,
  Watch,
  Database,
  Activity,
  Heart,
  Thermometer,
  Eye,
  CheckCircle,
  AlertTriangle,
  X,
  Play,
  Pause
} from 'lucide-react';

const ExaminationDemo = ({ type, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [demoData, setDemoData] = useState(null);

  useEffect(() => {
    if (type) {
      setIsActive(true);
      generateDemoData(type);
    }
  }, [type]);

  const generateDemoData = (demoType) => {
    const demoConfigs = {
      history: {
        title: 'Medical History Collection',
        steps: [
          'Chief complaint: Chest pain for 2 hours',
          'Pain severity: 7/10, crushing sensation',
          'Associated symptoms: Shortness of breath, nausea',
          'Risk factors: Hypertension, family history of CAD',
          'Current medications: Lisinopril, Aspirin'
        ],
        progress: 0
      },
      ai: {
        title: 'AI Diagnostic Analysis',
        diagnosis: 'Acute Coronary Syndrome',
        confidence: 85,
        reasoning: 'Chest pain pattern with associated symptoms suggests cardiac evaluation needed',
        recommendations: [
          'Order ECG immediately',
          'Cardiac enzyme panel',
          'Chest X-ray',
          'Continuous cardiac monitoring'
        ]
      },
      devices: {
        title: 'Connected Device Readings',
        devices: [
          { name: 'Blood Pressure Monitor', reading: '145/92 mmHg', status: 'elevated', icon: Heart },
          { name: 'Pulse Oximeter', reading: '94% SpO2, 105 BPM', status: 'borderline', icon: Activity },
          { name: 'Digital Thermometer', reading: '98.6°F', status: 'normal', icon: Thermometer }
        ]
      },
      wearable: {
        title: 'Wearable Data Integration',
        data: {
          heartRate: 105,
          steps: 3420,
          calories: 1850,
          activeMinutes: 45,
          sleepHours: 6.5
        }
      },
      camera: {
        title: 'Visual Inspection Demo',
        inspectionType: 'Skin examination',
        findings: [
          'No visible lesions detected',
          'Normal skin texture and color',
          'No signs of inflammation'
        ]
      }
    };

    setDemoData(demoConfigs[demoType]);
  };

  const simulateProgress = () => {
    if (type === 'history' && demoData) {
      const interval = setInterval(() => {
        setDemoData(prev => {
          if (prev.progress >= prev.steps.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, progress: prev.progress + 1 };
        });
      }, 2000);
    }
  };

  useEffect(() => {
    if (demoData && type === 'history') {
      simulateProgress();
    }
  }, [demoData]);

  if (!isActive || !demoData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">{demoData.title}</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Medical History Demo */}
          {type === 'history' && (
            <div className="space-y-4">
              {demoData.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: index <= demoData.progress ? 1 : 0.3,
                    x: 0 
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    index <= demoData.progress ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  {index <= demoData.progress ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                  <span className={`${index <= demoData.progress ? 'text-green-800' : 'text-gray-600'}`}>
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>
          )}

          {/* AI Diagnosis Demo */}
          {type === 'ai' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{demoData.diagnosis}</h4>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <motion.div 
                      className="bg-blue-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${demoData.confidence}%` }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                  <span className="font-bold text-blue-600">{demoData.confidence}%</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-800 mb-2">Clinical Reasoning:</h5>
                <p className="text-blue-700">{demoData.reasoning}</p>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Recommended Actions:</h5>
                <div className="space-y-2">
                  {demoData.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.3 }}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{rec}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Device Demo */}
          {type === 'devices' && (
            <div className="space-y-4">
              {demoData.devices.map((device, index) => {
                const Icon = device.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.5 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{device.name}</h5>
                        <p className="text-sm text-gray-600">{device.reading}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      device.status === 'normal' ? 'bg-green-100 text-green-800' :
                      device.status === 'elevated' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {device.status}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Wearable Demo */}
          {type === 'wearable' && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(demoData.data).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl"
                >
                  <h5 className="font-semibold capitalize mb-2">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </h5>
                  <p className="text-2xl font-bold">
                    {value}
                    {key === 'heartRate' && ' BPM'}
                    {key === 'sleepHours' && ' hrs'}
                    {key === 'steps' && ' steps'}
                    {key === 'calories' && ' kcal'}
                    {key === 'activeMinutes' && ' min'}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Camera Demo */}
          {type === 'camera' && (
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">{demoData.inspectionType}</p>
                  <p className="text-gray-300">Live camera feed simulation</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-3">Analysis Results:</h5>
                <div className="space-y-2">
                  {demoData.findings.map((finding, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close Demo
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExaminationDemo;
