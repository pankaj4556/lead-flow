import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { exportLeadsToCSV } from '../utils/csvExport';

// Components
import Sidebar from '../components/Dashboard/Sidebar';
import StatCard from '../components/Dashboard/StatCard';
import AppointmentModal from '../components/Dashboard/AppointmentModal';
import AnalyticsCharts from '../components/Dashboard/AnalyticsCharts';

// Icons
import { 
  Users, CalendarCheck, Clock, CheckCircle2, 
  XCircle, Search, Filter, Download, Eye, 
  Edit, Trash2, SlidersHorizontal, RefreshCw,
  Plus
} from 'lucide-react';

const SERVICES = [
  'General Consultation', 
  'Therapy Session', 
  'Diagnostics/Scan', 
  'Career Coaching',
  'Academic Counseling',
  'Custom Assistance'
];

const STATUSES = ['New', 'Contacted', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Navigation state
  const [activeTab, setActiveTab] = useState('leads');

  // Appointments and Stats states
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    status: '',
    service: '',
    startDate: '',
    endDate: ''
  });

  // Modal State
  const [selectedApt, setSelectedApt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch Dashboard Stats & Charts
  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/stats');
      setStats(response.data.stats);
      setCharts(response.data.charts);
    } catch (err) {
      console.error('Failed to retrieve analytics metrics:', err);
    }
  };

  // Fetch Appointments list based on current filters
  const fetchAppointments = async () => {
    setRefreshing(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.phone) queryParams.append('phone', filters.phone);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.service) queryParams.append('service', filters.service);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const response = await api.get(`/appointments?${queryParams.toString()}`);
      setAppointments(response.data.data);
    } catch (err) {
      console.error('Failed to retrieve appointments list:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Run full data synchronizer
  const synchronizeData = async () => {
    setLoading(true);
    await Promise.all([fetchAnalytics(), fetchAppointments()]);
    setLoading(false);
  };

  useEffect(() => {
    synchronizeData();
  }, [filters]); // Refetch list automatically when filter parameters modify

  // Inline Status Quick patch
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus });
      // Update local tables immediately for visual response
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      // Refresh stats aggregates in background
      fetchAnalytics();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  // Delete Action
  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this lead record?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments(prev => prev.filter(a => a.id !== id));
      fetchAnalytics();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete record.');
    }
  };

  // Modal Update Save adapter
  const handleModalSave = async (updatedData) => {
    try {
      const response = await api.put(`/appointments/${updatedData.id}`, updatedData);
      setAppointments(prev => prev.map(a => a.id === updatedData.id ? response.data.data : a));
      fetchAnalytics();
      setModalOpen(false);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Update failed.' };
    }
  };

  // Reset filter selections
  const resetFilters = () => {
    setFilters({
      name: '',
      phone: '',
      status: '',
      service: '',
      startDate: '',
      endDate: ''
    });
  };

  // Status coloring helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-sky-50 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/30';
      case 'Contacted': return 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/30';
      case 'Pending': return 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30';
      case 'Confirmed': return 'bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400 border-teal-200/50 dark:border-teal-900/30';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-950/20 dark:text-slate-400 border-slate-200/50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading Dashboard statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Sidebar navigation panel */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Admin Pipeline Grid */}
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-x-hidden">
        
        {/* Top Header details */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Admin Management Desk</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verify registrations, adjust schedule statuses, and monitor acquisition conversions.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={synchronizeData}
              className={`p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-350 transition-colors ${
                refreshing ? 'animate-spin' : ''
              }`}
              title="Refresh CRM listings"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/book"
              className="inline-flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600 px-4 py-2.5 rounded-xl text-sm font-semibold shadow transition-all hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Lead</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Analytics Summary Cards */}
        {stats && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Total Lead Submissions"
              value={stats.totalLeads}
              theme="indigo"
              subtext="Accumulated portal requests"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              label="Pending Review"
              value={stats.pendingLeads + stats.newLeads}
              theme="amber"
              subtext="Awaiting admin qualifications"
            />
            <StatCard
              icon={<CalendarCheck className="w-5 h-5" />}
              label="Confirmed Slots"
              value={stats.confirmedLeads}
              theme="teal"
              subtext="Scheduled consultation bookings"
            />
            <StatCard
              icon={<XCircle className="w-5 h-5" />}
              label="Cancelled Bookings"
              value={stats.cancelledAppointments}
              theme="rose"
              subtext="Rejected or cancelled slots"
            />
          </section>
        )}

        {/* Conditional Screen tabs: CRM Lead list vs Chart analytics */}
        {activeTab === 'leads' ? (
          <section className="space-y-6">
            {/* Filter Bar Controls Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                <div className="flex items-center space-x-2 text-sm font-bold text-slate-800 dark:text-white">
                  <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                  <span>Pipeline Search & Filter Parameters</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-teal-650 hover:underline dark:text-teal-400"
                >
                  Reset Selections
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* Search Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Name</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Aarav"
                      value={filters.name}
                      onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Search Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Phone</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. 987654"
                      value={filters.phone}
                      onChange={(e) => setFilters(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Status selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">-- All Statuses --</option>
                    {STATUSES.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Service selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service/Department</label>
                  <select
                    value={filters.service}
                    onChange={(e) => setFilters(prev => ({ ...prev, service: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">-- All Services --</option>
                    {SERVICES.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Leads Table Container */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm overflow-hidden transition-colors">
              
              {/* Header Actions */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between flex-wrap gap-2">
                <div className="text-sm font-bold text-slate-800 dark:text-white">
                  Intake CRM Pipeline ({appointments.length} Records)
                </div>
                <button
                  onClick={() => exportLeadsToCSV(appointments)}
                  className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-350 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export to CSV</span>
                </button>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Phone & Email</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Appt Date</th>
                      <th className="px-6 py-4">Lead Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {appointments.length > 0 ? (
                      appointments.map((apt) => (
                        <tr 
                          key={apt.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors"
                        >
                          {/* Name & Age */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-slate-850 dark:text-white">{apt.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Age: {apt.age}</div>
                          </td>
                          {/* Contact Info */}
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-700 dark:text-slate-350">{apt.phone}</div>
                            <div className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5 break-all">{apt.email}</div>
                          </td>
                          {/* Service */}
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-400">
                            {apt.service}
                          </td>
                          {/* Appointment Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-slate-700 dark:text-slate-350">{apt.date}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{apt.time}</div>
                          </td>
                          {/* Status Inline Update */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={apt.status}
                              onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                              className={`text-[10px] font-bold border rounded-full px-2 py-1 focus:outline-none ${getStatusColor(apt.status)}`}
                            >
                              {STATUSES.map((s, idx) => (
                                <option key={idx} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          {/* Actions buttons */}
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedApt(apt);
                                  setModalOpen(true);
                                }}
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors"
                                title="View Lead details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAppointment(apt.id)}
                                className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 dark:hover:text-rose-450 rounded-lg transition-colors"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-slate-400 font-medium">
                          No matching lead records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : (
          /* Analytics Visualization tab */
          <section className="space-y-6">
            {charts && stats && (
              <AnalyticsCharts chartsData={charts} conversionRate={stats.leadConversionRate} />
            )}
          </section>
        )}

      </main>

      {/* Details/Edit Modal overlay */}
      {modalOpen && selectedApt && (
        <AppointmentModal
          appointment={selectedApt}
          onClose={() => {
            setModalOpen(false);
            setSelectedApt(null);
          }}
          onSave={handleModalSave}
        />
      )}

    </div>
  );
};

export default AdminDashboard;
