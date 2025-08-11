import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
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
  CheckCircle,
  Heart,
  Brain,
  Activity,
  Zap,
  Globe,
  Award,
  Smartphone,
  Lock,
  TrendingUp
} from 'lucide-react';

const AnimatedSection = ({ children, className = "" }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const FloatingElement = ({ children, delay = 0 }) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
      rotate: [0, 1, -1, 0]
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: Brain,
      title: 'AI Diagnosis',
      description: 'Advanced machine learning algorithms provide accurate medical analysis',
      color: 'from-purple-500 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format'
    },
    {
      icon: FileText,
      title: 'Report Analysis',
      description: 'Intelligent document processing with real-time insights',
      color: 'from-emerald-500 to-teal-600',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&auto=format'
    },
    {
      icon: Pill,
      title: 'Smart Prescriptions',
      description: 'Personalized medication recommendations based on your health profile',
      color: 'from-blue-500 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format'
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Care',
      description: 'Immediate assistance with 24/7 emergency response system',
      color: 'from-red-500 to-pink-600',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop&auto=format'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Patients Served', icon: Users, color: 'text-blue-400' },
    { number: '98%', label: 'Accuracy Rate', icon: TrendingUp, color: 'text-green-400' },
    { number: '24/7', label: 'Availability', icon: Clock, color: 'text-purple-400' },
    { number: '5sec', label: 'Response Time', icon: Zap, color: 'text-yellow-400' }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      content: 'This AI system has revolutionized how we approach remote healthcare. The accuracy and speed are remarkable.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&auto=format'
    },
    {
      name: 'Michael Chen',
      role: 'Patient',
      content: 'Saved my life during a medical emergency. The instant diagnosis helped me get treatment in time.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format'
    },
    {
      name: 'Dr. Priya Patel',
      role: 'General Practitioner',
      content: 'The report analysis feature is outstanding. It helps me make better decisions for my patients.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1594824201504-82c16a5f4b3d?w=80&h=80&fit=crop&auto=format'
    }
  ];

  const trustIndicators = [
    { icon: Shield, text: 'HIPAA Compliant' },
    { icon: Lock, text: 'End-to-End Encryption' },
    { icon: Award, text: 'FDA Approved' },
    { icon: Globe, text: 'Global Reach' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-green-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-purple-200/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-green-600/5" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop&auto=format" 
              alt="Medical Background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 mb-6 shadow-lg">
                  <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                  Powered by Advanced AI Technology
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  Your AI-Powered
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 animate-gradient">
                    Virtual Hospital
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  Experience the future of healthcare with our revolutionary AI system. Get instant diagnosis, 
                  personalized treatment plans, and emergency care assistance - all powered by cutting-edge technology.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/diagnosis"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-2xl transform transition-all duration-300 group"
                    >
                      <Brain className="mr-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Start AI Diagnosis
                      <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/emergency"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-2xl transform transition-all duration-300 group"
                    >
                      <Heart className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                      Emergency Help
                      <AlertTriangle className="ml-3 w-5 h-5 group-hover:bounce transition-transform" />
                    </Link>
                  </motion.div>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {trustIndicators.map((indicator, index) => {
                    const Icon = indicator.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className="flex items-center space-x-2 text-sm text-gray-600"
                      >
                        <Icon className="w-4 h-4 text-green-500" />
                        <span>{indicator.text}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <FloatingElement delay={0}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-3xl blur-xl" />
                  <img 
                    src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=400&fit=crop&auto=format"
                    alt="AI Medical Technology"
                    className="relative rounded-3xl shadow-2xl w-full"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">AI Active</div>
                        <div className="text-xs text-gray-500">Analyzing symptoms...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Revolutionary Healthcare Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powered by advanced AI technology, our platform offers comprehensive healthcare solutions 
                that adapt to your unique needs
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className={`absolute top-4 left-4 w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop&auto=format"
              alt="Medical Background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted Globally by Healthcare Professionals
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join the revolution in digital healthcare with proven results
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center text-white bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
                >
                  <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-4`} />
                  <div className="text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100 text-lg">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted by Healthcare Professionals Worldwide
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
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 mb-8 italic text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-blue-200"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Technology Showcase */}
      <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Cutting-Edge AI Technology
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform leverages the latest advances in artificial intelligence, 
                machine learning, and medical research to provide accurate, reliable healthcare solutions.
              </p>
              
              <div className="space-y-4">
                {['Advanced Neural Networks', 'Real-time Processing', 'Continuous Learning', 'Secure Data Handling'].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <FloatingElement delay={1}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-3xl blur-xl" />
                  <img 
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&auto=format"
                    alt="AI Technology"
                    className="relative rounded-3xl shadow-2xl w-full"
                  />
                  <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">AI Learning</div>
                        <div className="text-xs text-gray-500">99.8% Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </FloatingElement>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-8">
              Ready to Experience the Future of Healthcare?
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Join thousands of healthcare professionals and patients who trust our AI-powered platform 
              for accurate diagnosis and personalized care.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white font-bold text-lg rounded-full hover:shadow-2xl transform transition-all duration-300 group"
              >
                <Smartphone className="mr-4 w-6 h-6 group-hover:rotate-12 transition-transform" />
                Get Started Today
                <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
            
            <p className="text-sm text-gray-500 mt-6">
              No credit card required • Free trial available • HIPAA compliant
            </p>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-center space-x-3 mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg" />
                <Stethoscope className="relative w-10 h-10 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">AI Doctor</h3>
                <p className="text-gray-400">MVK Solutions</p>
              </div>
            </motion.div>
            
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Revolutionizing healthcare with artificial intelligence, making quality medical care 
              accessible to everyone, everywhere.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {['Privacy Policy', 'Terms of Service', 'Contact Us', 'About'].map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link}
                </motion.a>
              ))}
            </div>
            
            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-500">
                © 2024 MVK Solutions. All rights reserved. Built with ❤️ for better healthcare.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
