import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, serverTimestamp, getDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { UserRole, UserStatus } from '../types';

// Generate a human-friendly unique ID for profiles: UID-XXXXXX
const genUniqueId = () => 'UID-' + Math.floor(100000 + Math.random() * 900000).toString();

export const approveUser = async (userId: string) => {
  const userRef = doc(db, 'sales_users', userId);
  // mark user active
  await updateDoc(userRef, { status: UserStatus.ACTIVE });

  // Generate uniqueId for this user
  const uniqueId = genUniqueId();
  
  // update user document with the uniqueId and any other fields that were previously in profiles
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() as any : {};

  const profileUpdates = {
    uniqueId,
    name: userData.displayName || userData.name || '',
    contact: '',
    updatedAt: Date.now(),
    // We no longer use a separate profileRef
    profileRef: null 
  };

  await updateDoc(userRef, profileUpdates);

  // For compatibility with return values, we can return the merged object
  const profile = {
    ...userData,
    ...profileUpdates,
    id: userId
  };

  // Update any existing leads/customers for this user to attach the new uniqueId / clientCode
  try {
    // leads where salesUserId == userId
    const leadsQ = query(collection(db, 'leads'), where('salesUserId', '==', userId));
    const leadSnaps = await getDocs(leadsQ);
    for (const ld of leadSnaps.docs) {
      const leadRef = doc(db, 'leads', ld.id);
      await updateDoc(leadRef, { salesUniqueId: uniqueId, clientCode: uniqueId });
    }

    // customers where salesUserId == userId
    const custQ = query(collection(db, 'customers'), where('salesUserId', '==', userId));
    const custSnaps = await getDocs(custQ);
    for (const c of custSnaps.docs) {
      const custRef = doc(db, 'customers', c.id);
      await updateDoc(custRef, { salesUniqueId: uniqueId, clientCode: uniqueId });
    }
  } catch (err) {
    // non-fatal
    console.warn('Failed to backfill leads/customers with uniqueId:', err);
  }

  return { userRef: userRef.path, profile };
};

export const rejectUser = async (userId: string) => {
  const userRef = doc(db, 'sales_users', userId);
  await updateDoc(userRef, { status: UserStatus.REJECTED });
};

export const deactivateUser = async (userId: string) => {
  const userRef = doc(db, 'sales_users', userId);
  await updateDoc(userRef, { status: UserStatus.REJECTED });
}

export const updateUserRole = async (userId: string, role: UserRole) => {
  const userRef = doc(db, 'sales_users', userId);
  await updateDoc(userRef, { role: role });
}

export const deleteUserAccount = async (userId: string) => {
  const userRef = doc(db, 'sales_users', userId);
  // Profile is now part of the user document, so deleting userRef deletes everything
  await deleteDoc(userRef);
}
