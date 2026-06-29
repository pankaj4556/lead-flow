const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter from env config
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT || '2525'),
  auth: {
    user: process.env.EMAIL_USER === 'your_smtp_username' ? '' : (process.env.EMAIL_USER || ''),
    pass: process.env.EMAIL_PASS === 'your_smtp_password' ? '' : (process.env.EMAIL_PASS || ''),
  }
});

const isEmailConfigured = process.env.EMAIL_USER && 
                           process.env.EMAIL_USER !== 'your_smtp_username' &&
                           process.env.EMAIL_PASS && 
                           process.env.EMAIL_PASS !== 'your_smtp_password';

/**
 * Send an appointment confirmation email to the user.
 */
async function sendAppointmentConfirmation(appointment) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@smartcrm.com',
    to: appointment.email,
    subject: `Appointment Confirmed: ${appointment.service}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0d9488; text-align: center;">Appointment Request Received!</h2>
        <p>Dear <strong>${appointment.name}</strong>,</p>
        <p>Thank you for scheduling your appointment with us. Below are your booking details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 35%;">Service:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${appointment.service}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Preferred Date:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${appointment.date}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Preferred Time:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${appointment.time}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Current Status:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #d97706; font-weight: bold;">${appointment.status}</td>
          </tr>
        </table>
        <p>Our team will contact you shortly on <strong>${appointment.phone}</strong> to confirm your slot.</p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9;" />
        <p style="font-size: 12px; color: #64748b; text-align: center;">
          This is an automated email. Please do not reply directly.
        </p>
      </div>
    `
  };

  if (isEmailConfigured) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✉️ Confirmation email sent successfully to ${appointment.email}`);
    } catch (error) {
      console.error('❌ Failed to send email confirmation:', error.message);
    }
  } else {
    console.log('\x1b[36m%s\x1b[0m', `✉️ [EMAIL DEMO MODE] Booking notification for ${appointment.email}:`);
    console.log(`   - To: ${appointment.email}`);
    console.log(`   - Service: ${appointment.service}`);
    console.log(`   - Date/Time: ${appointment.date} at ${appointment.time}`);
  }
}

/**
 * Send a notification email to the admin.
 */
async function sendNewAppointmentAlertToAdmin(appointment) {
  const adminEmail = process.env.EMAIL_FROM || 'admin@smartcrm.com';
  const mailOptions = {
    from: 'system@smartcrm.com',
    to: adminEmail,
    subject: `🚨 New Lead/Appointment Registered: ${appointment.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; text-align: center;">New Booking Alert</h2>
        <p>A new lead has submitted an appointment request on the portal:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 35%;">Lead Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${appointment.name} (Age: ${appointment.age})</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${appointment.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${appointment.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Service:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${appointment.service}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Date & Time:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${appointment.date} @ ${appointment.time}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Message:</td>
            <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${appointment.message || 'N/A'}</td>
          </tr>
        </table>
        <p>Please log in to the Admin CRM Dashboard to follow up and update their appointment status.</p>
      </div>
    `
  };

  if (isEmailConfigured) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`✉️ Alert email sent to Admin: ${adminEmail}`);
    } catch (error) {
      console.error('❌ Failed to send admin alert email:', error.message);
    }
  } else {
    console.log('\x1b[36m%s\x1b[0m', `✉️ [EMAIL DEMO MODE] Alert sent to Admin (${adminEmail}):`);
    console.log(`   - Name: ${appointment.name}`);
    console.log(`   - Phone: ${appointment.phone}`);
    console.log(`   - Service: ${appointment.service}`);
  }
}

module.exports = {
  sendAppointmentConfirmation,
  sendNewAppointmentAlertToAdmin
};
