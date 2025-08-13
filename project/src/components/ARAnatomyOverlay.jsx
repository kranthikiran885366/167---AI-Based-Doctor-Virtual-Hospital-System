import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCw, 
  Move3D, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  EyeOff, 
  Layers, 
  Info, 
  Search,
  Heart,
  Brain,
  Stethoscope,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Settings,
  Download,
  Share
} from 'lucide-react';
import { toast } from 'react-toastify';

const ARAnatomyOverlay = ({ onClose, patientData, consultationMode = 'education' }) => {
  const [selectedOrgan, setSelectedOrgan] = useState('heart');
  const [viewMode, setViewMode] = useState('3d'); // 3d, xray, layers
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(80);
  const [activeLayers, setActiveLayers] = useState({
    skin: true,
    muscles: true,
    bones: true,
    organs: true,
    vessels: true,
    nerves: false
  });
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const canvasRef = useRef(null);
  const annotationRef = useRef(null);

  // Anatomical systems and organs
  const anatomySystems = {
    cardiovascular: {
      name: 'Cardiovascular System',
      icon: Heart,
      color: '#ef4444',
      organs: ['heart', 'arteries', 'veins', 'capillaries'],
      description: 'Circulatory system including heart and blood vessels'
    },
    nervous: {
      name: 'Nervous System', 
      icon: Brain,
      color: '#8b5cf6',
      organs: ['brain', 'spinal_cord', 'nerves', 'neurons'],
      description: 'Central and peripheral nervous systems'
    },
    respiratory: {
      name: 'Respiratory System',
      icon: Stethoscope,
      color: '#06b6d4',
      organs: ['lungs', 'trachea', 'bronchi', 'alveoli'],
      description: 'Breathing and gas exchange system'
    },
    digestive: {
      name: 'Digestive System',
      icon: User,
      color: '#f59e0b',
      organs: ['stomach', 'liver', 'intestines', 'pancreas'],
      description: 'Food processing and nutrient absorption'
    },
    musculoskeletal: {
      name: 'Musculoskeletal System',
      icon: User,
      color: '#10b981',
      organs: ['bones', 'muscles', 'joints', 'cartilage'],
      description: 'Structure, support, and movement'
    }
  };

  // Organ-specific information
  const organDetails = {
    heart: {
      name: 'Heart',
      description: 'Four-chambered muscular organ that pumps blood throughout the body',
      chambers: ['Right Atrium', 'Right Ventricle', 'Left Atrium', 'Left Ventricle'],
      functions: ['Pump oxygenated blood', 'Receive deoxygenated blood', 'Maintain circulation'],
      commonIssues: ['Arrhythmia', 'Heart Attack', 'Heart Failure', 'Valve Disease'],
      anatomy3D: '/models/heart.glb', // Would be actual 3D model files
      xrayView: '/images/heart-xray.png',
      normalValues: {
        heartRate: '60-100 bpm',
        bloodPressure: '120/80 mmHg',
        ejectionFraction: '55-70%'
      }
    },
    lungs: {
      name: 'Lungs',
      description: 'Pair of respiratory organs that facilitate gas exchange',
      parts: ['Lobes', 'Bronchi', 'Alveoli', 'Pleura'],
      functions: ['Oxygen intake', 'Carbon dioxide removal', 'pH regulation'],
      commonIssues: ['Asthma', 'Pneumonia', 'COPD', 'Lung Cancer'],
      normalValues: {
        respiratoryRate: '12-20 breaths/min',
        oxygenSaturation: '95-100%',
        lungCapacity: '4000-6000 mL'
      }
    },
    brain: {
      name: 'Brain',
      description: 'Central control organ of the nervous system',
      regions: ['Cerebrum', 'Cerebellum', 'Brainstem', 'Limbic System'],
      functions: ['Thought processing', 'Motor control', 'Sensory processing', 'Memory'],
      commonIssues: ['Stroke', 'Alzheimer\'s', 'Migraine', 'Epilepsy'],
      normalValues: {
        intracranialPressure: '5-15 mmHg',
        bloodFlow: '50 mL/100g/min',
        glucoseConsumption: '20% of total'
      }
    }
  };

  // Educational content for different conditions
  const educationalContent = {
    'chest-pain': {
      title: 'Understanding Chest Pain',
      organs: ['heart', 'lungs'],
      explanation: 'Chest pain can originate from the heart, lungs, or other structures. Let me show you the anatomy involved.',
      keyPoints: [
        'Heart-related pain often feels like pressure or squeezing',
        'Lung-related pain may worsen with breathing',
        'Location and radiation patterns help diagnosis'
      ]
    },
    'shortness-of-breath': {
      title: 'Breathing Difficulties',
      organs: ['lungs', 'heart'],
      explanation: 'Shortness of breath can be caused by lung or heart problems. Here\'s how these systems work together.',
      keyPoints: [
        'Lungs provide oxygen to blood',
        'Heart pumps oxygenated blood to body',
        'Both systems must work efficiently'
      ]
    }
  };

  useEffect(() => {
    // Initialize 3D canvas or WebGL context here
    initializeARCanvas();
  }, []);

  useEffect(() => {
    // Animation loop for 3D models
    if (isPlaying) {
      const animationFrame = requestAnimationFrame(animate3DModel);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isPlaying]);

  const initializeARCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL or Three.js context
    // This would typically involve setting up a 3D scene
    const ctx = canvas.getContext('2d'); // Fallback to 2D for demo
    
    // Draw basic anatomical placeholder
    drawAnatomyPlaceholder(ctx);
  };

  const drawAnatomyPlaceholder = (ctx) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw simplified organ representation
    ctx.save();
    
    // Apply zoom and rotation
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom / 100, zoom / 100);
    ctx.rotate((rotation.z * Math.PI) / 180);
    
    // Draw based on selected organ
    switch (selectedOrgan) {
      case 'heart':
        drawHeart(ctx);
        break;
      case 'lungs':
        drawLungs(ctx);
        break;
      case 'brain':
        drawBrain(ctx);
        break;
      default:
        drawGenericOrgan(ctx);
    }
    
    ctx.restore();
    
    // Draw labels if enabled
    if (showLabels) {
      drawLabels(ctx);
    }
    
    // Draw annotations
    annotations.forEach(annotation => {
      drawAnnotation(ctx, annotation);
    });
  };

  const drawHeart = (ctx) => {
    // Simplified heart drawing
    ctx.fillStyle = activeLayers.organs ? '#ef4444' : 'transparent';
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2;
    
    // Heart shape using bezier curves
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.bezierCurveTo(-50, -60, -100, -30, -50, 0);
    ctx.bezierCurveTo(-50, 30, 0, 60, 0, 100);
    ctx.bezierCurveTo(0, 60, 50, 30, 50, 0);
    ctx.bezierCurveTo(100, -30, 50, -60, 0, -30);
    ctx.closePath();
    
    if (activeLayers.organs) ctx.fill();
    ctx.stroke();
    
    // Draw chambers if detail view
    if (zoom > 150) {
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1;
      
      // Left ventricle
      ctx.beginPath();
      ctx.arc(-15, 10, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      // Right ventricle
      ctx.beginPath();
      ctx.arc(15, 10, 15, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawLungs = (ctx) => {
    ctx.fillStyle = activeLayers.organs ? '#06b6d4' : 'transparent';
    ctx.strokeStyle = '#0891b2';
    ctx.lineWidth = 2;
    
    // Left lung
    ctx.beginPath();
    ctx.ellipse(-30, 0, 25, 50, 0, 0, Math.PI * 2);
    if (activeLayers.organs) ctx.fill();
    ctx.stroke();
    
    // Right lung (slightly larger)
    ctx.beginPath();
    ctx.ellipse(30, 0, 28, 50, 0, 0, Math.PI * 2);
    if (activeLayers.organs) ctx.fill();
    ctx.stroke();
    
    // Bronchi
    if (zoom > 120) {
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.lineTo(-20, -20);
      ctx.moveTo(0, -40);
      ctx.lineTo(20, -20);
      ctx.stroke();
    }
  };

  const drawBrain = (ctx) => {
    ctx.fillStyle = activeLayers.organs ? '#8b5cf6' : 'transparent';
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    
    // Brain outline
    ctx.beginPath();
    ctx.ellipse(0, -10, 50, 40, 0, 0, Math.PI * 2);
    if (activeLayers.organs) ctx.fill();
    ctx.stroke();
    
    // Brain hemispheres division
    ctx.strokeStyle = '#c4b5fd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(0, 30);
    ctx.stroke();
    
    // Cerebellum
    ctx.beginPath();
    ctx.ellipse(0, 25, 25, 15, 0, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawGenericOrgan = (ctx) => {
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };

  const drawLabels = (ctx) => {
    const canvas = ctx.canvas;
    const organInfo = organDetails[selectedOrgan] || { chambers: [], parts: [], regions: [] };
    const labels = organInfo.chambers || organInfo.parts || organInfo.regions || [];
    
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    ctx.font = '12px sans-serif';
    
    labels.forEach((label, index) => {
      const angle = (index / labels.length) * Math.PI * 2;
      const x = canvas.width / 2 + Math.cos(angle) * 80;
      const y = canvas.height / 2 + Math.sin(angle) * 80;
      
      // Label background
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(x - textWidth / 2 - 4, y - 8, textWidth + 8, 16);
      ctx.strokeRect(x - textWidth / 2 - 4, y - 8, textWidth + 8, 16);
      
      // Label text
      ctx.fillStyle = '#1f2937';
      ctx.fillText(label, x - textWidth / 2, y + 4);
      ctx.fillStyle = 'white';
      
      // Pointer line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 + Math.cos(angle) * 60, canvas.height / 2 + Math.sin(angle) * 60);
      ctx.lineTo(x, y);
      ctx.stroke();
    });
  };

  const drawAnnotation = (ctx, annotation) => {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    
    // Annotation marker
    ctx.beginPath();
    ctx.arc(annotation.x, annotation.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Annotation text
    if (annotation.text) {
      ctx.fillStyle = 'white';
      ctx.strokeStyle = '#1f2937';
      ctx.font = '10px sans-serif';
      
      const textWidth = ctx.measureText(annotation.text).width;
      ctx.fillRect(annotation.x + 12, annotation.y - 8, textWidth + 8, 16);
      ctx.strokeRect(annotation.x + 12, annotation.y - 8, textWidth + 8, 16);
      
      ctx.fillStyle = '#1f2937';
      ctx.fillText(annotation.text, annotation.x + 16, annotation.y + 4);
    }
  };

  const animate3DModel = () => {
    setRotation(prev => ({
      ...prev,
      y: prev.y + 1
    }));
    
    // Redraw canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawAnatomyPlaceholder(ctx);
    }
  };

  const handleCanvasClick = (event) => {
    if (!annotationMode) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const text = prompt('Enter annotation text:');
    if (text) {
      const newAnnotation = {
        id: Date.now(),
        x,
        y,
        text,
        timestamp: new Date().toISOString()
      };
      
      setAnnotations(prev => [...prev, newAnnotation]);
      toast.success('Annotation added');
    }
  };

  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const resetView = () => {
    setZoom(100);
    setRotation({ x: 0, y: 0, z: 0 });
    toast.info('View reset');
  };

  const exportAnnotations = () => {
    const data = {
      organ: selectedOrgan,
      annotations,
      settings: { zoom, rotation, activeLayers },
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anatomy-annotations-${selectedOrgan}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Annotations exported');
  };

  const currentSystem = Object.entries(anatomySystems).find(([key, system]) => 
    system.organs.includes(selectedOrgan)
  )?.[1];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${
            isFullscreen ? 'w-full h-full' : 'w-[95vw] h-[90vh] max-w-7xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {currentSystem?.icon && <currentSystem.icon className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">AR Anatomy Overlay</h2>
                  <p className="text-blue-100 text-sm">
                    {currentSystem ? currentSystem.name : 'Interactive 3D Anatomy'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-80 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
              {/* Organ Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Select Organ</h3>
                <div className="space-y-2">
                  {Object.entries(anatomySystems).map(([systemKey, system]) => (
                    <div key={systemKey} className="space-y-1">
                      <div className="flex items-center space-x-2 p-2 bg-white rounded-lg">
                        <system.icon className="w-4 h-4" style={{ color: system.color }} />
                        <span className="text-sm font-medium text-gray-700">{system.name}</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {system.organs.map(organ => (
                          <button
                            key={organ}
                            onClick={() => setSelectedOrgan(organ)}
                            className={`w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                              selectedOrgan === organ
                                ? 'bg-blue-100 text-blue-800'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {organ.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* View Controls */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">View Controls</h3>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    {['3d', 'xray', 'layers'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          viewMode === mode
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {mode.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Zoom</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                      <button
                        onClick={() => setZoom(Math.min(300, zoom + 10))}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Animation</span>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span className="text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={resetView}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span className="text-sm">Reset View</span>
                  </button>
                </div>
              </div>
              
              {/* Layer Controls */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Anatomical Layers</h3>
                <div className="space-y-2">
                  {Object.entries(activeLayers).map(([layer, active]) => (
                    <div key={layer} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {layer.charAt(0).toUpperCase() + layer.slice(1)}
                      </span>
                      <button
                        onClick={() => toggleLayer(layer)}
                        className={`w-8 h-4 rounded-full transition-colors ${
                          active ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                          active ? 'translate-x-4' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Annotation Tools */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Annotation Tools</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setAnnotationMode(!annotationMode)}
                    className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      annotationMode
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                    <span className="text-sm">
                      {annotationMode ? 'Exit Annotation' : 'Add Annotations'}
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setShowLabels(!showLabels)}
                    className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      showLabels
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    <span className="text-sm">Labels</span>
                  </button>
                  
                  {annotations.length > 0 && (
                    <button
                      onClick={exportAnnotations}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Export</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Organ Information */}
              {organDetails[selectedOrgan] && (
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {organDetails[selectedOrgan].name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {organDetails[selectedOrgan].description}
                  </p>
                  
                  {organDetails[selectedOrgan].normalValues && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Normal Values:</h5>
                      <div className="space-y-1">
                        {Object.entries(organDetails[selectedOrgan].normalValues).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-600">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </span>
                            <span className="text-gray-900 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Main Canvas Area */}
            <div className="flex-1 p-6">
              <div className="relative w-full h-full bg-gray-900 rounded-xl overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-full cursor-pointer"
                  onClick={handleCanvasClick}
                  style={{ opacity: overlayOpacity / 100 }}
                />
                
                {/* Overlay Controls */}
                <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded-lg">
                  <div className="flex items-center space-x-4 text-sm">
                    <span>Zoom: {zoom}%</span>
                    <span>Rotation: {Math.round(rotation.y)}°</span>
                    <span>Mode: {viewMode.toUpperCase()}</span>
                  </div>
                </div>
                
                {annotationMode && (
                  <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium">Click to add annotations</span>
                  </div>
                )}
                
                {/* Annotation Count */}
                {annotations.length > 0 && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg">
                    <span className="text-sm font-medium">{annotations.length} annotations</span>
                  </div>
                )}
              </div>
              
              {/* Quick Actions */}
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => toast.info('Explanation sent to patient')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Share className="w-4 h-4" />
                  <span>Share with Patient</span>
                </button>
                <button
                  onClick={() => toast.info('Added to consultation notes')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Add to Notes</span>
                </button>
                <button
                  onClick={() => setSearchTerm('')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Anatomy</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ARAnatomyOverlay;
