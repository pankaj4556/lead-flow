import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setLoading(true);
    // Simulate contact submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
          Contact <span className="text-gradient-primary">Us</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Have questions? Get in touch with our team or drop by our office.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info & Hours */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Get in Touch</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Feel free to call, email, or visit. We respond to all digital inquiries within 24 business hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Call Us</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">+91 80621 78600</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Email</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 break-all">support@launched.org.in</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Main Office</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Enzyme Office Space, Backside of Star Bazaar, Sector 7, HSR Layout, Bengaluru, Karnataka - 560102
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Hours of Operation</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                  <p className="text-xs text-slate-400">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Message Sent!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Thank you for reaching out. A representative will contact you via email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-teal-600 dark:text-teal-400 font-semibold hover:underline text-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send a Message</h2>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aarav@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Message</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Type details about your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 4. Google Maps Integration */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Location</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Find us in HSR Layout, Bengaluru.
          </p>
        </div>
        <div className="bg-slate-900/5 dark:bg-white/5 p-3 rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-md">
          <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950">
            <iframe
              title="Google Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.751390455648!2d77.6433276757116!3d12.923689415951838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae147fdbe8c65d%3A0xe54d92ee4c6df1fa!2sStar%20Bazaar!5e0!3m2!1sen!2sin!4v1713500000000!5m2!1sen!2sin"
              className="w-full h-full border-0 grayscale dark:invert dark:opacity-80 transition-all duration-300"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
