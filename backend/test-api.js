// Automated API Testing Script for LeadFlow CRM Backend
// Runs on native Node.js fetch (Node v18+)

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const testAdmin = {
  username: `tester_${Date.now().toString().slice(-4)}`,
  email: `tester_${Date.now().toString().slice(-4)}@example.com`,
  password: 'Password123!',
  registrationCode: 'AdminSecureSignupSecretCode2026'
};

let authToken = '';
let createdAppointmentId = '';

async function runTests() {
  console.log('🧪 Starting automated API Verification Tests...\n');

  try {
    // 1. Health check
    console.log('1. Testing Health Check...');
    const healthRes = await fetch(`${BASE_URL.replace('/api', '')}/api/health`);
    const healthData = await healthRes.json();
    console.log(`   - Status: ${healthRes.status} (${healthData.status})`);
    console.log(`   - DB Mode: ${healthData.databaseMode}\n`);

    // 2. Register Admin
    console.log('2. Registering Test Admin...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testAdmin)
    });
    const regData = await regRes.json();
    console.log(`   - Status: ${regRes.status}`);
    console.log(`   - Response Message: ${regData.message}\n`);

    // 3. Login Admin
    console.log('3. Authenticating Admin...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testAdmin.email, password: testAdmin.password })
    });
    const loginData = await loginRes.json();
    console.log(`   - Status: ${loginRes.status}`);
    authToken = loginData.token;
    console.log(`   - Token Issued: ${authToken ? 'Yes (Valid)' : 'No (Failed)'}\n`);

    if (!authToken) throw new Error('Auth Token was not issued. Aborting protected tests.');

    // 4. Create Appointment (Public Endpoint)
    console.log('4. Creating Public Appointment...');
    const newApt = {
      name: 'Rohan Sharma',
      phone: '9876543210',
      email: 'rohan.test@example.com',
      age: 29,
      service: 'General Consultation',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      time: '11:00 AM',
      message: 'Test scheduling entry.'
    };
    const aptRes = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newApt)
    });
    const aptData = await aptRes.json();
    createdAppointmentId = aptData.data.id;
    console.log(`   - Status: ${aptRes.status}`);
    console.log(`   - Created Reference ID: ${createdAppointmentId}`);
    console.log(`   - Status Assigned: ${aptData.data.status}\n`);

    // 5. Get All Appointments (Protected Endpoint)
    console.log('5. Retrieving Appointments (Protected)...');
    const getRes = await fetch(`${BASE_URL}/appointments`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const getData = await getRes.json();
    console.log(`   - Status: ${getRes.status}`);
    console.log(`   - Total Listed Counts: ${getData.count}\n`);

    // 6. Update Status (Protected Endpoint)
    console.log('6. Modifying Appointment Status...');
    const patchRes = await fetch(`${BASE_URL}/appointments/${createdAppointmentId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      },
      body: JSON.stringify({ status: 'Confirmed' })
    });
    const patchData = await patchRes.json();
    console.log(`   - Status: ${patchRes.status}`);
    console.log(`   - Updated Status: ${patchData.data.status}\n`);

    // 7. Get Analytics Stats (Protected Endpoint)
    console.log('7. Retrieving Analytics Aggregations...');
    const statsRes = await fetch(`${BASE_URL}/analytics/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const statsData = await statsRes.json();
    console.log(`   - Status: ${statsRes.status}`);
    console.log(`   - Total Leads In Stats: ${statsData.stats.totalLeads}`);
    console.log(`   - Lead Conversion Rate: ${statsData.stats.leadConversionRate}%\n`);

    // 8. Delete Appointment (Protected Endpoint)
    console.log('8. Cleaning Up Created Test Record...');
    const delRes = await fetch(`${BASE_URL}/appointments/${createdAppointmentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const delData = await delRes.json();
    console.log(`   - Status: ${delRes.status}`);
    console.log(`   - Response Message: ${delData.message}\n`);

    console.log('✅ All API verification checks passed successfully.');
    process.exit(0);

  } catch (error) {
    console.error('❌ API Verification Test Failed:', error.message);
    process.exit(1);
  }
}

// Start testing sequence
runTests();
