import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor, MessageSquare, Users, Settings, Share, Maximize, Minimize, Camera, Bell, Clock, Shield, Wifi } from 'lucide-react';
import { toast } from 'react-toastify';

export default function VideoConsultation() {
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [participants, setParticipants] = useState([{ id: 1, name: 'Patient', type: 'patient', videoOn: true, micOn: true }]);
  const [quality, setQuality] = useState('HD');

  useEffect(() => {
    let timer;
    if (isInCall) { timer = setInterval(() => setDuration(d => d + 1), 1000); }
    return () => clearInterval(timer);
  }, [isInCall]);

  const fmt = (s) => `${Math.floor(s / 3600).toString().padStart(2, '0')}:${Math.floor((s % 3600) / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const startCall = () => { setIsInCall(true); setDuration(0); toast.success('Call started'); };
  const endCall = () => { setIsInCall(false); toast.info(`Call ended — Duration: ${fmt(duration)}`); };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Consultation</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Video Call</span></div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Video Consultation</h1>
            <p className="text-[#64748B] mt-1 text-sm">HIPAA-compliant HD video consultation platform</p>
          </div>
          {isInCall && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-red-700 font-mono">{fmt(duration)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-600">
                <Wifi className="w-3.5 h-3.5" /><span>HD · Encrypted</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Video Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Video Stage */}
          <div className={`card p-0 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
            <div className="bg-[#0F172A] relative" style={{ aspectRatio: '16/9' }}>
              {/* Remote Video */}
              {isInCall ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-[#1E40AF] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-5xl font-bold text-white">P</span>
                    </div>
                    <div className="text-white font-medium">Patient</div>
                    <div className="text-white/60 text-sm">Video connected</div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <div className="text-white/50 text-sm">Call not started</div>
                    <button onClick={startCall} className="mt-6 flex items-center gap-2 px-6 py-3 bg-[#1E40AF] text-white rounded-xl font-medium hover:bg-[#1D3FAA] transition-colors mx-auto">
                      <Phone className="w-4 h-4" />Start Video Call
                    </button>
                  </div>
                </div>
              )}

              {/* Self Preview */}
              {isInCall && (
                <div className="absolute bottom-4 right-4 w-36 h-24 bg-[#1E3A5F] rounded-xl border border-white/20 flex items-center justify-center overflow-hidden">
                  {isVideoOn ? (
                    <div className="text-center">
                      <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center mx-auto"><span className="text-white text-sm font-bold">D</span></div>
                      <div className="text-white/70 text-[10px] mt-1">You (Doctor)</div>
                    </div>
                  ) : (
                    <VideoOff className="w-6 h-6 text-white/40" />
                  )}
                </div>
              )}

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white text-xs rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />Recording
                </div>
              )}

              {/* Fullscreen toggle */}
              <button onClick={() => setIsFullscreen(f => !f)} className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 backdrop-blur-sm">
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>

            {/* Controls Bar */}
            <div className="bg-[#0F172A] border-t border-white/10 p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsMicOn(m => !m)} className={`p-3 rounded-xl transition-colors ${!isMicOn ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsVideoOn(v => !v)} className={`p-3 rounded-xl transition-colors ${!isVideoOn ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
                <button onClick={() => { setIsScreenSharing(s => !s); toast.info(isScreenSharing ? 'Screen share stopped' : 'Screen sharing started'); }} className={`p-3 rounded-xl transition-colors ${isScreenSharing ? 'bg-[#1E40AF] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  <Monitor className="w-4 h-4" />
                </button>
                <button onClick={() => { setIsRecording(r => !r); toast.info(isRecording ? 'Recording stopped' : 'Recording started'); }} className={`p-3 rounded-xl transition-colors ${isRecording ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 ${isRecording ? 'bg-white border-white' : 'border-white'}`} />
                </button>
                <button onClick={() => toast.info('More options...')} className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              {isInCall ? (
                <button onClick={endCall} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors">
                  <PhoneOff className="w-4 h-4" />End Call
                </button>
              ) : (
                <button onClick={startCall} className="flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] text-white rounded-xl font-medium hover:bg-[#1D3FAA] transition-colors">
                  <Phone className="w-4 h-4" />Join Call
                </button>
              )}
            </div>
          </div>

          {/* Patient Info Strip */}
          {isInCall && (
            <div className="card">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="w-9 h-9 bg-[#EFF6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-[#1E40AF] text-sm">P</span>
                </div>
                <div>
                  <div className="font-medium text-[#0F172A] text-sm">Patient — John Smith</div>
                  <div className="text-xs text-[#64748B]">45 years · Appointment: Cardiology Consultation</div>
                </div>
                <div className="ml-auto flex items-center gap-3 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" />HIPAA Encrypted</span>
                  <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-green-500" />HD Quality</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-[#0F172A] mb-3 text-sm">Participants</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFC]">
                <div className="w-7 h-7 bg-[#1E40AF] rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-bold">D</span></div>
                <div className="flex-1 text-xs font-medium text-[#0F172A]">Dr. User (You)</div>
                <div className="flex gap-1">
                  <Mic className={`w-3 h-3 ${isMicOn ? 'text-green-500' : 'text-red-500'}`} />
                  <Video className={`w-3 h-3 ${isVideoOn ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </div>
              {participants.map(p => (
                <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFC]">
                  <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center"><span className="text-white text-[10px] font-bold">{p.name[0]}</span></div>
                  <div className="flex-1 text-xs font-medium text-[#0F172A]">{p.name}</div>
                  <div className="flex gap-1">
                    <Mic className={`w-3 h-3 ${p.micOn ? 'text-green-500' : 'text-red-500'}`} />
                    <Video className={`w-3 h-3 ${p.videoOn ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => toast.info('Inviting participant...')} className="btn-secondary w-full mt-3 text-xs py-2 flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5" />Invite Participant
            </button>
          </div>

          <div className="card">
            <h3 className="font-semibold text-[#0F172A] mb-3 text-sm">Connection Quality</h3>
            <div className="space-y-2">
              {[{ label: 'Video Quality', value: quality, status: 'good' }, { label: 'Latency', value: '42ms', status: 'good' }, { label: 'Packet Loss', value: '0.1%', status: 'good' }].map((q, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">{q.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-[#0F172A]">{q.value}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
