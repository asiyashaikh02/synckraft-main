import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ActivityLog, ActivityType } from '../types';
import { Phone, MapPin, Repeat, RefreshCcw, Clock, AlertCircle } from 'lucide-react';

export const ActivityMonitoring = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const qActivities = query(
      collection(db, 'activity_logs'), 
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    
    const unsubActivities = onSnapshot(qActivities, (snapshot) => {
      const logs: ActivityLog[] = [];
      snapshot.forEach(doc => logs.push({ id: doc.id, ...doc.data() } as ActivityLog));
      setActivities(logs);
    });

    return () => unsubActivities();
  }, []);

  const getActivityIcon = (type: ActivityType) => {
    switch(type) {
      case ActivityType.CALL:
        return <Phone className="w-5 h-5 text-indigo-500" />;
      case ActivityType.SITE_VISIT:
        return <MapPin className="w-5 h-5 text-emerald-500" />;
      case ActivityType.FOLLOW_UP:
        return <Repeat className="w-5 h-5 text-amber-500" />;
      case ActivityType.STATUS_CHANGE:
        return <RefreshCcw className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getActivityBg = (type: ActivityType) => {
    switch(type) {
      case ActivityType.CALL: return 'bg-indigo-100';
      case ActivityType.SITE_VISIT: return 'bg-emerald-100';
      case ActivityType.FOLLOW_UP: return 'bg-amber-100';
      case ActivityType.STATUS_CHANGE: return 'bg-blue-100';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Activity Monitoring</h1>
          <p className="text-slate-500 mt-1">Real-time feed of sales team actions and updates.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activities.length === 0 ? (
               <div className="text-center py-12 text-slate-500">
                <Clock className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                <p>No recent activities found.</p>
              </div>
            ) : activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <span className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityBg(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                      <div className="text-sm text-slate-500">
                        <span className="font-medium text-slate-900 mr-2">
                          {/* In a real scenario we'd join with sales_users to get the name, assuming user name is part of description for now or we just say "A user" */}
                          Agent Action:
                        </span>
                        {activity.type.replace('_', ' ')}
                        <span className="ml-2 whitespace-nowrap text-xs text-slate-400">
                          <Clock className="w-3 h-3 inline mr-1 mb-0.5" />
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        <p>{activity.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
