import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Pill, 
  Clock, 
  AlertTriangle, 
  Download, 
  Share, 
  Plus,
  Minus,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Info,
  Heart,
  Activity
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';
import jsPDF from 'jspdf';

const Prescription = () => {
  const [symptoms, setSymptoms] = useState('');
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [prescription, setPrescription] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, addPrescription } = useUser();

  const commonSymptoms = [
    'Fever', 'Headache', 'Cough', 'Sore Throat', 'Body Ache', 
    'Nausea', 'Vomiting', 'Diarrhea', 'Fatigue', 'Dizziness'
  ];

  const commonAllergies = [
    'Penicillin', 'Aspirin', 'Sulfa drugs', 'Ibuprofen', 
    'Codeine', 'Latex', 'Food allergies', 'None'
  ];

  const generatePrescription = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockPrescription = generateMockPrescription(symptoms, allergies, medicalHistory);
      setPrescription(mockPrescription);
      
      // Save to user's prescription history
      addPrescription(mockPrescription);
      
      toast.success('Prescription generated successfully');
    } catch (error) {
      toast.error('Failed to generate prescription. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockPrescription = (symptoms, allergies, history) => {
    const symptomsLower = symptoms.toLowerCase();
    let medications = [];
    let diagnosis = '';
    let instructions = [];

    // Simple symptom-based prescription logic
    if (symptomsLower.includes('fever') || symptomsLower.includes('temperature')) {
      diagnosis = 'Viral Fever';
      medications.push({
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: '3 times daily',
        duration: '5 days',
        instructions: 'Take after meals',
        type: 'Tablet'
      });
      instructions.push('Rest and stay hydrated');
      instructions.push('Monitor temperature regularly');
    }

    if (symptomsLower.includes('cough')) {
      medications.push({
        name: 'Dextromethorphan',
        dosage: '10ml',
        frequency: '3 times daily',
        duration: '7 days',
        instructions: 'Take with warm water',
        type: 'Syrup'
      });
      instructions.push('Avoid cold drinks');
    }

    if (symptomsLower.includes('headache')) {
      if (!medications.find(m => m.name === 'Paracetamol')) {
        medications.push({
          name: 'Ibuprofen',
          dosage: '400mg',
          frequency: '2 times daily',
          duration: '3 days',
          instructions: 'Take with food',
          type: 'Tablet'
        });
      }
      instructions.push('Ensure adequate sleep');
    }

    if (symptomsLower.includes('sore throat')) {
      medications.push({
        name: 'Benzydamine HCl',
        dosage: '15ml',
        frequency: '3 times daily',
        duration: '5 days',
        instructions: 'Gargle and spit out',
        type: 'Mouthwash'
      });
      instructions.push('Drink warm liquids');
    }

    // Default if no specific symptoms matched
    if (medications.length === 0) {
      diagnosis = 'General Malaise';
      medications.push({
        name: 'Multivitamin',
        dosage: '1 tablet',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with breakfast',
        type: 'Tablet'
      });
      instructions.push('Maintain healthy diet and exercise');
    }

    return {
      id: Date.now(),
      patientName: user?.name || 'Patient',
      date: new Date().toISOString(),
      diagnosis,
      symptoms,
      allergies: allergies || 'None reported',
      medications,
      instructions,
      followUp: 'Follow up in 1 week if symptoms persist',
      doctorName: 'Dr. AI Assistant',
      doctorId: 'AI001',
      prescriptionNumber: `RX${Date.now()}`
    };
  };

  const downloadPrescription = () => {
    if (!prescription) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('AI DOCTOR PRESCRIPTION', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text('MVK Solutions', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;
    pdf.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 10;

    // Patient Info
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Patient Information:', 10, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Name: ${prescription.patientName}`, 10, yPosition);
    yPosition += 6;
    pdf.text(`Date: ${new Date(prescription.date).toLocaleDateString()}`, 10, yPosition);
    yPosition += 6;
    pdf.text(`Prescription No: ${prescription.prescriptionNumber}`, 10, yPosition);
    yPosition += 15;

    // Diagnosis
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Diagnosis:', 10, yPosition);
    yPosition += 8;
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text(prescription.diagnosis, 10, yPosition);
    yPosition += 15;

    // Medications
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Medications:', 10, yPosition);
    yPosition += 10;

    prescription.medications.forEach((med, index) => {
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${index + 1}. ${med.name} (${med.type})`, 15, yPosition);
      yPosition += 6;
      
      pdf.setFont(undefined, 'normal');
      pdf.text(`   Dosage: ${med.dosage}`, 15, yPosition);
      yPosition += 5;
      pdf.text(`   Frequency: ${med.frequency}`, 15, yPosition);
      yPosition += 5;
      pdf.text(`   Duration: ${med.duration}`, 15, yPosition);
      yPosition += 5;
      pdf.text(`   Instructions: ${med.instructions}`, 15, yPosition);
      yPosition += 10;
    });

    // Instructions
    if (prescription.instructions.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('General Instructions:', 10, yPosition);
      yPosition += 8;

      prescription.instructions.forEach((instruction, index) => {
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text(`• ${instruction}`, 15, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
    }

    // Follow-up
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('Follow-up:', 10, yPosition);
    yPosition += 6;
    pdf.setFont(undefined, 'normal');
    pdf.text(prescription.followUp, 10, yPosition);

    // Footer
    yPosition = pdf.internal.pageSize.height - 30;
    pdf.line(10, yPosition, pageWidth - 10, yPosition);
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.text('Generated by AI Doctor - MVK Solutions', pageWidth / 2, yPosition, { align: 'center' });
    pdf.text('This is an AI-generated prescription. Consult a doctor for serious conditions.', pageWidth / 2, yPosition + 5, { align: 'center' });

    pdf.save(`prescription_${prescription.prescriptionNumber}.pdf`);
    toast.success('Prescription downloaded successfully');
  };

  const sharePrescription = () => {
    if (!prescription) return;
    
    const shareText = `AI Doctor Prescription\n\nPatient: ${prescription.patientName}\nDiagnosis: ${prescription.diagnosis}\nDate: ${new Date(prescription.date).toLocaleDateString()}\n\nGenerated by MVK Solutions AI Doctor`;
    
    if (navigator.share) {
      navigator.share({
        title: 'AI Doctor Prescription',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Prescription details copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Prescription Generator</h1>
          <p className="text-gray-600">
            Get personalized medication recommendations based on your symptoms and medical history
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Patient Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Patient Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-500" />
                Current Symptoms
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your symptoms in detail
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., I have been experiencing fever for 2 days, along with headache and body ache..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                />
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Select Common Symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => setSymptoms(prev => prev ? `${prev}, ${symptom}` : symptom)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Medical History & Allergies */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-green-500" />
                Medical Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Known Allergies
                  </label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g., Penicillin, Aspirin, None"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {commonAllergies.map((allergy) => (
                      <button
                        key={allergy}
                        onClick={() => setAllergies(allergy)}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                      >
                        {allergy}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <input
                    type="text"
                    value={currentMedications}
                    onChange={(e) => setCurrentMedications(e.target.value)}
                    placeholder="List any medications you're currently taking"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    placeholder="Any relevant medical history, chronic conditions, or previous surgeries"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePrescription}
              disabled={isGenerating || !symptoms.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Prescription...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Pill className="w-5 h-5" />
                  <span>Generate AI Prescription</span>
                </div>
              )}
            </button>
          </motion.div>

          {/* Prescription Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {prescription ? (
              <>
                {/* Prescription Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">AI Generated Prescription</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={downloadPrescription}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={sharePrescription}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Share className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Patient:</span>
                      <p className="text-gray-900">{prescription.patientName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date:</span>
                      <p className="text-gray-900">{new Date(prescription.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Prescription No:</span>
                      <p className="text-gray-900">{prescription.prescriptionNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Doctor:</span>
                      <p className="text-gray-900">{prescription.doctorName}</p>
                    </div>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-500" />
                    Diagnosis
                  </h3>
                  <p className="text-gray-900 bg-blue-50 p-4 rounded-lg">{prescription.diagnosis}</p>
                </div>

                {/* Medications */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-green-500" />
                    Prescribed Medications
                  </h3>
                  <div className="space-y-4">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{med.name}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {med.type}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Dosage:</span>
                            <p className="text-gray-900">{med.dosage}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Frequency:</span>
                            <p className="text-gray-900">{med.frequency}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Duration:</span>
                            <p className="text-gray-900">{med.duration}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Instructions:</span>
                            <p className="text-gray-900">{med.instructions}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                {prescription.instructions.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-yellow-500" />
                      General Instructions
                    </h3>
                    <ul className="space-y-2">
                      {prescription.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow-up */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                    Follow-up
                  </h3>
                  <p className="text-gray-900 bg-purple-50 p-4 rounded-lg">{prescription.followUp}</p>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h4>
                      <p className="text-yellow-700 text-sm">
                        This prescription is generated by AI and should be used for informational purposes only. 
                        Please consult with a qualified healthcare professional before taking any medications, 
                        especially if you have serious symptoms or chronic conditions.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescription Generated</h3>
                <p className="text-gray-500">
                  Fill in your symptoms and medical information, then click "Generate AI Prescription" to get started
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Prescription;