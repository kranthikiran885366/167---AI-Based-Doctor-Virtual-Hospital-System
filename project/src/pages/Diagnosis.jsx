import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Mic, MicOff, Bot, User, AlertTriangle, CheckCircle, Clock, Activity, Heart, Thermometer, Brain, Camera, FileText, Zap, Shield, Download, Bookmark, X, Plus, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext.jsx';

const QUICK_SYMPTOMS = [
  { name: 'Fever', icon: Thermometer },
  { name: 'Headache', icon: Brain },
  { name: 'Cough', icon: Activity },
  { name: 'Chest Pain', icon: Heart },
  { name: 'Fatigue', icon: Clock },
  { name: 'Nausea', icon: AlertTriangle },
  { name: 'Sore Throat', icon: Activity },
  { name: 'Shortness of Breath', icon: Activity },
];

const QUICK_QUESTIONS = [
  'How long have you had these symptoms?',
  'Rate your pain from 1-10',
  'Are you taking any medications?',
  'Do you have any allergies?',
  'Any recent travel or exposure?',
  'Have you had this before?',
];

function buildAIResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('fever') || msg.includes('temperature')) {
    return {
      text: "Fever is a common immune response. Key questions: How high is the temperature? How long have you had it? Are there other symptoms like chills, sweating, or body aches?\n\n**Possible causes:** Viral infection (most common), bacterial infection, inflammatory conditions.\n\n**Immediate advice:** Stay hydrated, rest, and monitor temperature. Seek care if > 103°F (39.4°C) or persistent > 3 days.",
      urgency: 'moderate',
      suggestions: ['Paracetamol 500mg for fever > 99°F', 'Drink 8+ glasses of water', 'Monitor every 4 hours']
    };
  }
  if (msg.includes('chest pain') || msg.includes('chest')) {
    return {
      text: "⚠️ Chest pain requires immediate evaluation. Please answer:\n- Is the pain sharp, dull, or pressure-like?\n- Does it radiate to arm, jaw, or back?\n- Are you short of breath or sweating?\n\n**If severe or crushing pain: Call 911 immediately.**\n\nChest pain can indicate cardiac issues, muscle strain, GERD, or anxiety.",
      urgency: 'high',
      suggestions: ['Call 911 if severe', 'Sit upright and rest', 'Do not eat or drink until evaluated']
    };
  }
  if (msg.includes('headache') || msg.includes('head')) {
    return {
      text: "Headaches are very common and usually benign. Let me help assess yours:\n- Location: forehead, temples, back of head, or all over?\n- Character: throbbing, pressure, stabbing?\n- Associated with: nausea, light sensitivity, vision changes?\n\n**Common types:** Tension headache (most common), Migraine, Cluster headache.\n\n**Seek immediate care** if: sudden severe headache, worst headache of life, with fever/stiff neck, or after head injury.",
      urgency: 'low',
      suggestions: ['Rest in a quiet, dark room', 'Stay hydrated', 'Paracetamol or Ibuprofen if no contraindications']
    };
  }
  if (msg.includes('cough')) {
    return {
      text: "Cough assessment:\n- Is it dry or productive (with phlegm)?\n- Color of phlegm if present?\n- Any fever, shortness of breath, or wheezing?\n- Duration: acute (< 3 weeks) or chronic?\n\n**Common causes:** Viral URTI, allergies, asthma, post-nasal drip.\n\n**Seek care if:** Coughing blood, high fever, difficulty breathing, or lasting > 3 weeks.",
      urgency: 'low',
      suggestions: ['Honey for soothing (not for children < 1yr)', 'Stay hydrated', 'Humidifier may help']
    };
  }
  if (msg.includes('nausea') || msg.includes('vomit')) {
    return {
      text: "Nausea and vomiting assessment:\n- Duration and frequency?\n- Any abdominal pain or fever?\n- Recent food or travel history?\n- Any blood in vomit?\n\n**Common causes:** Gastroenteritis, food poisoning, motion sickness, pregnancy, medications.\n\n**Seek care if:** Unable to keep fluids down > 24 hours, blood in vomit, severe abdominal pain, or signs of dehydration.",
      urgency: 'moderate',
      suggestions: ['Small sips of clear fluids', 'BRAT diet when tolerating food', 'Rest']
    };
  }
  return {
    text: "Thank you for sharing that. To provide the most accurate assessment, I need a bit more information:\n\n1. **Duration:** How long have you been experiencing this?\n2. **Severity:** Rate it 1-10 (10 being worst)\n3. **Associated symptoms:** Any other symptoms alongside this?\n4. **Medical history:** Any relevant conditions or medications?\n\nPlease describe your symptoms in more detail and I'll provide a comprehensive assessment.",
    urgency: 'low',
    suggestions: ['Describe symptoms in detail', 'Note when symptoms started', 'List any medications']
  };
}

