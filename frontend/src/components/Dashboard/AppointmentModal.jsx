import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, FileText, CheckCircle, AlertTriangle, ShieldCheck, Edit, Send } from 'lucide-react';

const SERVICES = [
  'General Consultation', 
  'Therapy Session', 
  'Diagnostics/Scan', 
  'Career Coaching',
  'Academic Counseling',
  'Custom Assistance'
];

const STATUSES = ['New', 'Contacted', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const AppointmentModal = ({ appointment, onClose, onSave }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...appointment });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Reset forms if selected appointment changes
  useEffect(() => {
    setFormData({ ...appointment });
    setIsEditMode(false);
    setErrors({});
    setSaveError('');
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      tempErrors.name = 'Full name is required.';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || phoneDigits.length < 10) {
      tempErrors.phone = 'Phone number must be at least 10 digits.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      tempErrors.email = 'Valid email is required.';
    }

    const ageNum = parseInt(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum <= 0 || ageNum > 125) {
      tempErrors.age = 'Age must be between 1 and 125.';
    }

    if (!formData.service) {
      tempErrors.service = 'Service is required.';
    }

    if (!formData.date) {
      tempErrors.date = 'Appointment date is required.';
    }

    if (!formData.time) {
      tempErrors.time = 'Preferred time slot is required.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');
    if (!validateForm()) return;

    setSaving(true);
    const result = await onSave(formData);
    setSaving(false);
    
    if (result.success) {
      setIsEditMode(false);
    } else {
      setSaveError(result.message);
    }
  };

  // Status badge classes generator
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

  // WhatsApp quick text link for following up with client
  const waMessageUrl = `https://wa.me/${formData.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${formData.name}, I am reaching out from CRM administration regarding your request for ${formData.service}.`)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Dialog Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200/50 dark:border-slate-800/50 shadow-2xl relative z-10 overflow-hidden transform transition-all animate-slide-up">
        {/* Header banner */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-display font-bold text-base text-slate-800 dark:text-white">
              {isEditMode ? 'Modify Lead Information' : 'Appointment Details'}
            </span>
            {!isEditMode && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(formData.status)}`}>
                {formData.status}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveError && (
          <div className="p-4 mx-6 mt-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{saveError}</span>
          </div>
        )}

        {/* View Mode */}
        {!isEditMode ? (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Fields */}
              <div className="flex items-start space-x-2.5">
                <User className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Client Name & Age</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{formData.name} ({formData.age} yrs)</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white break-all">{formData.email}</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Connection</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{formData.phone}</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <Calendar className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scheduled Date & Time</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{formData.date} at {formData.time}</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 md:col-span-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service Category</div>
                  <div className="text-sm font-semibold text-teal-600 dark:text-teal-400">{formData.service}</div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 md:col-span-2 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <FileText className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div className="w-full">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Client Message</div>
                  <p className="text-sm text-slate-650 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200/40 dark:border-slate-800/40">
                    {formData.message || 'No additional notes provided by client.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="border-t border-slate-150 dark:border-slate-800/60 pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsEditMode(true)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 py-3 rounded-xl flex items-center justify-center space-x-1.5 font-semibold text-sm transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Modify / Edit Details</span>
              </button>

              <a
                href={waMessageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white hover:bg-[#20ba5a] py-3 rounded-xl flex items-center justify-center space-x-1.5 font-bold text-sm shadow transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Follow up (WhatsApp)</span>
              </a>
            </div>
          </div>
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.age ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.age && <p className="text-[11px] text-rose-500 mt-1">{errors.age}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.phone ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {SERVICES.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {STATUSES.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm resize-none"
                ></textarea>
              </div>
            </div>

            {/* Edit Actions Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex space-x-3 justify-end">
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
              >
                Cancel Edits
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600 font-bold text-xs rounded-lg shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
