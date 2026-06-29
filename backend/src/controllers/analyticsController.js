const { supabase, isDemoMode } = require('../config/supabase');
const mockDb = require('../config/mockDb');

/**
 * Fetch and aggregate statistics for CRM Admin Dashboard
 */
exports.getDashboardStats = async (req, res) => {
  try {
    let allRecords = [];

    // --- Adaptor selection ---
    if (isDemoMode) {
      allRecords = [...mockDb.appointments];
    } else {
      const { data, error } = await supabase
        .from('appointments')
        .select('*');

      if (error) throw error;
      allRecords = data || [];
    }

    const totalLeads = allRecords.length;

    // Initialize status counts
    const statusCounts = {
      New: 0,
      Contacted: 0,
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0
    };

    // Initialize service counts
    const serviceCounts = {};

    // Grouping by dates for daily trends (last 7 days)
    const dailyMap = {};
    const dateList = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyMap[dateStr] = 0;
      dateList.push(dateStr);
    }

    // Grouping by months for monthly trends (last 6 months)
    const monthlyMap = {};
    const monthList = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap[monthKey] = { label: monthLabel, count: 0 };
      monthList.push(monthKey);
    }

    // Single-pass computation
    allRecords.forEach(record => {
      // 1. Status aggregates
      if (statusCounts[record.status] !== undefined) {
        statusCounts[record.status]++;
      } else {
        statusCounts[record.status] = 1;
      }

      // 2. Service aggregates
      if (serviceCounts[record.service] !== undefined) {
        serviceCounts[record.service]++;
      } else {
        serviceCounts[record.service] = 1;
      }

      // 3. Daily timeline filtering/incrementing
      if (dailyMap[record.date] !== undefined) {
        dailyMap[record.date]++;
      }

      // 4. Monthly timeline matching
      const recordMonthKey = record.date.substring(0, 7); // YYYY-MM
      if (monthlyMap[recordMonthKey] !== undefined) {
        monthlyMap[recordMonthKey].count++;
      }
    });

    // Structure charts payloads
    const dailyAppointments = dateList.map(date => ({
      date: date.substring(5), // MM-DD for label brevity
      count: dailyMap[date]
    }));

    const monthlyAppointments = monthList.map(key => ({
      month: monthlyMap[key].label,
      count: monthlyMap[key].count
    }));

    const serviceWiseDemand = Object.keys(serviceCounts).map(service => ({
      service,
      count: serviceCounts[service]
    }));

    // Calculate Lead Conversion Rate:
    // Defined as (Confirmed + Completed) / Total Leads
    const successfulLeads = (statusCounts['Confirmed'] || 0) + (statusCounts['Completed'] || 0);
    const leadConversionRate = totalLeads > 0 
      ? Math.round((successfulLeads / totalLeads) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        totalAppointments: totalLeads, // same mapping in single CRM setup
        pendingLeads: statusCounts['Pending'] || 0,
        confirmedLeads: statusCounts['Confirmed'] || 0,
        completedAppointments: statusCounts['Completed'] || 0,
        cancelledAppointments: statusCounts['Cancelled'] || 0,
        newLeads: statusCounts['New'] || 0,
        contactedLeads: statusCounts['Contacted'] || 0,
        leadConversionRate
      },
      charts: {
        dailyAppointments,
        monthlyAppointments,
        serviceWiseDemand,
        statusDistribution: Object.keys(statusCounts).map(status => ({
          status,
          count: statusCounts[status]
        }))
      }
    });

  } catch (error) {
    console.error('Analytics Fetch Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to aggregate dashboard analytics.' });
  }
};
