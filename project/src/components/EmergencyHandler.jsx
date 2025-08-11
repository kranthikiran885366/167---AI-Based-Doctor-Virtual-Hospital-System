import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Phone, 
  Video, 
  MapPin, 
  Clock, 
  Heart,
  Activity,
  Thermometer,
  Brain,
  Pill,
  User,
  Send,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  Navigation,
  Truck,
  Plus,
  Minus,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Zap,
  Shield,
  Users,
  MessageSquare,
  PhoneCall,
  Star,
  CheckCircle,
  X,
  Info,
  AlertCircle,
  Eye,
  Scissors,
  Bandages,
  Siren,
  Map
} from 'lucide-react';
import { toast } from 'react-toastify';

const EmergencyHandler = ({ emergency, onClose, onResolve }) => {
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [patientResponsive, setPatientResponsive] = useState(null);
  const [vitals, setVitals] = useState({
    consciousness: '',
    breathing: '',
    pulse: '',
    bleeding: ''
  });
  const [ambulanceStatus, setAmbulanceStatus] = useState('not_dispatched');
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [cprCount, setCprCount] = useState(0);
  const [cprActive, setCprActive] = useState(false);
  const [instructions, setInstructions] = useState([]);

  const emergencyTypes = {
    cardiac: {
      name: 'Cardiac Emergency',
      icon: Heart,
      color: 'text-red-600',
      steps: [
        'Check if patient is conscious',
        'Check for pulse',
        'Call for AED if available',
        'Begin CPR if no pulse',
        'Continue until help arrives'
      ],
      cprRequired: true
    },
    choking: {
      name: 'Choking',
      icon: AlertTriangle,
      color: 'text-orange-600',
      steps: [
        'Encourage coughing',
        'Perform back blows',
        'Perform abdominal thrusts',
        'Alternate back blows and thrusts',
        'Call ambulance if unconscious'
      ],
      cprRequired: false
    },
    seizure: {
      name: 'Seizure',
      icon: Brain,
      color: 'text-purple-600',
      steps: [
        'Clear area around patient',
        'Protect head from injury',
        'Time the seizure',
        'Do NOT restrain patient',
        'Recovery position after seizure'
      ],
      cprRequired: false
    },
    bleeding: {
      name: 'Severe Bleeding',
      icon: Bandages,
      color: 'text-red-700',
      steps: [
        'Apply direct pressure',
        'Elevate injured area',
        'Use clean cloth/bandage',
        'Apply pressure bandage',
        'Monitor for shock'
      ],
      cprRequired: false
    },
    breathing: {
      name: 'Breathing Emergency',
      icon: Activity,
      color: 'text-blue-600',
      steps: [
        'Check airway for obstructions',
        'Position patient upright',
        'Loosen tight clothing',
        'Provide rescue breathing if needed',
        'Monitor oxygen levels'
      ],
      cprRequired: false
    }
  };

  const hospitals = [
    { id: 1, name: 'City General Hospital', distance: '2.3 km', time: '8 min', specialty: 'Emergency & Trauma', phone: '+1-555-0101' },
    { id: 2, name: 'St. Mary Medical Center', distance: '3.1 km', time: '12 min', specialty: 'Cardiac Care', phone: '+1-555-0102' },
    { id: 3, name: 'Regional Medical Center', distance: '4.5 km', time: '15 min', specialty: 'Neurology', phone: '+1-555-0103' }
  ];

  // Timer for call duration
  useEffect(() => {
    let interval;
    if (connectionStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectionStatus]);

  // CPR Timer
  useEffect(() => {
    let interval;
    if (cprActive) {
      interval = setInterval(() => {
        setCprCount(prev => prev + 1);
      }, 600); // 100 compressions per minute
    }
    return () => clearInterval(interval);
  }, [cprActive]);

  // Auto-connect simulation
  useEffect(() => {
    if (connectionStatus === 'connecting') {
      setTimeout(() => {
        setConnectionStatus('connected');
        toast.success('Emergency call connected');
      }, 3000);
    }
  }, [connectionStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const emergencyType = emergencyTypes[emergency?.type] || emergencyTypes.cardiac;

  const dispatchAmbulance = () => {
    setAmbulanceStatus('dispatched');
    toast.success('Ambulance dispatched to your location');
    
    // Simulate ambulance arrival
    setTimeout(() => {
      setAmbulanceStatus('en_route');
      toast.info('Ambulance is en route - ETA 8 minutes');
    }, 2000);
  };

  const contactHospital = (hospital) => {
    setSelectedHospital(hospital);
    toast.success(`Contacting ${hospital.name}...`);
    
    setTimeout(() => {
      toast.success(`${hospital.name} notified - preparing for arrival`);
    }, 2000);
  };

  const startCPR = () => {
    setCprActive(true);
    setCprCount(0);
    toast.info('CPR started - Follow the rhythm');
  };

  const stopCPR = () => {
    setCprActive(false);
    toast.info(`CPR stopped - ${cprCount} compressions completed`);
  };

  const nextStep = () => {
    if (currentStep < emergencyType.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setInstructions(prev => [...prev, {
        step: currentStep + 1,
        instruction: emergencyType.steps[currentStep + 1],
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endEmergency = (resolved = true) => {
    const resolution = {
      resolved,
      duration: callDuration,
      ambulanceDispatched: ambulanceStatus !== 'not_dispatched',
      hospital: selectedHospital,
      cprPerformed: cprCount > 0,
      steps: instructions,
      timestamp: new Date().toISOString()
    };
    
    onResolve && onResolve(resolution);
    toast.success(resolved ? 'Emergency resolved successfully' : 'Emergency call ended');
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
      >
        {/* Emergency Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <emergencyType.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">EMERGENCY: {emergencyType.name}</h2>
                <p className="text-red-100">
                  Patient: {emergency?.patient?.name} | Location: {emergency?.location} | 
                  Status: {connectionStatus} {connectionStatus === 'connected' && `(${formatTime(callDuration)})`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-red-500/30 px-3 py-1 rounded-full">
                <Siren className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">ACTIVE</span>
              </div>
              
              {ambulanceStatus !== 'not_dispatched' && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  ambulanceStatus === 'dispatched' ? 'bg-yellow-500/30' :
                  ambulanceStatus === 'en_route' ? 'bg-green-500/30' : 'bg-blue-500/30'
                }`}>
                  <Truck className="w-4 h-4" />
                  <span className="text-xs">{ambulanceStatus.replace('_', ' ').toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex h-[calc(95vh-200px)]">
          {/* Video Call Area */}
          <div className="w-2/3 border-r border-gray-200 p-6">
            <div className="h-full flex flex-col space-y-4">
              {/* Main Video */}
              <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden relative">
                {connectionStatus === 'connected' ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-75" />
                      <p className="text-lg font-medium">{emergency?.patient?.name}</p>
                      <p className="text-gray-300">Emergency video call active</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin mb-4">
                        <Phone className="w-16 h-16 mx-auto" />
                      </div>
                      <p className="text-lg font-medium">Connecting to emergency patient...</p>
                    </div>
                  </div>
                )}
                
                {/* Emergency Overlay */}
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  EMERGENCY CALL
                </div>
                
                {/* Doctor's view */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-red-500 overflow-hidden">
                  <div className="flex items-center justify-center h-full text-white text-xs">
                    Dr. View
                  </div>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center space-x-4 bg-gray-100 p-4 rounded-2xl">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-colors ${
                    isMuted ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`p-3 rounded-full transition-colors ${
                    !cameraEnabled ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cameraEnabled ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                </button>
                
                <button className="p-3 rounded-full bg-white text-gray-700 hover:bg-gray-200 transition-colors">
                  <Volume2 className="w-5 h-5" />
                </button>
                
                <button className="p-3 rounded-full bg-white text-gray-700 hover:bg-gray-200 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => endEmergency(false)}
                  className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <PhoneCall className="w-5 h-5" />
                </button>
              </div>

              {/* Emergency Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={dispatchAmbulance}
                  disabled={ambulanceStatus !== 'not_dispatched'}
                  className="bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  <Truck className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {ambulanceStatus === 'not_dispatched' ? 'Dispatch Ambulance' : 'Ambulance Dispatched'}
                  </span>
                </button>
                
                <button className="bg-blue-500 text-white p-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium">Share Location</span>
                </button>
                
                <button className="bg-green-500 text-white p-4 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm font-medium">Conference Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Instructions & Tools */}
          <div className="w-1/3 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Current Step */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <h3 className="font-bold text-red-800 mb-2">
                  Step {currentStep + 1} of {emergencyType.steps.length}
                </h3>
                <p className="text-red-700 text-lg font-medium mb-4">
                  {emergencyType.steps[currentStep]}
                </p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="bg-gray-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={currentStep === emergencyType.steps.length - 1}
                    className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    Next Step
                  </button>
                </div>
              </div>

              {/* CPR Monitor */}
              {emergencyType.cprRequired && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    CPR Monitor
                  </h4>
                  
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-yellow-800">{cprCount}</div>
                    <div className="text-sm text-yellow-600">Compressions</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!cprActive ? (
                      <button
                        onClick={startCPR}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Start CPR
                      </button>
                    ) : (
                      <button
                        onClick={stopCPR}
                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Stop CPR
                      </button>
                    )}
                    <button
                      onClick={() => setCprCount(0)}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                  
                  {cprActive && (
                    <div className="mt-3 text-center">
                      <div className="text-sm text-yellow-700 animate-pulse">
                        Push hard and fast - 100-120 per minute
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Vitals Assessment */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Patient Assessment</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Consciousness</label>
                    <select
                      value={vitals.consciousness}
                      onChange={(e) => setVitals(prev => ({ ...prev, consciousness: e.target.value }))}
                      className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="conscious">Conscious & Alert</option>
                      <option value="confused">Conscious but Confused</option>
                      <option value="unconscious">Unconscious</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Breathing</label>
                    <select
                      value={vitals.breathing}
                      onChange={(e) => setVitals(prev => ({ ...prev, breathing: e.target.value }))}
                      className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="normal">Normal Breathing</option>
                      <option value="difficulty">Difficulty Breathing</option>
                      <option value="absent">No Breathing</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Pulse</label>
                    <select
                      value={vitals.pulse}
                      onChange={(e) => setVitals(prev => ({ ...prev, pulse: e.target.value }))}
                      className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select...</option>
                      <option value="strong">Strong Pulse</option>
                      <option value="weak">Weak Pulse</option>
                      <option value="absent">No Pulse</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Nearby Hospitals */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Nearby Hospitals
                </h4>
                
                <div className="space-y-2">
                  {hospitals.map(hospital => (
                    <div key={hospital.id} className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-green-800">{hospital.name}</h5>
                        <span className="text-sm text-green-600">{hospital.distance}</span>
                      </div>
                      <p className="text-sm text-green-700 mb-2">{hospital.specialty}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600">ETA: {hospital.time}</span>
                        <button
                          onClick={() => contactHospital(hospital)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Emergency Actions</h4>
                
                <button className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
                  <Info className="w-4 h-4" />
                  <span>Send Instructions to Caller</span>
                </button>
                
                <button className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Add Specialist to Call</span>
                </button>
                
                <button className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Text Updates</span>
                </button>
              </div>

              {/* Emergency Resolution */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Resolve Emergency</h4>
                
                <div className="space-y-2">
                  <button
                    onClick={() => endEmergency(true)}
                    className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Emergency Resolved</span>
                  </button>
                  
                  <button
                    onClick={() => endEmergency(false)}
                    className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>End Call</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Status Bar */}
        <div className="bg-gray-100 border-t border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Emergency ID: {emergency?.id || 'EMG-' + Date.now()}</span>
              <span className="text-gray-600">Duration: {formatTime(callDuration)}</span>
              <span className="text-gray-600">Type: {emergencyType.name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">All actions logged</span>
              <Shield className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencyHandler;
