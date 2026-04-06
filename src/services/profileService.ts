import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

/**
 * Read a profile document by a full document path (e.g. "sales_users/<id>")
 */
export async function getProfileByPath(path: string) {
  if (!path) return null;
  const parts = path.split('/');
  if (parts.length !== 2) return null;
  const [, id] = parts;
  const snap = await getDoc(doc(db, 'users', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as any) : null;
}

/**
 * Query profile by userId
 */
export async function getProfileByUserId(userId: string) {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as any) : null;
}

/**
 * Subscribe to a profile document for real-time updates. Returns unsubscribe.
 */
export function subscribeToProfile(profileId: string, cb: (data: any) => void) {
  return onSnapshot(doc(db, 'users', profileId), s => {
    cb(s.exists() ? ({ id: s.id, ...s.data() } as any) : null);
  });
}

/**
 * Update profile fields (partial update)
 */
export async function updateProfile(profileId: string, data: Record<string, any>) {
  await updateDoc(doc(db, 'users', profileId), data as any);
}
