import React from 'react';
import { motion } from 'framer-motion';
import { Shield, GraduationCap, Bell, BookOpen } from 'lucide-react';

const AdminCompliance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin & Compliance
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Manage regulatory compliance, continuing education, hospital notices, and system training.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
            <div className="text-sm text-gray-600">HIPAA Compliance</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">32.5</div>
            <div className="text-sm text-gray-600">CME Credits</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">8</div>
            <div className="text-sm text-gray-600">Unread Notices</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">75%</div>
            <div className="text-sm text-gray-600">Training Progress</div>
          </motion.div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Compliance & Training</h2>
          <p className="text-gray-600 mb-4">
            Complete administrative and compliance management system:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• HIPAA compliance monitoring</li>
            <li>• Continuing Medical Education (CME) tracking</li>
            <li>• Hospital notices and updates</li>
            <li>• System training modules</li>
            <li>• Regulatory documentation</li>
            <li>• Compliance reporting and auditing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminCompliance;
