import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, DollarSign, FileText, Download, Plus, Search, Calendar, CheckCircle, Clock, AlertTriangle, X, Printer, Eye, Edit, Trash2, Receipt, Building, User, Hash, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const INVOICES = [
  { id: 'INV-2026-001', patient: 'John Smith', service: 'Cardiology Consultation', date: '2026-04-07', due: '2026-04-14', amount: 200, paid: 200, status: 'paid', insurance: 'Blue Cross' },
  { id: 'INV-2026-002', patient: 'Maria Garcia', service: 'Follow-up Visit + Labs', date: '2026-04-07', due: '2026-04-14', amount: 350, paid: 150, status: 'partial', insurance: 'Aetna' },
  { id: 'INV-2026-003', patient: 'Robert Chen', service: 'Emergency Consultation', date: '2026-04-06', due: '2026-04-13', amount: 500, paid: 0, status: 'overdue', insurance: 'United Health' },
  { id: 'INV-2026-004', patient: 'Sarah Johnson', service: 'Diabetes Management', date: '2026-04-05', due: '2026-04-12', amount: 175, paid: 0, status: 'pending', insurance: 'Medicare' },
  { id: 'INV-2026-005', patient: 'Michael Brown', service: 'Annual Physical + ECG', date: '2026-04-04', due: '2026-04-11', amount: 450, paid: 450, status: 'paid', insurance: 'Cigna' },
];

const PAYMENT_METHODS = [
  { id: 1, type: 'Credit Card', last4: '4242', brand: 'Visa', expiry: '12/27', isDefault: true },
  { id: 2, type: 'Bank Account', last4: '6789', brand: 'Chase Checking', expiry: null, isDefault: false },
];

