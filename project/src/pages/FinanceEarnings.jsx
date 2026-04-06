import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock, Download, Calendar, CreditCard, CheckCircle, BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const TRANSACTIONS = [
  { id: 'TXN-001', patient: 'John Smith', service: 'Video Consultation', amount: 200, date: '2026-04-07', status: 'completed', mode: 'video' },
  { id: 'TXN-002', patient: 'Maria Garcia', service: 'Follow-up Visit', amount: 150, date: '2026-04-07', status: 'completed', mode: 'in-person' },
  { id: 'TXN-003', patient: 'Robert Chen', service: 'Emergency Consult', amount: 350, date: '2026-04-06', status: 'completed', mode: 'video' },
  { id: 'TXN-004', patient: 'Sarah Johnson', service: 'Diabetes Review', amount: 175, date: '2026-04-05', status: 'pending', mode: 'audio' },
  { id: 'TXN-005', patient: 'Michael Brown', service: 'Annual Physical', amount: 250, date: '2026-04-04', status: 'completed', mode: 'in-person' },
  { id: 'TXN-006', patient: 'Emily Davis', service: 'Prescription Review', amount: 100, date: '2026-04-03', status: 'completed', mode: 'chat' },
];

const chartOpts = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: '#F1F5F9' }, ticks: { color: '#64748B', font: { size: 11 }, callback: v => '$' + v } },
    x: { grid: { display: false }, ticks: { color: '#64748B' } }
  }
};

export default function FinanceEarnings() {
  const [period, setPeriod] = useState('month');
  const [tab, setTab] = useState('overview');

  const monthly = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], datasets: [{ data: [18000, 21000, 19500, 24000, 22000, 28400], backgroundColor: '#1E40AF', borderRadius: 6 }] };
  const weekly = { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ data: [1200, 1850, 2100, 1750, 2300, 800, 400], borderColor: '#1E40AF', backgroundColor: 'rgba(30,64,175,0.08)', fill: true, tension: 0.4, pointBackgroundColor: '#1E40AF', pointRadius: 4 }] };

  const stats = [
    { label: 'Total Earnings', value: '$28,400', sub: 'This month', change: '+18.3%', up: true },
    { label: 'Total Consultations', value: '142', sub: 'This month', change: '+12%', up: true },
    { label: 'Avg per Consultation', value: '$200', sub: 'All modes', change: '+5.2%', up: true },
    { label: 'Pending Payments', value: '$525', sub: '3 invoices', change: '—', up: null },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'payout', label: 'Payout' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Finance</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Earnings</span></div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Finance & Earnings</h1>
            <p className="text-[#64748B] mt-1 text-sm">Track your consultation revenue and financial performance</p>
          </div>
          <button onClick={() => toast.info('Downloading report...')} className="btn-secondary flex items-center gap-2"><Download className="w-4 h-4" />Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="card">
            <div className="text-2xl font-bold text-[#0F172A]">{s.value}</div>
            <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
            <div className="flex items-center gap-1 mt-1">
              {s.up !== null && (s.up ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />)}
              <span className={`text-xs font-medium ${s.up === null ? 'text-[#94A3B8]' : s.up ? 'text-green-600' : 'text-red-600'}`}>{s.change}</span>
              <span className="text-xs text-[#94A3B8] ml-0.5">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'}`}>{t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#0F172A]">Monthly Revenue</h2>
                <div className="flex gap-2">
                  {['month', 'week'].map(p => (
                    <button key={p} onClick={() => setPeriod(p)} className={`px-2.5 py-1 text-xs rounded-lg border capitalize transition-colors ${period === p ? 'bg-[#1E40AF] text-white border-[#1E40AF]' : 'border-[#E2E8F0] text-[#64748B]'}`}>{p}</button>
                  ))}
                </div>
              </div>
              {period === 'month' ? <Bar data={monthly} options={chartOpts} height={160} /> : <Line data={weekly} options={{ ...chartOpts, scales: { ...chartOpts.scales, y: { ...chartOpts.scales.y, callback: v => '$' + v } } }} height={160} />}
            </div>
            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-4">Revenue by Mode</h2>
              <div className="space-y-3">
                {[
                  { mode: 'Video Consultation', pct: 55, amount: '$15,620', color: 'bg-[#1E40AF]' },
                  { mode: 'In-person Visit', pct: 28, amount: '$7,952', color: 'bg-blue-400' },
                  { mode: 'Audio Call', pct: 11, amount: '$3,124', color: 'bg-blue-300' },
                  { mode: 'Chat Consultation', pct: 6, amount: '$1,704', color: 'bg-blue-200' },
                ].map((row, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1"><span className="text-[#374151]">{row.mode}</span><span className="font-medium text-[#0F172A]">{row.amount} ({row.pct}%)</span></div>
                    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full transition-all`} style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {tab === 'transactions' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {TRANSACTIONS.map(txn => (
            <div key={txn.id} className="card">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-[#EFF6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-[#1E40AF]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-[#0F172A] text-sm">{txn.patient}</span>
                    <span className="text-xs text-[#94A3B8]">{txn.service}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium capitalize ${txn.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>{txn.status}</span>
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">{txn.id} · {txn.date} · {txn.mode}</div>
                </div>
                <div className="font-bold text-[#0F172A]">${txn.amount}</div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {tab === 'payout' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card max-w-lg">
          <h2 className="font-semibold text-[#0F172A] mb-4">Payout Settings</h2>
          <div className="space-y-3 mb-6">
            {[
              { label: 'Available Balance', value: '$28,400', cls: 'text-green-600 text-xl font-bold' },
              { label: 'Pending', value: '$525', cls: 'text-amber-600 font-medium' },
              { label: 'Payout Method', value: 'Direct Deposit — Chase ****6789' },
              { label: 'Payout Schedule', value: 'Weekly, every Monday' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-[#F1F5F9] last:border-0">
                <span className="text-sm text-[#64748B]">{item.label}</span>
                <span className={item.cls || 'text-sm font-medium text-[#0F172A]'}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => toast.success('Payout initiated!')} className="btn-primary flex items-center gap-2 flex-1"><DollarSign className="w-4 h-4" />Request Payout</button>
            <button onClick={() => toast.info('Updating payout settings...')} className="btn-secondary flex items-center gap-2"><CreditCard className="w-4 h-4" />Edit</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
