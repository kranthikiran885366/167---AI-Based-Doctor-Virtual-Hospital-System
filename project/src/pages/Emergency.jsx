import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, Clock, Heart, Activity, Thermometer, Brain, Zap, Shield, Play, Pause, RotateCcw, ChevronRight, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';

const EMERGENCY_TYPES = [
  { id: 'heart_attack', title: 'Heart Attack', icon: Heart, urgency: 'critical', description: 'Chest pain, arm pain, shortness of breath' },
  { id: 'choking', title: 'Choking', icon: Activity, urgency: 'critical', description: 'Cannot breathe, speak, or cough effectively' },
  { id: 'seizure', title: 'Seizure', icon: Brain, urgency: 'high', description: 'Uncontrolled shaking, loss of consciousness' },
  { id: 'severe_bleeding', title: 'Severe Bleeding', icon: Zap, urgency: 'critical', description: 'Heavy bleeding that will not stop' },
  { id: 'burns', title: 'Burns', icon: Thermometer, urgency: 'high', description: 'Severe burns from heat, chemicals, or electricity' },
  { id: 'poisoning', title: 'Poisoning', icon: Shield, urgency: 'critical', description: 'Ingested harmful substances' },
  { id: 'stroke', title: 'Stroke', icon: Brain, urgency: 'critical', description: 'FAST: Face drooping, Arm weakness, Speech difficulty' },
  { id: 'anaphylaxis', title: 'Anaphylaxis', icon: AlertTriangle, urgency: 'critical', description: 'Severe allergic reaction with breathing difficulty' },
];

