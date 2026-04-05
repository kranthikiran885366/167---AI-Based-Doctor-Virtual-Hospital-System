import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Mail, Lock, Eye, EyeOff, User, ArrowRight, Shield, Brain, Activity } from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import { toast } from 'react-toastify';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', phone: '', age: '', gender: ''
  });

  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      if (isLogin) {
        if (!formData.email || !formData.password) { toast.error('Please enter your credentials.'); return; }
        login({ id: 1, name: formData.name || 'Dr. User', email: formData.email });
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        if (!formData.email || !formData.password || !formData.name) { toast.error('Please fill in all required fields.'); return; }
        login({ id: 1, name: formData.name, email: formData.email, phone: formData.phone, age: formData.age, gender: formData.gender });
        toast.success('Account created. Welcome!');
        navigate('/dashboard');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    { icon: Brain, label: 'AI-powered diagnosis in seconds' },
    { icon: Activity, label: 'Real-time vitals & health monitoring' },
    { icon: Shield, label: 'HIPAA-compliant & end-to-end encrypted' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <div className="hidden lg:flex flex-col justify-between w-[440px] flex-shrink-0 bg-[#1E40AF] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white translate-y-1/3 -translate-x-1/3" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-700 text-white text-lg tracking-tight">AI Doctor</span>
          </div>

          <h2 className="text-3xl font-display font-800 text-white leading-tight mb-4">
            Healthcare,<br />reimagined.
          </h2>
          <p className="text-blue-200 text-base leading-relaxed max-w-[280px]">
            An AI-powered medical platform built for clarity, speed, and trust.
          </p>
        </div>

        <div className="relative space-y-4">
          {highlights.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-blue-100">{label}</span>
            </div>
          ))}
          <p className="text-blue-300 text-xs pt-4">© 2025 AI Doctor · MVK Solutions</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-[380px]"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-[#1E40AF] rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-700 text-slate-900 text-lg">AI Doctor</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-display font-700 text-slate-900 mb-1">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-slate-500 text-sm">
              {isLogin ? 'Sign in to access your dashboard.' : 'Get started with AI-powered healthcare.'}
            </p>
          </div>

          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-6">
            {['Sign In', 'Sign Up'].map((label, i) => (
              <button
                key={label}
                onClick={() => setIsLogin(i === 0)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-base ${
                  (isLogin ? i === 0 : i === 1)
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input name="name" type="text" value={formData.name} onChange={handleChange}
                    className="input pl-9" placeholder="Dr. Jane Smith" required={!isLogin} />
                </div>
              </div>
            )}

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="email" type="email" value={formData.email} onChange={handleChange}
                  className="input pl-9" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs text-[#1E40AF] hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="password" type={showPassword ? 'text' : 'password'}
                  value={formData.password} onChange={handleChange}
                  className="input pl-9 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-base">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Age</label>
                  <input name="age" type="number" value={formData.age} onChange={handleChange}
                    className="input" placeholder="32" />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="input">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-[#1E40AF] font-medium hover:underline">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <p className="text-center text-xs text-slate-400 mt-6">
            By continuing, you agree to our{' '}
            <button className="underline underline-offset-2">Terms</button>{' '}
            and{' '}
            <button className="underline underline-offset-2">Privacy Policy</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
