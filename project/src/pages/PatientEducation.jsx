import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Star, Clock, Play, FileText, Video, Globe, Bookmark, Share, ChevronRight, Award, TrendingUp, Users, Heart, Brain, Activity, Pill, Download, Check, Eye, Filter, X } from 'lucide-react';
import { toast } from 'react-toastify';

const ARTICLES = [
  { id: 1, title: 'Understanding Type 2 Diabetes', category: 'Chronic Disease', type: 'article', readTime: '8 min', level: 'Beginner', rating: 4.9, views: 15420, icon: Activity, color: 'bg-blue-100 text-blue-600', bookmarked: false, description: 'A comprehensive guide to understanding type 2 diabetes, its causes, symptoms, and management strategies.' },
  { id: 2, title: 'Heart Health: The Basics', category: 'Cardiovascular', type: 'video', readTime: '12 min', level: 'Beginner', rating: 4.8, views: 12300, icon: Heart, color: 'bg-red-100 text-red-600', bookmarked: true, description: 'Learn the fundamentals of cardiovascular health, risk factors, and prevention strategies.' },
  { id: 3, title: 'Managing Hypertension at Home', category: 'Cardiovascular', type: 'article', readTime: '6 min', level: 'Intermediate', rating: 4.7, views: 8920, icon: Activity, color: 'bg-green-100 text-green-600', bookmarked: false, description: 'Practical tips and strategies for managing high blood pressure in daily life.' },
  { id: 4, title: 'Mental Health & Stress Management', category: 'Mental Health', type: 'article', readTime: '10 min', level: 'Beginner', rating: 4.9, views: 22100, icon: Brain, color: 'bg-purple-100 text-purple-600', bookmarked: false, description: 'Evidence-based strategies for maintaining mental wellness and managing stress effectively.' },
  { id: 5, title: 'Medication Safety & Compliance', category: 'Medications', type: 'guide', readTime: '5 min', level: 'Beginner', rating: 4.8, views: 6780, icon: Pill, color: 'bg-amber-100 text-amber-600', bookmarked: true, description: 'How to safely manage medications, understand side effects, and maintain compliance.' },
  { id: 6, title: 'Nutrition & Healthy Eating', category: 'Wellness', type: 'video', readTime: '15 min', level: 'Beginner', rating: 4.7, views: 18900, icon: Heart, color: 'bg-green-100 text-green-600', bookmarked: false, description: 'A practical guide to building healthy eating habits for long-term wellness.' },
  { id: 7, title: 'Exercise for Chronic Pain', category: 'Musculoskeletal', type: 'guide', readTime: '9 min', level: 'Intermediate', rating: 4.6, views: 5430, icon: Activity, color: 'bg-orange-100 text-orange-600', bookmarked: false, description: 'Safe and effective exercises for managing chronic pain conditions.' },
  { id: 8, title: 'Understanding Your Lab Results', category: 'Diagnostics', type: 'article', readTime: '7 min', level: 'Advanced', rating: 4.9, views: 9200, icon: FileText, color: 'bg-indigo-100 text-indigo-600', bookmarked: false, description: 'A guide to reading and understanding common laboratory test results.' },
];

