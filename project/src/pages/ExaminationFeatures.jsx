import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope,
  Camera,
  Upload,
  FileImage,
  MousePointer,
  Highlighter,
  Eye,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Brain,
  Search,
  Watch,
  Monitor,
  Database,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  TrendingUp,
  Zap,
  Shield,
  Smartphone,
  Bluetooth,
  Wifi,
  Video,
  Mic,
  MessageSquare,
  Download,
  Share,
  Settings,
  BookOpen,
  Link,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { toast } from 'react-toastify';

const ExaminationFeatures = () => {
  const [activeDemo, setActiveDemo] = useState(null);

  const features = [
    {
      id: 'history',
      title: 'Medical History Questions',
      description: 'Comprehensive patient history collection with guided questionnaires',
      icon: BookOpen,
      color: 'blue',
      features: [
        'Chief complaint documentation',
        'History of present illness',
        'Past medical & family history',
        'Medication & allergy tracking',
        'System-specific questionnaires',
        'Automated follow-up questions'
      ],
      demo: {
        type: 'interactive',
        content: 'Interactive medical history form with real-time validation'
      }
    },
    {
      id: 'reports',
      title: 'Lab Reports & Scan Analysis',
      description: 'Upload, view, and annotate medical reports with AI-powered insights',
      icon: FileImage,
      color: 'green',
      features: [
        'Multi-format file support (PDF, JPEG, PNG)',
        'AI-powered report analysis',
        'Interactive annotation tools',
        'Abnormal findings highlighting',
        'Comparison with normal ranges',
        'Automated report interpretation'
      ],
      demo: {
        type: 'visual',
        content: 'Live annotation and analysis demonstration'
      }
    },
    {
      id: 'inspection',
      title: 'Visual Inspection via Camera',
      description: 'Real-time camera-based examination for skin, eye, and wound assessment',
      icon: Camera,
      color: 'purple',
      features: [
        'Skin condition assessment',
        'Eye examination tools',
        'Wound documentation',
        'Oral cavity inspection',
        'High-quality image capture',
        'Real-time analysis feedback'
      ],
      demo: {
        type: 'camera',
        content: 'Live camera feed with examination guidelines'
      }
    },
    {
      id: 'ai-diagnosis',
      title: 'AI-Suggested Diagnoses',
      description: 'Advanced AI analysis providing evidence-based diagnostic suggestions',
      icon: Brain,
      color: 'indigo',
      features: [
        'Evidence-based diagnostic suggestions',
        'Confidence scoring system',
        'Differential diagnosis options',
        'Treatment recommendations',
        'Clinical decision support',
        'Continuous learning algorithms'
      ],
      demo: {
        type: 'ai',
        content: 'Real-time AI diagnostic analysis'
      }
    },
    {
      id: 'devices',
      title: 'Connected Device Integration',
      description: 'Seamless integration with medical devices for vital sign monitoring',
      icon: Monitor,
      color: 'red',
      features: [
        'Blood pressure monitors',
        'Pulse oximeters',
        'Digital thermometers',
        'Glucometers',
        'ECG machines',
        'Digital scales'
      ],
      demo: {
        type: 'devices',
        content: 'Live device connectivity demonstration'
      }
    },
    {
      id: 'investigations',
      title: 'Investigation Orders',
      description: 'Streamlined ordering system for laboratory tests and imaging studies',
      icon: Search,
      color: 'yellow',
      features: [
        'Comprehensive test catalog',
        'Priority-based ordering',
        'Department routing',
        'Status tracking',
        'Result integration',
        'Cost optimization'
      ],
      demo: {
        type: 'ordering',
        content: 'Investigation ordering workflow'
      }
    },
    {
      id: 'wearables',
      title: 'Wearable Device Data',
      description: 'Real-time health monitoring through wearable device integration',
      icon: Watch,
      color: 'teal',
      features: [
        'Continuous heart rate monitoring',
        'Activity tracking',
        'Sleep pattern analysis',
        'Calorie burn tracking',
        'Stress level monitoring',
        'Real-time alerts'
      ],
      demo: {
        type: 'wearable',
        content: 'Live wearable data dashboard'
      }
    },
    {
      id: 'coding',
      title: 'Medical Coding (ICD-10 & SNOMED)',
      description: 'Comprehensive medical coding system for accurate documentation',
      icon: Database,
      color: 'gray',
      features: [
        'ICD-10 diagnosis codes',
        'SNOMED CT terminology',
        'Smart code suggestions',
        'Search functionality',
        'Code validation',
        'Billing integration'
      ],
      demo: {
        type: 'coding',
        content: 'Interactive medical coding interface'
      }
    }
  ];

  const stats = [
    { label: 'Accuracy Rate', value: '98%', icon: Target },
    { label: 'Time Saved', value: '65%', icon: Clock },
    { label: 'Devices Supported', value: '50+', icon: Monitor },
    { label: 'Medical Codes', value: '10K+', icon: Database }
  ];

  const benefits = [
    {
      title: 'Comprehensive Assessment',
      description: 'Complete patient evaluation with all examination tools in one platform',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'AI-Powered Insights',
      description: 'Advanced artificial intelligence provides diagnostic support and recommendations',
      icon: Brain,
      color: 'blue'
    },
    {
      title: 'Real-time Integration',
      description: 'Seamless connectivity with medical devices and wearable technology',
      icon: Zap,
      color: 'yellow'
    },
    {
      title: 'Evidence-Based Care',
      description: 'Clinical decision support based on latest medical research and guidelines',
      icon: Shield,
      color: 'purple'
    }
  ];

  const startDemo = (featureId) => {
    setActiveDemo(featureId);
    toast.info(`Starting ${features.find(f => f.id === featureId)?.title} demo`);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-white border-blue-200',
      green: 'bg-green-500 text-white border-green-200',
      purple: 'bg-purple-500 text-white border-purple-200',
      indigo: 'bg-indigo-500 text-white border-indigo-200',
      red: 'bg-red-500 text-white border-red-200',
      yellow: 'bg-yellow-500 text-white border-yellow-200',
      teal: 'bg-teal-500 text-white border-teal-200',
      gray: 'bg-gray-500 text-white border-gray-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900">Examination & Diagnosis</h1>
              <p className="text-xl text-gray-600 mt-2">Complete Medical Assessment Platform</p>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Revolutionary medical examination system combining AI-powered diagnostics, real-time device integration, 
            and comprehensive patient assessment tools for modern healthcare professionals.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Complete Examination Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className={`w-14 h-14 ${getColorClasses(feature.color)} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {feature.features.slice(0, 3).map((feat, featIndex) => (
                      <div key={featIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feat}</span>
                      </div>
                    ))}
                    {feature.features.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{feature.features.length - 3} more features
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => startDemo(feature.id)}
                    className={`w-full py-3 px-4 ${getColorClasses(feature.color)} rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center space-x-2`}
                  >
                    <Play className="w-4 h-4" />
                    <span className="font-medium">Try Demo</span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Our Platform?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 bg-${benefit.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 text-${benefit.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Integration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white mb-16"
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Seamless Integration</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Our platform integrates with over 50+ medical devices and wearable technologies to provide 
              comprehensive patient monitoring and assessment capabilities.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Monitor className="w-12 h-12 mx-auto mb-3 text-blue-200" />
                <p className="text-sm font-medium">Medical Devices</p>
              </div>
              <div className="text-center">
                <Watch className="w-12 h-12 mx-auto mb-3 text-blue-200" />
                <p className="text-sm font-medium">Wearables</p>
              </div>
              <div className="text-center">
                <Smartphone className="w-12 h-12 mx-auto mb-3 text-blue-200" />
                <p className="text-sm font-medium">Mobile Apps</p>
              </div>
              <div className="text-center">
                <Database className="w-12 h-12 mx-auto mb-3 text-blue-200" />
                <p className="text-sm font-medium">EMR Systems</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Workflow Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Complete Examination Workflow</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Patient History', description: 'Comprehensive medical history collection', icon: BookOpen },
              { step: 2, title: 'Visual Inspection', description: 'Camera-based examination and documentation', icon: Camera },
              { step: 3, title: 'Device Testing', description: 'Connected device measurements and analysis', icon: Monitor },
              { step: 4, title: 'AI Diagnosis', description: 'AI-powered diagnostic suggestions and coding', icon: Brain }
            ].map((workflow, index) => {
              const Icon = workflow.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                      {workflow.step}
                    </div>
                    <Icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{workflow.title}</h3>
                    <p className="text-gray-600 text-sm">{workflow.description}</p>
                  </div>
                  
                  {index < 3 && (
                    <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 text-gray-300 transform -translate-y-1/2" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Medical Practice?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the future of medical examination with our comprehensive AI-powered platform. 
            Start your journey towards more efficient and accurate patient care today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Start Free Trial</span>
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Learn More</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExaminationFeatures;
