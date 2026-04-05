import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Video, MessageSquare, FileText, Calendar, Bell, Clock, Activity, TrendingUp, DollarSign, AlertTriangle, Phone, Mic, MicOff, Share, Send, Plus, Search, Star, Heart, Stethoscope, Pill, Download, Settings, ChevronRight, X, Check, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'react-toastify';

const PATIENTS = [
  { id: 1, name: 'John Smith', age: 45, priority: 'critical', status: 'waiting', time: '10:30 AM', waitTime: '15 min', symptoms: 'Chest pain, shortness of breath', aiNote: 'Possible cardiac event — immediate attention', vitals: { bp: '180/100', hr: 95, temp: '98.6', o2: 94 }, photo: 'https://i.pravatar.cc/100?img=1' },
  { id: 2, name: 'Sarah Johnson', age: 32, priority: 'normal', status: 'waiting', time: '10:45 AM', waitTime: '8 min', symptoms: 'Headache, fever', aiNote: 'Likely viral URTI — standard treatment', vitals: { bp: '118/76', hr: 72, temp: '100.2', o2: 99 }, photo: 'https://i.pravatar.cc/100?img=5' },
  { id: 3, name: 'Robert Chen', age: 58, priority: 'urgent', status: 'in-progress', time: '11:00 AM', waitTime: 'Active', symptoms: 'Abdominal pain', aiNote: 'Requires detailed assessment', vitals: { bp: '142/88', hr: 88, temp: '98.8', o2: 97 }, photo: 'https://i.pravatar.cc/100?img=3' },
  { id: 4, name: 'Maria Garcia', age: 28, priority: 'normal', status: 'completed', time: '09:00 AM', waitTime: 'Done', symptoms: 'Follow-up diabetes', aiNote: 'Stable — continue current management', vitals: { bp: '122/80', hr: 76, temp: '98.4', o2: 98 }, photo: 'https://i.pravatar.cc/100?img=9' },
];

const MESSAGES = [
  { id: 1, sender: 'Dr. Emily Park', role: 'Cardiologist', message: 'Can you review the ECG results for patient John Smith?', time: '10:15 AM', unread: true },
  { id: 2, sender: 'Nurse Jackson', role: 'Head Nurse', message: 'Patient in Room 3 needs immediate attention.', time: '09:58 AM', unread: true },
  { id: 3, sender: 'Lab Department', role: 'Laboratory', message: 'CBC results ready for Maria Garcia.', time: '09:30 AM', unread: false },
];

const STATS = [
  { label: 'Patients Today', value: 24, icon: Users, change: '+3', color: 'text-[#1E40AF]', bg: 'bg-[#EFF6FF]' },
  { label: 'Consultations', value: 18, icon: Stethoscope, change: '+2', color: 'text-green-600', bg: 'bg-green-50' },
  { label: "Today's Revenue", value: '$3,200', icon: DollarSign, change: '+12%', color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Rating', value: '4.9', icon: Star, change: '98 reviews', color: 'text-amber-600', bg: 'bg-amber-50' },
];

const PRIO_COLORS = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  urgent: 'bg-amber-100 text-amber-700 border-amber-200',
  normal: 'bg-green-100 text-green-700 border-green-200',
};

