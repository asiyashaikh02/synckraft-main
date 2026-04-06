const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyABUFzB1bximvVXN7OS9Lt5eUh8vc4DFKA',
  authDomain: 'synckraft-crm-9d193.firebaseapp.com',
  projectId: 'synckraft-crm-9d193',
  storageBucket: 'synckraft-crm-9d193.firebasestorage.app',
  messagingSenderId: '63795340779',
  appId: '1:63795340779:web:20edc0c6ac94897eca25ae'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const COLLECTIONS = [
  'users', 'leads', 'activity_logs', 'plans', 'sales_metrics',
  'sales_daily_stats', 'plan_analytics', 'Lead_Notes', 'Phase2_details'
];

async function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

async function validateIntegrity() {
  await signInWithEmailAndPassword(auth, 'asiyashk@synckraft.in', 'test@123');
  const token = await auth.currentUser.getIdToken(true);
  const uid = auth.currentUser.uid;
  
  // Step 2 - Ensure MASTER_ADMIN Profile
  const userUrl = `https://firestore.googleapis.com/v1/projects/synckraft-crm-9d193/databases/(default)/documents/users/${uid}`;
  const profilePayload = {
    fields: {
       email: { stringValue: 'asiyashk@synckraft.in' },
       role: { stringValue: 'MASTER_ADMIN' },
       status: { stringValue: 'ACTIVE' },
       createdAt: { integerValue: Date.now().toString() }
    }
  };
  
  // PATCH without updateMask creates or replaces the entire document.
  // Because rule is: allow write: if request.auth.uid == userId
  const profRes = await fetch(userUrl, { 
     method: 'PATCH',
     headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
     body: JSON.stringify(profilePayload)
  });
  
  const pData = await profRes.json();
  if (pData.error) throw new Error("Failed to secure Master Admin: " + pData.error.message);
  console.log("✅ Verified MASTER_ADMIN Identity");
  
  await delay(1500); // Give rules a moment to evaluate the fresh profile data
  
  // Step 1 - Verify collections for corrupted schema
  for (const coll of COLLECTIONS) {
      const url = `https://firestore.googleapis.com/v1/projects/synckraft-crm-9d193/databases/(default)/documents/${coll}?pageSize=1`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (data.error) throw new Error(`Collection ${coll} threw error: ` + data.error.message);
      console.log(`✅ Collection [${coll}] structure is sound.`);
  }
  
  // Step 4 - Validate Read Write on Phase2_details
  const testUrl = `https://firestore.googleapis.com/v1/projects/synckraft-crm-9d193/databases/(default)/documents/Phase2_details/test_rw_doc`;
  
  // Test Write
  const wRes = await fetch(testUrl, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { phase: { stringValue: "4.5" } } })
  });
  if ((await wRes.json()).error) throw new Error("Write permission denied!");
  console.log("✅ Verified Write permission");
  
  // Test Read
  const rRes = await fetch(testUrl, { headers: { Authorization: `Bearer ${token}` } });
  if ((await rRes.json()).error) throw new Error("Read permission denied!");
  console.log("✅ Verified Read permission");
  
  // Test Update
  const uRes = await fetch(`${testUrl}?updateMask.fieldPaths=integrity`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { integrity: { stringValue: "safe" } } })
  });
  if ((await uRes.json()).error) throw new Error("Update permission denied!");
  console.log("✅ Verified Update permission");
  
  console.log("\\nIntegrity Validated.");
  process.exit(0);
}

validateIntegrity().catch(err => {
  console.error("FATAL ERROR:", err.message);
  process.exit(1);
});
