import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, Smile, Activity, 
  Briefcase, GraduationCap, HelpCircle, 
  Clock, CheckCircle, ArrowRight 
} from 'lucide-react';

const Services = () => {
  const serviceList = [
    {
      icon: <Stethoscope className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      name: "General Consultation",
      desc: "Comprehensive check-ups, diagnostic queries, health assessments, or custom diagnostic reviews.",
      duration: "30 Mins",
      features: ["Medical/general checkup", "Prescription review", "Referral coordination"]
    },
    {
      icon: <Smile className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
      name: "Therapy Session",
      desc: "Personalized mental health support, stress management counseling, and cognitive behavioral therapy sessions.",
      duration: "50 Mins",
      features: ["Certified therapist support", "Fully private & secure", "Custom coping schedules"]
    },
    {
      icon: <Activity className="w-8 h-8 text-violet-600 dark:text-violet-400" />,
      name: "Diagnostics/Scan",
      desc: "Scheduled imaging, lab report collections, X-Ray referrals, and basic scans under specialized supervisions.",
      duration: "45 Mins",
      features: ["State of the art lab scans", "Fast digital reports", "Expert consultation review"]
    },
    {
      icon: <Briefcase className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      name: "Career Coaching",
      desc: "One-on-one professional development advising, profile audit, resume editing, and interview mock ups.",
      duration: "60 Mins",
      features: ["Resume & Portfolio review", "Job search strategies", "Mock HR interview runs"]
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
      name: "Academic Counseling",
      desc: "Course selections assistance, stream guidelines, college application reviews, and target tutoring alignments.",
      duration: "45 Mins",
      features: ["Curriculum matching plans", "University admissions guidance", "Learning pace planning"]
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-slate-600 dark:text-slate-400" />,
      name: "Custom Assistance",
      desc: "Tailored services, specialized intake support, or agency client registrations.",
      duration: "Flexible",
      features: ["Needs assessment run", "Dedicated representative", "Custom service scoping"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
          Our <span className="text-gradient-primary">Services</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Select from our list of services to request an appointment. Admins will confirm details upon receipt of form submission.
        </p>
      </section>

      {/* Services Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceList.map((service, idx) => (
          <div key={idx} className="glass-card rounded-3xl p-6 flex flex-col justify-between hover:border-teal-500/50 dark:hover:border-teal-500/30 transition-all duration-300">
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-200/50 dark:border-slate-800/50">
                {service.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{service.name}</h3>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Duration: {service.duration}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{service.desc}</p>
              
              <hr className="border-slate-200/50 dark:border-slate-800/50" />
              
              <ul className="space-y-2">
                {service.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-6">
              <Link
                to={`/book?service=${encodeURIComponent(service.name)}`}
                className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors group"
              >
                <span>Request Slot</span>
                <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Services;
