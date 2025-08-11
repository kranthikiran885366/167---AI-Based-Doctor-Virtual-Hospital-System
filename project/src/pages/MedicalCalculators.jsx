import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator,
  Heart,
  Activity,
  Droplets,
  Thermometer,
  User,
  Weight,
  Ruler,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  Pill,
  Syringe,
  Beaker,
  Microscope,
  Save,
  Download,
  Share,
  History,
  Star,
  Info,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  FileText,
  Brain,
  Zap,
  Shield
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const MedicalCalculators = () => {
  const { user, addMedicalRecord } = useUser();
  const [activeCalculator, setActiveCalculator] = useState('bmi');
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [favorites, setFavorites] = useState(['bmi', 'creatinine', 'dosage']);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // BMI Calculator
  const [bmiData, setBmiData] = useState({
    weight: '',
    height: '',
    unit: 'metric' // metric or imperial
  });

  // Dosage Calculator
  const [dosageData, setDosageData] = useState({
    weight: '',
    drug: '',
    dose: '',
    frequency: '',
    duration: '',
    kidneyClearance: '',
    age: '',
    indication: ''
  });

  // Creatinine Clearance
  const [creatinineData, setCreatinineData] = useState({
    age: '',
    weight: '',
    gender: 'male',
    serumCreatinine: '',
    formula: 'cockcroft' // cockcroft, mdrd, ckd-epi
  });

  // Body Surface Area
  const [bsaData, setBsaData] = useState({
    weight: '',
    height: '',
    formula: 'dubois' // dubois, mosteller, haycock
  });

  // Cardiac Output
  const [cardiacData, setCardiacData] = useState({
    heartRate: '',
    strokeVolume: '',
    method: 'direct' // direct, thermodilution, fick
  });

  // GCS (Glasgow Coma Scale)
  const [gcsData, setGcsData] = useState({
    eyeOpening: 4,
    verbalResponse: 5,
    motorResponse: 6
  });

  // APGAR Score
  const [apgarData, setApgarData] = useState({
    appearance: 2,
    pulse: 2,
    grimace: 2,
    activity: 2,
    respiration: 2,
    timePoint: '1min' // 1min, 5min, 10min
  });

  // IV Drip Rate
  const [dripData, setDripData] = useState({
    totalVolume: '',
    infusionTime: '',
    dropFactor: '15', // drops per ml
    concentration: '',
    desiredRate: ''
  });

  const calculatorCategories = [
    {
      id: 'basic',
      name: 'Basic Measurements',
      description: 'Fundamental medical calculations',
      calculators: ['bmi', 'bsa', 'ideal-weight']
    },
    {
      id: 'cardiac',
      name: 'Cardiovascular',
      description: 'Heart and circulation calculations',
      calculators: ['cardiac-output', 'map', 'qrs-axis']
    },
    {
      id: 'renal',
      name: 'Renal Function',
      description: 'Kidney function assessments',
      calculators: ['creatinine', 'urea-clearance', 'fractional-sodium']
    },
    {
      id: 'dosing',
      name: 'Drug Dosing',
      description: 'Medication and dosage calculations',
      calculators: ['dosage', 'drip-rate', 'bioavailability']
    },
    {
      id: 'emergency',
      name: 'Emergency Medicine',
      description: 'Critical care calculations',
      calculators: ['gcs', 'apgar', 'trauma-score']
    },
    {
      id: 'respiratory',
      name: 'Respiratory',
      description: 'Lung function calculations',
      calculators: ['alveolar-gas', 'shunt-fraction', 'dead-space']
    }
  ];

  const calculators = [
    {
      id: 'bmi',
      name: 'BMI Calculator',
      description: 'Body Mass Index calculation and interpretation',
      category: 'basic',
      icon: Weight,
      color: 'blue',
      formula: 'BMI = weight(kg) / height(m)²'
    },
    {
      id: 'dosage',
      name: 'Drug Dosage Calculator',
      description: 'Medication dosing based on patient parameters',
      category: 'dosing',
      icon: Pill,
      color: 'green',
      formula: 'Dose = (mg/kg) × weight × frequency'
    },
    {
      id: 'creatinine',
      name: 'Creatinine Clearance',
      description: 'Kidney function assessment using multiple formulas',
      category: 'renal',
      icon: Droplets,
      color: 'purple',
      formula: 'CrCl = ((140-age) × weight) / (72 × SCr)'
    },
    {
      id: 'bsa',
      name: 'Body Surface Area',
      description: 'BSA calculation for drug dosing and cardiac index',
      category: 'basic',
      icon: User,
      color: 'orange',
      formula: 'BSA = √((height × weight) / 3600)'
    },
    {
      id: 'cardiac-output',
      name: 'Cardiac Output',
      description: 'Heart pumping efficiency calculation',
      category: 'cardiac',
      icon: Heart,
      color: 'red',
      formula: 'CO = HR × SV'
    },
    {
      id: 'gcs',
      name: 'Glasgow Coma Scale',
      description: 'Neurological assessment scoring',
      category: 'emergency',
      icon: Brain,
      color: 'indigo',
      formula: 'GCS = Eye + Verbal + Motor (3-15)'
    },
    {
      id: 'apgar',
      name: 'APGAR Score',
      description: 'Newborn health assessment',
      category: 'emergency',
      icon: Activity,
      color: 'pink',
      formula: 'APGAR = A + P + G + A + R (0-10)'
    },
    {
      id: 'drip-rate',
      name: 'IV Drip Rate',
      description: 'Intravenous infusion rate calculation',
      category: 'dosing',
      icon: Syringe,
      color: 'teal',
      formula: 'Rate = (Volume × Drop Factor) / Time'
    }
  ];

  useEffect(() => {
    // Load calculation history from localStorage
    const saved = localStorage.getItem('calculationHistory');
    if (saved) {
      setCalculationHistory(JSON.parse(saved));
    }

    const savedFavorites = localStorage.getItem('favoriteCalculators');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const calculateBMI = () => {
    const { weight, height, unit } = bmiData;
    
    if (!weight || !height) {
      toast.error('Please enter both weight and height');
      return;
    }

    let weightKg = parseFloat(weight);
    let heightM = parseFloat(height);

    if (unit === 'imperial') {
      weightKg = weightKg * 0.453592; // lbs to kg
      heightM = heightM * 0.0254; // inches to meters
    } else {
      heightM = heightM / 100; // cm to meters
    }

    const bmi = weightKg / (heightM * heightM);
    
    let category = '';
    let color = '';
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-600';
    } else if (bmi < 25) {
      category = 'Normal weight';
      color = 'text-green-600';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-600';
    } else {
      category = 'Obese';
      color = 'text-red-600';
    }

    const result = {
      id: Date.now(),
      calculator: 'BMI',
      inputs: { weight, height, unit },
      result: {
        bmi: bmi.toFixed(1),
        category,
        color,
        interpretation: getBMIInterpretation(bmi)
      },
      timestamp: new Date().toISOString()
    };

    addToHistory(result);
    return result;
  };

  const calculateDosage = () => {
    const { weight, drug, dose, frequency, kidneyClearance, age } = dosageData;
    
    if (!weight || !dose) {
      toast.error('Please enter weight and dose');
      return;
    }

    const weightKg = parseFloat(weight);
    const dosePerKg = parseFloat(dose);
    const ageNum = parseFloat(age) || 0;
    const clearance = parseFloat(kidneyClearance) || 100;

    let totalDose = weightKg * dosePerKg;
    
    // Adjust for kidney function
    if (clearance < 50) {
      totalDose = totalDose * 0.5; // Reduce dose by 50% for impaired kidney function
    } else if (clearance < 30) {
      totalDose = totalDose * 0.25; // Reduce dose by 75% for severe impairment
    }

    // Adjust for age (pediatric/geriatric)
    if (ageNum > 65) {
      totalDose = totalDose * 0.8; // Reduce dose by 20% for elderly
    } else if (ageNum < 18) {
      totalDose = totalDose * 0.9; // Slight reduction for pediatric
    }

    const result = {
      id: Date.now(),
      calculator: 'Drug Dosage',
      inputs: { weight, drug, dose, frequency, kidneyClearance, age },
      result: {
        totalDose: totalDose.toFixed(1),
        adjustedDose: totalDose.toFixed(1),
        warnings: getDosageWarnings(clearance, ageNum),
        recommendations: getDosageRecommendations(drug, totalDose)
      },
      timestamp: new Date().toISOString()
    };

    addToHistory(result);
    return result;
  };

  const calculateCreatinineClearance = () => {
    const { age, weight, gender, serumCreatinine, formula } = creatinineData;
    
    if (!age || !weight || !serumCreatinine) {
      toast.error('Please enter all required fields');
      return;
    }

    const ageNum = parseFloat(age);
    const weightKg = parseFloat(weight);
    const scr = parseFloat(serumCreatinine);

    let clearance = 0;
    let formulaUsed = '';

    switch (formula) {
      case 'cockcroft':
        // Cockcroft-Gault formula
        clearance = ((140 - ageNum) * weightKg) / (72 * scr);
        if (gender === 'female') {
          clearance = clearance * 0.85;
        }
        formulaUsed = 'Cockcroft-Gault';
        break;
      
      case 'mdrd':
        // MDRD formula (simplified)
        clearance = 186 * Math.pow(scr, -1.154) * Math.pow(ageNum, -0.203);
        if (gender === 'female') {
          clearance = clearance * 0.742;
        }
        formulaUsed = 'MDRD';
        break;
      
      case 'ckd-epi':
        // CKD-EPI formula (simplified)
        const kappa = gender === 'female' ? 0.7 : 0.9;
        const alpha = gender === 'female' ? -0.329 : -0.411;
        const minScr = Math.min(scr / kappa, 1);
        const maxScr = Math.max(scr / kappa, 1);
        
        clearance = 141 * Math.pow(minScr, alpha) * Math.pow(maxScr, -1.209) * Math.pow(0.993, ageNum);
        if (gender === 'female') {
          clearance = clearance * 1.018;
        }
        formulaUsed = 'CKD-EPI';
        break;
    }

    const stage = getKidneyStage(clearance);

    const result = {
      id: Date.now(),
      calculator: 'Creatinine Clearance',
      inputs: { age, weight, gender, serumCreatinine, formula },
      result: {
        clearance: clearance.toFixed(1),
        formula: formulaUsed,
        stage: stage.stage,
        description: stage.description,
        recommendations: stage.recommendations
      },
      timestamp: new Date().toISOString()
    };

    addToHistory(result);
    return result;
  };

  const calculateBSA = () => {
    const { weight, height, formula } = bsaData;
    
    if (!weight || !height) {
      toast.error('Please enter both weight and height');
      return;
    }

    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    let bsa = 0;
    let formulaUsed = '';

    switch (formula) {
      case 'dubois':
        bsa = 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725);
        formulaUsed = 'Du Bois';
        break;
      
      case 'mosteller':
        bsa = Math.sqrt((weightKg * heightCm) / 3600);
        formulaUsed = 'Mosteller';
        break;
      
      case 'haycock':
        bsa = 0.024265 * Math.pow(weightKg, 0.5378) * Math.pow(heightCm, 0.3964);
        formulaUsed = 'Haycock';
        break;
    }

    const result = {
      id: Date.now(),
      calculator: 'Body Surface Area',
      inputs: { weight, height, formula },
      result: {
        bsa: bsa.toFixed(2),
        formula: formulaUsed,
        interpretation: getBSAInterpretation(bsa)
      },
      timestamp: new Date().toISOString()
    };

    addToHistory(result);
    return result;
  };

  const calculateCardiacOutput = () => {
    const { heartRate, strokeVolume } = cardiacData;
    
    if (!heartRate || !strokeVolume) {
      toast.error('Please enter heart rate and stroke volume');
      return;
    }

    const hr = parseFloat(heartRate);
    const sv = parseFloat(strokeVolume);
    const co = (hr * sv) / 1000; // Convert to L/min

    const cardiacIndex = co / 1.8; // Assuming average BSA of 1.8 m²

    const result = {
      id: Date.now(),
      calculator: 'Cardiac Output',
      inputs: { heartRate, strokeVolume },
      result: {
        cardiacOutput: co.toFixed(1),
        cardiacIndex: cardiacIndex.toFixed(1),
        interpretation: getCardiacOutputInterpretation(co, cardiacIndex)
      },
      timestamp: new Date().toISOString()
    };

    addToHistory(result);
    return result;
  };

  const calculateGCS = () => {
    const { eyeOpening, verbalResponse, motorResponse } = gcsData;
    const total = eyeOpening + verbalResponse + motorResponse;

    const interpretation = getGCSInterpretation(total);

    const result = {
      id: Date.now(),
      calculator: 'Glasgow Coma Scale',
      inputs: { eyeOpening, verbalResponse, motorResponse },
      result: {
        total,
        eyeOpening,
        verbalResponse,
        motorResponse,
        interpretation
      },
      timestamp: new Date().toISOString()
    };

    addToHistory(result);
    return result;
  };

  const calculateAPGAR = () => {
    const { appearance, pulse, grimace, activity, respiration, timePoint } = apgarData;
    const total = appearance + pulse + grimace + activity + respiration;

    const interpretation = getAPGARInterpretation(total);

    const result = {
      id: Date.now(),
      calculator: 'APGAR Score',
      inputs: { appearance, pulse, grimace, activity, respiration, timePoint },
      result: {
        total,
        timePoint,
        interpretation,
        breakdown: {
          appearance,
          pulse,
          grimace,
          activity,
          respiration
        }
      },
      timestamp: new Date().toISOString()
    };

    addToHistory(result);
    return result;
  };

  const calculateDripRate = () => {
    const { totalVolume, infusionTime, dropFactor } = dripData;
    
    if (!totalVolume || !infusionTime) {
      toast.error('Please enter total volume and infusion time');
      return;
    }

    const volume = parseFloat(totalVolume);
    const time = parseFloat(infusionTime);
    const drops = parseFloat(dropFactor);

    const dropsPerMinute = (volume * drops) / time;
    const mlPerHour = volume / time * 60;

    const result = {
      id: Date.now(),
      calculator: 'IV Drip Rate',
      inputs: { totalVolume, infusionTime, dropFactor },
      result: {
        dropsPerMinute: Math.round(dropsPerMinute),
        mlPerHour: mlPerHour.toFixed(1),
        recommendations: getDripRateRecommendations(dropsPerMinute)
      },
      timestamp: new Date().toISOString()
    };

    addToHistory(result);
    return result;
  };

  // Helper functions for interpretations
  const getBMIInterpretation = (bmi) => {
    if (bmi < 18.5) return 'May need to gain weight. Consult healthcare provider.';
    if (bmi < 25) return 'Healthy weight range. Maintain current lifestyle.';
    if (bmi < 30) return 'Consider weight loss through diet and exercise.';
    return 'Obesity range. Consult healthcare provider for weight management plan.';
  };

  const getDosageWarnings = (clearance, age) => {
    const warnings = [];
    if (clearance < 50) warnings.push('Reduced kidney function - dose adjustment required');
    if (age > 65) warnings.push('Elderly patient - consider dose reduction');
    if (age < 18) warnings.push('Pediatric patient - verify pediatric dosing guidelines');
    return warnings;
  };

  const getDosageRecommendations = (drug, dose) => {
    return [
      'Monitor for therapeutic response',
      'Check for adverse effects',
      'Consider drug interactions',
      'Adjust dose based on response'
    ];
  };

  const getKidneyStage = (clearance) => {
    if (clearance >= 90) {
      return {
        stage: 'Stage 1',
        description: 'Normal or high',
        recommendations: ['Monitor annually', 'Control blood pressure']
      };
    } else if (clearance >= 60) {
      return {
        stage: 'Stage 2',
        description: 'Mildly decreased',
        recommendations: ['Monitor every 6 months', 'Control diabetes and hypertension']
      };
    } else if (clearance >= 30) {
      return {
        stage: 'Stage 3',
        description: 'Moderately decreased',
        recommendations: ['Monitor every 3 months', 'Nephrology consultation']
      };
    } else if (clearance >= 15) {
      return {
        stage: 'Stage 4',
        description: 'Severely decreased',
        recommendations: ['Prepare for dialysis', 'Frequent monitoring']
      };
    } else {
      return {
        stage: 'Stage 5',
        description: 'Kidney failure',
        recommendations: ['Dialysis or transplant required', 'Immediate nephrology care']
      };
    }
  };

  const getBSAInterpretation = (bsa) => {
    if (bsa < 1.5) return 'Below average body surface area';
    if (bsa <= 2.0) return 'Normal body surface area';
    return 'Above average body surface area';
  };

  const getCardiacOutputInterpretation = (co, ci) => {
    let interpretation = '';
    if (co < 4.0) interpretation = 'Low cardiac output';
    else if (co <= 8.0) interpretation = 'Normal cardiac output';
    else interpretation = 'High cardiac output';
    
    if (ci < 2.5) interpretation += ' - Low cardiac index';
    else if (ci <= 4.0) interpretation += ' - Normal cardiac index';
    else interpretation += ' - High cardiac index';
    
    return interpretation;
  };

  const getGCSInterpretation = (total) => {
    if (total <= 8) return { severity: 'Severe', description: 'Coma or severe brain injury', color: 'text-red-600' };
    if (total <= 12) return { severity: 'Moderate', description: 'Moderate brain injury', color: 'text-yellow-600' };
    return { severity: 'Mild', description: 'Mild or no brain injury', color: 'text-green-600' };
  };

  const getAPGARInterpretation = (total) => {
    if (total <= 3) return { condition: 'Critical', description: 'Immediate resuscitation needed', color: 'text-red-600' };
    if (total <= 6) return { condition: 'Moderately abnormal', description: 'Close monitoring needed', color: 'text-yellow-600' };
    return { condition: 'Normal', description: 'Good condition', color: 'text-green-600' };
  };

  const getDripRateRecommendations = (rate) => {
    const recommendations = [];
    if (rate > 100) recommendations.push('High flow rate - monitor closely');
    if (rate < 10) recommendations.push('Very slow rate - verify calculation');
    recommendations.push('Double-check calculation before administration');
    return recommendations;
  };

  const addToHistory = (calculation) => {
    const newHistory = [calculation, ...calculationHistory.slice(0, 19)]; // Keep last 20
    setCalculationHistory(newHistory);
    localStorage.setItem('calculationHistory', JSON.stringify(newHistory));
    
    // Save to medical records
    addMedicalRecord({
      type: 'medical_calculation',
      data: calculation,
      timestamp: new Date().toISOString()
    });
    
    toast.success('Calculation completed and saved');
  };

  const toggleFavorite = (calculatorId) => {
    const newFavorites = favorites.includes(calculatorId)
      ? favorites.filter(id => id !== calculatorId)
      : [...favorites, calculatorId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteCalculators', JSON.stringify(newFavorites));
  };

  const executeCalculation = () => {
    switch (activeCalculator) {
      case 'bmi': return calculateBMI();
      case 'dosage': return calculateDosage();
      case 'creatinine': return calculateCreatinineClearance();
      case 'bsa': return calculateBSA();
      case 'cardiac-output': return calculateCardiacOutput();
      case 'gcs': return calculateGCS();
      case 'apgar': return calculateAPGAR();
      case 'drip-rate': return calculateDripRate();
      default: return null;
    }
  };

  const exportHistory = () => {
    const data = {
      calculations: calculationHistory,
      exportDate: new Date().toISOString(),
      user: user?.name || 'Unknown'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_calculations_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Calculation history exported');
  };

  const filteredCalculators = calculators.filter(calc => {
    const matchesSearch = calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || calc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const renderCalculatorInput = () => {
    const calculator = calculators.find(c => c.id === activeCalculator);
    if (!calculator) return null;

    switch (activeCalculator) {
      case 'bmi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit System</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={bmiData.unit === 'metric'}
                    onChange={() => setBmiData(prev => ({ ...prev, unit: 'metric' }))}
                    className="mr-2"
                  />
                  Metric (kg, cm)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={bmiData.unit === 'imperial'}
                    onChange={() => setBmiData(prev => ({ ...prev, unit: 'imperial' }))}
                    className="mr-2"
                  />
                  Imperial (lbs, inches)
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight ({bmiData.unit === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  type="number"
                  value={bmiData.weight}
                  onChange={(e) => setBmiData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter weight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height ({bmiData.unit === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  type="number"
                  value={bmiData.height}
                  onChange={(e) => setBmiData(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter height"
                />
              </div>
            </div>
          </div>
        );

      case 'dosage':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={dosageData.weight}
                  onChange={(e) => setDosageData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Patient weight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                <input
                  type="number"
                  value={dosageData.age}
                  onChange={(e) => setDosageData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Patient age"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Drug Name</label>
              <input
                type="text"
                value={dosageData.drug}
                onChange={(e) => setDosageData(prev => ({ ...prev, drug: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter drug name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dose (mg/kg)</label>
                <input
                  type="number"
                  value={dosageData.dose}
                  onChange={(e) => setDosageData(prev => ({ ...prev, dose: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Dose per kg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Creatinine Clearance (ml/min)</label>
                <input
                  type="number"
                  value={dosageData.kidneyClearance}
                  onChange={(e) => setDosageData(prev => ({ ...prev, kidneyClearance: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Kidney function"
                />
              </div>
            </div>
          </div>
        );

      case 'creatinine':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                <input
                  type="number"
                  value={creatinineData.age}
                  onChange={(e) => setCreatinineData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={creatinineData.weight}
                  onChange={(e) => setCreatinineData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={creatinineData.gender}
                  onChange={(e) => setCreatinineData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serum Creatinine (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={creatinineData.serumCreatinine}
                  onChange={(e) => setCreatinineData(prev => ({ ...prev, serumCreatinine: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formula</label>
                <select
                  value={creatinineData.formula}
                  onChange={(e) => setCreatinineData(prev => ({ ...prev, formula: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cockcroft">Cockcroft-Gault</option>
                  <option value="mdrd">MDRD</option>
                  <option value="ckd-epi">CKD-EPI</option>
                </select>
              </div>
            </div>
          </div>
        );

      // Add other calculator inputs...
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <Calculator className="w-12 h-12 mx-auto mb-4" />
            <p>Calculator input form will be implemented</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Medical Calculators</h1>
              <p className="text-xl text-gray-600">Professional Medical Calculation Tools</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Calculator List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search calculators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {calculatorCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-2" />
                  Favorites
                </h3>
                <div className="space-y-2">
                  {favorites.map(favId => {
                    const calc = calculators.find(c => c.id === favId);
                    if (!calc) return null;
                    const Icon = calc.icon;
                    return (
                      <button
                        key={favId}
                        onClick={() => setActiveCalculator(favId)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeCalculator === favId
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{calc.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Calculator List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">All Calculators</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCalculators.map((calculator) => {
                  const Icon = calculator.icon;
                  return (
                    <div key={calculator.id} className="relative">
                      <button
                        onClick={() => setActiveCalculator(calculator.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          activeCalculator === calculator.id
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="w-5 h-5 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{calculator.name}</div>
                            <div className="text-xs text-gray-600">{calculator.description}</div>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => toggleFavorite(calculator.id)}
                        className="absolute top-2 right-2"
                      >
                        <Star className={`w-4 h-4 ${
                          favorites.includes(calculator.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center Panel - Calculator Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              {(() => {
                const calculator = calculators.find(c => c.id === activeCalculator);
                if (!calculator) return null;
                const Icon = calculator.icon;
                
                return (
                  <div className="space-y-6">
                    {/* Calculator Header */}
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-${calculator.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`w-8 h-8 text-${calculator.color}-600`} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{calculator.name}</h2>
                      <p className="text-gray-600 mb-4">{calculator.description}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 font-mono">{calculator.formula}</p>
                      </div>
                    </div>

                    {/* Calculator Input */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Input Parameters</h3>
                      {renderCalculatorInput()}
                    </div>

                    {/* Calculate Button */}
                    <button
                      onClick={executeCalculation}
                      className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 text-lg font-semibold"
                    >
                      <Calculator className="w-6 h-6" />
                      <span>Calculate</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Right Panel - Results & History */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Results */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Results</h3>
                {calculationHistory.length > 0 && (
                  <button
                    onClick={exportHistory}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Download className="w-4 h-4 inline mr-1" />
                    Export
                  </button>
                )}
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {calculationHistory.slice(0, 5).map((calc) => (
                  <div key={calc.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 text-sm">{calc.calculator}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(calc.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {calc.result && typeof calc.result === 'object' ? (
                        Object.entries(calc.result)
                          .filter(([key]) => !['interpretation', 'warnings', 'recommendations'].includes(key))
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <div key={key}>
                              {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                            </div>
                          ))
                      ) : (
                        <div>{calc.result}</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {calculationHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No calculations yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Normal Values Reference</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>BMI Normal:</span>
                  <span className="font-medium">18.5-24.9</span>
                </div>
                <div className="flex justify-between">
                  <span>Creatinine (M):</span>
                  <span className="font-medium">0.7-1.3 mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span>Creatinine (F):</span>
                  <span className="font-medium">0.6-1.1 mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span>GCS Normal:</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex justify-between">
                  <span>APGAR Normal:</span>
                  <span className="font-medium">7-10</span>
                </div>
                <div className="flex justify-between">
                  <span>Cardiac Output:</span>
                  <span className="font-medium">4-8 L/min</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-4 h-4 text-blue-500 mr-2" />
                Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Double-check all inputs before calculating</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Always consider clinical context</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Verify critical calculations manually</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Calculations are aids, not substitutes for clinical judgment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalCalculators;
