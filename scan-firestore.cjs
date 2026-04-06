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
  'users',
  'leads',
  'activity_logs',
  'plans',
  'sales_metrics',
  'sales_daily_stats',
  'plan_analytics',
  'Lead_Notes',
  'Phase2_details'
];

async function scan() {
  await signInWithEmailAndPassword(auth, 'asiyashk@synckraft.in', 'test@123');
  const token = await auth.currentUser.getIdToken();
  const report = {};
  
  for (const coll of COLLECTIONS) {
    try {
        const url = `https://firestore.googleapis.com/v1/projects/synckraft-crm-9d193/databases/(default)/documents/${coll}?pageSize=1`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }});
        const data = await res.json();
        
        if (data.error) {
            console.log(`[${coll}] Error: ${data.error.message}`);
            report[coll] = { status: 'error', code: data.error.status };
            continue;
        }

        if (!data.documents || data.documents.length === 0) {
            console.log(`[${coll}] Missing document.`);
            // Auto create dummy via REST
            const dummyUrl = `https://firestore.googleapis.com/v1/projects/synckraft-crm-9d193/databases/(default)/documents/${coll}?documentId=dummy_doc`;
            
            const dummyPayload = {
                fields: {
                    _auto_generated: { booleanValue: true },
                    scannedAt: { stringValue: Date.now().toString() }
                }
            };
            
            await fetch(dummyUrl, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(dummyPayload)
            });
            report[coll] = { status: 'created', schema: { _auto_generated: 'boolean', scannedAt: 'string' } };
        } else {
            console.log(`[${coll}] Document found.`);
            const fields = data.documents[0].fields;
            const schema = {};
            for (const [key, val] of Object.entries(fields || {})) {
                schema[key] = Object.keys(val)[0].replace('Value', '');
            }
            report[coll] = { status: 'exists', schema };
        }
    } catch (e) {
        console.error(e.message);
    }
  }
  
  require('fs').writeFileSync('firestore-schema.json', JSON.stringify(report, null, 2));
  console.log("✅ Scan complete. Saved to firestore-schema.json");
  process.exit(0);
}

scan();
