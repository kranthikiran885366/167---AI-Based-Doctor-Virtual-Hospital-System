import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Star,
  Search,
  Filter,
  Trash2,
  Share2,
  Plus,
  Folder,
  Clock,
  User,
  FileText,
  Video,
  Heart,
  Brain,
  Stethoscope,
  Pill,
  MoreVertical,
  ExternalLink,
  Edit,
  Archive,
  Tag,
  Calendar,
  ChevronDown,
  Eye
} from 'lucide-react';

const Bookmarks = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const [bookmarks] = useState([
    {
      id: 1,
      title: 'Emergency Cardiac Protocol',
      type: 'document',
      category: 'protocols',
      url: '/emergency-cardiac-protocol',
      description: 'Step-by-step emergency cardiac care guidelines',
      dateAdded: '2024-01-18',
      tags: ['emergency', 'cardiology', 'protocol'],
      priority: 'high',
      accessed: 15
    },
    {
      id: 2,
      title: 'Dr. Emily Carter - Cardiologist',
      type: 'doctor',
      category: 'contacts',
      url: '/doctor/emily-carter',
      description: 'Specialist in interventional cardiology',
      dateAdded: '2024-01-17',
      tags: ['cardiology', 'specialist', 'referral'],
      priority: 'medium',
      accessed: 8
    },
    {
      id: 3,
      title: 'Diabetes Management Guidelines',
      type: 'resource',
      category: 'guidelines',
      url: '/guidelines/diabetes-management',
      description: 'Comprehensive diabetes care protocols',
      dateAdded: '2024-01-15',
      tags: ['diabetes', 'chronic-care', 'guidelines'],
      priority: 'medium',
      accessed: 22
    },
    {
      id: 4,
      title: 'Patient Education: Heart Health',
      type: 'education',
      category: 'patient-education',
      url: '/education/heart-health',
      description: 'Educational materials for heart health',
      dateAdded: '2024-01-14',
      tags: ['education', 'cardiology', 'prevention'],
      priority: 'low',
      accessed: 5
    },
    {
      id: 5,
      title: 'Telemedicine Best Practices',
      type: 'video',
      category: 'training',
      url: '/training/telemedicine-practices',
      description: 'Training video on telemedicine protocols',
      dateAdded: '2024-01-12',
      tags: ['telemedicine', 'training', 'best-practices'],
      priority: 'medium',
      accessed: 12
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Bookmarks', count: bookmarks.length },
    { id: 'protocols', name: 'Protocols', count: bookmarks.filter(b => b.category === 'protocols').length },
    { id: 'contacts', name: 'Doctor Contacts', count: bookmarks.filter(b => b.category === 'contacts').length },
    { id: 'guidelines', name: 'Guidelines', count: bookmarks.filter(b => b.category === 'guidelines').length },
    { id: 'patient-education', name: 'Patient Education', count: bookmarks.filter(b => b.category === 'patient-education').length },
    { id: 'training', name: 'Training', count: bookmarks.filter(b => b.category === 'training').length }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'document': return FileText;
      case 'doctor': return User;
      case 'resource': return Stethoscope;
      case 'education': return Brain;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory;
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bookmarks
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Quick access to your saved documents, contacts, guidelines, and resources.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
                
                <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Bookmark</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                <div className="text-2xl font-bold mb-1">{category.count}</div>
                <div className="text-sm">{category.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Bookmarks Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBookmarks.map((bookmark, index) => {
            const TypeIcon = getTypeIcon(bookmark.type);
            return (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    bookmark.type === 'document' ? 'bg-blue-100' :
                    bookmark.type === 'doctor' ? 'bg-green-100' :
                    bookmark.type === 'resource' ? 'bg-purple-100' :
                    bookmark.type === 'education' ? 'bg-orange-100' : 'bg-pink-100'
                  }`}>
                    <TypeIcon className={`w-6 h-6 ${
                      bookmark.type === 'document' ? 'text-blue-600' :
                      bookmark.type === 'doctor' ? 'text-green-600' :
                      bookmark.type === 'resource' ? 'text-purple-600' :
                      bookmark.type === 'education' ? 'text-orange-600' : 'text-pink-600'
                    }`} />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(bookmark.priority)}`}>
                      {bookmark.priority}
                    </span>
                    <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {bookmark.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {bookmark.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {bookmark.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                  {bookmark.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{bookmark.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{bookmark.dateAdded}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{bookmark.accessed} views</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                    Open
                  </button>
                  <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredBookmarks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start saving important resources for quick access'}
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              Add Your First Bookmark
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
