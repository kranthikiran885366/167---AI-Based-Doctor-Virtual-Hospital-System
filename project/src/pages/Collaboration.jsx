import React from 'react';
import { motion } from 'framer-motion';
import { Users, Video, MessageSquare, UserPlus } from 'lucide-react';

const Collaboration = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Doctor Collaboration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Connect with specialists, share cases, and collaborate on patient care with colleagues worldwide.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">23</div>
            <div className="text-sm text-gray-600">Active Referrals</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
            <div className="text-sm text-gray-600">Second Opinions</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">8</div>
            <div className="text-sm text-gray-600">Case Discussions</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">5</div>
            <div className="text-sm text-gray-600">Live Conferences</div>
          </motion.div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Collaboration Tools</h2>
          <p className="text-gray-600 mb-4">
            Professional collaboration platform featuring:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• Specialist referrals and consultations</li>
            <li>• Second opinion requests</li>
            <li>• Case discussion forums</li>
            <li>• Multi-doctor video conferences</li>
            <li>• Secure patient data sharing</li>
            <li>• Real-time collaboration tools</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
