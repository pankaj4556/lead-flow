import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, KeyRound, AlertCircle, LayoutDashboard } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [loginCred, setLoginCred] = useState({ email: '', password: '' });
  const [registerCred, setRegisterCred] = useState({
    username: '',
    email: '',
    password: '',
    regCode: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!loginCred.email || !loginCred.password) {
      setErrorMsg('Please fill in all credentials.');
      return;
    }

    setLoading(true);
    const result = await login(loginCred.email, loginCred.password);
    setLoading(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const { username, email, password, regCode } = registerCred;
    if (!username || !email || !password || !regCode) {
      setErrorMsg('Please fill in all registration fields.');
      return;
    }

    setLoading(true);
    const result = await register(username, email, password, regCode);
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Admin registered successfully! You can now log in.');
      setIsLoginTab(true); // Switch to login tab
      setLoginCred({ email: registerCred.email, password: '' }); // Pre-fill login email
      setRegisterCred({ username: '', email: '', password: '', regCode: '' }); // Clear register form
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden p-8 space-y-6">
        
        {/* Header Indicator */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Control Portal</h1>
          <p className="text-xs text-slate-500">Access lead pipeline management tools</p>
        </div>

        {/* Tab Toggle buttons */}
        <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200/20 dark:border-slate-800/20">
          <button
            onClick={() => {
              setIsLoginTab(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              isLoginTab 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              !isLoginTab 
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            Create Admin
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        {isLoginTab ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Mail className="w-3 h-3" />
                <span>Email or Username</span>
              </label>
              <input
                type="text"
                required
                placeholder="admin@example.com"
                value={loginCred.email}
                onChange={(e) => setLoginCred({ ...loginCred, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3 h-3" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginCred.password}
                onChange={(e) => setLoginCred({ ...loginCred, password: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] active:scale-100 transition-all duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Admin Registration Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <User className="w-3 h-3" />
                <span>Username</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. systemadmin"
                value={registerCred.username}
                onChange={(e) => setRegisterCred({ ...registerCred, username: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Mail className="w-3 h-3" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. admin@example.com"
                value={registerCred.email}
                onChange={(e) => setRegisterCred({ ...registerCred, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3 h-3" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={registerCred.password}
                onChange={(e) => setRegisterCred({ ...registerCred, password: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <KeyRound className="w-3 h-3" />
                <span>Registration Sign-up Code</span>
              </label>
              <input
                type="password"
                required
                placeholder="Enter secret registration key"
                value={registerCred.regCode}
                onChange={(e) => setRegisterCred({ ...registerCred, regCode: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] active:scale-100 transition-all duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Register Administrator</span>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400 leading-normal">
            💡 Default local sandbox user: <br />
            <strong>admin@example.com</strong> / Password: <strong>Admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
