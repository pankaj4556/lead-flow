import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BarChart3, LogOut, User, Calendar, ShieldCheck } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { adminUser, logout } = useAuth();

  const menuItems = [
    { id: 'leads', label: 'Lead CRM Table', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics Panel', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between flex-shrink-0 transition-colors duration-300">
      <div className="p-6 space-y-8">
        
        {/* Branding */}
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-tr from-teal-500 to-indigo-600 p-2 rounded-lg text-white">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg text-slate-800 dark:text-white">
            LeadFlow CRM
          </span>
        </div>

        {/* Admin profile detail card */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <div className="font-semibold text-xs text-slate-800 dark:text-white truncate">
              {adminUser?.username || 'Administrator'}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center mt-0.5 space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Admin Session</span>
            </div>
          </div>
        </div>

        {/* Nav list */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Logout bottom anchor */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-850">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
