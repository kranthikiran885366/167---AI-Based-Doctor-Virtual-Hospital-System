import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill,
  Plus,
  Minus,
  Search,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Clock,
  User,
  Heart,
  Activity,
  Brain,
  Target,
  Utensils,
  Moon,
  Dumbbell,
  Send,
  Download,
  Share,
  Printer,
  Mail,
  MessageSquare,
  QrCode,
  FileText,
  Save,
  Edit,
  Trash2,
  Copy,
  Phone,
  Smartphone,
  X,
  Zap,
  Shield,
  Database,
  Settings,
  Archive,
  History,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdvancedPrescription = ({ patient, diagnosis, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('medications');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [nonMedicationTreatments, setNonMedicationTreatments] = useState([]);
  const [lifestyleRecommendations, setLifestyleRecommendations] = useState([]);
  const [followUpSchedule, setFollowUpSchedule] = useState([]);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [drugInteractions, setDrugInteractions] = useState([]);
  const [allergieWarnings, setAllergieWarnings] = useState([]);

  const drugDatabase = [
    {
      id: 1,
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      brandNames: ['Amoxil', 'Trimox', 'Moxatag'],
      category: 'Antibiotics',
      strength: ['250mg', '500mg', '875mg'],
      forms: ['Tablet', 'Capsule', 'Suspension'],
      indications: ['Bacterial infections', 'Respiratory tract infections', 'UTI'],
      contraindications: ['Penicillin allergy', 'Mononucleosis'],
      sideEffects: ['Nausea', 'Diarrhea', 'Abdominal pain', 'Rash'],
      drugInteractions: ['Warfarin', 'Methotrexate', 'Oral contraceptives'],
      dosageAdult: '500mg every 8 hours',
      dosagePediatric: '20-40mg/kg/day divided every 8 hours',
      maxDose: '3g/day',
      pregnancyCategory: 'B',
      renalAdjustment: 'Reduce dose if CrCl <30',
      hepaticAdjustment: 'No adjustment needed',
      foodInteraction: 'Take with or without food',
      monitoringRequired: ['Renal function', 'Signs of allergic reaction'],
      availability: true,
      cost: 'Low',
      region: 'Global'
    },
    {
      id: 2,
      name: 'Metformin',
      genericName: 'Metformin HCl',
      brandNames: ['Glucophage', 'Fortamet', 'Glumetza'],
      category: 'Antidiabetic',
      strength: ['500mg', '850mg', '1000mg'],
      forms: ['Tablet', 'Extended Release'],
      indications: ['Type 2 Diabetes', 'PCOS', 'Prediabetes'],
      contraindications: ['Renal impairment', 'Metabolic acidosis', 'Heart failure'],
      sideEffects: ['GI upset', 'Diarrhea', 'Metallic taste', 'B12 deficiency'],
      drugInteractions: ['Contrast agents', 'Alcohol', 'Furosemide'],
      dosageAdult: '500mg twice daily with meals',
      dosagePediatric: '10-17 years: 500mg twice daily',
      maxDose: '2550mg/day',
      pregnancyCategory: 'B',
      renalAdjustment: 'Contraindicated if eGFR <30',
      hepaticAdjustment: 'Use with caution',
      foodInteraction: 'Take with meals to reduce GI effects',
      monitoringRequired: ['Renal function', 'B12 levels', 'HbA1c'],
      availability: true,
      cost: 'Low',
      region: 'Global'
    },
    {
      id: 3,
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      brandNames: ['Prinivil', 'Zestril'],
      category: 'ACE Inhibitor',
      strength: ['2.5mg', '5mg', '10mg', '20mg', '40mg'],
      forms: ['Tablet'],
      indications: ['Hypertension', 'Heart failure', 'Post-MI'],
      contraindications: ['Pregnancy', 'Angioedema history', 'Bilateral renal artery stenosis'],
      sideEffects: ['Dry cough', 'Hyperkalemia', 'Angioedema', 'Hypotension'],
      drugInteractions: ['Potassium supplements', 'NSAIDs', 'Lithium'],
      dosageAdult: '10mg once daily',
      dosagePediatric: '0.07mg/kg once daily (max 5mg)',
      maxDose: '40mg/day',
      pregnancyCategory: 'D',
      renalAdjustment: 'Reduce dose if CrCl <30',
      hepaticAdjustment: 'No adjustment needed',
      foodInteraction: 'Can take with or without food',
      monitoringRequired: ['Blood pressure', 'Renal function', 'Potassium'],
      availability: true,
      cost: 'Low',
      region: 'Global'
    },
    {
      id: 4,
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      brandNames: ['Lipitor'],
      category: 'Statin',
      strength: ['10mg', '20mg', '40mg', '80mg'],
      forms: ['Tablet'],
      indications: ['Hyperlipidemia', 'Primary prevention CVD', 'Secondary prevention CVD'],
      contraindications: ['Active liver disease', 'Pregnancy', 'Breastfeeding'],
      sideEffects: ['Myalgia', 'Elevated liver enzymes', 'Rhabdomyolysis'],
      drugInteractions: ['Warfarin', 'Digoxin', 'Cyclosporine', 'Gemfibrozil'],
      dosageAdult: '20mg once daily',
      dosagePediatric: '10-17 years: 10mg once daily',
      maxDose: '80mg/day',
      pregnancyCategory: 'X',
      renalAdjustment: 'No adjustment needed',
      hepaticAdjustment: 'Contraindicated in active liver disease',
      foodInteraction: 'Can take with or without food',
      monitoringRequired: ['Liver function', 'CK levels', 'Lipid panel'],
      availability: true,
      cost: 'Moderate',
      region: 'Global'
    }
  ];

  const nonMedicationTreatmentOptions = [
    {
      id: 1,
      category: 'Physical Therapy',
      name: 'Physiotherapy',
      description: 'Physical rehabilitation and exercise therapy',
      duration: '4-6 weeks',
      frequency: '2-3 times per week',
      specialInstructions: 'Focus on range of motion and strengthening',
      provider: 'Licensed Physical Therapist'
    },
    {
      id: 2,
      category: 'Respiratory Therapy',
      name: 'Breathing Exercises',
      description: 'Pulmonary rehabilitation and breathing techniques',
      duration: '2-4 weeks',
      frequency: 'Daily',
      specialInstructions: 'Use spirometer 10 times every 2 hours',
      provider: 'Respiratory Therapist'
    },
    {
      id: 3,
      category: 'Occupational Therapy',
      name: 'Occupational Therapy',
      description: 'Daily living skills and adaptive techniques',
      duration: '6-8 weeks',
      frequency: '2 times per week',
      specialInstructions: 'Focus on activities of daily living',
      provider: 'Occupational Therapist'
    },
    {
      id: 4,
      category: 'Psychology',
      name: 'Cognitive Behavioral Therapy',
      description: 'Psychological counseling and therapy',
      duration: '8-12 weeks',
      frequency: 'Weekly sessions',
      specialInstructions: 'Address anxiety and depression symptoms',
      provider: 'Licensed Psychologist'
    }
  ];

  const lifestyleOptions = [
    {
      category: 'Diet',
      recommendations: [
        'Low sodium diet (<2300mg/day)',
        'Mediterranean diet',
        'Diabetic diet (carb counting)',
        'Heart-healthy diet',
        'High fiber diet',
        'Gluten-free diet',
        'Low fat diet'
      ]
    },
    {
      category: 'Exercise',
      recommendations: [
        'Moderate aerobic exercise 150 min/week',
        'Strength training 2-3 times/week',
        'Walking 30 minutes daily',
        'Swimming for low-impact exercise',
        'Yoga for flexibility and stress relief',
        'Physical therapy exercises',
        'Balance training for fall prevention'
      ]
    },
    {
      category: 'Sleep',
      recommendations: [
        'Sleep hygiene education',
        '7-9 hours of sleep nightly',
        'Consistent sleep schedule',
        'Avoid screens before bedtime',
        'Create comfortable sleep environment',
        'Limit caffeine after 2 PM',
        'Consider sleep study if indicated'
      ]
    },
    {
      category: 'Stress Management',
      recommendations: [
        'Meditation and mindfulness',
        'Deep breathing exercises',
        'Progressive muscle relaxation',
        'Regular social activities',
        'Hobby engagement',
        'Counseling if needed',
        'Time management techniques'
      ]
    }
  ];

  useEffect(() => {
    if (patient?.allergies) {
      checkAllergyWarnings();
    }
    if (prescriptionItems.length > 1) {
      checkDrugInteractions();
    }
  }, [prescriptionItems, patient?.allergies]);

  const checkAllergyWarnings = () => {
    const warnings = [];
    if (patient?.allergies) {
      const allergyList = patient.allergies.toLowerCase();
      prescriptionItems.forEach(item => {
        const medication = drugDatabase.find(med => med.id === item.medicationId);
        if (medication) {
          if (allergyList.includes('penicillin') && medication.category === 'Antibiotics') {
            warnings.push({
              severity: 'high',
              message: `Patient allergic to penicillin - ${medication.name} may cause allergic reaction`,
              medication: medication.name
            });
          }
          medication.contraindications.forEach(contraindication => {
            if (allergyList.includes(contraindication.toLowerCase())) {
              warnings.push({
                severity: 'high',
                message: `Patient allergic to ${contraindication} - ${medication.name} contraindicated`,
                medication: medication.name
              });
            }
          });
        }
      });
    }
    setAllergieWarnings(warnings);
  };

  const checkDrugInteractions = () => {
    const interactions = [];
    for (let i = 0; i < prescriptionItems.length; i++) {
      for (let j = i + 1; j < prescriptionItems.length; j++) {
        const med1 = drugDatabase.find(med => med.id === prescriptionItems[i].medicationId);
        const med2 = drugDatabase.find(med => med.id === prescriptionItems[j].medicationId);
        
        if (med1 && med2) {
          if (med1.drugInteractions.includes(med2.name) || med2.drugInteractions.includes(med1.name)) {
            interactions.push({
              severity: 'moderate',
              medication1: med1.name,
              medication2: med2.name,
              description: `Potential interaction between ${med1.name} and ${med2.name}`,
              recommendation: 'Monitor patient closely and consider dose adjustment'
            });
          }
        }
      }
    }
    setDrugInteractions(interactions);
  };

  const calculatePediatricDose = (medication, weightKg, ageYears) => {
    if (!medication.dosagePediatric) return null;
    
    const doseMatch = medication.dosagePediatric.match(/(\d+)-?(\d+)?mg\/kg/);
    if (doseMatch && weightKg) {
      const minDose = parseInt(doseMatch[1]);
      const maxDose = doseMatch[2] ? parseInt(doseMatch[2]) : minDose;
      const calculatedDose = (minDose * weightKg);
      return `${calculatedDose}mg (${minDose}-${maxDose}mg/kg)`;
    }
    return medication.dosagePediatric;
  };

  const addMedication = (medication) => {
    const isPatientPediatric = patient?.age && patient.age < 18;
    const defaultDosage = isPatientPediatric ? 
      calculatePediatricDose(medication, patient?.weight, patient?.age) || medication.dosagePediatric :
      medication.dosageAdult;

    const newPrescriptionItem = {
      id: Date.now(),
      medicationId: medication.id,
      medicationName: medication.name,
      strength: medication.strength[0],
      form: medication.forms[0],
      dosage: defaultDosage,
      frequency: 'Twice daily',
      duration: '7 days',
      quantity: '14',
      refills: '0',
      specialInstructions: '',
      urgent: false,
      substitutionAllowed: true
    };

    setPrescriptionItems(prev => [...prev, newPrescriptionItem]);
    setSelectedMedication(null);
    toast.success(`${medication.name} added to prescription`);
  };

  const removeMedication = (id) => {
    setPrescriptionItems(prev => prev.filter(item => item.id !== id));
    toast.info('Medication removed from prescription');
  };

  const updatePrescriptionItem = (id, field, value) => {
    setPrescriptionItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addNonMedicationTreatment = (treatment) => {
    const newTreatment = {
      id: Date.now(),
      ...treatment,
      customInstructions: '',
      urgent: false
    };
    setNonMedicationTreatments(prev => [...prev, newTreatment]);
    toast.success(`${treatment.name} added to treatment plan`);
  };

  const addLifestyleRecommendation = (category, recommendation) => {
    const newRecommendation = {
      id: Date.now(),
      category,
      recommendation,
      priority: 'moderate',
      customNotes: ''
    };
    setLifestyleRecommendations(prev => [...prev, newRecommendation]);
    toast.success('Lifestyle recommendation added');
  };

  const addFollowUp = (type, timeframe, notes = '') => {
    const followUp = {
      id: Date.now(),
      type,
      timeframe,
      notes,
      urgent: false,
      reminderEnabled: true
    };
    setFollowUpSchedule(prev => [...prev, followUp]);
    toast.success('Follow-up appointment scheduled');
  };

  const generatePrescription = () => {
    const prescription = {
      id: `RX-${Date.now()}`,
      patient,
      diagnosis,
      prescriptionItems,
      nonMedicationTreatments,
      lifestyleRecommendations,
      followUpSchedule,
      notes: prescriptionNotes,
      drugInteractions,
      allergieWarnings,
      prescribedBy: 'Current Doctor',
      prescribedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    return prescription;
  };

  const savePrescription = () => {
    const prescription = generatePrescription();
    onSave && onSave(prescription);
    toast.success('Prescription saved to EMR');
  };

  const sendPrescription = (method) => {
    const prescription = generatePrescription();
    
    switch (method) {
      case 'email':
        toast.success(`Prescription sent to ${patient?.email || 'patient email'}`);
        break;
      case 'whatsapp':
        toast.success(`Prescription sent via WhatsApp to ${patient?.phone || 'patient phone'}`);
        break;
      case 'pdf':
        toast.success('Prescription PDF generated and downloaded');
        break;
      case 'print':
        window.print();
        toast.success('Prescription sent to printer');
        break;
      case 'pharmacy':
        toast.success('Prescription sent to patient\'s preferred pharmacy');
        break;
      default:
        toast.info('Prescription ready for delivery');
    }
  };

  const generateQRCode = () => {
    const prescription = generatePrescription();
    const qrData = {
      prescriptionId: prescription.id,
      patientId: patient?.id,
      medications: prescription.prescriptionItems.map(item => ({
        name: item.medicationName,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration
      })),
      prescriber: prescription.prescribedBy,
      date: prescription.prescribedAt
    };
    
    toast.success('QR code generated for pharmacy scanning');
    return qrData;
  };

  const filteredMedications = drugDatabase.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.indications.some(indication => 
      indication.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const tabs = [
    { id: 'medications', name: 'Medications', icon: Pill },
    { id: 'non_medication', name: 'Non-Medication Treatments', icon: Activity },
    { id: 'lifestyle', name: 'Lifestyle Changes', icon: Heart },
    { id: 'followup', name: 'Follow-up Schedule', icon: Calendar },
    { id: 'review', name: 'Review & Send', icon: Send }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Advanced Prescription & Treatment Management</h2>
              <p className="text-green-100">Patient: {patient?.name || 'Unknown'} | Diagnosis: {diagnosis || 'Not specified'}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-full max-h-[calc(95vh-120px)]">
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-500 text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            {(drugInteractions.length > 0 || allergieWarnings.length > 0) && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Alerts</h4>
                {allergieWarnings.map((warning, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700">{warning.message}</p>
                  </div>
                ))}
                {drugInteractions.map((interaction, index) => (
                  <div key={index} className="flex items-start space-x-2 mb-2">
                    <Info className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-orange-700">{interaction.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'medications' && (
                <motion.div
                  key="medications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">Digital Prescription</h3>
                    <div className="flex items-center space-x-2">
                      <Search className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search medications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Medication Database</h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {filteredMedications.map(medication => (
                          <div key={medication.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{medication.name}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                medication.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {medication.availability ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{medication.category}</p>
                            <p className="text-xs text-gray-500 mb-2">
                              {medication.indications.slice(0, 2).join(', ')}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Cost: {medication.cost}</span>
                                {medication.pregnancyCategory && (
                                  <span className="text-xs text-gray-500">Cat: {medication.pregnancyCategory}</span>
                                )}
                              </div>
                              <button
                                onClick={() => addMedication(medication)}
                                disabled={!medication.availability}
                                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Prescription</h4>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {prescriptionItems.map(item => {
                          const medication = drugDatabase.find(med => med.id === item.medicationId);
                          return (
                            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-semibold text-gray-900">{item.medicationName}</h5>
                                <button
                                  onClick={() => removeMedication(item.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Strength</label>
                                  <select
                                    value={item.strength}
                                    onChange={(e) => updatePrescriptionItem(item.id, 'strength', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  >
                                    {medication?.strength.map(strength => (
                                      <option key={strength} value={strength}>{strength}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Form</label>
                                  <select
                                    value={item.form}
                                    onChange={(e) => updatePrescriptionItem(item.id, 'form', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  >
                                    {medication?.forms.map(form => (
                                      <option key={form} value={form}>{form}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Frequency</label>
                                  <select
                                    value={item.frequency}
                                    onChange={(e) => updatePrescriptionItem(item.id, 'frequency', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  >
                                    <option value="Once daily">Once daily</option>
                                    <option value="Twice daily">Twice daily</option>
                                    <option value="Three times daily">Three times daily</option>
                                    <option value="Four times daily">Four times daily</option>
                                    <option value="Every 4 hours">Every 4 hours</option>
                                    <option value="Every 6 hours">Every 6 hours</option>
                                    <option value="Every 8 hours">Every 8 hours</option>
                                    <option value="As needed">As needed</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                                  <select
                                    value={item.duration}
                                    onChange={(e) => updatePrescriptionItem(item.id, 'duration', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                  >
                                    <option value="3 days">3 days</option>
                                    <option value="5 days">5 days</option>
                                    <option value="7 days">7 days</option>
                                    <option value="10 days">10 days</option>
                                    <option value="14 days">14 days</option>
                                    <option value="30 days">30 days</option>
                                    <option value="90 days">90 days</option>
                                  </select>
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Special Instructions</label>
                                <textarea
                                  value={item.specialInstructions}
                                  onChange={(e) => updatePrescriptionItem(item.id, 'specialInstructions', e.target.value)}
                                  placeholder="Take with food, avoid alcohol, etc."
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                  rows="2"
                                />
                              </div>

                              <div className="flex items-center space-x-4 text-sm">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={item.urgent}
                                    onChange={(e) => updatePrescriptionItem(item.id, 'urgent', e.target.checked)}
                                    className="rounded"
                                  />
                                  <span>Urgent</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={item.substitutionAllowed}
                                    onChange={(e) => updatePrescriptionItem(item.id, 'substitutionAllowed', e.target.checked)}
                                    className="rounded"
                                  />
                                  <span>Generic substitution allowed</span>
                                </label>
                              </div>
                            </div>
                          );
                        })}
                        
                        {prescriptionItems.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No medications added yet</p>
                            <p className="text-sm">Search and add medications from the database</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'non_medication' && (
                <motion.div
                  key="non_medication"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">Non-Medication Treatments</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Treatments</h4>
                      <div className="space-y-3">
                        {nonMedicationTreatmentOptions.map(treatment => (
                          <div key={treatment.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{treatment.name}</h5>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {treatment.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{treatment.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                              <span>Duration: {treatment.duration}</span>
                              <span>Frequency: {treatment.frequency}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">{treatment.specialInstructions}</p>
                            <button
                              onClick={() => addNonMedicationTreatment(treatment)}
                              className="w-full py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            >
                              Add to Treatment Plan
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Prescribed Treatments</h4>
                      <div className="space-y-4">
                        {nonMedicationTreatments.map(treatment => (
                          <div key={treatment.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-semibold text-gray-900">{treatment.name}</h5>
                              <button
                                onClick={() => setNonMedicationTreatments(prev => 
                                  prev.filter(t => t.id !== treatment.id)
                                )}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="mb-3">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Custom Instructions</label>
                              <textarea
                                value={treatment.customInstructions}
                                onChange={(e) => {
                                  const updated = nonMedicationTreatments.map(t => 
                                    t.id === treatment.id ? { ...t, customInstructions: e.target.value } : t
                                  );
                                  setNonMedicationTreatments(updated);
                                }}
                                placeholder="Additional specific instructions..."
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                rows="2"
                              />
                            </div>
                            <label className="flex items-center space-x-2 text-sm">
                              <input
                                type="checkbox"
                                checked={treatment.urgent}
                                onChange={(e) => {
                                  const updated = nonMedicationTreatments.map(t => 
                                    t.id === treatment.id ? { ...t, urgent: e.target.checked } : t
                                  );
                                  setNonMedicationTreatments(updated);
                                }}
                                className="rounded"
                              />
                              <span>Urgent referral required</span>
                            </label>
                          </div>
                        ))}
                        
                        {nonMedicationTreatments.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No treatments prescribed yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'lifestyle' && (
                <motion.div
                  key="lifestyle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">Lifestyle Recommendations</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Categories</h4>
                      <div className="space-y-4">
                        {lifestyleOptions.map(category => {
                          const icons = {
                            'Diet': Utensils,
                            'Exercise': Dumbbell,
                            'Sleep': Moon,
                            'Stress Management': Heart
                          };
                          const Icon = icons[category.category] || Target;
                          
                          return (
                            <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-3">
                                <Icon className="w-5 h-5 text-blue-600" />
                                <h5 className="font-semibold text-gray-900">{category.category}</h5>
                              </div>
                              <div className="space-y-2">
                                {category.recommendations.map((rec, index) => (
                                  <button
                                    key={index}
                                    onClick={() => addLifestyleRecommendation(category.category, rec)}
                                    className="block w-full text-left p-2 text-sm text-gray-700 hover:bg-blue-50 rounded transition-colors"
                                  >
                                    + {rec}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Patient Recommendations</h4>
                      <div className="space-y-3">
                        {lifestyleRecommendations.map(rec => (
                          <div key={rec.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {rec.category}
                              </span>
                              <button
                                onClick={() => setLifestyleRecommendations(prev => 
                                  prev.filter(r => r.id !== rec.id)
                                )}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-900 mb-2">{rec.recommendation}</p>
                            <div className="mb-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                              <select
                                value={rec.priority}
                                onChange={(e) => {
                                  const updated = lifestyleRecommendations.map(r => 
                                    r.id === rec.id ? { ...r, priority: e.target.value } : r
                                  );
                                  setLifestyleRecommendations(updated);
                                }}
                                className="w-full p-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="low">Low</option>
                                <option value="moderate">Moderate</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                            <textarea
                              value={rec.customNotes}
                              onChange={(e) => {
                                const updated = lifestyleRecommendations.map(r => 
                                  r.id === rec.id ? { ...r, customNotes: e.target.value } : r
                                );
                                setLifestyleRecommendations(updated);
                              }}
                              placeholder="Additional notes..."
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                              rows="2"
                            />
                          </div>
                        ))}
                        
                        {lifestyleRecommendations.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No lifestyle recommendations yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'followup' && (
                <motion.div
                  key="followup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">Follow-up Schedule</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Schedule Follow-up</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => addFollowUp('office_visit', '1 week', 'Check medication response')}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-left"
                        >
                          <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                          <h5 className="font-medium text-gray-900">Office Visit</h5>
                          <p className="text-sm text-gray-600">1 week</p>
                        </button>
                        
                        <button
                          onClick={() => addFollowUp('lab_tests', '2 weeks', 'Monitor treatment response')}
                          className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors text-left"
                        >
                          <TestTube className="w-6 h-6 text-green-600 mb-2" />
                          <h5 className="font-medium text-gray-900">Lab Tests</h5>
                          <p className="text-sm text-gray-600">2 weeks</p>
                        </button>
                        
                        <button
                          onClick={() => addFollowUp('phone_call', '3 days', 'Check for side effects')}
                          className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left"
                        >
                          <Phone className="w-6 h-6 text-purple-600 mb-2" />
                          <h5 className="font-medium text-gray-900">Phone Call</h5>
                          <p className="text-sm text-gray-600">3 days</p>
                        </button>
                        
                        <button
                          onClick={() => addFollowUp('specialist_referral', '1 month', 'Specialist consultation')}
                          className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors text-left"
                        >
                          <User className="w-6 h-6 text-orange-600 mb-2" />
                          <h5 className="font-medium text-gray-900">Specialist</h5>
                          <p className="text-sm text-gray-600">1 month</p>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Follow-ups</h4>
                      <div className="space-y-3">
                        {followUpSchedule.map(followUp => (
                          <div key={followUp.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{followUp.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
                              <button
                                onClick={() => setFollowUpSchedule(prev => 
                                  prev.filter(f => f.id !== followUp.id)
                                )}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Timeframe: {followUp.timeframe}</p>
                            <textarea
                              value={followUp.notes}
                              onChange={(e) => {
                                const updated = followUpSchedule.map(f => 
                                  f.id === followUp.id ? { ...f, notes: e.target.value } : f
                                );
                                setFollowUpSchedule(updated);
                              }}
                              placeholder="Follow-up notes..."
                              className="w-full p-2 border border-gray-300 rounded text-sm"
                              rows="2"
                            />
                            <div className="flex items-center space-x-4 mt-2 text-sm">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={followUp.urgent}
                                  onChange={(e) => {
                                    const updated = followUpSchedule.map(f => 
                                      f.id === followUp.id ? { ...f, urgent: e.target.checked } : f
                                    );
                                    setFollowUpSchedule(updated);
                                  }}
                                  className="rounded"
                                />
                                <span>Urgent</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={followUp.reminderEnabled}
                                  onChange={(e) => {
                                    const updated = followUpSchedule.map(f => 
                                      f.id === followUp.id ? { ...f, reminderEnabled: e.target.checked } : f
                                    );
                                    setFollowUpSchedule(updated);
                                  }}
                                  className="rounded"
                                />
                                <span>Send reminder</span>
                              </label>
                            </div>
                          </div>
                        ))}
                        
                        {followUpSchedule.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No follow-ups scheduled</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">Review & Send Prescription</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Prescription Summary</h4>
                    
                    {prescriptionItems.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 mb-3">Medications ({prescriptionItems.length})</h5>
                        <div className="space-y-2">
                          {prescriptionItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded border">
                              <div>
                                <span className="font-medium">{item.medicationName}</span>
                                <span className="text-gray-600 ml-2">{item.strength} {item.form}</span>
                              </div>
                              <div className="text-right text-sm text-gray-600">
                                <div>{item.frequency} for {item.duration}</div>
                                <div>Qty: {item.quantity}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {nonMedicationTreatments.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 mb-3">Non-Medication Treatments ({nonMedicationTreatments.length})</h5>
                        <div className="space-y-2">
                          {nonMedicationTreatments.map(treatment => (
                            <div key={treatment.id} className="p-3 bg-white rounded border">
                              <span className="font-medium">{treatment.name}</span>
                              <p className="text-sm text-gray-600">{treatment.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {lifestyleRecommendations.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 mb-3">Lifestyle Recommendations ({lifestyleRecommendations.length})</h5>
                        <div className="space-y-2">
                          {lifestyleRecommendations.map(rec => (
                            <div key={rec.id} className="p-3 bg-white rounded border">
                              <span className="font-medium">{rec.category}:</span>
                              <span className="ml-2">{rec.recommendation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                      <textarea
                        value={prescriptionNotes}
                        onChange={(e) => setPrescriptionNotes(e.target.value)}
                        placeholder="Additional instructions for patient or pharmacy..."
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">Send Prescription</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => sendPrescription('email')}
                        className="flex items-center justify-center space-x-2 p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-400 transition-colors"
                      >
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">Email</span>
                      </button>
                      
                      <button
                        onClick={() => sendPrescription('whatsapp')}
                        className="flex items-center justify-center space-x-2 p-4 bg-white border border-green-200 rounded-lg hover:border-green-400 transition-colors"
                      >
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">WhatsApp</span>
                      </button>
                      
                      <button
                        onClick={() => sendPrescription('pdf')}
                        className="flex items-center justify-center space-x-2 p-4 bg-white border border-red-200 rounded-lg hover:border-red-400 transition-colors"
                      >
                        <Download className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium">PDF</span>
                      </button>
                      
                      <button
                        onClick={() => sendPrescription('print')}
                        className="flex items-center justify-center space-x-2 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        <Printer className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium">Print</span>
                      </button>
                      
                      <button
                        onClick={generateQRCode}
                        className="flex items-center justify-center space-x-2 p-4 bg-white border border-purple-200 rounded-lg hover:border-purple-400 transition-colors"
                      >
                        <QrCode className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium">QR Code</span>
                      </button>
                      
                      <button
                        onClick={() => sendPrescription('pharmacy')}
                        className="flex items-center justify-center space-x-2 p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-400 transition-colors"
                      >
                        <Share className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium">Pharmacy</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Prescription ID: RX-{Date.now().toString().slice(-6)}
              </span>
              <span className="text-sm text-gray-600">
                Valid until: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={savePrescription}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save to EMR</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedPrescription;
