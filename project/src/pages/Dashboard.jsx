import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity, Heart, Thermometer, Clock, FileText, Pill,
  AlertTriangle, TrendingUp, Calendar, ArrowRight, Brain,
  Zap, Target, ChevronRight, BarChart3, Users, Stethoscope,
  TestTube, Video, Shield, RefreshCw
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { useUser } from '../context/UserContext.jsx';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const FadeUp = ({ children, delay = 0, className = '' }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const VitalCard = ({ icon: Icon, label, value, unit, status, statusColor }) => (
  <div className="card p-5 hover:border-slate-300 transition-base">
    <div className="flex items-start justify-between mb-4">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
        {status}
      </span>
    </div>
    <div className="font-display text-2xl font-700 text-slate-900 tracking-tight">
      {value}
      <span className="text-sm font-normal text-slate-400 ml-1">{unit}</span>
    </div>
    <p className="text-xs text-slate-500 mt-1">{label}</p>
  </div>
);

const ActionRow = ({ icon: Icon, title, description, href, badge }) => (
  <Link
    to={href}
    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-base group border border-transparent hover:border-slate-200"
  >
    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#1E40AF]/10 flex items-center justify-center flex-shrink-0 transition-base">
      <Icon className="w-4.5 h-4.5 text-slate-500 group-hover:text-[#1E40AF] transition-base" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-800 group-hover:text-slate-900">{title}</span>
        {badge && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full">{badge}</span>
        )}
      </div>
      <p className="text-xs text-slate-400 truncate mt-0.5">{description}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1E40AF] group-hover:translate-x-0.5 transition-base flex-shrink-0" />
  </Link>
);

