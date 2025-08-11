import React from 'react';
import { motion } from 'framer-motion';
import { FileText, PenTool, Camera, Download } from 'lucide-react';

const MedicalDocumentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Medical Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Create, manage, and digitally sign medical documents with HIPAA-compliant security.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">156</div>
            <div className="text-sm text-gray-600">SOAP Notes</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">89</div>
            <div className="text-sm text-gray-600">Digital Signatures</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">234</div>
            <div className="text-sm text-gray-600">Media Files</div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">67</div>
            <div className="text-sm text-gray-600">Exported Records</div>
          </motion.div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentation Features</h2>
          <p className="text-gray-600 mb-4">
            Comprehensive medical documentation system includes:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• SOAP notes creation and management</li>
            <li>• Digital signature integration</li>
            <li>• Photo and video documentation</li>
            <li>• Medical record export capabilities</li>
            <li>• HIPAA-compliant storage</li>
            <li>• Real-time collaboration tools</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MedicalDocumentation;
