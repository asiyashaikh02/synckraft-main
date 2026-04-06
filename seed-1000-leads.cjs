const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
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
const db = getFirestore(app);
const auth = getAuth(app);

async function seed() {
  console.log("Authenticating...");
  await signInWithEmailAndPassword(auth, 'asiyashk@synckraft.in', 'test@123');
  
  console.log("Seeding 1000 records...");
  const promises = [];
  const leadsRef = collection(db, "leads");
  
  // Create chunks to avoid max concurrent connections issues
  for (let i = 0; i < 10; i++) {
    const chunk = [];
    for (let j = 0; j < 100; j++) {
      chunk.push(addDoc(leadsRef, {
        companyName: `Test Corp ${i * 100 + j}`,
        contactPerson: `John Doe ${i * 100 + j}`,
        email: `john${i * 100 + j}@test.com`,
        status: 'NEW',
        salesUserId: auth.currentUser.uid,
        potentialValue: 15000,
        createdAt: Date.now() - (i * 1000000), // Varies creation date
        updatedAt: Date.now()
      }));
    }
    await Promise.all(chunk);
    console.log(`Seeded ${ (i + 1) * 100 } leads...`);
  }
  
  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
