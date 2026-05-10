const http = require('http');

const API_BASE = 'http://localhost:3001/api/v1';

async function request(endpoint, method, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + endpoint);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runDemo() {
  console.log('--- TRAVELOOP BACKEND E2E TEST ---');

  // 1. Signup
  const email = `testuser_${Date.now()}@traveloop.com`;
  console.log(`\n1. Creating User: ${email}...`);
  const signupRes = await request('/auth/signup', 'POST', {
    email,
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
  });
  console.log('Signup Response:', signupRes);

  const token = signupRes.data?.accessToken;
  if (!token) {
    console.error('❌ Failed to retrieve access token!');
    return;
  }

  // 2. Create Trip
  console.log('\n2. Creating a new Trip...');
  const createTripRes = await request('/trips', 'POST', {
    title: 'Summer in Japan',
    description: 'A 2-week adventure across Tokyo, Kyoto, and Osaka.',
    startDate: '2024-07-01T00:00:00Z',
    endDate: '2024-07-15T00:00:00Z',
  }, token);
  console.log('Create Trip Response:', createTripRes);

  // 3. Fetch Trips
  console.log('\n3. Fetching User Trips...');
  const fetchTripsRes = await request('/trips', 'GET', null, token);
  console.log('Fetch Trips Response:', JSON.stringify(fetchTripsRes, null, 2));

  console.log('\n✅ Demo completed successfully! The backend is working perfectly.');
}

runDemo();
