import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task, FollowUp, TaskStatus, FollowUpStatus } from '../types';

const TASKS_COLLECTION = 'tasks';
const FOLLOW_UPS_COLLECTION = 'follow_ups';

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
  try {
    const data: Omit<Task, 'id'> = {
      ...taskData,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(collection(db, TASKS_COLLECTION), data);
    return docRef.id;
  } catch (error) {
    console.error('Error creating task: ', error);
    throw error;
  }
};

export const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
  await updateDoc(doc(db, TASKS_COLLECTION, taskId), { status });
};

export const createFollowUp = async (followUpData: Omit<FollowUp, 'id' | 'createdAt'>) => {
  try {
    const data: Omit<FollowUp, 'id'> = {
      ...followUpData,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(collection(db, FOLLOW_UPS_COLLECTION), data);
    return docRef.id;
  } catch (error) {
    console.error('Error creating follow up: ', error);
    throw error;
  }
};

export const updateFollowUpStatus = async (followUpId: string, status: FollowUpStatus) => {
  await updateDoc(doc(db, FOLLOW_UPS_COLLECTION, followUpId), { status });
};

export const subscribeToUserTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId),
    orderBy('dueDate', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => tasks.push({ id: doc.id, ...doc.data() } as Task));
    callback(tasks);
  });
};

export const subscribeToUserFollowUps = (userId: string, callback: (followUps: FollowUp[]) => void) => {
  const q = query(
    collection(db, FOLLOW_UPS_COLLECTION),
    where('userId', '==', userId),
    orderBy('followUpDate', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const followUps: FollowUp[] = [];
    snapshot.forEach((doc) => followUps.push({ id: doc.id, ...doc.data() } as FollowUp));
    callback(followUps);
  });
};