export default function Diagnosis() {
  const { addMedicalRecord } = useUser();
  const [messages, setMessages] = useState([{
    id: 1, type: 'bot', timestamp: new Date().toISOString(),
    text: "Hello, I'm your AI Medical Assistant. I'll help analyze your symptoms and provide evidence-based guidance.\n\nPlease describe what you're experiencing, or use the quick symptom buttons below. Remember: I support — not replace — professional medical care.",
    urgency: null, suggestions: []
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showSymptoms, setShowSymptoms] = useState(true);
  const messagesEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const msgText = text || (input + (selectedSymptoms.length ? ' ' + selectedSymptoms.join(', ') : '')).trim();
    if (!msgText) return;

    const userMsg = { id: Date.now(), type: 'user', text: msgText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedSymptoms([]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const response = buildAIResponse(msgText);
    const botMsg = { id: Date.now() + 1, type: 'bot', text: response.text, urgency: response.urgency, suggestions: response.suggestions, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
    inputRef.current?.focus();
  };

  const toggleSymptom = (name) => {
    setSelectedSymptoms(prev => prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]);
  };

  const urgencyColors = { high: 'border-red-200 bg-red-50', moderate: 'border-amber-200 bg-amber-50', low: 'border-green-200 bg-green-50' };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Clinical AI</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Symptom Chat</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F172A]">AI Diagnosis Chat</h1>
            <p className="text-[#64748B] text-sm">Real-time symptom analysis and medical guidance</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-700">AI Online</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.type === 'bot' ? 'bg-[#1E40AF]' : 'bg-[#E2E8F0]'
            }`}>
              {msg.type === 'bot' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-[#64748B]" />}
            </div>
            <div className={`max-w-[75%] ${msg.type === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
              <div className={`rounded-xl px-4 py-3 text-sm ${
                msg.type === 'user'
                  ? 'bg-[#1E40AF] text-white rounded-tr-sm'
                  : `bg-white border border-[#E2E8F0] text-[#374151] rounded-tl-sm ${msg.urgency ? urgencyColors[msg.urgency] : ''}`
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i} className={msg.type === 'user' ? 'text-white' : 'text-[#0F172A]'}>{part}</strong> : part
                  )}
                </div>
              </div>
              {msg.suggestions?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.suggestions.map((s, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-1 bg-[#EFF6FF] text-[#1E40AF] text-xs rounded border border-[#BFDBFE]">
                      <CheckCircle className="w-3 h-3" />{s}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-[10px] text-[#94A3B8]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1E40AF] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 bg-[#94A3B8] rounded-full"
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Quick Symptoms */}
      <div className="mb-3">
        <button onClick={() => setShowSymptoms(s => !s)} className="flex items-center gap-1 text-xs text-[#64748B] mb-2">
          <ChevronDown className={`w-3 h-3 transition-transform ${showSymptoms ? '' : '-rotate-90'}`} />
          Quick Symptoms
        </button>
        {showSymptoms && (
          <div className="flex flex-wrap gap-2">
            {QUICK_SYMPTOMS.map(s => (
              <button key={s.name} onClick={() => toggleSymptom(s.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  selectedSymptoms.includes(s.name) ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'bg-white text-[#374151] border-[#E2E8F0] hover:border-[#1E40AF]'
                }`}>
                <s.icon className="w-3 h-3" />{s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {QUICK_QUESTIONS.map((q, i) => (
          <button key={i} onClick={() => send(q)}
            className="flex-shrink-0 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] rounded-lg hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-end gap-3">
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 absolute bottom-24 left-6 right-6 bg-white border border-[#E2E8F0] rounded-lg p-2">
            {selectedSymptoms.map(s => (
              <span key={s} className="flex items-center gap-1 px-2 py-0.5 bg-[#EFF6FF] text-[#1E40AF] text-xs rounded">
                {s} <button onClick={() => toggleSymptom(s)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            rows={2}
            className="input resize-none pr-4 leading-relaxed"
            placeholder="Describe your symptoms..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setRecording(r => !r)}
            className={`p-2.5 rounded-lg border transition-colors ${recording ? 'bg-red-50 border-red-200 text-red-600' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#1E40AF]'}`}>
            {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button onClick={() => send()} disabled={loading || (!input.trim() && !selectedSymptoms.length)}
            className="p-2.5 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1D3FAA] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-[#94A3B8] mt-2">AI analysis is for informational purposes only. Always consult a healthcare professional.</p>
    </div>
  );
}
