import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register core Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsCharts = ({ chartsData, conversionRate }) => {
  const isDark = document.documentElement.classList.contains('dark');
  
  // Shared font & color styling definitions for chart rendering
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#f1f5f9';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { family: 'Inter', size: 11, weight: '500' }
        }
      },
      tooltip: {
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: 'Outfit', size: 12 },
        bodyFont: { family: 'Inter', size: 12 }
      }
    },
    scales: {
      x: {
        grid: { color: 'transparent' },
        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
      }
    }
  };

  // 1. Line Chart: Daily Volume
  const dailyData = {
    labels: (chartsData?.dailyAppointments || []).map(d => d.date),
    datasets: [
      {
        label: 'Daily Bookings',
        data: (chartsData?.dailyAppointments || []).map(d => d.count),
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: '#14b8a6'
      }
    ]
  };

  // 2. Bar Chart: Service Popularity
  const serviceData = {
    labels: (chartsData?.serviceWiseDemand || []).map(s => s.service),
    datasets: [
      {
        label: 'Total Leads Scheduled',
        data: (chartsData?.serviceWiseDemand || []).map(s => s.count),
        backgroundColor: [
          '#14b8a6', // Teal
          '#6366f1', // Indigo
          '#8b5cf6', // Violet
          '#10b981', // Emerald
          '#f59e0b', // Amber
          '#64748b'  // Slate
        ],
        borderRadius: 6
      }
    ]
  };

  const serviceOptions = {
    ...chartOptions,
    indexAxis: 'y', // Horizontal bars are beautiful for long service names
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
      },
      y: {
        grid: { color: 'transparent' },
        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
      }
    }
  };

  // 3. Doughnut Chart: Status Breakdowns
  const statusData = {
    labels: (chartsData?.statusDistribution || []).map(s => s.status),
    datasets: [
      {
        data: (chartsData?.statusDistribution || []).map(s => s.count),
        backgroundColor: [
          '#38bdf8', // New -> Sky
          '#c084fc', // Contacted -> Purple
          '#fbbf24', // Pending -> Amber
          '#2dd4bf', // Confirmed -> Teal
          '#34d399', // Completed -> Emerald
          '#f87171'  // Cancelled -> Rose
        ],
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? '#1e293b' : '#ffffff'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: textColor,
          font: { family: 'Inter', size: 10 },
          boxWidth: 10
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      
      {/* Lead Conversion Progress Card */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between transition-colors">
        <div className="space-y-2 mb-4 sm:mb-0 text-center sm:text-left">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Conversion Insights</h3>
          <p className="text-xs text-slate-400 max-w-md">
            Percentage of leads successfully verified (Confirmed + Completed statuses) relative to total CRM requests.
          </p>
        </div>
        <div className="w-full sm:w-64 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Lead Conversion Rate</span>
            <span className="text-teal-500 font-bold text-sm">{conversionRate}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-200/20 dark:border-slate-850">
            <div 
              className="bg-gradient-to-r from-teal-500 to-indigo-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${conversionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 1. Daily Bookings Trends */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm h-[320px] transition-colors flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Daily Booking Trends</h4>
        </div>
        <div className="flex-1 min-h-0 relative">
          <Line data={dailyData} options={chartOptions} />
        </div>
      </div>

      {/* 2. Status Distribution */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm h-[320px] transition-colors flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Status Distributions</h4>
        </div>
        <div className="flex-1 min-h-0 relative">
          <Doughnut data={statusData} options={doughnutOptions} />
        </div>
      </div>

      {/* 3. Service Popularity */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm h-[350px] transition-colors flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-4">Service Popularity Metric</h4>
        </div>
        <div className="flex-1 min-h-0 relative">
          <Bar data={serviceData} options={serviceOptions} />
        </div>
      </div>

    </div>
  );
};

export default AnalyticsCharts;
