import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  CreditCard,
  FileText,
  Calendar,
  Clock,
  User,
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Receipt,
  Banknote,
  Wallet,
  PieChart,
  BarChart3,
  LineChart,
  Building,
  MapPin,
  Phone,
  Mail,
  Printer,
  Send,
  RefreshCw,
  Settings,
  Shield,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calculator,
  Target,
  Award,
  Activity,
  Zap
} from 'lucide-react';
import { toast } from 'react-toastify';

const BillingFinance = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Financial data state
  const [financialStats, setFinancialStats] = useState({
    totalRevenue: 48750,
    pendingPayments: 12400,
    completedConsultations: 147,
    averageConsultationFee: 280,
    monthlyGrowth: 12.5,
    unpaidInvoices: 8,
    totalPatients: 234,
    recurringPatients: 89
  });

  // Sample invoices data
  const [invoices] = useState([
    {
      id: 'INV-2024-001',
      patientName: 'John Smith',
      patientId: 'P001',
      consultationType: 'Video Consultation',
      specialty: 'Cardiology',
      amount: 300,
      tax: 45,
      total: 345,
      status: 'paid',
      issueDate: '2024-01-15',
      dueDate: '2024-01-30',
      paidDate: '2024-01-18',
      paymentMethod: 'Credit Card',
      insuranceProvider: 'Blue Cross Blue Shield',
      insuranceClaim: 'BCBS-2024-78901',
      insuranceAmount: 210,
      patientAmount: 135,
      consultationDuration: 45,
      consultationDate: '2024-01-15T10:00:00',
      notes: 'Routine cardiology follow-up consultation'
    },
    {
      id: 'INV-2024-002',
      patientName: 'Maria Garcia',
      patientId: 'P002',
      consultationType: 'Emergency Consultation',
      specialty: 'Emergency Medicine',
      amount: 450,
      tax: 67.5,
      total: 517.5,
      status: 'pending',
      issueDate: '2024-01-16',
      dueDate: '2024-02-01',
      paidDate: null,
      paymentMethod: null,
      insuranceProvider: 'Aetna',
      insuranceClaim: 'AETNA-2024-45612',
      insuranceAmount: 320,
      patientAmount: 197.5,
      consultationDuration: 60,
      consultationDate: '2024-01-16T14:30:00',
      notes: 'Emergency consultation for severe headache'
    },
    {
      id: 'INV-2024-003',
      patientName: 'Robert Johnson',
      patientId: 'P003',
      consultationType: 'Follow-up Consultation',
      specialty: 'Cardiology',
      amount: 200,
      tax: 30,
      total: 230,
      status: 'overdue',
      issueDate: '2024-01-10',
      dueDate: '2024-01-25',
      paidDate: null,
      paymentMethod: null,
      insuranceProvider: 'Medicare',
      insuranceClaim: 'MED-2024-12345',
      insuranceAmount: 160,
      patientAmount: 70,
      consultationDuration: 30,
      consultationDate: '2024-01-10T11:00:00',
      notes: 'Follow-up for diabetes management'
    }
  ]);

  // Earnings by specialty
  const [specialtyEarnings] = useState([
    { specialty: 'Cardiology', amount: 18500, consultations: 65, percentage: 38 },
    { specialty: 'Neurology', amount: 12400, consultations: 42, percentage: 25 },
    { specialty: 'Internal Medicine', amount: 9800, consultations: 38, percentage: 20 },
    { specialty: 'Emergency Medicine', amount: 5200, consultations: 18, percentage: 11 },
    { specialty: 'Radiology', amount: 2850, consultations: 12, percentage: 6 }
  ]);

  // Monthly revenue data
  const [monthlyRevenue] = useState([
    { month: 'Jan', revenue: 45200, consultations: 142 },
    { month: 'Feb', revenue: 38900, consultations: 128 },
    { month: 'Mar', revenue: 42100, consultations: 135 },
    { month: 'Apr', revenue: 47800, consultations: 149 },
    { month: 'May', revenue: 51200, consultations: 162 },
    { month: 'Jun', revenue: 48750, consultations: 147 }
  ]);

  // Payment gateways
  const [paymentGateways] = useState([
    {
      id: 'stripe',
      name: 'Stripe',
      status: 'active',
      commission: 2.9,
      setupFee: 0,
      monthlyFee: 0,
      features: ['Credit Cards', 'Debit Cards', 'Digital Wallets', 'Bank Transfers']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      status: 'active',
      commission: 3.49,
      setupFee: 0,
      monthlyFee: 0,
      features: ['PayPal Account', 'Credit Cards', 'Buy Now Pay Later']
    },
    {
      id: 'square',
      name: 'Square',
      status: 'inactive',
      commission: 2.6,
      setupFee: 0,
      monthlyFee: 0,
      features: ['Credit Cards', 'Contactless', 'Gift Cards']
    }
  ]);

  // Insurance providers
  const [insuranceProviders] = useState([
    { name: 'Blue Cross Blue Shield', acceptanceRate: 95, averageReimbursement: 280, processingTime: '14 days' },
    { name: 'Aetna', acceptanceRate: 89, averageReimbursement: 265, processingTime: '18 days' },
    { name: 'Medicare', acceptanceRate: 100, averageReimbursement: 220, processingTime: '21 days' },
    { name: 'Cigna', acceptanceRate: 87, averageReimbursement: 275, processingTime: '16 days' },
    { name: 'UnitedHealthcare', acceptanceRate: 92, averageReimbursement: 290, processingTime: '12 days' }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const generateInvoicePDF = (invoice) => {
    // In a real application, this would generate and download a PDF
    toast.success('Invoice PDF generated and downloaded');
  };

  const sendInvoiceEmail = (invoice) => {
    toast.success(`Invoice sent to ${invoice.patientName}`);
  };

  const markAsPaid = (invoiceId, paymentDetails) => {
    toast.success('Payment recorded successfully');
  };

  const submitInsuranceClaim = (invoice) => {
    toast.success('Insurance claim submitted');
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Billing & Finance</h1>
              <p className="text-gray-600">Comprehensive financial management for your medical practice</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <button
                onClick={() => setShowNewInvoice(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>New Invoice</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: PieChart },
              { id: 'invoices', label: 'Invoices', icon: FileText },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'insurance', label: 'Insurance', icon: Shield },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Financial Overview Cards */}
              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold">{formatCurrency(financialStats.totalRevenue)}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">+{financialStats.monthlyGrowth}% this month</span>
                      </div>
                    </div>
                    <DollarSign className="w-12 h-12 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Pending Payments</p>
                      <p className="text-2xl font-bold">{formatCurrency(financialStats.pendingPayments)}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{financialStats.unpaidInvoices} unpaid invoices</span>
                      </div>
                    </div>
                    <Clock className="w-12 h-12 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Consultations</p>
                      <p className="text-2xl font-bold">{financialStats.completedConsultations}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm">Avg: {formatCurrency(financialStats.averageConsultationFee)}</span>
                      </div>
                    </div>
                    <Users className="w-12 h-12 text-purple-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Patients</p>
                      <p className="text-2xl font-bold">{financialStats.totalPatients}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">{financialStats.recurringPatients} recurring</span>
                      </div>
                    </div>
                    <User className="w-12 h-12 text-orange-200" />
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Revenue Trend</h3>
                  <div className="space-y-4">
                    {monthlyRevenue.map((month, index) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="w-8 text-sm font-medium text-gray-600">{month.month}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[200px]">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(month.revenue / 60000) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(month.revenue)}</p>
                          <p className="text-xs text-gray-500">{month.consultations} consults</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialty Earnings */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Earnings by Specialty</h3>
                  <div className="space-y-4">
                    {specialtyEarnings.map((specialty, index) => (
                      <div key={specialty.specialty} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full bg-blue-${(index + 1) * 100}`} />
                          <span className="text-sm font-medium text-gray-700">{specialty.specialty}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(specialty.amount)}</p>
                          <p className="text-xs text-gray-500">{specialty.consultations} consults</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Plus className="w-6 h-6 text-blue-600" />
                    <span className="font-medium text-blue-900">Create Invoice</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <Download className="w-6 h-6 text-green-600" />
                    <span className="font-medium text-green-900">Export Reports</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <Send className="w-6 h-6 text-purple-600" />
                    <span className="font-medium text-purple-900">Send Reminders</span>
                  </button>
                  <button className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <Calculator className="w-6 h-6 text-orange-600" />
                    <span className="font-medium text-orange-900">Tax Calculator</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                    </select>
                    <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Filter className="w-5 h-5" />
                      <span>More Filters</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Invoices List */}
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{invoice.id}</h3>
                          <p className="text-gray-600">{invoice.patientName}</p>
                          <p className="text-sm text-gray-500">{invoice.consultationType}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                          <p className="text-sm text-gray-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(invoice.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowInvoiceModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => generateInvoicePDF(invoice)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => sendInvoiceEmail(invoice)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Send Email"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Payment Gateways */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Gateways</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {paymentGateways.map((gateway) => (
                    <div key={gateway.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{gateway.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gateway.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {gateway.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Commission:</span>
                          <span className="font-medium">{gateway.commission}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Setup Fee:</span>
                          <span className="font-medium">{formatCurrency(gateway.setupFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Fee:</span>
                          <span className="font-medium">{formatCurrency(gateway.monthlyFee)}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs text-gray-600 mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {gateway.features.map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'insurance' && (
            <motion.div
              key="insurance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Insurance Providers */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Insurance Provider Performance</h3>
                <div className="space-y-4">
                  {insuranceProviders.map((provider, index) => (
                    <div key={provider.name} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                          <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                            <div>
                              <p className="text-gray-600">Acceptance Rate</p>
                              <p className="font-medium text-green-600">{provider.acceptanceRate}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Avg. Reimbursement</p>
                              <p className="font-medium text-blue-600">{formatCurrency(provider.averageReimbursement)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Processing Time</p>
                              <p className="font-medium text-purple-600">{provider.processingTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invoice Details Modal */}
        <AnimatePresence>
          {showInvoiceModal && selectedInvoice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowInvoiceModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Invoice {selectedInvoice.id}</h2>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Invoice Header */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Name:</span> {selectedInvoice.patientName}</p>
                        <p><span className="text-gray-600">Patient ID:</span> {selectedInvoice.patientId}</p>
                        <p><span className="text-gray-600">Insurance:</span> {selectedInvoice.insuranceProvider}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Consultation Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Type:</span> {selectedInvoice.consultationType}</p>
                        <p><span className="text-gray-600">Duration:</span> {selectedInvoice.consultationDuration} minutes</p>
                        <p><span className="text-gray-600">Date:</span> {new Date(selectedInvoice.consultationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Billing Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Billing Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Consultation Fee:</span>
                        <span>{formatCurrency(selectedInvoice.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(selectedInvoice.tax)}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{formatCurrency(selectedInvoice.total)}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <div className="flex justify-between text-blue-600">
                          <span>Insurance Coverage:</span>
                          <span>{formatCurrency(selectedInvoice.insuranceAmount)}</span>
                        </div>
                        <div className="flex justify-between text-orange-600">
                          <span>Patient Responsibility:</span>
                          <span>{formatCurrency(selectedInvoice.patientAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedInvoice.status === 'pending' && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => markAsPaid(selectedInvoice.id)}
                        className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Mark as Paid
                      </button>
                      <button
                        onClick={() => submitInsuranceClaim(selectedInvoice)}
                        className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Submit Insurance Claim
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BillingFinance;
