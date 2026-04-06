import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Search, Trash2, ExternalLink, Tag, Grid, List, BookOpen, FileText, Pill, Brain, Activity, Heart, User, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const INITIAL_BOOKMARKS = [
  { id: 1, title: 'Understanding Cardiac Arrhythmias', category: 'Cardiology', type: 'article', url: '#', description: 'Comprehensive guide to identifying and managing cardiac arrhythmias in clinical practice.', savedAt: '2026-04-06', starred: true, icon: Heart, color: 'bg-red-100 text-red-600' },
  { id: 2, title: 'Diabetes Management Protocol 2026', category: 'Endocrinology', type: 'protocol', url: '#', description: 'Updated clinical protocols for type 1 and type 2 diabetes management.', savedAt: '2026-04-05', starred: false, icon: Activity, color: 'bg-blue-100 text-blue-600' },
  { id: 3, title: 'Drug Interaction Checker — Warfarin', category: 'Pharmacology', type: 'reference', url: '#', description: 'Complete drug interaction reference for warfarin and anticoagulation therapy.', savedAt: '2026-04-03', starred: true, icon: Pill, color: 'bg-green-100 text-green-600' },
  { id: 4, title: 'USMLE Step 3 — High Yield Topics', category: 'Education', type: 'resource', url: '#', description: 'High yield clinical topics for USMLE Step 3 examination preparation.', savedAt: '2026-03-30', starred: false, icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
  { id: 5, title: 'AI in Radiology: Current State', category: 'Technology', type: 'article', url: '#', description: 'How artificial intelligence is transforming diagnostic radiology.', savedAt: '2026-03-28', starred: false, icon: Brain, color: 'bg-amber-100 text-amber-600' },
  { id: 6, title: 'Patient Consent Forms Templates', category: 'Administrative', type: 'template', url: '#', description: 'Ready-to-use patient consent form templates for various procedures.', savedAt: '2026-03-25', starred: false, icon: FileText, color: 'bg-gray-100 text-gray-600' },
];

const CATEGORIES = ['All', 'Cardiology', 'Endocrinology', 'Pharmacology', 'Education', 'Technology', 'Administrative'];

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState(INITIAL_BOOKMARKS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showStarred, setShowStarred] = useState(false);

  const filtered = bookmarks.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || b.category === category;
    const matchStarred = !showStarred || b.starred;
    return matchSearch && matchCat && matchStarred;
  });

  const remove = (id) => { setBookmarks(prev => prev.filter(b => b.id !== id)); toast.success('Bookmark removed'); };
  const toggleStar = (id) => setBookmarks(prev => prev.map(b => b.id === id ? { ...b, starred: !b.starred } : b));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Library</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Saved</span></div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Bookmarks</h1>
        <p className="text-[#64748B] mt-1 text-sm">Your saved resources, articles, and references</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input className="input pl-9" placeholder="Search bookmarks..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => setShowStarred(s => !s)} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${showStarred ? 'bg-amber-100 text-amber-700 border-amber-200' : 'border-[#E2E8F0] text-[#64748B]'}`}>
          <Star className={`w-4 h-4 ${showStarred ? 'fill-amber-400 text-amber-400' : ''}`} />Starred
        </button>
        <div className="flex border border-[#E2E8F0] rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-[#1E40AF] text-white' : 'text-[#64748B] hover:bg-[#F8FAFC]'}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-[#1E40AF] text-white' : 'text-[#64748B] hover:bg-[#F8FAFC]'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Bookmark className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
          <p className="font-medium text-[#64748B]">No bookmarks found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(b => (
            <motion.div key={b.id} whileHover={{ y: -2 }} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${b.color}`}><b.icon className="w-4 h-4" /></div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleStar(b.id)} className={`p-1 ${b.starred ? 'text-amber-400' : 'text-[#94A3B8] hover:text-amber-400'}`}><Star className={`w-4 h-4 ${b.starred ? 'fill-current' : ''}`} /></button>
                  <button onClick={() => remove(b.id)} className="p-1 text-[#94A3B8] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <span className="text-xs font-medium text-[#1E40AF]">{b.category}</span>
              <h3 className="font-semibold text-[#0F172A] text-sm mt-1 mb-2 line-clamp-2">{b.title}</h3>
              <p className="text-xs text-[#64748B] mb-3 line-clamp-2">{b.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#94A3B8]">{b.savedAt}</span>
                <button onClick={() => toast.info('Opening resource...')} className="flex items-center gap-1 text-xs text-[#1E40AF] hover:underline"><ExternalLink className="w-3 h-3" />Open</button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => (
            <div key={b.id} className="card hover:border-[#1E40AF] transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${b.color}`}><b.icon className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[#0F172A] text-sm">{b.title}</span>
                    <span className="text-xs text-[#1E40AF]">{b.category}</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5 truncate">{b.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#94A3B8]">{b.savedAt}</span>
                  <button onClick={() => toggleStar(b.id)} className={`p-1 ${b.starred ? 'text-amber-400' : 'text-[#94A3B8] hover:text-amber-400'}`}><Star className={`w-4 h-4 ${b.starred ? 'fill-current' : ''}`} /></button>
                  <button onClick={() => toast.info('Opening...')} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg"><ExternalLink className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(b.id)} className="p-1.5 text-[#64748B] hover:text-red-500 border border-[#E2E8F0] rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
