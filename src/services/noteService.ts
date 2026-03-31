import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Note } from '../types';

const NOTES_COLLECTION = 'Lead_Notes';

export const addNote = async (leadId: string, userId: string, text: string) => {
  try {
    const noteData: Omit<Note, 'id'> = {
      leadId,
      userId,
      note: text,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(collection(db, NOTES_COLLECTION), noteData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding note: ', error);
    throw error;
  }
};

export const subscribeToLeadNotes = (leadId: string, callback: (notes: Note[]) => void) => {
  const q = query(
    collection(db, NOTES_COLLECTION),
    where('leadId', '==', leadId),
    orderBy('createdAt', 'desc') // Ensure indexing in firestore later if composite
  );

  return onSnapshot(q, (snapshot) => {
    const notes: Note[] = [];
    snapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() } as Note);
    });
    // Due to missing composite index often in dev early on, we also sort client side
    notes.sort((a,b) => b.createdAt - a.createdAt);
    callback(notes);
  }, (error) => {
    console.error("Error subscribing to notes: ", error);
  });
};
