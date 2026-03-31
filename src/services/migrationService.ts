import { collection, getDocs, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";

export const runDataMigration = async () => {
  console.log("Starting data migration...");
  
  try {
    const batch = writeBatch(db);
    let count = 0;

    // 1. Fix Leads: Ensure salesUserId exists
    const leadsSnap = await getDocs(collection(db, "leads"));
    leadsSnap.forEach((leadDoc) => {
      const data = leadDoc.data();
      if (!data.salesUserId) {
        console.log(`Fixing lead ${leadDoc.id}: missing salesUserId`);
        batch.update(doc(db, "leads", leadDoc.id), { 
          salesUserId: "SYSTEM_MIGRATED", // Placeholder or fetch first admin
          updatedAt: Date.now() 
        });
        count++;
      }
    });

    // 2. Fix sales_users: Ensure basic fields exist
    const usersSnap = await getDocs(collection(db, "sales_users"));
    usersSnap.forEach((userDoc) => {
      const data = userDoc.data();
      if (!data.role) {
        console.log(`Fixing user ${userDoc.id}: missing role`);
        batch.update(doc(db, "sales_users", userDoc.id), { 
          role: "SALES_USER",
          status: data.status || "PENDING"
        });
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
      console.log(`Migration complete. Fixed ${count} documents.`);
    } else {
      console.log("No fixes needed. Data is consistent.");
    }
    
    return { success: true, count };
  } catch (error) {
    console.error("Migration failed:", error);
    return { success: false, error };
  }
};
