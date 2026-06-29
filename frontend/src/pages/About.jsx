import React from 'react';
import { Target, Eye, Sparkles, Trophy, HeartHandshake } from 'lucide-react';

const About = () => {
  const points = [
    {
      icon: <Sparkles className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      title: "Built for Small Businesses",
      desc: "We design simple, streamlined workflows rather than bulky, expensive enterprise CRM software. We focus on what matters: secure bookings and organized follow-ups."
    },
    {
      icon: <Trophy className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Data-Driven Growth",
      desc: "Our responsive analytics charts empower business owners to view peak consulting days, service demands, and lead pipelines to improve overall conversions."
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      title: "Zero Setup Overhead",
      desc: "Clients request booking dates via simple browser web forms. No app downloads or account creations required. Admin notifications are immediate."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 animate-fade-in">
      {/* 1. Header Overview */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
          About <span className="text-gradient-primary">LeadFlow</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          We are dedicated to helping small healthcare clinics, academic institutes, and professional consultants transition from paper registers and chaotic messaging apps to a centralized CRM pipeline.
        </p>
      </section>

      {/* 2. Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl space-y-4">
          <div className="bg-teal-50 dark:bg-teal-950/40 w-12 h-12 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To provide service-based professionals with a lightweight, secure, and intuitive appointment platform that reduces booking drops, automates notifications, and centralizes patient or student databases without technical complexity.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-4">
          <div className="bg-indigo-50 dark:bg-indigo-950/40 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Vision</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To become the premier intake CRM system for small-to-midsize service organizations worldwide, helping them run professional, paperless scheduling operations that elevate client satisfaction.
          </p>
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Why Choose Us?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Here is how our custom booking and CRM integrations stand apart.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {points.map((p, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl space-y-4">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{p.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
