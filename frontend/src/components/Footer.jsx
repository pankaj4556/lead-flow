import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, ShieldAlert } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 dark:bg-slate-950 dark:text-slate-500 border-t border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-tr from-teal-500 to-indigo-500 p-2 rounded-lg text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                LeadFlow
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Modernizing lead capture and booking flows for clinics, institutes, and agencies. Eliminate manual registries and Whatsapp overflow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">Services Catalog</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-white text-teal-400 font-semibold transition-colors">Book Now</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">General Consultation</li>
              <li className="hover:text-white transition-colors cursor-pointer">Therapy Session</li>
              <li className="hover:text-white transition-colors cursor-pointer">Diagnostics / Scan</li>
              <li className="hover:text-white transition-colors cursor-pointer">Career Coaching</li>
              <li className="hover:text-white transition-colors cursor-pointer">Academic Counseling</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Info</h3>
            <div className="flex items-start space-x-2 text-sm">
              <Phone className="w-4 h-4 text-teal-400 mt-1 flex-shrink-0" />
              <span>+91 80621 78600</span>
            </div>
            <div className="flex items-start space-x-2 text-sm">
              <Mail className="w-4 h-4 text-teal-400 mt-1 flex-shrink-0" />
              <span className="break-all">support@launched.org.in</span>
            </div>
            <div className="flex items-start space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-teal-400 mt-1 flex-shrink-0" />
              <span>Enzyme Office Space, Star Bazaar, HSR Layout, Bengaluru, KA - 560102</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LeadFlow. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link to="/admin/login" className="hover:text-white flex items-center space-x-1 transition-colors">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Gateway</span>
            </Link>
            <span className="cursor-pointer hover:text-white">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white">Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