const CATEGORIES = ['All', 'Cardiovascular', 'Chronic Disease', 'Mental Health', 'Medications', 'Wellness', 'Musculoskeletal', 'Diagnostics'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const TYPES = ['All', 'article', 'video', 'guide'];

const TYPE_ICONS = { article: FileText, video: Video, guide: BookOpen };

export default function PatientEducation() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [type, setType] = useState('All');
  const [articles, setArticles] = useState(ARTICLES);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('browse');

  const bookmarked = articles.filter(a => a.bookmarked);

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || a.category === category;
    const matchLevel = level === 'All' || a.level === level;
    const matchType = type === 'All' || a.type === type;
    return matchSearch && matchCat && matchLevel && matchType;
  });

  const toggleBookmark = (id) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, bookmarked: !a.bookmarked } : a));
    toast.success(articles.find(a => a.id === id)?.bookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks');
  };

  const tabs = [
    { id: 'browse', label: 'Browse' },
    { id: 'bookmarks', label: 'Saved', count: bookmarked.length },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Patient</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Education</span></div>
        <h1 className="font-display text-3xl font-bold text-[#0F172A]">Patient Education</h1>
        <p className="text-[#64748B] mt-1 text-sm">Evidence-based health articles, guides, and videos</p>
      </div>

      {/* Hero */}
      <div className="card mb-6 bg-[#1E40AF] border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium opacity-80 mb-1">Featured Resource</div>
            <h2 className="font-display text-xl font-bold mb-2">Understanding Your Diagnosis</h2>
            <p className="text-sm opacity-80 mb-4">A comprehensive guide to help patients understand their medical conditions and treatment options.</p>
            <button onClick={() => toast.info('Opening guide...')} className="flex items-center gap-2 px-4 py-2 bg-white text-[#1E40AF] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
              <Play className="w-4 h-4" />Start Reading
            </button>
          </div>
          <BookOpen className="w-20 h-20 opacity-20 hidden sm:block" />
        </div>
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'}`}>
            {t.label}
            {t.count > 0 && <span className="text-[10px] px-1.5 py-0.5 bg-[#EFF6FF] text-[#1E40AF] rounded">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'browse' && (
        <>
          <div className="flex gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input className="input pl-9" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input w-auto" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="input w-auto" value={level} onChange={e => setLevel(e.target.value)}>
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
            <select className="input w-auto" value={type} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t} className="capitalize">{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(article => {
              const TypeIcon = TYPE_ICONS[article.type] || FileText;
              return (
                <motion.div key={article.id} whileHover={{ y: -2 }} className="card cursor-pointer" onClick={() => setSelected(article)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${article.color}`}>
                      <article.icon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={e => { e.stopPropagation(); toggleBookmark(article.id); }} className={`p-1 rounded transition-colors ${article.bookmarked ? 'text-[#1E40AF]' : 'text-[#94A3B8] hover:text-[#1E40AF]'}`}>
                        <Bookmark className={`w-4 h-4 ${article.bookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-[#1E40AF] mb-1">{article.category}</div>
                  <h3 className="font-semibold text-[#0F172A] text-sm mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-[#64748B] mb-3 line-clamp-2">{article.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-[#94A3B8]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" />{article.rating}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(article.views / 1000).toFixed(1)}k</span>
                    <span className={`ml-auto px-1.5 py-0.5 rounded border capitalize text-[10px] ${article.level === 'Beginner' ? 'bg-green-50 text-green-700 border-green-200' : article.level === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{article.level}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'bookmarks' && (
        <div>
          {bookmarked.length === 0 ? (
            <div className="card text-center py-16">
              <Bookmark className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
              <p className="font-medium text-[#64748B]">No saved articles</p>
              <p className="text-sm text-[#94A3B8] mt-1">Bookmark articles to access them quickly</p>
              <button onClick={() => setTab('browse')} className="btn-secondary mt-4">Browse Articles</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarked.map(article => {
                const TypeIcon = TYPE_ICONS[article.type] || FileText;
                return (
                  <div key={article.id} className="card cursor-pointer" onClick={() => setSelected(article)}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${article.color}`}><article.icon className="w-4 h-4" /></div>
                      <button onClick={e => { e.stopPropagation(); toggleBookmark(article.id); }} className="text-[#1E40AF]"><Bookmark className="w-4 h-4 fill-current" /></button>
                    </div>
                    <h3 className="font-semibold text-[#0F172A] text-sm mb-1">{article.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-[#94A3B8]">
                      <Clock className="w-3 h-3" />{article.readTime}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Article Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected.color}`}><selected.icon className="w-5 h-5" /></div>
                  <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-[#94A3B8]" /></button>
                </div>
                <div className="text-xs font-medium text-[#1E40AF] mb-2">{selected.category}</div>
                <h2 className="font-display text-xl font-bold text-[#0F172A] mb-3">{selected.title}</h2>
                <div className="flex items-center gap-4 mb-4 text-xs text-[#94A3B8]">
                  <span>{selected.readTime}</span><span>·</span><span>{selected.level}</span><span>·</span><span>{selected.views.toLocaleString()} views</span>
                </div>
                <p className="text-[#374151] text-sm leading-relaxed mb-6">{selected.description}</p>
                <p className="text-[#374151] text-sm leading-relaxed">
                  This resource provides comprehensive, evidence-based health information reviewed by medical professionals. 
                  The content is designed to help patients better understand their health conditions and make informed decisions 
                  in partnership with their healthcare providers.
                </p>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => toast.info('Opening full content...')} className="btn-primary flex items-center gap-2"><Play className="w-4 h-4" />Read Full Article</button>
                  <button onClick={() => toggleBookmark(selected.id)} className="btn-secondary flex items-center gap-2"><Bookmark className={`w-4 h-4 ${selected.bookmarked ? 'fill-current text-[#1E40AF]' : ''}`} />{selected.bookmarked ? 'Saved' : 'Save'}</button>
                  <button onClick={() => toast.info('Sharing...')} className="btn-secondary flex items-center gap-2"><Share className="w-4 h-4" />Share</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
