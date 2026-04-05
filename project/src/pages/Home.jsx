import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain, FileText, Pill, AlertTriangle, Shield, Clock, Users,
  ArrowRight, CheckCircle, Heart, Activity, Zap, Lock, TrendingUp,
  Stethoscope, Star
} from 'lucide-react';

const FadeUp = ({ children, delay = 0, className = '' }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    { icon: Brain, name: 'AI Diagnosis', desc: 'Symptom analysis powered by clinical-grade machine learning.', href: '/ai-diagnosis' },
    { icon: FileText, name: 'Report Analysis', desc: 'Intelligent parsing of lab results with instant clinical context.', href: '/lab-reports-analysis' },
    { icon: Pill, name: 'Smart Prescriptions', desc: 'Personalized medication recommendations with interaction checks.', href: '/prescription' },
    { icon: Activity, name: 'Vitals Monitoring', desc: 'Real-time tracking with automated alerts and trend analysis.', href: '/dashboard' },
    { icon: AlertTriangle, name: 'Emergency Response', desc: '24/7 triage and dispatch coordination for critical cases.', href: '/emergency' },
    { icon: Stethoscope, name: 'Telemedicine', desc: 'HD video consultations with real-time transcription.', href: '/consultation-modes' },
  ];

  const stats = [
    { value: '50K+', label: 'Patients served' },
    { value: '98%', label: 'Diagnostic accuracy' },
    { value: '24/7', label: 'Always available' },
    { value: '<5s', label: 'Response time' },
  ];

  const testimonials = [
    {
      quote: 'This has fundamentally changed how we approach remote diagnostics. The accuracy is remarkable.',
      author: 'Dr. Sarah Johnson', role: 'Cardiologist, UCSF',
      img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&auto=format'
    },
    {
      quote: 'The instant analysis saved critical minutes during an emergency. I cannot imagine working without it.',
      author: 'Michael Chen', role: 'Patient',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format'
    },
    {
      quote: 'Report analysis that used to take 20 minutes now happens in seconds with better precision.',
      author: 'Dr. Priya Patel', role: 'General Practitioner',
      img: 'https://images.unsplash.com/photo-1594824201504-82c16a5f4b3d?w=80&h=80&fit=crop&auto=format'
    },
  ];

  const trustBadges = [
    { icon: Shield, text: 'HIPAA Compliant' },
    { icon: Lock, text: 'End-to-End Encrypted' },
    { icon: CheckCircle, text: 'FDA Referenced' },
    { icon: TrendingUp, text: 'Clinically Validated' },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentTestimonial(p => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <section className="relative min-h-[88vh] flex items-center px-6 lg:px-16 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-transparent to-slate-50" />
        <div className="absolute top-20 right-0 w-[480px] h-[480px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-[#1E40AF] text-xs font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              Powered by clinical AI
            </div>

            <h1 className="font-display text-[56px] md:text-[72px] lg:text-[88px] font-800 leading-[1.0] tracking-[-0.03em] text-slate-900 mb-7">
              Healthcare<br />
              <span className="text-[#1E40AF]">reimagined.</span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-10">
              Instant diagnosis, intelligent report analysis, and 24/7 emergency care — 
              all in one platform built for clinicians and patients alike.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/dashboard" className="btn-primary text-sm px-5 py-2.5 rounded-lg font-semibold">
                Open Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/ai-diagnosis" className="btn-secondary text-sm px-5 py-2.5 rounded-lg font-semibold">
                Try AI Diagnosis
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-5 mt-10">
              {trustBadges.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Icon className="w-3.5 h-3.5 text-emerald-500" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="absolute right-16 bottom-16 hidden xl:block"
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=480&h=360&fit=crop&auto=format"
              alt="AI Medical Technology"
              className="w-[420px] rounded-2xl shadow-2xl shadow-slate-200 object-cover"
            />
            <div className="absolute -bottom-4 -left-4 card shadow-lg px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">AI Active</div>
                <div className="text-[11px] text-slate-400">Analyzing symptoms…</div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-6 lg:px-16 py-24 bg-white border-t border-slate-100">
        <FadeUp className="mb-16">
          <p className="section-label mb-3">Platform</p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2 className="font-display text-4xl md:text-5xl font-700 text-slate-900 tracking-tight max-w-lg">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-slate-500 text-base max-w-sm leading-relaxed">
              A focused set of clinical tools, thoughtfully designed for real-world workflows.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeUp key={f.name} delay={i * 0.05}>
                <Link
                  to={f.href}
                  className="group flex flex-col gap-4 p-8 bg-white hover:bg-slate-50 transition-base h-full"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#1E40AF]/10 flex items-center justify-center transition-base">
                    <Icon className="w-4.5 h-4.5 text-slate-500 group-hover:text-[#1E40AF] transition-base" />
                  </div>
                  <div>
                    <h3 className="font-display font-600 text-slate-900 mb-1.5">{f.name}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-[#1E40AF] opacity-0 group-hover:opacity-100 transition-base mt-auto">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-24 bg-[#F8FAFC]">
        <div className="grid lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.08} className="text-center lg:text-left">
              <div className="font-display text-5xl font-800 text-[#1E40AF] tracking-tight mb-2">{s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-24 bg-white border-t border-slate-100">
        <FadeUp className="mb-14">
          <p className="section-label mb-3">Testimonials</p>
          <h2 className="font-display text-4xl font-700 text-slate-900 tracking-tight max-w-sm">
            Trusted by those who matter.
          </h2>
        </FadeUp>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <FadeUp key={t.author} delay={i * 0.07}>
              <div className={`relative p-8 rounded-xl border transition-base ${
                i === currentTestimonial ? 'border-[#1E40AF]/30 bg-blue-50/40' : 'border-slate-200 bg-white'
              }`}>
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed mb-8 text-[15px]">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.author} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.author}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-24 bg-[#1E40AF]">
        <div className="max-w-2xl">
          <FadeUp>
            <p className="text-blue-300 text-sm font-medium mb-4">Get started</p>
            <h2 className="font-display text-4xl md:text-5xl font-700 text-white tracking-tight mb-6 leading-tight">
              Ready to experience the future of care?
            </h2>
            <p className="text-blue-200 text-base leading-relaxed mb-10 max-w-md">
              Join thousands of healthcare professionals and patients who rely on AI Doctor every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#1E40AF] rounded-lg text-sm font-semibold hover:bg-blue-50 transition-base"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-blue-400 text-blue-100 rounded-lg text-sm font-medium hover:border-blue-300 hover:text-white transition-base"
              >
                Sign In
              </Link>
            </div>
            <p className="text-blue-400 text-xs mt-5">No credit card required · HIPAA compliant · Free to start</p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
};

export default Home;
