
const axios = require("axios");

async function testRole(email, password, endpoints) {
  try {
    const login = await axios.post("http://localhost:8080/api/auth/login", { email, password });
    const token = login.data.token;
    console.log(`\n--- Testing ${email} (${login.data.role}) ---`);
    for (const ep of endpoints) {
      try {
        const res = await axios.get(`http://localhost:8080${ep}`, { headers: { Authorization: `Bearer ${token}` } });
        console.log(`[OK] ${ep}`);
      } catch (e) {
        console.log(`[FAIL] ${ep} - ${e.response ? e.response.status : e.message}`);
      }
    }
  } catch (e) {
    console.log(`[LOGIN FAIL] ${email} - ${e.message}`);
  }
}

async function run() {
  await testRole("worker@streetfix.com", "Admin@123", ["/api/dashboard/officer", "/api/complaints", "/api/notifications"]);
  await testRole("assistant@streetfix.com", "Admin@123", ["/api/dashboard/commissioner", "/api/complaints", "/api/analytics/category", "/api/analytics/priority", "/api/analytics/sla", "/api/analytics/users", "/api/escalations", "/api/analytics/trend?days=30", "/api/notifications"]);
  await testRole("zonal@streetfix.com", "Admin@123", ["/api/dashboard/commissioner", "/api/complaints", "/api/analytics/category", "/api/analytics/priority", "/api/analytics/sla", "/api/analytics/users", "/api/escalations", "/api/analytics/trend?days=30", "/api/notifications"]);
}

run();

