import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle2, ShieldCheck, 
  CalendarRange, Users, BarChart3, Clock, 
  ChevronRight, Quote, Check
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <CalendarRange className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      title: "Smart Scheduling",
      desc: "Allow clients to request specific date/time slots directly. Cuts down on manual phone queues."
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Lead CRM Pipeline",
      desc: "Centralize customer requests and follow-ups. Track client statuses from New to Completed."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-violet-600 dark:text-violet-400" />,
      title: "Actionable Analytics",
      desc: "Evaluate your business's busiest days, service demand distributions, and conversion metrics."
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Automated Logging",
      desc: "Ditch paper registers. Search, filter, and export contacts instantly into CSV format."
    }
  ];

  const benefits = [
    { title: "Zero Lost Records", desc: "No more misplaced phone numbers or notes. Everything is safely backed up in Supabase." },
    { title: "Reduce No-Shows", desc: "Confirm schedules via WhatsApp and emails instantly to keep clients accountable." },
    { title: "Saves Hours Weekly", desc: "Automating validation and routing saves admin staff up to 15 hours every week." },
    { title: "Higher Conversions", desc: "Quick follow-up leads to happier customers and up to a 30% increase in revenue." }
  ];

  const stats = [
    { number: "99%", label: "System Uptime" },
    { number: "10k+", label: "Appointments Managed" },
    { number: "15hrs+", label: "Saved Weekly" },
    { number: "30%", label: "Conversion Lift" }
  ];

  const testimonials = [
    {
      quote: "Our dental clinic went from chaotic WhatsApp threads to a fully automated pipeline. The dashboard analytics helped us understand our peak consult hours.",
      author: "Dr. Sandeep Patel",
      role: "Lead Dentist, Smile Dental Hub"
    },
    {
      quote: "Before this booking portal, we lost track of 20% of student coaching inquiries. Now every lead is tracked, assigned a status, and followed up promptly.",
      author: "Radhika Sen",
      role: "Director, Achiever Prep Institute"
    }
  ];

  return (
    <div className="space-y-24 pb-20 animate-fade-in">
      {/* 1. Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-teal-50 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-800/30 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">Secure Lead & Booking Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Stop relying on sticky notes. <br />
            <span className="text-gradient-primary">Automate your appointments.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A secure CRM portal built specifically for small clinics, academies, and client-service businesses to capture, qualify, and organize scheduling requests.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 px-8 py-4 rounded-xl text-base font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200"
            >
              Book an Appointment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850 px-8 py-4 rounded-xl text-base font-bold shadow-sm transition-all duration-200"
            >
              Explore Services
            </Link>
          </div>

          {/* CRM Mockup Graphic */}
          <div className="pt-12 max-w-5xl mx-auto">
            <div className="bg-slate-900/5 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/50 dark:border-white/5 backdrop-blur shadow-xl">
              <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow border border-slate-200 dark:border-slate-800 text-left">
                {/* Mock header */}
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">leadflow-dashboard.crm</div>
                  <div className="w-4"></div>
                </div>
                {/* Mock body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Total Leads</div>
                    <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">1,048</div>
                    <div className="text-xs text-emerald-500 mt-2">↑ 12% vs last month</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Confirmed slots</div>
                    <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">742</div>
                    <div className="text-xs text-indigo-500 mt-2">Conversion rate: 71%</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200/50 dark:border-slate-800/50">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Daily Booking Load</div>
                    <div className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">45 / day</div>
                    <div className="text-xs text-teal-500 mt-2">Optimized queue capacity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Designed for seamless client scheduling
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Ditch complex enterprise CRM software. LeadFlow gives you the exact tools needed to organize your intake pipeline efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-800 w-12 h-12 flex items-center justify-center rounded-xl">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Benefits Section */}
      <section className="bg-slate-100 dark:bg-slate-900/40 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Streamline operations and elevate user experience
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                By digitizing lead intake and status modifications, scheduling becomes automated, and client records are instantly accessible.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="font-semibold">Automatic email confirmation dispatches</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="font-semibold">Direct WhatsApp messaging linkages</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <span className="font-semibold">Complete lead validation & security rules</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((b, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-2">
                  <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-3">{b.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-600 to-indigo-700 rounded-3xl p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl translate-x-12 -translate-y-12"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
            {stats.map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">{s.number}</div>
                <div className="text-teal-100 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Trusted by independent professionals
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Read how small clinics and coaching centers utilize our platform to organize bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl relative space-y-6">
              <Quote className="w-10 h-10 text-teal-600/20 absolute top-6 right-6" />
              <p className="text-slate-600 dark:text-slate-300 italic text-base leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 font-extrabold font-display">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.author}</h4>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