const GUIDES = {
  heart_attack: {
    title: 'Heart Attack Response',
    steps: [
      { title: 'Call Emergency Services', instruction: 'Call 911 (or local emergency number) immediately. Do not drive yourself.', critical: true, time: null },
      { title: 'Have patient sit or lie down', instruction: 'Help the person sit in a comfortable position. Loosen any tight clothing.', critical: false, time: null },
      { title: 'Give aspirin if available', instruction: 'If not allergic, give 325mg aspirin and have them chew it slowly. Do not give if unconscious.', critical: false, time: null },
      { title: 'Begin CPR if unconscious', instruction: 'If not breathing: 30 chest compressions (2"/5cm deep) at 100-120/min, then 2 rescue breaths. Repeat.', critical: true, time: 30 },
      { title: 'Use AED if available', instruction: 'Turn on AED, attach pads, follow voice instructions exactly. Continue CPR when prompted.', critical: true, time: null },
    ],
  },
  choking: {
    title: 'Choking Response',
    steps: [
      { title: 'Assess the situation', instruction: 'Ask "Are you choking?" If they can cough or speak, encourage coughing. If not, act immediately.', critical: true, time: null },
      { title: 'Call for help', instruction: 'Have someone call 911 while you assist. If alone, act first then call.', critical: true, time: null },
      { title: 'Perform abdominal thrusts', instruction: 'Stand behind them, arms around waist. Make a fist above navel, grasp with other hand. Pull sharply upward 5 times.', critical: true, time: null },
      { title: 'Alternate with back blows', instruction: '5 back blows between shoulder blades with heel of hand. Alternate with abdominal thrusts until object clears.', critical: false, time: null },
      { title: 'If unconscious, begin CPR', instruction: 'Lower to ground, call 911, begin CPR. Look in mouth before breaths — remove object if visible.', critical: true, time: null },
    ],
  },
  seizure: {
    title: 'Seizure Response',
    steps: [
      { title: 'Stay calm and call for help', instruction: 'Do not restrain the person. Time the seizure — call 911 if > 5 minutes or first seizure.', critical: true, time: null },
      { title: 'Protect from injury', instruction: 'Clear hard or sharp objects away. Cushion their head with something soft.', critical: false, time: null },
      { title: 'Position safely', instruction: 'Turn gently on their side (recovery position) to prevent choking. Never put anything in mouth.', critical: true, time: null },
      { title: 'Monitor and stay with them', instruction: 'Stay until fully conscious. Note seizure duration and symptoms for medical team.', critical: false, time: null },
      { title: 'Post-seizure care', instruction: 'Person may be confused afterward (postictal state). Speak calmly and reassuringly.', critical: false, time: null },
    ],
  },
  severe_bleeding: {
    title: 'Severe Bleeding Response',
    steps: [
      { title: 'Call 911 immediately', instruction: 'Severe bleeding can cause unconsciousness in minutes. Call emergency services now.', critical: true, time: null },
      { title: 'Apply direct pressure', instruction: 'Press firmly on wound with clean cloth or gauze. Do not lift to check bleeding — add more cloth if soaked.', critical: true, time: null },
      { title: 'Elevate if possible', instruction: 'Raise the injured area above heart level if no broken bones are suspected.', critical: false, time: null },
      { title: 'Apply tourniquet if needed', instruction: 'For limb: apply 2-3 inches above wound, tighten until bleeding stops. Note time applied.', critical: true, time: null },
      { title: 'Keep patient warm and calm', instruction: 'Lay flat, elevate legs if not injured, cover with blanket to prevent shock.', critical: false, time: null },
    ],
  },
  burns: {
    title: 'Burns Response',
    steps: [
      { title: 'Ensure safety first', instruction: 'Remove from heat source. For chemical burns: remove contaminated clothing and flush with water.', critical: true, time: null },
      { title: 'Cool the burn', instruction: 'Run cool (not cold) water over burn for 10-20 minutes. Do NOT use ice, butter, or toothpaste.', critical: true, time: 15 },
      { title: 'Call 911 for severe burns', instruction: 'Call 911 if: larger than 3 inches, on face/hands/genitals/joints, or from electricity/chemicals.', critical: true, time: null },
      { title: 'Cover loosely', instruction: 'Cover with sterile, non-fluffy material. Do NOT burst blisters or remove stuck clothing.', critical: false, time: null },
      { title: 'Monitor for shock', instruction: 'Keep warm, lay flat, elevate legs. Give sips of water if conscious and not vomiting.', critical: false, time: null },
    ],
  },
  poisoning: {
    title: 'Poisoning Response',
    steps: [
      { title: 'Call Poison Control', instruction: 'Call 1-800-222-1222 (US) or local poison control. Have the substance container ready.', critical: true, time: null },
      { title: 'Call 911 if serious', instruction: 'Call 911 immediately if: unconscious, not breathing, seizures, or corrosive substance ingested.', critical: true, time: null },
      { title: 'Do NOT induce vomiting', instruction: 'Unless specifically told by poison control. Vomiting can cause more damage with corrosives.', critical: true, time: null },
      { title: 'Identify the substance', instruction: 'Collect containers, pills, or plants. Note the time and amount ingested for medical team.', critical: false, time: null },
      { title: 'Monitor breathing and consciousness', instruction: 'Keep patient awake if possible. Turn on side if drowsy. Follow poison control instructions exactly.', critical: false, time: null },
    ],
  },
  stroke: {
    title: 'Stroke Response (FAST)',
    steps: [
      { title: 'F - Face drooping', instruction: 'Ask person to smile. Is one side drooping or numb? Asymmetry is a warning sign.', critical: true, time: null },
      { title: 'A - Arm weakness', instruction: 'Ask them to raise both arms. Does one drift downward? This indicates possible stroke.', critical: true, time: null },
      { title: 'S - Speech difficulty', instruction: 'Ask them to repeat a simple phrase. Is speech slurred, strange, or unable to speak?', critical: true, time: null },
      { title: 'T - Time to call 911', instruction: 'If ANY of these signs: call 911 immediately. Note the time symptoms began — critical for treatment.', critical: true, time: null },
      { title: 'While waiting', instruction: 'Keep calm and comfortable. Do NOT give food or water. Do not leave alone.', critical: false, time: null },
    ],
  },
  anaphylaxis: {
    title: 'Anaphylaxis Response',
    steps: [
      { title: 'Use epinephrine (EpiPen) immediately', instruction: 'Inject epinephrine into outer thigh (through clothing if needed). Hold for 10 seconds.', critical: true, time: null },
      { title: 'Call 911', instruction: 'Call emergency services even if symptoms improve — effects may return. Go to ER.', critical: true, time: null },
      { title: 'Second injection if needed', instruction: 'If no improvement after 5-15 minutes and second dose available, administer second injection.', critical: true, time: null },
      { title: 'Position correctly', instruction: 'Have person lie flat with legs elevated (unless breathing is easier sitting up). Keep them still.', critical: false, time: null },
      { title: 'Monitor and keep warm', instruction: 'Monitor breathing. If unconscious and not breathing, begin CPR. Cover with blanket.', critical: false, time: null },
    ],
  },
};