const ActivityItem = ({ icon: Icon, title, time, tag, tagColor }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
      <Icon className="w-3.5 h-3.5 text-slate-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-700 font-medium truncate">{title}</p>
      <p className="text-xs text-slate-400">{time}</p>
    </div>
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${tagColor}`}>{tag}</span>
  </div>
);

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [vitals, setVitals] = useState({
    heartRate: 72, temperature: 98.6, bloodPressure: '120/80', oxygenLevel: 98
  });

  useEffect(() => {
    const t1 = setInterval(() => setNow(new Date()), 1000);
    const t2 = setInterval(() => {
      setVitals(p => ({
        ...p,
        heartRate: Math.round(p.heartRate + (Math.random() - 0.5) * 3),
        temperature: parseFloat((p.temperature + (Math.random() - 0.5) * 0.1).toFixed(1)),
        oxygenLevel: Math.max(95, Math.min(100, Math.round(p.oxygenLevel + (Math.random() - 0.5) * 1)))
      }));
    }, 4000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  const trendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
    datasets: [
      {
        label: 'Heart Rate',
        data: [72, 75, 70, 78, 72, 74, vitals.heartRate],
        borderColor: '#1E40AF',
        backgroundColor: 'rgba(30, 64, 175, 0.06)',
        borderWidth: 1.5,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#1E40AF',
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
      },
      {
        label: 'Blood Pressure',
        data: [120, 118, 122, 119, 121, 117, 120],
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.04)',
        borderWidth: 1.5,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#059669',
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          usePointStyle: true,
          font: { size: 11, family: 'Inter' },
          color: '#64748B'
        }
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { size: 11, family: 'Inter', weight: '600' },
        bodyFont: { size: 11, family: 'Inter' },
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { size: 11, family: 'Inter' }, color: '#94A3B8' }
      },
      y: {
        grid: { color: '#F1F5F9' },
        border: { display: false, dash: [4, 4] },
        ticks: { font: { size: 11, family: 'Inter' }, color: '#94A3B8' }
      }
    }
  };

  const donutData = {
    labels: ['Healthy', 'Mild', 'Headache', 'Stress', 'Other'],
    datasets: [{
      data: [60, 20, 10, 7, 3],
      backgroundColor: ['#059669', '#1E40AF', '#F59E0B', '#EF4444', '#8B5CF6'],
      borderWidth: 0,
      cutout: '70%'
    }]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 8, boxHeight: 8, usePointStyle: true,
          font: { size: 10, family: 'Inter' }, color: '#64748B', padding: 12
        }
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { size: 11 },
        bodyFont: { size: 11 },
        padding: 10, cornerRadius: 8
      }
    }
  };

  const actions = [
    { icon: Brain, title: 'AI Diagnosis', description: 'Symptom analysis & differential diagnosis', href: '/ai-diagnosis' },
    { icon: AlertTriangle, title: 'Emergency', description: '24/7 triage & emergency response', href: '/emergency', badge: 'URGENT' },
    { icon: TestTube, title: 'Lab Reports', description: 'Upload & interpret medical reports', href: '/lab-reports-analysis' },
    { icon: Pill, title: 'Prescriptions', description: 'Smart medication recommendations', href: '/prescription' },
    { icon: Video, title: 'Video Consult', description: 'Start or schedule a telemedicine call', href: '/consultation-modes' },
    { icon: Users, title: 'Patient Management', description: 'Records, scheduling & follow-ups', href: '/patient-management' },
    { icon: Stethoscope, title: 'Doctor Dashboard', description: 'Clinical workflow & analytics', href: '/doctor-dashboard' },
    { icon: BarChart3, title: 'Finance', description: 'Billing, earnings & analytics', href: '/finance-earnings' },
  ];

  const recentActivity = [
    { icon: Brain, title: 'AI Health Check Completed', time: '2 hours ago', tag: 'Done', tagColor: 'bg-emerald-100 text-emerald-700' },
    { icon: Pill, title: 'Prescription Updated', time: '1 day ago', tag: 'Active', tagColor: 'bg-blue-100 text-blue-700' },
    { icon: TestTube, title: 'Blood Test Analyzed', time: '2 days ago', tag: 'Reviewed', tagColor: 'bg-slate-100 text-slate-600' },
    { icon: Video, title: 'Video Consultation', time: '3 days ago', tag: 'Done', tagColor: 'bg-emerald-100 text-emerald-700' },
    { icon: Calendar, title: 'Appointment Scheduled', time: '4 days ago', tag: 'Upcoming', tagColor: 'bg-amber-100 text-amber-700' },
  ];

  const insights = [
    { icon: Heart, text: 'Cardiovascular health is excellent — heart rate is consistent.', type: 'positive', action: 'View trends', href: '/dashboard' },
    { icon: AlertTriangle, text: 'Hydration levels could be improved — increase daily water intake.', type: 'warning', action: 'Set reminder', href: '/patient-followup' },
    { icon: Calendar, text: 'Last comprehensive check was 2 months ago. Schedule your next one.', type: 'info', action: 'Schedule now', href: '/scheduling-management' },
  ];

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <FadeUp className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">
              {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="font-display text-3xl font-700 text-slate-900 tracking-tight">
              {greeting}, {user?.name?.split(' ')[0] || 'Doctor'}.
            </h1>
            <p className="text-slate-500 text-sm mt-1">Here's your health overview for today.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
              Monitoring active
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 px-3 py-1.5 bg-slate-100 rounded-lg">
              <Shield className="w-3.5 h-3.5" />
              HIPAA Secure
            </div>
            <button className="btn-ghost p-2 text-slate-400 hover:text-slate-700">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.05} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Live Vitals</h2>
          <span className="text-xs text-slate-400">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <VitalCard icon={Heart} label="Heart Rate" value={vitals.heartRate} unit="bpm" status="Normal" statusColor="bg-emerald-100 text-emerald-700" />
          <VitalCard icon={Thermometer} label="Temperature" value={vitals.temperature} unit="°F" status="Normal" statusColor="bg-emerald-100 text-emerald-700" />
          <VitalCard icon={Activity} label="Blood Pressure" value={vitals.bloodPressure} unit="mmHg" status="Optimal" statusColor="bg-blue-100 text-blue-700" />
          <VitalCard icon={TrendingUp} label="Oxygen Level" value={`${vitals.oxygenLevel}%`} unit="" status="Excellent" statusColor="bg-emerald-100 text-emerald-700" />
        </div>
      </FadeUp>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 mb-6">
        <FadeUp delay={0.1}>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-slate-700">Weekly Health Trends</h2>
              <select className="text-xs text-slate-500 bg-transparent border-none focus:outline-none cursor-pointer">
                <option>This week</option>
                <option>Last week</option>
                <option>This month</option>
              </select>
            </div>
            <div className="h-52">
              <Line data={trendData} options={chartOptions} />
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.12}>
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-1">Health Score</h2>
            <p className="text-xs text-slate-400 mb-4">Symptom distribution</p>
            <div className="relative h-36">
              <Doughnut data={donutData} options={donutOptions} />
              <div className="absolute inset-0 flex items-center justify-center pb-8">
                <div className="text-center">
                  <div className="font-display text-2xl font-700 text-slate-900">85</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide">Overall</div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 mb-6">
        <FadeUp delay={0.14}>
          <div className="card">
            <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Quick Actions</h2>
              <Link to="/micro-functionalities" className="text-xs text-[#1E40AF] hover:underline font-medium flex items-center gap-1">
                All tools <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-3">
              {actions.map((a) => (
                <ActionRow key={a.href + a.title} {...a} />
              ))}
            </div>
          </div>
        </FadeUp>

        <div className="space-y-5">
          <FadeUp delay={0.16}>
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-700">Recent Activity</h2>
              </div>
              <div>
                {recentActivity.map((item) => (
                  <ActivityItem key={item.title} {...item} />
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.18}>
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">AI Insights</h2>
              <div className="space-y-3">
                {insights.map((insight) => {
                  const Icon = insight.icon;
                  const colors = {
                    positive: 'bg-emerald-50 border-emerald-200 text-emerald-700',
                    warning: 'bg-amber-50 border-amber-200 text-amber-700',
                    info: 'bg-blue-50 border-blue-200 text-blue-700'
                  };
                  return (
                    <div key={insight.text} className={`rounded-lg border p-3.5 ${colors[insight.type]}`}>
                      <div className="flex items-start gap-2.5">
                        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-relaxed">{insight.text}</p>
                          <Link to={insight.href} className="text-[11px] font-semibold mt-1.5 inline-flex items-center gap-1 underline underline-offset-2">
                            {insight.action} <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
