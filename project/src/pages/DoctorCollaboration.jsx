import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Video, Phone, Search, Plus, Star, Check, Clock, Globe, Send, FileText, Calendar, Share, Bookmark, X, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const DOCTORS = [
  { id: 1, name: 'Dr. Sarah Chen', specialty: 'Cardiology', hospital: 'City Medical Center', status: 'online', rating: 4.9, photo: 'https://i.pravatar.cc/100?img=47' },
  { id: 2, name: 'Dr. Marcus Johnson', specialty: 'Neurology', hospital: 'Metro Hospital', status: 'online', rating: 4.8, photo: 'https://i.pravatar.cc/100?img=68' },
  { id: 3, name: 'Dr. Priya Patel', specialty: 'Pulmonology', hospital: 'Regional Medical', status: 'busy', rating: 4.9, photo: 'https://i.pravatar.cc/100?img=49' },
  { id: 4, name: 'Dr. James Wright', specialty: 'Orthopedics', hospital: 'Orthopedic Clinic', status: 'offline', rating: 4.7, photo: 'https://i.pravatar.cc/100?img=12' },
  { id: 5, name: 'Dr. Emily Roberts', specialty: 'Radiology', hospital: 'Imaging Center', status: 'online', rating: 4.8, photo: 'https://i.pravatar.cc/100?img=25' },
];

const CONSULT_CASES = [
  { id: 1, patientName: 'John Smith', age: 45, case: 'Chest pain with ST changes on ECG', consultingDoctor: 'Dr. Sarah Chen', status: 'open', priority: 'urgent', created: '2 hours ago', messages: 4 },
  { id: 2, patientName: 'Maria Garcia', age: 32, case: 'Persistent headaches and vision changes', consultingDoctor: 'Dr. Marcus Johnson', status: 'responded', priority: 'normal', created: '1 day ago', messages: 7 },
  { id: 3, patientName: 'Robert Chen', age: 58, case: 'Shortness of breath with low O2 sat', consultingDoctor: 'Dr. Priya Patel', status: 'resolved', priority: 'urgent', created: '2 days ago', messages: 12 },
];

const statusDot = { online: 'bg-green-500', busy: 'bg-amber-500', offline: 'bg-gray-400' };

