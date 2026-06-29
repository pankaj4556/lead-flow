const { supabase, isDemoMode } = require('../config/supabase');
const mockDb = require('../config/mockDb');
const emailService = require('../services/emailService');

// Valid services list for validator checks
const VALID_SERVICES = [
  'General Consultation', 
  'Therapy Session', 
  'Diagnostics/Scan', 
  'Career Coaching',
  'Academic Counseling',
  'Custom Assistance'
];

// Valid statuses list
const VALID_STATUSES = ['New', 'Contacted', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

/**
 * Helper to validate appointment inputs
 */
function validateAppointment(data) {
  const { name, phone, email, age, service, date, time } = data;
  if (!name || name.trim().length < 2) return 'Name must be at least 2 characters long.';
  if (!phone || phone.trim().length < 10) return 'Phone number must be at least 10 digits.';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) return 'Please provide a valid email address.';

  const numAge = parseInt(age);
  if (isNaN(numAge) || numAge <= 0 || numAge > 125) return 'Please provide a valid age between 1 and 125.';

  if (!service || !VALID_SERVICES.includes(service)) {
    return `Service must be one of: ${VALID_SERVICES.join(', ')}`;
  }

  if (!date) return 'Appointment date is required.';
  
  // Date must not be in the deep past
  const appDate = new Date(date);
  const today = new Date();
  today.setHours(0,0,0,0);
  if (appDate < today) {
    // We allow same day booking, but not yesterday or earlier
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (appDate <= yesterday) {
      return 'Appointment date cannot be in the past.';
    }
  }

  if (!time || time.trim().length < 2) return 'Appointment time slot selection is required.';

  return null;
}

/**
 * Create Appointment
 */
exports.createAppointment = async (req, res) => {
  const errorMsg = validateAppointment(req.body);
  if (errorMsg) {
    return res.status(400).json({ success: false, message: errorMsg });
  }

  const { name, phone, email, age, service, date, time, message } = req.body;

  try {
    let appointment = null;

    if (isDemoMode) {
      appointment = {
        id: `apt-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        age: parseInt(age),
        service,
        date,
        time,
        message: message ? message.trim() : '',
        status: 'New',
        created_at: new Date().toISOString()
      };
      mockDb.appointments.unshift(appointment); // Add to beginning of mock table
    } else {
      // Create in Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          age: parseInt(age),
          service,
          date,
          time,
          message: message ? message.trim() : '',
          status: 'New'
        }])
        .select()
        .single();

      if (error) throw error;
      appointment = data;
    }

    // Trigger asynchronous notifications (non-blocking)
    emailService.sendAppointmentConfirmation(appointment).catch(console.error);
    emailService.sendNewAppointmentAlertToAdmin(appointment).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Appointment successfully requested!',
      data: appointment
    });

  } catch (error) {
    console.error('Create Appointment Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error while scheduling appointment.' });
  }
};

/**
 * Get All Appointments (with filters + search)
 */
exports.getAllAppointments = async (req, res) => {
  const { name, phone, status, service, startDate, endDate } = req.query;

  try {
    if (isDemoMode) {
      let filtered = [...mockDb.appointments];

      if (name) {
        filtered = filtered.filter(a => a.name.toLowerCase().includes(name.toLowerCase()));
      }
      if (phone) {
        filtered = filtered.filter(a => a.phone.includes(phone));
      }
      if (status) {
        filtered = filtered.filter(a => a.status === status);
      }
      if (service) {
        filtered = filtered.filter(a => a.service === service);
      }
      if (startDate) {
        filtered = filtered.filter(a => a.date >= startDate);
      }
      if (endDate) {
        filtered = filtered.filter(a => a.date <= endDate);
      }

      // Sort by created_at DESC by default
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered
      });
    }

    // Supabase query builder
    let query = supabase.from('appointments').select('*', { count: 'exact' });

    if (name) query = query.ilike('name', `%${name}%`);
    if (phone) query = query.ilike('phone', `%${phone}%`);
    if (status) query = query.eq('status', status);
    if (service) query = query.eq('service', service);
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    // Sort
    query = query.order('created_at', { ascending: false });

    const { data, count, error } = await query;
    if (error) throw error;

    res.status(200).json({
      success: true,
      count,
      data
    });

  } catch (error) {
    console.error('Get Appointments Error:', error.message);
    res.status(500).json({ success: false, message: 'Error retrieving appointments list.' });
  }
};

/**
 * Get Single Appointment
 */
exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;

  try {
    let appointment = null;

    if (isDemoMode) {
      appointment = mockDb.appointments.find(a => a.id === id);
    } else {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      appointment = data;
    }

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment record not found.' });
    }

    res.status(200).json({ success: true, data: appointment });

  } catch (error) {
    console.error('Get Single Appointment Error:', error.message);
    res.status(500).json({ success: false, message: 'Error retrieving appointment details.' });
  }
};

/**
 * Update Appointment
 */
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const errorMsg = validateAppointment(req.body);
  if (errorMsg) {
    return res.status(400).json({ success: false, message: errorMsg });
  }

  const { name, phone, email, age, service, date, time, message, status } = req.body;

  try {
    let appointment = null;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status option.' });
    }

    if (isDemoMode) {
      const idx = mockDb.appointments.findIndex(a => a.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Appointment not found.' });
      }

      mockDb.appointments[idx] = {
        ...mockDb.appointments[idx],
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        age: parseInt(age),
        service,
        date,
        time,
        message: message ? message.trim() : '',
        status: status || mockDb.appointments[idx].status
      };
      appointment = mockDb.appointments[idx];
    } else {
      const updateData = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        age: parseInt(age),
        service,
        date,
        time,
        message: message ? message.trim() : '',
      };
      if (status) updateData.status = status;

      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      appointment = data;
    }

    res.status(200).json({
      success: true,
      message: 'Appointment details updated successfully.',
      data: appointment
    });

  } catch (error) {
    console.error('Update Appointment Error:', error.message);
    res.status(500).json({ success: false, message: 'Error updating appointment record.' });
  }
};

/**
 * Update Appointment Status only
 */
exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: 'Provide a valid status from options list.' });
  }

  try {
    let appointment = null;

    if (isDemoMode) {
      const idx = mockDb.appointments.findIndex(a => a.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Appointment not found.' });
      }
      mockDb.appointments[idx].status = status;
      appointment = mockDb.appointments[idx];
    } else {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      appointment = data;
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}.`,
      data: appointment
    });

  } catch (error) {
    console.error('Status Update Error:', error.message);
    res.status(500).json({ success: false, message: 'Error updating status.' });
  }
};

/**
 * Delete Appointment
 */
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    if (isDemoMode) {
      const idx = mockDb.appointments.findIndex(a => a.id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Appointment not found.' });
      }
      mockDb.appointments.splice(idx, 1);
    } else {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Appointment record deleted successfully.'
    });

  } catch (error) {
    console.error('Delete Appointment Error:', error.message);
    res.status(500).json({ success: false, message: 'Error deleting appointment record.' });
  }
};
