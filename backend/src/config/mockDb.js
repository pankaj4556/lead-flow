const bcrypt = require('bcryptjs');

// In-Memory Database arrays for Demo/Mock Mode
const admins = [];
const appointments = [];

// Helper function to seed mock appointments with custom offsets from today
function getOffsetDate(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

// Seed admin account
const defaultPasswordHash = bcrypt.hashSync('Admin123', 10);
admins.push({
  id: '00000000-0000-0000-0000-000000000000',
  username: 'admin',
  email: 'admin@example.com',
  password: defaultPasswordHash,
  created_at: new Date().toISOString()
});

// Seed mock appointments
const mockData = [
  {
    name: 'Aarav Sharma',
    phone: '9876543210',
    email: 'aarav.sharma@example.com',
    age: 28,
    service: 'General Consultation',
    date: getOffsetDate(-5),
    time: '10:00 AM',
    message: 'Routine checkup and blood pressure reading.',
    status: 'Completed'
  },
  {
    name: 'Priya Patel',
    phone: '9123456789',
    email: 'priya.patel@example.com',
    age: 34,
    service: 'Therapy Session',
    date: getOffsetDate(-4),
    time: '02:30 PM',
    message: 'Weekly counseling appointment.',
    status: 'Completed'
  },
  {
    name: 'Rohan Mehta',
    phone: '9988776655',
    email: 'rohan.mehta@example.com',
    age: 22,
    service: 'Career Coaching',
    date: getOffsetDate(-3),
    time: '11:00 AM',
    message: 'Resume review and interview prep.',
    status: 'Confirmed'
  },
  {
    name: 'Ananya Nair',
    phone: '8877665544',
    email: 'ananya.nair@example.com',
    age: 45,
    service: 'Diagnostics/Scan',
    date: getOffsetDate(-2),
    time: '09:00 AM',
    message: 'Prescribed ultrasound scan.',
    status: 'Cancelled'
  },
  {
    name: 'Vikram Singh',
    phone: '7766554433',
    email: 'vikram.singh@example.com',
    age: 50,
    service: 'General Consultation',
    date: getOffsetDate(-1),
    time: '04:00 PM',
    message: 'Follow up on diabetes medication.',
    status: 'Contacted'
  },
  {
    name: 'Kavita Rao',
    phone: '9888777666',
    email: 'kavita.rao@example.com',
    age: 31,
    service: 'Therapy Session',
    date: getOffsetDate(0), // Today
    time: '10:30 AM',
    message: 'Stress management consultation.',
    status: 'Pending'
  },
  {
    name: 'Amit Verma',
    phone: '9555444333',
    email: 'amit.verma@example.com',
    age: 26,
    service: 'Career Coaching',
    date: getOffsetDate(0), // Today
    time: '01:00 PM',
    message: 'Discussing job search strategy.',
    status: 'Confirmed'
  },
  {
    name: 'Sneha Gupta',
    phone: '9666777888',
    email: 'sneha.gupta@example.com',
    age: 19,
    service: 'General Consultation',
    date: getOffsetDate(1), // Tomorrow
    time: '11:30 AM',
    message: 'Fever and cold checkup.',
    status: 'New'
  },
  {
    name: 'Rahul Joshi',
    phone: '9222333444',
    email: 'rahul.joshi@example.com',
    age: 62,
    service: 'Diagnostics/Scan',
    date: getOffsetDate(2),
    time: '03:00 PM',
    message: 'Blood report sample collection.',
    status: 'Pending'
  },
  {
    name: 'Neha Kapoor',
    phone: '9333444555',
    email: 'neha.kapoor@example.com',
    age: 29,
    service: 'Therapy Session',
    date: getOffsetDate(3),
    time: '09:30 AM',
    message: 'Anxiety management therapy.',
    status: 'Confirmed'
  },
  {
    name: 'Devendra Kumar',
    phone: '9444555666',
    email: 'devendra.kumar@example.com',
    age: 38,
    service: 'General Consultation',
    date: getOffsetDate(4),
    time: '02:00 PM',
    message: 'Knee joint pain consultation.',
    status: 'New'
  },
  {
    name: 'Meera Deshmukh',
    phone: '9000111222',
    email: 'meera.deshmukh@example.com',
    age: 41,
    service: 'Diagnostics/Scan',
    date: getOffsetDate(5),
    time: '12:00 PM',
    message: 'Routine chest X-Ray.',
    status: 'Confirmed'
  }
];

// Add IDs and timestamps
mockData.forEach((item, index) => {
  appointments.push({
    id: `8a6e0c0d-b4b1-4b14-87cf-6f34e8f7730${index.toString(16)}`,
    ...item,
    created_at: new Date(new Date().setDate(new Date().getDate() - (5 - index % 3))).toISOString()
  });
});

console.log('\x1b[36m%s\x1b[0m', `📦 Seeded In-Memory DB: ${admins.length} Admins, ${appointments.length} Appointments.`);

module.exports = {
  admins,
  appointments
};
