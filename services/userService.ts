import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, serverTimestamp, getDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { UserRole, UserStatus } from '../types';

// Generate a human-friendly unique ID for profiles: UID-XXXXXX
const genUniqueId = () => 'UID-' + Math.floor(100000 + Math.random() * 900000).toString();

export const approveUser = async (userId: string) => {
  const userRef = doc(db, 'sales_users', userId);
  // mark user active
  await updateDoc(userRef, { status: UserStatus.ACTIVE });

  // create profile in `profiles` collection
  const profilesCol = collection(db, 'profiles');
  const uniqueId = genUniqueId();

  // read basic user data to copy into profile
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() as any : { name: '', email: '' };

  const profileRef = doc(profilesCol);
  const profile = {
    id: profileRef.id,
    name: userData.displayName || userData.name || '',
    email: userData.email || '',
    contact: '',
    role: userData.role || UserRole.SALES_USER,
    uniqueId,
    createdAt: Date.now(),
    userRef: userRef.path,
  };

  await setDoc(profileRef, profile);

  // link profile back to user document
  await updateDoc(userRef, { profileRef: profileRef.path });

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
  
  // Attempt to sync role to profile as well
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    if (data.profileRef) {
       const profileRef = doc(db, data.profileRef);
       await updateDoc(profileRef, { role: role });
    }
  }
}

export const deleteUserAccount = async (userId: string) => {
  const userRef = doc(db, 'sales_users', userId);
  
  // Delete the profile if referenced
  const userSnap = await getDoc(userRef);
  if (userSnap.exists() && userSnap.data().profileRef) {
      await deleteDoc(doc(db, userSnap.data().profileRef));
  }
  
  // Then delete the user document
  await deleteDoc(userRef);
}