export default function DoctorCollaboration() {
  const [tab, setTab] = useState('network');
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatMsg, setChatMsg] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [showConsult, setShowConsult] = useState(false);
  const [newCase, setNewCase] = useState({ patientName: '', age: '', case: '', specialty: '', priority: 'normal' });

  const filtered = DOCTORS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()));

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'me', text: chatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatMsg('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'them', text: 'I agree with your assessment. Let me review the imaging.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  const submitConsult = () => {
    if (!newCase.patientName || !newCase.case) { toast.error('Fill required fields'); return; }
    toast.success('Consult request sent');
    setShowConsult(false);
    setNewCase({ patientName: '', age: '', case: '', specialty: '', priority: 'normal' });
  };

  const tabs = [
    { id: 'network', label: 'My Network' },
    { id: 'consult', label: 'Consult Cases', count: CONSULT_CASES.filter(c => c.status === 'open').length },
    { id: 'chat', label: 'Messages' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Collaboration</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Doctor Network</span></div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Doctor Collaboration</h1>
            <p className="text-[#64748B] mt-1 text-sm">Consult with specialists, share cases, and collaborate on patient care</p>
          </div>
          <button onClick={() => setShowConsult(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />New Consult</button>
        </div>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'}`}>
            {t.label}
            {t.count > 0 && <span className="w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{t.count}</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'network' && (
          <motion.div key="net" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input className="input pl-9" placeholder="Search doctors by name or specialty..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(doc => (
                <div key={doc.id} className="card hover:border-[#1E40AF] transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <img src={doc.photo} alt={doc.name} className="w-10 h-10 rounded-full object-cover" onError={e => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=1E40AF&color=fff`} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusDot[doc.status]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#0F172A] text-sm truncate">{doc.name}</div>
                      <div className="text-xs text-[#64748B]">{doc.specialty}</div>
                      <div className="text-[10px] text-[#94A3B8]">{doc.hospital}</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-[#64748B]">{doc.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedDoctor(doc); setTab('chat'); }} className="flex-1 btn-secondary text-xs py-1.5 flex items-center justify-center gap-1"><MessageSquare className="w-3 h-3" />Message</button>
                    <button onClick={() => toast.info(`Calling ${doc.name}...`)} disabled={doc.status === 'offline'} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg disabled:opacity-40"><Video className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'consult' && (
          <motion.div key="consult" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            {CONSULT_CASES.map(c => (
              <div key={c.id} className="card hover:border-[#1E40AF] transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${c.priority === 'urgent' ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[#0F172A] text-sm">{c.patientName}</span>
                      <span className="text-xs text-[#94A3B8]">· {c.age}y</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${c.status === 'open' ? 'bg-amber-100 text-amber-700 border-amber-200' : c.status === 'responded' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200'}`}>{c.status}</span>
                    </div>
                    <p className="text-sm text-[#64748B] mt-1">{c.case}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#94A3B8]">
                      <span>Consulting: {c.consultingDoctor}</span>
                      <span>{c.created}</span>
                      <span>{c.messages} messages</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="section-label mb-3">Conversations</div>
              {DOCTORS.filter(d => d.status !== 'offline').map(doc => (
                <button key={doc.id} onClick={() => setSelectedDoctor(doc)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${selectedDoctor?.id === doc.id ? 'border-[#1E40AF] bg-[#EFF6FF]' : 'border-[#E2E8F0] hover:border-[#1E40AF]'}`}>
                  <div className="relative">
                    <img src={doc.photo} alt={doc.name} className="w-8 h-8 rounded-full object-cover" onError={e => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=1E40AF&color=fff`} />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${statusDot[doc.status]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#0F172A] text-xs truncate">{doc.name}</div>
                    <div className="text-[10px] text-[#64748B]">{doc.specialty}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-2 card flex flex-col h-[500px]">
              {selectedDoctor ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0] mb-3">
                    <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="w-8 h-8 rounded-full" onError={e => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=1E40AF&color=fff`} />
                    <div>
                      <div className="font-medium text-[#0F172A] text-sm">{selectedDoctor.name}</div>
                      <div className="text-xs text-[#64748B]">{selectedDoctor.specialty}</div>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <button onClick={() => toast.info('Starting video...')} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg"><Video className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex gap-2 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                        <div className={`max-w-[75%] px-3 py-2 rounded-xl text-xs ${msg.sender === 'me' ? 'bg-[#1E40AF] text-white rounded-tr-sm' : 'bg-[#F1F5F9] text-[#374151] rounded-tl-sm'}`}>
                          {msg.text}
                          <div className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-[#94A3B8]'}`}>{msg.time}</div>
                        </div>
                      </div>
                    ))}
                    {chatMessages.length === 0 && (
                      <div className="text-center py-12 text-[#94A3B8] text-sm">Start a conversation with {selectedDoctor.name}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input className="input flex-1 text-sm" placeholder="Type a message..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                    <button onClick={sendMessage} className="p-2.5 bg-[#1E40AF] text-white rounded-lg"><Send className="w-4 h-4" /></button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
                    <p className="text-[#64748B] text-sm">Select a colleague to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConsult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4"><h3 className="font-display font-bold text-[#0F172A]">New Consult Request</h3><button onClick={() => setShowConsult(false)}><X className="w-5 h-5 text-[#94A3B8]" /></button></div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-[#64748B] mb-1">Patient Name *</label><input className="input" value={newCase.patientName} onChange={e => setNewCase(p => ({ ...p, patientName: e.target.value }))} /></div>
                  <div><label className="block text-xs text-[#64748B] mb-1">Age</label><input type="number" className="input" value={newCase.age} onChange={e => setNewCase(p => ({ ...p, age: e.target.value }))} /></div>
                </div>
                <div><label className="block text-xs text-[#64748B] mb-1">Case Summary *</label><textarea className="input h-24 resize-none" value={newCase.case} onChange={e => setNewCase(p => ({ ...p, case: e.target.value }))} placeholder="Describe the case..." /></div>
                <div><label className="block text-xs text-[#64748B] mb-1">Specialist Needed</label>
                  <select className="input" value={newCase.specialty} onChange={e => setNewCase(p => ({ ...p, specialty: e.target.value }))}>
                    <option value="">Select specialty...</option>
                    {['Cardiology', 'Neurology', 'Pulmonology', 'Orthopedics', 'Radiology'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs text-[#64748B] mb-1">Priority</label>
                  <div className="flex gap-2">
                    {['normal', 'urgent', 'stat'].map(p => (
                      <button key={p} onClick={() => setNewCase(prev => ({ ...prev, priority: p }))}
                        className={`flex-1 py-1.5 text-xs rounded-lg border capitalize font-medium ${newCase.priority === p ? p === 'urgent' ? 'bg-amber-100 text-amber-700 border-amber-200' : p === 'stat' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200' : 'border-[#E2E8F0] text-[#64748B]'}`}>{p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={submitConsult} className="btn-primary flex-1">Send Consult</button>
                <button onClick={() => setShowConsult(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