const STATUS_CONFIG = {
  paid: { cls: 'bg-green-100 text-green-700 border-green-200', label: 'Paid' },
  partial: { cls: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Partial' },
  pending: { cls: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Pending' },
  overdue: { cls: 'bg-red-100 text-red-700 border-red-200', label: 'Overdue' },
};

export default function BillingFinance() {
  const [tab, setTab] = useState('invoices');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [invoices, setInvoices] = useState(INVOICES);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newInvoice, setNewInvoice] = useState({ patient: '', service: '', amount: '', insurance: '', due: '' });

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.patient.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.paid, 0);
  const outstanding = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + (i.amount - i.paid), 0);
  const overdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const createInvoice = () => {
    if (!newInvoice.patient || !newInvoice.service || !newInvoice.amount) { toast.error('Fill required fields'); return; }
    const inv = {
      id: 'INV-2026-' + String(invoices.length + 1).padStart(3, '0'),
      ...newInvoice,
      amount: parseFloat(newInvoice.amount),
      paid: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setInvoices(prev => [inv, ...prev]);
    setShowCreateInvoice(false);
    setNewInvoice({ patient: '', service: '', amount: '', insurance: '', due: '' });
    toast.success('Invoice created');
  };

  const markPaid = (id) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid', paid: inv.amount } : inv));
    setSelected(null);
    toast.success('Marked as paid');
  };

  const tabs = [
    { id: 'invoices', label: 'Invoices' },
    { id: 'payments', label: 'Payment Methods' },
    { id: 'settings', label: 'Billing Settings' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1"><span className="section-label">Finance</span><span className="text-[#CBD5E1] text-xs">·</span><span className="section-label">Billing</span></div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0F172A]">Billing & Finance</h1>
            <p className="text-[#64748B] mt-1 text-sm">Manage invoices, payments, and financial records</p>
          </div>
          <button onClick={() => setShowCreateInvoice(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />New Invoice</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Collected', value: '$' + totalRevenue.toLocaleString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Outstanding', value: '$' + outstanding.toLocaleString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Overdue', value: '$' + overdue.toLocaleString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Invoices', value: invoices.length, icon: FileText, color: 'text-[#1E40AF]', bg: 'bg-[#EFF6FF]' },
        ].map((s, i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-[#0F172A]">{s.value}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
              </div>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-[#E2E8F0] mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t.id ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-transparent text-[#64748B]'}`}>{t.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'invoices' && (
          <motion.div key="invoices" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex gap-3 mb-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input className="input pl-9" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="input w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="space-y-3">
              {filtered.map(inv => {
                const st = STATUS_CONFIG[inv.status];
                return (
                  <div key={inv.id} className={`card cursor-pointer hover:border-[#1E40AF] transition-colors ${selected?.id === inv.id ? 'border-[#1E40AF]' : ''}`} onClick={() => setSelected(inv)}>
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-[#EFF6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                        <Receipt className="w-4 h-4 text-[#1E40AF]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-[#1E40AF]">{inv.id}</span>
                          <span className="font-medium text-[#0F172A] text-sm">{inv.patient}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${st.cls}`}>{st.label}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 flex-wrap">
                          <span className="text-xs text-[#64748B]">{inv.service}</span>
                          <span className="text-xs text-[#94A3B8]">Due: {inv.due}</span>
                          <span className="text-xs text-[#94A3B8]">{inv.insurance}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-[#0F172A]">${inv.amount}</div>
                        {inv.status === 'partial' && <div className="text-xs text-[#64748B]">Paid: ${inv.paid}</div>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={e => { e.stopPropagation(); toast.info('Sending invoice...'); }} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg"><Send className="w-3.5 h-3.5" /></button>
                        <button onClick={e => { e.stopPropagation(); toast.info('Downloading...'); }} className="p-1.5 text-[#64748B] hover:text-[#1E40AF] border border-[#E2E8F0] rounded-lg"><Download className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    {inv.status !== 'paid' && selected?.id === inv.id && (
                      <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex justify-end gap-2">
                        <button onClick={() => markPaid(inv.id)} className="btn-primary text-sm flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Mark Paid</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {tab === 'payments' && (
          <motion.div key="payments" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="card">
              <h2 className="font-semibold text-[#0F172A] mb-4">Saved Payment Methods</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(pm => (
                  <div key={pm.id} className="flex items-center gap-4 p-3 border border-[#E2E8F0] rounded-lg">
                    <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-[#1E40AF]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#0F172A] text-sm">{pm.brand} ···· {pm.last4}</div>
                      <div className="text-xs text-[#64748B]">{pm.type}{pm.expiry ? ` · Expires ${pm.expiry}` : ''}</div>
                    </div>
                    {pm.isDefault && <span className="text-xs bg-[#EFF6FF] text-[#1E40AF] border border-blue-200 px-2 py-0.5 rounded">Default</span>}
                    <button onClick={() => toast.info('Removing...')} className="text-[#64748B] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => toast.info('Adding payment method...')} className="btn-secondary mt-4 flex items-center gap-2"><Plus className="w-4 h-4" />Add Payment Method</button>
            </div>
          </motion.div>
        )}

        {tab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card">
            <h2 className="font-semibold text-[#0F172A] mb-4">Billing Configuration</h2>
            <div className="space-y-4 max-w-lg">
              {[
                { label: 'Practice Name', placeholder: 'Your Medical Practice' },
                { label: 'Tax ID / NPI', placeholder: 'EIN or NPI number' },
                { label: 'Payment Terms', placeholder: 'e.g., Net 30' },
                { label: 'Late Fee (%)', placeholder: '1.5', type: 'number' },
              ].map(f => (
                <div key={f.label}><label className="block text-xs text-[#64748B] mb-1">{f.label}</label><input type={f.type || 'text'} className="input" placeholder={f.placeholder} /></div>
              ))}
              <div className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg">
                <div><div className="font-medium text-[#0F172A] text-sm">Auto-send Invoices</div><div className="text-xs text-[#64748B]">Automatically email invoices after consultation</div></div>
                <div className="w-11 h-6 rounded-full bg-[#1E40AF] relative cursor-pointer" onClick={() => toast.success('Updated')}><div className="w-4 h-4 bg-white rounded-full absolute top-1 translate-x-6" /></div>
              </div>
              <button onClick={() => toast.success('Settings saved')} className="btn-primary">Save Settings</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Invoice Modal */}
      <AnimatePresence>
        {showCreateInvoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-[#0F172A]">Create Invoice</h3>
                <button onClick={() => setShowCreateInvoice(false)} className="text-[#94A3B8]"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div><label className="block text-xs text-[#64748B] mb-1">Patient Name *</label><input className="input" value={newInvoice.patient} onChange={e => setNewInvoice(p => ({ ...p, patient: e.target.value }))} placeholder="Full name" /></div>
                <div><label className="block text-xs text-[#64748B] mb-1">Service *</label><input className="input" value={newInvoice.service} onChange={e => setNewInvoice(p => ({ ...p, service: e.target.value }))} placeholder="Service description" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs text-[#64748B] mb-1">Amount ($) *</label><input type="number" className="input" value={newInvoice.amount} onChange={e => setNewInvoice(p => ({ ...p, amount: e.target.value }))} placeholder="0.00" /></div>
                  <div><label className="block text-xs text-[#64748B] mb-1">Due Date</label><input type="date" className="input" value={newInvoice.due} onChange={e => setNewInvoice(p => ({ ...p, due: e.target.value }))} /></div>
                </div>
                <div><label className="block text-xs text-[#64748B] mb-1">Insurance</label><input className="input" value={newInvoice.insurance} onChange={e => setNewInvoice(p => ({ ...p, insurance: e.target.value }))} placeholder="Insurance provider" /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={createInvoice} className="btn-primary flex-1">Create Invoice</button>
                <button onClick={() => setShowCreateInvoice(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