export default function Emergency() {
  const [selected, setSelected] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    let interval;
    if (timerRunning) interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const selectEmergency = (type) => {
    setSelected(type);
    setCurrentStep(0);
    setTimer(0);
    setTimerRunning(true);
    setCompletedSteps([]);
    toast.warning(`Emergency protocol: ${GUIDES[type.id]?.title} activated`, { autoClose: 3000 });
  };

  const reset = () => {
    setSelected(null);
    setCurrentStep(0);
    setTimer(0);
    setTimerRunning(false);
    setCompletedSteps([]);
  };

  const toggleStep = (i) => {
    setCompletedSteps(prev => prev.includes(i) ? prev.filter(s => s !== i) : [...prev, i]);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); toast.success('Location acquired'); },
        () => toast.error('Location unavailable')
      );
    }
  };

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const guide = selected ? GUIDES[selected.id] : null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Emergency</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">First Response Protocol</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Emergency Response</h1>
            <p className="text-[#64748B] mt-1 text-sm">Step-by-step first aid protocols for critical situations</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:911" className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              <Phone className="w-4 h-4" />Call 911
            </a>
            <button onClick={getLocation} className="btn-secondary flex items-center gap-2">
              <MapPin className="w-4 h-4" />Share Location
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Alert Bar */}
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div className="flex-1">
          <span className="text-sm font-semibold text-red-800">Always call emergency services first.</span>
          <span className="text-sm text-red-700 ml-2">These protocols assist — not replace — professional medical care.</span>
        </div>
        {location && (
          <span className="text-xs text-red-600 font-medium">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="select" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className="font-semibold text-[#0F172A] mb-4">Select Emergency Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {EMERGENCY_TYPES.map(type => (
                <motion.button
                  key={type.id}
                  onClick={() => selectEmergency(type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="card text-left hover:border-red-300 hover:shadow-sm transition-all group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    type.urgency === 'critical' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    <type.icon className={`w-5 h-5 ${type.urgency === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
                  </div>
                  <div className="font-semibold text-[#0F172A] text-sm mb-1">{type.title}</div>
                  <div className="text-xs text-[#64748B]">{type.description}</div>
                  <div className={`mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${
                    type.urgency === 'critical' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${type.urgency === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    {type.urgency}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="guide" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Guide Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button onClick={reset} className="p-2 text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0] rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0F172A]">{guide.title}</h2>
                  <p className="text-sm text-[#64748B]">{completedSteps.length}/{guide.steps.length} steps completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Timer */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                  <Clock className="w-4 h-4 text-[#64748B]" />
                  <span className="font-mono text-lg font-bold text-[#0F172A]">{fmt(timer)}</span>
                  <button onClick={() => setTimerRunning(r => !r)} className="text-[#64748B] hover:text-[#1E40AF]">
                    {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setTimer(0); setTimerRunning(false); }} className="text-[#64748B] hover:text-[#1E40AF]">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
                <a href="tel:911" className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  <Phone className="w-4 h-4" />911
                </a>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#1E40AF] rounded-full"
                  animate={{ width: `${(completedSteps.length / guide.steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {guide.steps.map((step, i) => {
                const done = completedSteps.includes(i);
                const isCurrent = i === currentStep;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`border rounded-xl p-5 transition-all ${
                      done ? 'border-green-200 bg-green-50' :
                      isCurrent ? 'border-[#1E40AF] bg-[#EFF6FF]' :
                      'border-[#E2E8F0] bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => { toggleStep(i); if (!done && i === currentStep) setCurrentStep(i + 1); }}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          done ? 'border-green-500 bg-green-500 text-white' :
                          isCurrent ? 'border-[#1E40AF] bg-white' :
                          'border-[#CBD5E1] bg-white'
                        }`}
                      >
                        {done ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-bold text-[#64748B]">{i + 1}</span>}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold text-sm ${done ? 'text-green-800 line-through' : 'text-[#0F172A]'}`}>{step.title}</h3>
                          {step.critical && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded border border-red-200">Critical</span>}
                          {step.time && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded border border-blue-200">{step.time}s</span>}
                        </div>
                        <p className={`text-sm ${done ? 'text-green-700' : 'text-[#374151]'}`}>{step.instruction}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${isCurrent ? 'text-[#1E40AF]' : 'text-[#CBD5E1]'}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {completedSteps.length === guide.steps.length && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card bg-green-50 border-green-200 mt-6 text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-display text-xl font-bold text-green-800 mb-2">Protocol Complete</h3>
                <p className="text-green-700 text-sm mb-4">All steps completed in {fmt(timer)}. Continue monitoring until professional help arrives.</p>
                <button onClick={reset} className="btn-secondary">Return to Emergency Types</button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
