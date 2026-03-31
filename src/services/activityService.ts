import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ActivityLog, ActivityType } from '../types';

const ACTIVITIES_COLLECTION = 'activity_logs';

export const logActivity = async (
  userId: string,
  type: ActivityType,
  description: string,
  relatedId?: { leadId?: string; customerId?: string }
) => {
  try {
    const activityData: Omit<ActivityLog, 'id'> = {
      userId,
      type,
      description,
      createdAt: Date.now(),
      ...relatedId
    };

    const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), activityData);
    return docRef.id;
  } catch (error) {
    console.error('Error logging activity: ', error);
    throw error;
  }
};

export const subscribeToActivities = (
  callback: (activities: ActivityLog[]) => void,
  userId?: string,   // If provided, filters by specific user
  maxLogs: number = 50,
  onError?: (err: any) => void
) => {
  let q;
  if (userId) {
    q = query(
      collection(db, ACTIVITIES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(maxLogs)
    );
  } else {
    q = query(
      collection(db, ACTIVITIES_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(maxLogs)
    );
  }

  return onSnapshot(q, (snapshot) => {
    const activitiesData: ActivityLog[] = [];
    snapshot.forEach((doc) => {
      activitiesData.push({ id: doc.id, ...doc.data() } as ActivityLog);
    });
    callback(activitiesData);
  }, (error) => {
    console.error("Activities subscription error: ", error);
    if (onError) onError(error);
  });
};

export const subscribeToLeadActivities = (
  leadId: string,
  callback: (activities: ActivityLog[]) => void,
  maxLogs: number = 50,
  onError?: (err: any) => void
) => {
  const q = query(
      collection(db, ACTIVITIES_COLLECTION),
      where('leadId', '==', leadId),
      orderBy('createdAt', 'desc'),
      limit(maxLogs)
  );

  return onSnapshot(q, (snapshot) => {
    const activitiesData: ActivityLog[] = [];
    snapshot.forEach((doc) => {
      activitiesData.push({ id: doc.id, ...doc.data() } as ActivityLog);
    });
    callback(activitiesData);
  }, (error) => {
    console.error("Lead activities subscription error: ", error);
    if (onError) onError(error);
  });
};
