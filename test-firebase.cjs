const admin = require("firebase-admin");

const serviceAccount = require("./firebase-service-account.json");

console.log("Using Project:", serviceAccount.project_id);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id, // 👈 FORCE PROJECT
});

const db = admin.firestore();

// 👇 VERY IMPORTANT FIX
db.settings({
    ignoreUndefinedProperties: true,
});

async function test() {
    try {
        const snapshot = await db.collection("users").limit(1).get();
        console.log("✅ SUCCESS: Connected to Firestore");
        console.log("Docs count:", snapshot.size);
    } catch (err) {
        console.error("❌ ERROR:", err);
    }
}

test();