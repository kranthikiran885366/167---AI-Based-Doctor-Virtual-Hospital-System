import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Plus, 
  Search, 
  AlertTriangle, 
  Clock, 
  Calendar,
  Send,
  Save,
  Download,
  Printer,
  Mail,
  MessageSquare,
  X,
  Check,
  Edit,
  Trash2,
  Info,
  Shield,
  Star,
  Filter,
  ChevronDown,
  ChevronRight,
  Activity,
  Heart,
  Brain,
  Eye,
  Zap
} from 'lucide-react';
import { toast } from 'react-toastify';

const PrescriptionManager = ({ patient, onClose, onSave }) => {
  const [medications, setMedications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [dosageForm, setDosageForm] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    beforeFood: false,
    afterFood: false,
    withFood: false
  });

  const [treatments, setTreatments] = useState([]);
  const [lifestyle, setLifestyle] = useState([]);
  const [followUp, setFollowUp] = useState({
    date: '',
    time: '',
    notes: ''
  });

  // Drug database (in real app, this would be from API)
  const drugDatabase = [
    {
      id: 1,
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      strength: ['500mg', '650mg', '1000mg'],
      category: 'Analgesic',
      sideEffects: ['Nausea', 'Stomach pain', 'Loss of appetite'],
      interactions: ['Alcohol', 'Warfarin', 'Phenytoin'],
      contraindications: ['Severe liver disease', 'Allergy to acetaminophen'],
      pregnancy: 'Safe',
      price: '$5.99',
      form: 'Tablet'
    },
    {
      id: 2,
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      strength: ['250mg', '500mg', '875mg'],
      category: 'Antibiotic',
      sideEffects: ['Diarrhea', 'Nausea', 'Skin rash'],
      interactions: ['Methotrexate', 'Probenecid'],
      contraindications: ['Penicillin allergy', 'Mononucleosis'],
      pregnancy: 'Safe',
      price: '$12.50',
      form: 'Capsule'
    },
    {
      id: 3,
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      strength: ['2.5mg', '5mg', '10mg', '20mg'],
      category: 'ACE Inhibitor',
      sideEffects: ['Dry cough', 'Dizziness', 'Hyperkalemia'],
      interactions: ['Potassium supplements', 'NSAIDs', 'Lithium'],
      contraindications: ['Pregnancy', 'Angioedema history'],
      pregnancy: 'Contraindicated',
      price: '$8.75',
      form: 'Tablet'
    },
    {
      id: 4,
      name: 'Metformin',
      genericName: 'Metformin HCl',
      strength: ['500mg', '850mg', '1000mg'],
      category: 'Antidiabetic',
      sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'],
      interactions: ['Contrast dye', 'Alcohol', 'Furosemide'],
      contraindications: ['Kidney disease', 'Liver disease', 'Heart failure'],
      pregnancy: 'Caution',
      price: '$15.25',
      form: 'Tablet'
    },
    {
      id: 5,
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      strength: ['10mg', '20mg', '40mg', '80mg'],
      category: 'Statin',
      sideEffects: ['Muscle pain', 'Liver problems', 'Memory loss'],
      interactions: ['Cyclosporine', 'Gemfibrozil', 'Warfarin'],
      contraindications: ['Active liver disease', 'Pregnancy'],
      pregnancy: 'Contraindicated',
      price: '$22.99',
      form: 'Tablet'
    }
  ];

  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 4 hours',
    'Every 6 hours',
    'Every 8 hours',
    'Every 12 hours',
    'As needed',
    'Before meals',
    'After meals',
    'At bedtime'
  ];

  const durations = [
    '3 days',
    '5 days',
    '7 days',
    '10 days',
    '14 days',
    '21 days',
    '30 days',
    '60 days',
    '90 days',
    'Until finished',
    'Ongoing',
    'As needed'
  ];

  const treatmentOptions = [
    { name: 'Physiotherapy', icon: Activity, description: 'Physical rehabilitation exercises' },
    { name: 'Dietary Changes', icon: Heart, description: 'Nutritional modifications' },
    { name: 'Exercise Program', icon: Zap, description: 'Structured physical activity' },
    { name: 'Breathing Exercises', icon: Activity, description: 'Respiratory therapy' },
    { name: 'Hot/Cold Therapy', icon: Activity, description: 'Temperature-based treatment' },
    { name: 'Meditation', icon: Brain, description: 'Mindfulness and stress reduction' },
    { name: 'Sleep Hygiene', icon: Activity, description: 'Sleep quality improvement' }
  ];

  const lifestyleOptions = [
    'Quit smoking',
    'Reduce alcohol consumption',
    'Increase water intake',
    'Regular exercise (30 min daily)',
    'Stress management',
    'Weight management',
    'Adequate sleep (7-8 hours)',
    'Limit caffeine',
    'Reduce sodium intake',
    'Increase fiber intake',
    'Regular meal timing',
    'Monitor blood pressure',
    'Check blood sugar regularly'
  ];

  const addMedication = () => {
    if (!dosageForm.medication || !dosageForm.dosage || !dosageForm.frequency) {
      toast.error('Please fill in all required fields');
      return;
    }

    const medication = drugDatabase.find(drug => drug.name === dosageForm.medication);
    const newMedication = {
      id: Date.now(),
      ...dosageForm,
      drugInfo: medication,
      addedAt: new Date().toISOString()
    };

    setMedications(prev => [...prev, newMedication]);
    setDosageForm({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      beforeFood: false,
      afterFood: false,
      withFood: false
    });
    setSelectedMedication(null);
    toast.success('Medication added to prescription');
  };

  const removeMedication = (id) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    toast.info('Medication removed from prescription');
  };

  const checkDrugInteractions = () => {
    const interactions = [];
    const patientMeds = patient?.medications || [];
    
    medications.forEach(med => {
      const drugInfo = med.drugInfo;
      if (drugInfo?.interactions) {
        patientMeds.forEach(patientMed => {
          if (drugInfo.interactions.some(interaction => 
            patientMed.toLowerCase().includes(interaction.toLowerCase()))) {
            interactions.push({
              medication: med.medication,
              interaction: patientMed,
              severity: 'moderate'
            });
          }
        });
      }
    });

    return interactions;
  };

  const checkAllergies = () => {
    const allergies = [];
    const patientAllergies = patient?.allergies || [];
    
    medications.forEach(med => {
      const drugInfo = med.drugInfo;
      patientAllergies.forEach(allergy => {
        if (drugInfo?.contraindications?.some(contra => 
          contra.toLowerCase().includes(allergy.toLowerCase()))) {
          allergies.push({
            medication: med.medication,
            allergy: allergy,
            severity: 'high'
          });
        }
      });
    });

    return allergies;
  };

  const generatePrescription = () => {
    const interactions = checkDrugInteractions();
    const allergies = checkAllergies();
    
    if (allergies.length > 0) {
      toast.error('Allergy alert! Please review contraindications.');
      return;
    }

    if (interactions.length > 0) {
      toast.warning('Drug interactions detected. Please review.');
    }

    const prescription = {
      id: Date.now(),
      patient: patient,
      medications: medications,
      treatments: treatments,
      lifestyle: lifestyle,
      followUp: followUp,
      interactions: interactions,
      allergies: allergies,
      prescribedBy: 'Dr. John Smith', // In real app, get from auth
      prescribedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
    };

    onSave && onSave(prescription);
    toast.success('Prescription generated successfully');
  };

  const sendPrescription = (method) => {
    generatePrescription();
    toast.success(`Prescription sent via ${method}`);
  };

  const interactions = checkDrugInteractions();
  const allergies = checkAllergies();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Digital Prescription</h2>
              <p className="text-blue-100">
                Patient: {patient?.name} | Age: {patient?.age} | Gender: {patient?.gender}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Left Panel - Drug Search & Selection */}
          <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Medication</h3>
            
            {/* Search Drugs */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Drug List */}
            <div className="space-y-2 mb-6">
              {drugDatabase
                .filter(drug => drug.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(drug => (
                  <motion.div
                    key={drug.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedMedication?.id === drug.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedMedication(drug);
                      setDosageForm(prev => ({ ...prev, medication: drug.name }));
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{drug.name}</h4>
                      <span className="text-sm text-green-600 font-medium">{drug.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{drug.genericName}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {drug.category}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {drug.form}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Dosage Form */}
            {selectedMedication && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Prescription Details</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Strength/Dosage</label>
                  <select
                    value={dosageForm.dosage}
                    onChange={(e) => setDosageForm(prev => ({ ...prev, dosage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select dosage</option>
                    {selectedMedication.strength.map(strength => (
                      <option key={strength} value={strength}>{strength}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={dosageForm.frequency}
                    onChange={(e) => setDosageForm(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select frequency</option>
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    value={dosageForm.duration}
                    onChange={(e) => setDosageForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select duration</option>
                    {durations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea
                    value={dosageForm.instructions}
                    onChange={(e) => setDosageForm(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Special instructions for patient..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Food Instructions</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={dosageForm.beforeFood}
                        onChange={(e) => setDosageForm(prev => ({ ...prev, beforeFood: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Take before food</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={dosageForm.afterFood}
                        onChange={(e) => setDosageForm(prev => ({ ...prev, afterFood: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Take after food</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={dosageForm.withFood}
                        onChange={(e) => setDosageForm(prev => ({ ...prev, withFood: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Take with food</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={addMedication}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Prescription</span>
                </button>
              </div>
            )}

            {/* Drug Information */}
            {selectedMedication && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  Drug Information
                </h4>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">Side Effects:</span>
                    <p className="text-gray-600">{selectedMedication.sideEffects.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-medium">Interactions:</span>
                    <p className="text-gray-600">{selectedMedication.interactions.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-medium">Pregnancy:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedMedication.pregnancy === 'Safe' ? 'bg-green-100 text-green-800' :
                      selectedMedication.pregnancy === 'Caution' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedMedication.pregnancy}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Prescription Review */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Alerts */}
              {(interactions.length > 0 || allergies.length > 0) && (
                <div className="space-y-3">
                  {allergies.map((allergy, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">Allergy Alert</span>
                      </div>
                      <p className="text-red-700 text-sm mt-1">
                        {allergy.medication} may cause allergic reaction due to {allergy.allergy}
                      </p>
                    </div>
                  ))}
                  
                  {interactions.map((interaction, index) => (
                    <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Drug Interaction</span>
                      </div>
                      <p className="text-yellow-700 text-sm mt-1">
                        {interaction.medication} may interact with {interaction.interaction}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Prescribed Medications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescribed Medications</h3>
                {medications.length > 0 ? (
                  <div className="space-y-3">
                    {medications.map((med, index) => (
                      <div key={med.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900">{index + 1}. {med.medication}</span>
                              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {med.dosage}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                              <div>
                                <span className="font-medium">Frequency:</span> {med.frequency}
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span> {med.duration}
                              </div>
                            </div>
                            {med.instructions && (
                              <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium">Instructions:</span> {med.instructions}
                              </p>
                            )}
                            <div className="flex space-x-2 text-xs">
                              {med.beforeFood && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Before food</span>}
                              {med.afterFood && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">After food</span>}
                              {med.withFood && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">With food</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => removeMedication(med.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No medications added yet</p>
                  </div>
                )}
              </div>

              {/* Non-medication Treatments */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Treatments</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {treatmentOptions.map((treatment) => {
                    const Icon = treatment.icon;
                    const isSelected = treatments.includes(treatment.name);
                    return (
                      <button
                        key={treatment.name}
                        onClick={() => {
                          if (isSelected) {
                            setTreatments(prev => prev.filter(t => t !== treatment.name));
                          } else {
                            setTreatments(prev => [...prev, treatment.name]);
                          }
                        }}
                        className={`p-3 border-2 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className="font-medium text-sm">{treatment.name}</span>
                        </div>
                        <p className="text-xs text-gray-500">{treatment.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lifestyle Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Changes</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {lifestyleOptions.map((option) => {
                    const isSelected = lifestyle.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          if (isSelected) {
                            setLifestyle(prev => prev.filter(l => l !== option));
                          } else {
                            setLifestyle(prev => [...prev, option]);
                          }
                        }}
                        className={`p-2 border-2 rounded-lg text-left text-sm transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Follow-up Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Schedule</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={followUp.date}
                      onChange={(e) => setFollowUp(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={followUp.time}
                      onChange={(e) => setFollowUp(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={followUp.notes}
                    onChange={(e) => setFollowUp(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Follow-up instructions..."
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => sendPrescription('email')}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
              
              <button
                onClick={() => sendPrescription('WhatsApp')}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              
              <button
                onClick={() => sendPrescription('download')}
                className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              
              <button
                onClick={() => sendPrescription('print')}
                className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generatePrescription}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save & Generate</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrescriptionManager;
