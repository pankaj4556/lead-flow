import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Calendar, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Sync theme to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-tr from-teal-500 to-indigo-600 p-2 rounded-lg text-white shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-400 dark:to-indigo-400">
                LeadFlow
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/30'
                    : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions (Theme + Auth / CTA) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-950/50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/book"
                className="inline-flex items-center justify-center bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                Book Appointment
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="my-2 border-slate-200 dark:border-slate-800" />
            
            {isAuthenticated ? (
              <div className="space-y-1 py-1">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Admin Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 text-rose-500 font-semibold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="px-3 py-2">
                <Link
                  to="/book"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-teal-600 text-white dark:bg-teal-500 py-2.5 rounded-lg font-semibold"
                >
                  Book Appointment
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-slate-500 dark:text-slate-400 py-2 mt-2 text-sm font-medium hover:underline"
                >
                  Admin Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
