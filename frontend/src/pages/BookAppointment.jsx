import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, User, Phone, Mail, FileText, ChevronRight, HelpCircle, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import api from '../utils/api';

const SERVICES = [
  'General Consultation', 
  'Therapy Session', 
  'Diagnostics/Scan', 
  'Career Coaching',
  'Academic Counseling',
  'Custom Assistance'
];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM',
  '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
];

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdRecord, setCreatedRecord] = useState(null);
  const [serverError, setServerError] = useState('');

  // Pre-fill service from URL queries if present
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && SERVICES.includes(serviceParam)) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }
  }, [searchParams]);

  // Client-side validations
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      tempErrors.name = 'Full name must be at least 2 characters long.';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim() || phoneDigits.length < 10) {
      tempErrors.phone = 'Phone number must be at least 10 digits.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    const ageNum = parseInt(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum <= 0 || ageNum > 125) {
      tempErrors.age = 'Age must be between 1 and 125.';
    }

    if (!formData.service) {
      tempErrors.service = 'Please select a service or department.';
    }

    if (!formData.date) {
      tempErrors.date = 'Appointment date is required.';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        tempErrors.date = 'Appointment date cannot be in the past.';
      }
    }

    if (!formData.time) {
      tempErrors.time = 'Please choose a preferred time slot.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/appointments', formData);
      setCreatedRecord(response.data.data);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || 'Failed to submit appointment request. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date for date-picker min-date limitation
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (success && createdRecord) {
    // Generate quick WhatsApp checkout confirmation link
    const waPhone = import.meta.env.VITE_WHATSAPP_PHONE || '918062178600';
    const waText = encodeURIComponent(`Hi! I requested a booking. Ref Name: ${createdRecord.name}, Service: ${createdRecord.service}, Date/Time: ${createdRecord.date} at ${createdRecord.time}. Please confirm my slot.`);
    const waConfirmUrl = `https://wa.me/${waPhone}?text=${waText}`;

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-lg text-center space-y-6">
          <div className="w-20 h-20 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-12 h-12" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Appointment Scheduled!</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              We received your slot request. A confirmation email has been dispatched.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 text-left space-y-3">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wide border-b border-slate-200/50 dark:border-slate-800/50 pb-2 mb-2">
              Booking Details Reference
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium text-slate-400">Client Name:</span>
              <span className="text-right font-semibold text-slate-800 dark:text-white">{createdRecord.name}</span>
              
              <span className="font-medium text-slate-400">Service:</span>
              <span className="text-right font-semibold text-slate-800 dark:text-white">{createdRecord.service}</span>
              
              <span className="font-medium text-slate-400">Preferred Date:</span>
              <span className="text-right font-semibold text-slate-800 dark:text-white">{createdRecord.date}</span>
              
              <span className="font-medium text-slate-400">Preferred Time:</span>
              <span className="text-right font-semibold text-slate-800 dark:text-white">{createdRecord.time}</span>

              <span className="font-medium text-slate-400">Status:</span>
              <span className="text-right font-semibold text-amber-500">{createdRecord.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href={waConfirmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] text-white hover:bg-[#20ba5a] font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow hover:shadow-md hover:scale-[1.01] active:scale-100 transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>Quick Confirm via WhatsApp</span>
            </a>
            <Link
              to="/"
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-xl flex items-center justify-center transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Link to="/services" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Services
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-md p-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Schedule Appointment</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please fill in details. Submissions will be registered into our database and reviewed by admins.
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aarav Sharma"
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                  errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 font-medium mt-1">{errors.name}</p>}
            </div>

            {/* Age */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Age</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 28"
                min="1"
                max="125"
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                  errors.age ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
              {errors.age && <p className="text-xs text-rose-500 font-medium mt-1">{errors.age}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                  errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-500 font-medium mt-1">{errors.phone}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. aarav@example.com"
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                  errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-500 font-medium mt-1">{errors.email}</p>}
            </div>

            {/* Service Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Service / Department</span>
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                  errors.service ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <option value="">-- Choose Option --</option>
                {SERVICES.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))}
              </select>
              {errors.service && <p className="text-xs text-rose-500 font-medium mt-1">{errors.service}</p>}
            </div>

            {/* Date Pick */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferred Date</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                min={getMinDate()}
                onChange={handleChange}
                className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${
                  errors.date ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200 dark:border-slate-800'
                }`}
              />
              {errors.date && <p className="text-xs text-rose-500 font-medium mt-1">{errors.date}</p>}
            </div>

            {/* Time Slot Pick */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferred Time Slot</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, time: t }));
                      if (errors.time) setErrors(prev => ({ ...prev, time: '' }));
                    }}
                    className={`py-2.5 text-xs font-semibold rounded-lg border text-center transition-all ${
                      formData.time === t
                        ? 'bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:border-teal-500'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {errors.time && <p className="text-xs text-rose-500 font-medium mt-2">{errors.time}</p>}
            </div>
          </div>

          {/* Message Text */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Notes / Reason for Visit (Optional)</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              placeholder="e.g. Any details you would like the administrator to know..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] active:scale-100 transition-all duration-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Schedule Appointment Slot</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
