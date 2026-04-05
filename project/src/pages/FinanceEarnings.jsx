import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, CreditCard, Receipt, Download, Filter, Search, Calendar, ChevronDown, ChevronUp, Eye, Check, X, Plus, Clock, AlertTriangle, Users, BarChart3, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const EARNINGS_DATA = [18200, 21500, 19800, 24750, 22100, 26300, 24750];
const CONSULTATIONS_DATA = [128, 152, 141, 165, 158, 182, 165];

const TRANSACTIONS = [
  { id: 1, patient: 'John Smith', type: 'Consultation', date: '2026-04-07', amount: 200, status: 'paid', mode: 'Video', insurance: 'Blue Cross' },
  { id: 2, patient: 'Maria Garcia', type: 'Follow-up', date: '2026-04-07', amount: 150, status: 'paid', mode: 'In-person', insurance: 'Aetna' },
  { id: 3, patient: 'Robert Chen', type: 'Emergency', date: '2026-04-06', amount: 350, status: 'pending', mode: 'In-person', insurance: 'United Health' },
  { id: 4, patient: 'Sarah Johnson', type: 'Consultation', date: '2026-04-06', amount: 200, status: 'paid', mode: 'Video', insurance: 'Medicare' },
  { id: 5, patient: 'Michael Brown', type: 'Follow-up', date: '2026-04-05', amount: 150, status: 'overdue', mode: 'Phone', insurance: 'Cigna' },
  { id: 6, patient: 'Emily Davis', type: 'New Patient', date: '2026-04-05', amount: 300, status: 'paid', mode: 'In-person', insurance: 'BCBS' },
  { id: 7, patient: 'David Wilson', type: 'Consultation', date: '2026-04-04', amount: 200, status: 'pending', mode: 'Video', insurance: 'Humana' },
];

const STATUS_CONFIG = {
  paid: { cls: 'bg-green-100 text-green-700 border-green-200', label: 'Paid' },
  pending: { cls: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Pending' },
  overdue: { cls: 'bg-red-100 text-red-700 border-red-200', label: 'Overdue' },
};

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false }, tooltip: { mode: 'index' } },
  scales: { y: { grid: { color: '#F1F5F9' }, ticks: { color: '#64748B', fontSize: 11 } }, x: { grid: { display: false }, ticks: { color: '#64748B' } } },
  elements: { line: { tension: 0.4 } },
};

