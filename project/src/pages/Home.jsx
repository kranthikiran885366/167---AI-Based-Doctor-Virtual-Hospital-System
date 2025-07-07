import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  FileText, 
  Pill, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Users,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Stethoscope,
      title: 'AI Diagnosis',
      description: 'Get instant medical diagnosis from our advanced AI system',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: FileText,
      title: 'Report Analysis',
      description: 'Upload and analyze medical reports with AI-powered insights',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Pill,
      title: 'Smart Prescriptions',
      description: 'Receive personalized medication recommendations',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Care',
      description: '24/7 emergency guidance and first aid assistance',
      color: 'from-red-500 to-red-600'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Patients Served' },
    { number: '98%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'Availability' },
    { number: '5sec', label: 'Response Time' }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      content: 'This AI system has revolutionized how we approach remote healthcare. Incredibly accurate and user-friendly.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Patient',
      content: 'Saved my life during a medical emergency. The instant diagnosis helped me get treatment in time.',
      rating: 5
    },
    {
      name: 'Dr. Priya Patel',
      role: 'General Practitioner',
      content: 'The report analysis feature is outstanding. It helps me make better decisions for my patients.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-green-600/10" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your AI-Powered
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                  {' '}Virtual Hospital
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Experience the future of healthcare with our advanced AI system. Get instant diagnosis, 
                prescription recommendations, and emergency care assistance - all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/diagnosis"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Start Diagnosis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/emergency"
                  className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Emergency Help
                  <AlertTriangle className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Revolutionary Healthcare Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by advanced AI technology, our platform offers comprehensive healthcare solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what doctors and patients are saying about our AI healthcare platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Experience the Future of Healthcare?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users who trust our AI-powered healthcare platform
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Stethoscope className="w-8 h-8 text-blue-400" />
            <div>
              <h3 className="text-xl font-bold">AI Doctor</h3>
              <p className="text-gray-400 text-sm">MVK Solutions</p>
            </div>
          </div>
          <p className="text-gray-400 mb-4">
            Revolutionizing healthcare with artificial intelligence
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 MVK Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;