export default function DoctorDashboard() {
  const [patients, setPatients] = useState(PATIENTS);
  const [activePatient, setActivePatient] = useState(null);
  const [activeTab, setActiveTab] = useState('queue');
  const [chatMsg, setChatMsg] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'patient', text: "Hello Doctor, I'm ready for the consultation.", time: '10:30 AM' },
    { id: 2, sender: 'doctor', text: "Hello! I can see you've been experiencing chest pain. Can you describe it in more detail?", time: '10:31 AM' },
  ]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [inConsultation, setInConsultation] = useState(false);
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'queue', label: 'Queue', count: patients.filter(p => p.status !== 'completed').length },
    { id: 'consultation', label: 'Consultation' },
    { id: 'messages', label: 'Messages', count: MESSAGES.filter(m => m.unread).length },
  ];

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'doctor', text: chatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatMsg('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'patient', text: 'Thank you, Doctor.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  const startConsultation = (patient) => {
    setActivePatient(patient);
    setInConsultation(true);
    setActiveTab('consultation');
    setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, status: 'in-progress' } : p));
    toast.success(`Consultation started with ${patient.name}`);
  };

  const endConsultation = () => {
    if (activePatient) setPatients(prev => prev.map(p => p.id === activePatient.id ? { ...p, status: 'completed' } : p));
    setActivePatient(null);
    setInConsultation(false);
    setActiveTab('queue');
    toast.success('Consultation ended');
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Doctor</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Dashboard</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Doctor Dashboard</h1>
            <p className="text-[#64748B] mt-1 text-sm">Manage consultations, patient queue, and communications</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">Online</span>
            </div>
            <button className="btn-secondary flex items-center gap-2"><Settings className="w-4 h-4" />Settings</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((s, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{s.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
                <div className="text-xs text-green-600 mt-0.5">{s.change}</div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}>
            {t.label}
            {t.count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${activeTab === t.id ? 'bg-[#1E40AF] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* QUEUE TAB */}
        {activeTab === 'queue' && (
          <motion.div key="queue" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input className="input pl-9" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="space-y-3">
              {filteredPatients.map(patient => (
                <div key={patient.id} className={`card transition-all ${patient.status === 'completed' ? 'opacity-60' : 'hover:border-[#1E40AF]'}`}>
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img src={patient.photo} alt={patient.name} className="w-10 h-10 rounded-full object-cover" onError={e => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=1E40AF&color=fff`} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${patient.priority === 'critical' ? 'bg-red-500' : patient.priority === 'urgent' ? 'bg-amber-500' : 'bg-green-500'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-[#0F172A] text-sm">{patient.name}</span>
                        <span className="text-xs text-[#94A3B8]">· {patient.age}y</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${PRIO_COLORS[patient.priority]}`}>{patient.priority}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${patient.status === 'completed' ? 'bg-green-100 text-green-700' : patient.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{patient.status}</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">{patient.symptoms}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] text-amber-700">{patient.aiNote}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] text-[#94A3B8]">{patient.time}</span>
                        <span className="text-[10px] text-[#94A3B8]">Wait: {patient.waitTime}</span>
                        <span className="text-[10px] text-[#94A3B8]">BP: {patient.vitals.bp} · HR: {patient.vitals.hr} · SpO₂: {patient.vitals.o2}%</span>
                      </div>
                    </div>
                    {patient.status !== 'completed' && (
                      <div className="flex gap-2">
                        <button onClick={() => startConsultation(patient)} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                          <Video className="w-3 h-3" />Start
                        </button>
                        <button onClick={() => toast.info(`Messaging ${patient.name}`)} className="p-1.5 text-[#64748B] border border-[#E2E8F0] rounded-lg hover:border-[#1E40AF]">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CONSULTATION TAB */}
        {activeTab === 'consultation' && (
          <motion.div key="consult" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {!inConsultation ? (
              <div className="card text-center py-16">
                <Video className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                <p className="font-medium text-[#64748B]">No active consultation</p>
                <p className="text-sm text-[#94A3B8] mt-1">Select a patient from the queue to start</p>
                <button onClick={() => setActiveTab('queue')} className="btn-primary mt-4">View Queue</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Area */}
                <div className="lg:col-span-2">
                  <div className="card p-0 overflow-hidden">
                    {/* Video preview */}
                    <div className="bg-[#0F172A] aspect-video flex items-center justify-center relative">
                      <div className="text-center text-white">
                        <div className="w-20 h-20 bg-[#1E40AF] rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-3xl font-bold">{activePatient?.name[0]}</span>
                        </div>
                        <p className="text-sm opacity-70">{activePatient?.name} — Video Connected</p>
                      </div>
                      {/* Self preview */}
                      <div className="absolute bottom-4 right-4 w-24 h-16 bg-[#1E3A5F] rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">You</span>
                      </div>
                    </div>
                    {/* Controls */}
                    <div className="p-4 flex items-center justify-between border-t border-[#E2E8F0]">
                      <div className="flex gap-3">
                        <button onClick={() => setIsMuted(m => !m)} className={`p-2.5 rounded-lg border transition-colors ${isMuted ? 'bg-red-50 border-red-200 text-red-600' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#1E40AF]'}`}>
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setIsVideoOn(v => !v)} className={`p-2.5 rounded-lg border transition-colors ${!isVideoOn ? 'bg-red-50 border-red-200 text-red-600' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#1E40AF]'}`}>
                          {isVideoOn ? <Video className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                        </button>
                        <button onClick={() => toast.info('Screen sharing...')} className="p-2.5 border border-[#E2E8F0] rounded-lg text-[#64748B] hover:border-[#1E40AF]">
                          <Share className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={endConsultation} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        <Phone className="w-4 h-4" />End Call
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  {activePatient && (
                    <div className="card mt-4">
                      <h3 className="font-semibold text-[#0F172A] mb-3 text-sm">Patient Vitals</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {Object.entries(activePatient.vitals).map(([k, v]) => (
                          <div key={k} className="text-center p-2 bg-[#F8FAFC] rounded-lg">
                            <div className="font-bold text-[#0F172A] text-sm">{v}</div>
                            <div className="text-[10px] text-[#64748B]">{k.toUpperCase()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat */}
                <div className="card flex flex-col h-[500px]">
                  <h3 className="font-semibold text-[#0F172A] mb-3 text-sm border-b border-[#E2E8F0] pb-3">Consultation Chat</h3>
                  <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex gap-2 ${msg.sender === 'doctor' ? 'flex-row-reverse' : ''}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${msg.sender === 'doctor' ? 'bg-[#1E40AF] text-white rounded-tr-sm' : 'bg-[#F1F5F9] text-[#374151] rounded-tl-sm'}`}>
                          {msg.text}
                          <div className={`text-[10px] mt-1 ${msg.sender === 'doctor' ? 'text-blue-200' : 'text-[#94A3B8]'}`}>{msg.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input className="input flex-1 text-xs py-2" placeholder="Type a message..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                    <button onClick={sendMessage} className="p-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1D3FAA] transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <motion.div key="messages" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="space-y-3">
              {MESSAGES.map(msg => (
                <div key={msg.id} className={`card hover:border-[#1E40AF] transition-colors cursor-pointer ${msg.unread ? 'border-l-2 border-l-[#1E40AF]' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#1E40AF]">{msg.sender[0]}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-[#0F172A] text-sm">{msg.sender}</span>
                          <span className="text-xs text-[#94A3B8] ml-2">{msg.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#94A3B8]">{msg.time}</span>
                          {msg.unread && <div className="w-2 h-2 bg-[#1E40AF] rounded-full" />}
                        </div>
                      </div>
                      <p className="text-sm text-[#64748B] mt-1">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