export default function FinanceEarnings() {
  const [tab, setTab] = useState('overview');
  const [period, setPeriod] = useState('month');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = TRANSACTIONS.filter(t => {
    const matchSearch = t.patient.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = TRANSACTIONS.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0);
  const pending = TRANSACTIONS.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);
  const overdue = TRANSACTIONS.filter(t => t.status === 'overdue').reduce((s, t) => s + t.amount, 0);

  const earningsChartData = {
    labels: MONTHS,
    datasets: [{
      data: EARNINGS_DATA,
      borderColor: '#1E40AF',
      backgroundColor: 'rgba(30,64,175,0.08)',
      fill: true,
      pointBackgroundColor: '#1E40AF',
      pointRadius: 4,
    }],
  };

  const consultationsChartData = {
    labels: MONTHS,
    datasets: [{
      data: CONSULTATIONS_DATA,
      backgroundColor: '#1E40AF',
      borderRadius: 6,
    }],
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'invoices', label: 'Invoices' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="section-label">Finance</span>
          <span className="text-[#CBD5E1] text-xs">·</span>
          <span className="section-label">Earnings & Revenue</span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Finance & Earnings</h1>
            <p className="text-[#64748B] mt-1 text-sm">Track revenue, manage billing, and generate financial reports</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toast.info('Generating report...')} className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Monthly Revenue', value: '$24,750', change: '+12.5%', icon: DollarSign, color: 'text-[#1E40AF]', bg: 'bg-[#EFF6FF]', positive: true },
          { label: 'Consultations', value: '165', change: '+8.5%', icon: Users, color: 'text-green-600', bg: 'bg-green-50', positive: true },
          { label: 'Avg per Consultation', value: '$150', change: '+3.8%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', positive: true },
          { label: 'Pending Payments', value: '$' + (pending + overdue), change: `${TRANSACTIONS.filter(t => t.status !== 'paid').length} invoices`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', positive: false },
        ].map((s, i) => (
          <div key={i} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{s.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
                <div className={`text-xs mt-1 font-medium ${s.positive ? 'text-green-600' : 'text-amber-600'}`}>{s.change}</div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'
            }`}>{t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#0F172A]">Monthly Revenue</h2>
                <span className="text-xs text-[#64748B]">Last 7 months</span>
              </div>
              <Line data={earningsChartData} options={chartOptions} height={160} />
            </div>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#0F172A]">Consultations</h2>
                <span className="text-xs text-[#64748B]">Last 7 months</span>
              </div>
              <Bar data={consultationsChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} height={160} />
            </div>

            {/* Summary Cards */}
            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-4">Revenue Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: 'Consultation Fees', amount: 18200, pct: 74 },
                  { label: 'Follow-up Visits', amount: 4300, pct: 17 },
                  { label: 'Emergency Cases', amount: 2250, pct: 9 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[#374151]">{item.label}</span>
                      <span className="font-medium text-[#0F172A]">${item.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#1E40AF] rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-4">Payment Status</h2>
              <div className="space-y-3">
                {[
                  { label: 'Paid', amount: totalRevenue, count: TRANSACTIONS.filter(t => t.status === 'paid').length, cls: 'bg-green-500' },
                  { label: 'Pending', amount: pending, count: TRANSACTIONS.filter(t => t.status === 'pending').length, cls: 'bg-amber-500' },
                  { label: 'Overdue', amount: overdue, count: TRANSACTIONS.filter(t => t.status === 'overdue').length, cls: 'bg-red-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.cls}`} />
                    <span className="flex-1 text-sm text-[#374151]">{item.label}</span>
                    <span className="text-xs text-[#94A3B8]">{item.count} invoices</span>
                    <span className="font-medium text-[#0F172A]">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'transactions' && (
          <motion.div key="trans" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input className="input pl-9" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="input w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="card p-0 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    {['Patient', 'Type', 'Date', 'Mode', 'Insurance', 'Amount', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#64748B]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => {
                    const status = STATUS_CONFIG[t.status];
                    return (
                      <tr key={t.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[#0F172A]">{t.patient}</td>
                        <td className="px-4 py-3 text-sm text-[#64748B]">{t.type}</td>
                        <td className="px-4 py-3 text-sm text-[#64748B]">{t.date}</td>
                        <td className="px-4 py-3 text-sm text-[#64748B]">{t.mode}</td>
                        <td className="px-4 py-3 text-xs text-[#64748B]">{t.insurance}</td>
                        <td className="px-4 py-3 text-sm font-bold text-[#0F172A]">${t.amount}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded border font-medium ${status.cls}`}>{status.label}</span></td>
                        <td className="px-4 py-3"><button onClick={() => toast.info('Viewing invoice...')} className="text-[#64748B] hover:text-[#1E40AF]"><Eye className="w-4 h-4" /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-[#64748B]">No transactions found</div>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'invoices' && (
          <motion.div key="invoices" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex justify-end mb-4">
              <button onClick={() => toast.info('Creating new invoice...')} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />New Invoice
              </button>
            </div>
            <div className="space-y-3">
              {TRANSACTIONS.filter(t => t.status !== 'paid').map(t => {
                const status = STATUS_CONFIG[t.status];
                return (
                  <div key={t.id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#0F172A]">{t.patient}</span>
                          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${status.cls}`}>{status.label}</span>
                        </div>
                        <div className="text-xs text-[#64748B] mt-1">{t.type} · {t.date} · {t.insurance}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-[#0F172A]">${t.amount}</span>
                        <div className="flex gap-2">
                          <button onClick={() => toast.success('Invoice sent')} className="btn-secondary text-xs py-1.5 px-3">Send</button>
                          <button onClick={() => toast.info('Downloading...')} className="p-1.5 text-[#64748B] border border-[#E2E8F0] rounded-lg hover:border-[#1E40AF]"><Download className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
