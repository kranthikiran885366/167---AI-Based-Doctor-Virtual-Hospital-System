import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  User,
  Heart,
  Activity,
  Brain,
  Pill,
  AlertTriangle,
  Clock,
  Calendar,
  Users,
  Save,
  Download,
  Share,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Plus,
  Edit,
  Search,
  Filter,
  BookOpen,
  Stethoscope,
  Archive
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const MedicalHistory = () => {
  const { user, addMedicalRecord } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [patientInfo, setPatientInfo] = useState({
    name: user?.name || '',
    age: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
    email: user?.email || '',
    emergencyContact: '',
    insurance: '',
    bloodType: '',
    height: '',
    weight: ''
  });

  const [medicalHistory, setMedicalHistory] = useState({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    onsetDate: '',
    severity: 5,
    triggers: [],
    relievingFactors: [],
    associatedSymptoms: [],
    pastMedicalHistory: '',
    previousSurgeries: [],
    hospitalizations: [],
    chronicConditions: [],
    familyHistory: {
      diabetes: false,
      heartDisease: false,
      cancer: false,
      hypertension: false,
      strokeCV: false,
      mentalHealth: false,
      other: ''
    },
    socialHistory: {
      smoking: 'never',
      alcohol: 'never',
      drugs: 'never',
      exercise: 'none',
      diet: 'balanced',
      occupation: '',
      stress: 'low'
    },
    allergies: [],
    medications: [],
    reviewOfSystems: {
      constitutional: { fever: false, weightLoss: false, fatigue: false, chills: false },
      cardiovascular: { chestPain: false, palpitations: false, dyspnea: false, edema: false },
      respiratory: { cough: false, wheezing: false, shortnessOfBreath: false, sputum: false },
      gastrointestinal: { nausea: false, vomiting: false, diarrhea: false, constipation: false },
      neurological: { headache: false, dizziness: false, seizures: false, numbness: false },
      musculoskeletal: { jointPain: false, swelling: false, stiffness: false, weakness: false },
      dermatological: { rash: false, itching: false, changes: false, lesions: false },
      psychiatric: { anxiety: false, depression: false, insomnia: false, moodChanges: false }
    }
  });

  const [savedHistories, setSavedHistories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const steps = [
    { title: 'Patient Information', icon: User, color: 'blue' },
    { title: 'Chief Complaint', icon: FileText, color: 'red' },
    { title: 'Present Illness', icon: Activity, color: 'orange' },
    { title: 'Past Medical History', icon: Clock, color: 'purple' },
    { title: 'Family History', icon: Family, color: 'green' },
    { title: 'Social History', icon: User, color: 'yellow' },
    { title: 'Medications & Allergies', icon: Pill, color: 'pink' },
    { title: 'Review of Systems', icon: Stethoscope, color: 'indigo' },
    { title: 'Summary & Save', icon: Save, color: 'gray' }
  ];

  const severityScale = [
    { value: 1, label: 'Minimal', color: 'bg-green-100 text-green-800' },
    { value: 2, label: 'Mild', color: 'bg-green-200 text-green-800' },
    { value: 3, label: 'Mild-Moderate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 4, label: 'Moderate', color: 'bg-yellow-200 text-yellow-800' },
    { value: 5, label: 'Moderate-Severe', color: 'bg-orange-100 text-orange-800' },
    { value: 6, label: 'Severe', color: 'bg-orange-200 text-orange-800' },
    { value: 7, label: 'Very Severe', color: 'bg-red-100 text-red-800' },
    { value: 8, label: 'Extremely Severe', color: 'bg-red-200 text-red-800' },
    { value: 9, label: 'Unbearable', color: 'bg-red-300 text-red-900' },
    { value: 10, label: 'Maximum', color: 'bg-red-400 text-red-900' }
  ];

  const commonSymptoms = [
    'Fever', 'Headache', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation',
    'Chest Pain', 'Shortness of Breath', 'Cough', 'Dizziness', 'Fatigue',
    'Joint Pain', 'Muscle Pain', 'Rash', 'Weight Loss', 'Weight Gain'
  ];

  const commonMedications = [
    'Aspirin', 'Ibuprofen', 'Acetaminophen', 'Lisinopril', 'Metformin',
    'Atorvastatin', 'Omeprazole', 'Levothyroxine', 'Amlodipine', 'Metoprolol'
  ];

  const commonAllergies = [
    'Penicillin', 'Aspirin', 'Sulfa drugs', 'Codeine', 'Latex',
    'Peanuts', 'Shellfish', 'Eggs', 'Milk', 'Pollen', 'Dust'
  ];

  useEffect(() => {
    const saved = localStorage.getItem('medicalHistories');
    if (saved) {
      setSavedHistories(JSON.parse(saved));
    }
  }, []);

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!patientInfo.name || !patientInfo.age || !patientInfo.gender) {
          toast.error('Please fill in required patient information');
          return false;
        }
        break;
      case 1:
        if (!medicalHistory.chiefComplaint) {
          toast.error('Please enter the chief complaint');
          return false;
        }
        break;
      case 2:
        if (!medicalHistory.historyOfPresentIllness) {
          toast.error('Please provide history of present illness');
          return false;
        }
        break;
    }
    return true;
  };

  const addSymptom = (symptom) => {
    if (!medicalHistory.associatedSymptoms.includes(symptom)) {
      setMedicalHistory(prev => ({
        ...prev,
        associatedSymptoms: [...prev.associatedSymptoms, symptom]
      }));
    }
  };

  const removeSymptom = (symptom) => {
    setMedicalHistory(prev => ({
      ...prev,
      associatedSymptoms: prev.associatedSymptoms.filter(s => s !== symptom)
    }));
  };

  const addMedication = (medication) => {
    const newMed = {
      id: Date.now(),
      name: medication,
      dosage: '',
      frequency: '',
      startDate: '',
      prescribedBy: ''
    };
    setMedicalHistory(prev => ({
      ...prev,
      medications: [...prev.medications, newMed]
    }));
  };

  const addAllergy = (allergy) => {
    const newAllergy = {
      id: Date.now(),
      substance: allergy,
      reaction: '',
      severity: 'mild'
    };
    setMedicalHistory(prev => ({
      ...prev,
      allergies: [...prev.allergies, newAllergy]
    }));
  };

  const saveHistory = () => {
    const historyData = {
      id: currentEditId || Date.now(),
      patientInfo,
      medicalHistory,
      createdAt: isEditing ? savedHistories.find(h => h.id === currentEditId)?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedHistories;
    if (isEditing) {
      updatedHistories = savedHistories.map(h => h.id === currentEditId ? historyData : h);
    } else {
      updatedHistories = [...savedHistories, historyData];
    }

    setSavedHistories(updatedHistories);
    localStorage.setItem('medicalHistories', JSON.stringify(updatedHistories));
    
    // Save to user context
    addMedicalRecord({
      type: 'medical_history',
      data: historyData,
      timestamp: new Date().toISOString()
    });

    toast.success(isEditing ? 'Medical history updated successfully' : 'Medical history saved successfully');
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(0);
    setIsEditing(false);
    setCurrentEditId(null);
    setPatientInfo({
      name: user?.name || '',
      age: '',
      gender: '',
      dateOfBirth: '',
      contactNumber: '',
      email: user?.email || '',
      emergencyContact: '',
      insurance: '',
      bloodType: '',
      height: '',
      weight: ''
    });
    setMedicalHistory({
      chiefComplaint: '',
      historyOfPresentIllness: '',
      onsetDate: '',
      severity: 5,
      triggers: [],
      relievingFactors: [],
      associatedSymptoms: [],
      pastMedicalHistory: '',
      previousSurgeries: [],
      hospitalizations: [],
      chronicConditions: [],
      familyHistory: {
        diabetes: false,
        heartDisease: false,
        cancer: false,
        hypertension: false,
        strokeCV: false,
        mentalHealth: false,
        other: ''
      },
      socialHistory: {
        smoking: 'never',
        alcohol: 'never',
        drugs: 'never',
        exercise: 'none',
        diet: 'balanced',
        occupation: '',
        stress: 'low'
      },
      allergies: [],
      medications: [],
      reviewOfSystems: {
        constitutional: { fever: false, weightLoss: false, fatigue: false, chills: false },
        cardiovascular: { chestPain: false, palpitations: false, dyspnea: false, edema: false },
        respiratory: { cough: false, wheezing: false, shortnessOfBreath: false, sputum: false },
        gastrointestinal: { nausea: false, vomiting: false, diarrhea: false, constipation: false },
        neurological: { headache: false, dizziness: false, seizures: false, numbness: false },
        musculoskeletal: { jointPain: false, swelling: false, stiffness: false, weakness: false },
        dermatological: { rash: false, itching: false, changes: false, lesions: false },
        psychiatric: { anxiety: false, depression: false, insomnia: false, moodChanges: false }
      }
    });
  };

  const editHistory = (history) => {
    setPatientInfo(history.patientInfo);
    setMedicalHistory(history.medicalHistory);
    setIsEditing(true);
    setCurrentEditId(history.id);
    setCurrentStep(0);
  };

  const deleteHistory = (id) => {
    const updatedHistories = savedHistories.filter(h => h.id !== id);
    setSavedHistories(updatedHistories);
    localStorage.setItem('medicalHistories', JSON.stringify(updatedHistories));
    toast.success('Medical history deleted');
  };

  const renderPatientInfo = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={patientInfo.name}
            onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter patient's full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
          <input
            type="number"
            value={patientInfo.age}
            onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Age in years"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
          <select
            value={patientInfo.gender}
            onChange={(e) => setPatientInfo(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={patientInfo.dateOfBirth}
            onChange={(e) => setPatientInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
          <select
            value={patientInfo.bloodType}
            onChange={(e) => setPatientInfo(prev => ({ ...prev, bloodType: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
          <input
            type="number"
            value={patientInfo.height}
            onChange={(e) => setPatientInfo(prev => ({ ...prev, height: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Height in centimeters"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <input
            type="number"
            value={patientInfo.weight}
            onChange={(e) => setPatientInfo(prev => ({ ...prev, weight: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Weight in kilograms"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
          <input
            type="tel"
            value={patientInfo.contactNumber}
            onChange={(e) => setPatientInfo(prev => ({ ...prev, contactNumber: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Phone number"
          />
        </div>
      </div>
    </div>
  );

  const renderChiefComplaint = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint *</label>
        <textarea
          value={medicalHistory.chiefComplaint}
          onChange={(e) => setMedicalHistory(prev => ({ ...prev, chiefComplaint: e.target.value }))}
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What is the main reason for today's visit? (e.g., 'Chest pain for 2 hours')"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Onset Date</label>
          <input
            type="date"
            value={medicalHistory.onsetDate}
            onChange={(e) => setMedicalHistory(prev => ({ ...prev, onsetDate: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Severity (1-10)</label>
          <div className="space-y-3">
            <input
              type="range"
              min="1"
              max="10"
              value={medicalHistory.severity}
              onChange={(e) => setMedicalHistory(prev => ({ ...prev, severity: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 - Minimal</span>
              <span className={`px-2 py-1 rounded ${severityScale.find(s => s.value === medicalHistory.severity)?.color}`}>
                {medicalHistory.severity} - {severityScale.find(s => s.value === medicalHistory.severity)?.label}
              </span>
              <span>10 - Maximum</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Associated Symptoms</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {commonSymptoms.map(symptom => (
            <button
              key={symptom}
              onClick={() => medicalHistory.associatedSymptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom)}
              className={`p-2 text-sm rounded-lg border transition-colors ${
                medicalHistory.associatedSymptoms.includes(symptom)
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
        {medicalHistory.associatedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {medicalHistory.associatedSymptoms.map(symptom => (
              <span
                key={symptom}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {symptom}
                <button
                  onClick={() => removeSymptom(symptom)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPresentIllness = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">History of Present Illness *</label>
        <textarea
          value={medicalHistory.historyOfPresentIllness}
          onChange={(e) => setMedicalHistory(prev => ({ ...prev, historyOfPresentIllness: e.target.value }))}
          rows="6"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe the detailed history of the present illness including onset, duration, character, location, radiation, aggravating and relieving factors..."
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPatientInfo();
      case 1: return renderChiefComplaint();
      case 2: return renderPresentIllness();
      case 3: return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Past Medical History</label>
            <textarea
              value={medicalHistory.pastMedicalHistory}
              onChange={(e) => setMedicalHistory(prev => ({ ...prev, pastMedicalHistory: e.target.value }))}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Previous illnesses, surgeries, hospitalizations..."
            />
          </div>
        </div>
      );
      case 4: return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Family History</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.keys(medicalHistory.familyHistory).filter(key => key !== 'other').map(condition => (
              <label key={condition} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={medicalHistory.familyHistory[condition]}
                  onChange={(e) => setMedicalHistory(prev => ({
                    ...prev,
                    familyHistory: {
                      ...prev.familyHistory,
                      [condition]: e.target.checked
                    }
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 capitalize">{condition.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Other Family History</label>
            <textarea
              value={medicalHistory.familyHistory.other}
              onChange={(e) => setMedicalHistory(prev => ({
                ...prev,
                familyHistory: { ...prev.familyHistory, other: e.target.value }
              }))}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Other family medical history..."
            />
          </div>
        </div>
      );
      case 5: return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Social History</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Smoking</label>
              <select
                value={medicalHistory.socialHistory.smoking}
                onChange={(e) => setMedicalHistory(prev => ({
                  ...prev,
                  socialHistory: { ...prev.socialHistory, smoking: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="never">Never</option>
                <option value="former">Former smoker</option>
                <option value="current">Current smoker</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol</label>
              <select
                value={medicalHistory.socialHistory.alcohol}
                onChange={(e) => setMedicalHistory(prev => ({
                  ...prev,
                  socialHistory: { ...prev.socialHistory, alcohol: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="never">Never</option>
                <option value="occasional">Occasional</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exercise</label>
              <select
                value={medicalHistory.socialHistory.exercise}
                onChange={(e) => setMedicalHistory(prev => ({
                  ...prev,
                  socialHistory: { ...prev.socialHistory, exercise: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="none">None</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
              <input
                type="text"
                value={medicalHistory.socialHistory.occupation}
                onChange={(e) => setMedicalHistory(prev => ({
                  ...prev,
                  socialHistory: { ...prev.socialHistory, occupation: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Current occupation"
              />
            </div>
          </div>
        </div>
      );
      case 6: return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {commonMedications.map(med => (
                <button
                  key={med}
                  onClick={() => addMedication(med)}
                  className="p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  + {med}
                </button>
              ))}
            </div>
            {medicalHistory.medications.map(med => (
              <div key={med.id} className="p-4 border border-gray-200 rounded-lg mb-2">
                <div className="grid md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => setMedicalHistory(prev => ({
                      ...prev,
                      medications: prev.medications.map(m => m.id === med.id ? { ...m, name: e.target.value } : m)
                    }))}
                    placeholder="Medication name"
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => setMedicalHistory(prev => ({
                      ...prev,
                      medications: prev.medications.map(m => m.id === med.id ? { ...m, dosage: e.target.value } : m)
                    }))}
                    placeholder="Dosage"
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => setMedicalHistory(prev => ({
                      ...prev,
                      medications: prev.medications.map(m => m.id === med.id ? { ...m, frequency: e.target.value } : m)
                    }))}
                    placeholder="Frequency"
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => setMedicalHistory(prev => ({
                      ...prev,
                      medications: prev.medications.filter(m => m.id !== med.id)
                    }))}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {commonAllergies.map(allergy => (
                <button
                  key={allergy}
                  onClick={() => addAllergy(allergy)}
                  className="p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  + {allergy}
                </button>
              ))}
            </div>
            {medicalHistory.allergies.map(allergy => (
              <div key={allergy.id} className="p-4 border border-gray-200 rounded-lg mb-2">
                <div className="grid md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={allergy.substance}
                    onChange={(e) => setMedicalHistory(prev => ({
                      ...prev,
                      allergies: prev.allergies.map(a => a.id === allergy.id ? { ...a, substance: e.target.value } : a)
                    }))}
                    placeholder="Allergen"
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={allergy.reaction}
                    onChange={(e) => setMedicalHistory(prev => ({
                      ...prev,
                      allergies: prev.allergies.map(a => a.id === allergy.id ? { ...a, reaction: e.target.value } : a)
                    }))}
                    placeholder="Reaction"
                    className="px-3 py-2 border border-gray-300 rounded"
                  />
                  <select
                    value={allergy.severity}
                    onChange={(e) => setMedicalHistory(prev => ({
                      ...prev,
                      allergies: prev.allergies.map(a => a.id === allergy.id ? { ...a, severity: e.target.value } : a)
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                  <button
                    onClick={() => setMedicalHistory(prev => ({
                      ...prev,
                      allergies: prev.allergies.filter(a => a.id !== allergy.id)
                    }))}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 7: return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Review of Systems</h3>
          {Object.keys(medicalHistory.reviewOfSystems).map(system => (
            <div key={system} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 capitalize">{system}</h4>
              <div className="grid md:grid-cols-2 gap-2">
                {Object.keys(medicalHistory.reviewOfSystems[system]).map(symptom => (
                  <label key={symptom} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={medicalHistory.reviewOfSystems[system][symptom]}
                      onChange={(e) => setMedicalHistory(prev => ({
                        ...prev,
                        reviewOfSystems: {
                          ...prev.reviewOfSystems,
                          [system]: {
                            ...prev.reviewOfSystems[system],
                            [symptom]: e.target.checked
                          }
                        }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 capitalize text-sm">{symptom.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
      case 8: return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                <p className="text-sm text-gray-600">Name: {patientInfo.name}</p>
                <p className="text-sm text-gray-600">Age: {patientInfo.age}</p>
                <p className="text-sm text-gray-600">Gender: {patientInfo.gender}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Chief Complaint</h4>
                <p className="text-sm text-gray-600">{medicalHistory.chiefComplaint}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={saveHistory}
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{isEditing ? 'Update' : 'Save'} Medical History</span>
            </button>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Medical History</h1>
              <p className="text-xl text-gray-600">Comprehensive Patient History Collection</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    isActive ? 'bg-blue-500 text-white' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <span className={`text-xs text-center ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{steps[currentStep].title}</h2>
          {renderStepContent()}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset Form
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Saved Histories */}
        {savedHistories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Medical Histories</h2>
            <div className="space-y-4">
              {savedHistories.map(history => (
                <div key={history.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{history.patientInfo.name}</h3>
                      <p className="text-sm text-gray-600">
                        {history.medicalHistory.chiefComplaint}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(history.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editHistory(history)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteHistory(history.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
