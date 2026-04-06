import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, MessageSquare, Send, Share, Users, Monitor, PenTool, Globe, Clock, User, Heart, Activity, Stethoscope, Eye, EyeOff, Zap, Wifi, X, Plus, MoreVertical, Download, Settings, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'hi', label: 'Hindi' },
  { code: 'zh', label: 'Chinese' },
];

const INITIAL_CHAT = [
  { id: 1, sender: 'patient', name: 'Patient', message: "Hello Doctor, I'm ready for the consultation.", time: '09:00 AM' },
  { id: 2, sender: 'doctor', name: 'Dr. User', message: "Hello! Good to see you. How are you feeling today?", time: '09:01 AM' },
  { id: 3, sender: 'patient', name: 'Patient', message: "I've been having chest pains for the past 2 days.", time: '09:01 AM' },
];

export default function ConsultationModes() {
  const [mode, setMode] = useState('video'); // video, audio, chat
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT);
  const [newMessage, setNewMessage] = useState('');
  const [language, setLanguage] = useState('en');
  const [connectionQuality, setConnectionQuality] = useState('excellent');
  const [tab, setTab] = useState('video');
  const chatEndRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => setCallDuration(d => d + 1), 1000);
      const qualities = ['excellent', 'good', 'fair'];
      setTimeout(() => setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]), 5000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const startCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
    toast.success('Call started');
  };

  const endCall = () => {
    setIsCallActive(false);
    toast.info(`Call ended — Duration: ${fmt(callDuration)}`);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = { id: Date.now(), sender: 'doctor', name: 'Dr. User', message: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'patient', name: 'Patient', message: 'Thank you, doctor.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  const qualityColor = { excellent: 'text-green-500', good: 'text-yellow-500', fair: 'text-amber-500', poor: 'text-red-500' };

  const tabs = [
    { id: 'video', label: 'Video Consultation' },
    { id: 'audio', label: 'Audio Call' },
    { id: 'chat', label: 'Chat Only' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Consultation</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Live Session</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Consultation Modes</h1>
            <p className="text-[#64748B] mt-1 text-sm">Video, audio, and chat consultation with real-time features</p>
          </div>
          {isCallActive && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-red-700">{fmt(callDuration)}</span>
              </div>
              <div className={`flex items-center gap-1.5 text-xs ${qualityColor[connectionQuality]}`}>
                <Wifi className="w-3.5 h-3.5" />
                <span className="capitalize">{connectionQuality}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'
            }`}>{t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video/Audio Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Feed */}
          {tab !== 'chat' && (
            <div className="card p-0 overflow-hidden">
              <div className={`${tab === 'video' ? 'aspect-video' : 'h-24'} bg-[#0F172A] flex items-center justify-center relative`}>
                {tab === 'video' ? (
                  isCallActive ? (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-[#1E40AF] rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-4xl font-bold text-white">P</span>
                      </div>
                      <p className="text-white/70 text-sm">Patient — Connected</p>
                      {isRecording && <div className="flex items-center gap-2 mt-2 justify-center"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /><span className="text-white/70 text-xs">Recording</span></div>}
                    </div>
                  ) : (
                    <div className="text-center">
                      <VideoOff className="w-12 h-12 text-white/30 mx-auto mb-3" />
                      <p className="text-white/50 text-sm">Call not started</p>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-3 text-white/70">
                    <Phone className="w-5 h-5" />
                    <span className="text-sm">{isCallActive ? `Audio call active — ${fmt(callDuration)}` : 'Audio call not started'}</span>
                  </div>
                )}
                {/* Self view */}
                {tab === 'video' && isCallActive && (
                  <div className="absolute bottom-4 right-4 w-28 h-20 bg-[#1E3A5F] rounded-lg flex items-center justify-center border border-white/20">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-1"><span className="text-white text-xs font-bold">You</span></div>
                    </div>
                    {!isVideoOn && <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center"><VideoOff className="w-5 h-5 text-white/50" /></div>}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="p-4 flex items-center justify-between border-t border-[#E2E8F0]">
                <div className="flex gap-3">
                  {tab === 'video' && (
                    <button onClick={() => setIsVideoOn(v => !v)} className={`p-2.5 rounded-lg border transition-colors ${!isVideoOn ? 'bg-red-50 border-red-200 text-red-600' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#1E40AF]'}`}>
                      {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </button>
                  )}
                  <button onClick={() => setIsAudioOn(a => !a)} className={`p-2.5 rounded-lg border transition-colors ${!isAudioOn ? 'bg-red-50 border-red-200 text-red-600' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#1E40AF]'}`}>
                    {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                  {tab === 'video' && (
                    <>
                      <button onClick={() => { setIsScreenSharing(s => !s); toast.info(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started'); }} className={`p-2.5 rounded-lg border transition-colors ${isScreenSharing ? 'bg-[#EFF6FF] border-[#1E40AF] text-[#1E40AF]' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#1E40AF]'}`}>
                        <Monitor className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setIsRecording(r => !r); toast.info(isRecording ? 'Recording stopped' : 'Recording started'); }} className={`p-2.5 rounded-lg border transition-colors ${isRecording ? 'bg-red-50 border-red-200 text-red-600' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#1E40AF]'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 ${isRecording ? 'bg-red-500 border-red-500' : 'border-current'}`} />
                      </button>
                    </>
                  )}
                  <button onClick={() => setShowChat(c => !c)} className={`p-2.5 rounded-lg border transition-colors ${showChat ? 'bg-[#EFF6FF] border-[#1E40AF] text-[#1E40AF]' : 'border-[#E2E8F0] text-[#64748B]'}`}>
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-3">
                  {!isCallActive ? (
                    <button onClick={startCall} className="btn-primary flex items-center gap-2">
                      <Phone className="w-4 h-4" />Start Call
                    </button>
                  ) : (
                    <button onClick={endCall} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      <PhoneOff className="w-4 h-4" />End Call
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Patient Info */}
          <div className="card">
            <h2 className="font-semibold text-[#0F172A] mb-3 text-sm">Current Patient</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#1E40AF]" />
              </div>
              <div>
                <div className="font-medium text-[#0F172A]">John Smith</div>
                <div className="text-xs text-[#64748B]">45 years · Male · Consultation #1247</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'BP', value: '140/90', status: 'elevated' },
                { label: 'HR', value: '88 bpm', status: 'normal' },
                { label: 'Temp', value: '98.6°F', status: 'normal' },
                { label: 'SpO₂', value: '96%', status: 'normal' },
              ].map((v, i) => (
                <div key={i} className="text-center p-2 bg-[#F8FAFC] rounded-lg">
                  <div className={`font-bold text-sm ${v.status === 'elevated' ? 'text-amber-600' : 'text-[#0F172A]'}`}>{v.value}</div>
                  <div className="text-[10px] text-[#64748B]">{v.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-xs font-medium text-amber-800">Chief Complaint</div>
              <div className="text-xs text-amber-700 mt-0.5">Chest pain for 2 days, moderate severity, non-radiating</div>
            </div>
          </div>

          {/* Translation */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#1E40AF]" />
                <span className="text-sm font-medium text-[#0F172A]">Language & Translation</span>
              </div>
              <select className="input w-auto text-sm py-1.5" value={language} onChange={e => { setLanguage(e.target.value); toast.info('Translation enabled'); }}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {(showChat || tab === 'chat') && (
          <div className="card flex flex-col h-[600px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
              <h3 className="font-semibold text-[#0F172A] text-sm">Chat</h3>
              {tab !== 'chat' && <button onClick={() => setShowChat(false)} className="text-[#94A3B8] hover:text-[#0F172A]"><X className="w-4 h-4" /></button>}
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.sender === 'doctor' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${msg.sender === 'doctor' ? 'bg-[#1E40AF] text-white' : 'bg-[#E2E8F0] text-[#64748B]'}`}>{msg.name[0]}</div>
                  <div className={`max-w-[75%] px-3 py-2 rounded-xl text-xs ${msg.sender === 'doctor' ? 'bg-[#1E40AF] text-white rounded-tr-sm' : 'bg-[#F1F5F9] text-[#374151] rounded-tl-sm'}`}>
                    {msg.message}
                    <div className={`text-[10px] mt-1 ${msg.sender === 'doctor' ? 'text-blue-200' : 'text-[#94A3B8]'}`}>{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <input className="input flex-1 text-xs py-2" placeholder="Type a message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
              <button onClick={sendMessage} className="p-2 bg-[#1E40AF] text-white rounded-lg hover:bg-[#1D3FAA] transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
