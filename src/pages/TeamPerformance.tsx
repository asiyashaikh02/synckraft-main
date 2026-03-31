import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserRole, LeadStatus, ActivityType } from '../types';
import { BarChart2, Activity, Target, PhoneCall } from 'lucide-react';

export const TeamPerformance = () => {
  const [salesUsers, setSalesUsers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const qUsers = query(collection(db, 'sales_users'), where('role', '==', UserRole.SALES_USER));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const users: any[] = [];
      snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
      setSalesUsers(users);
    });

    const unsubLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const allLeads: any[] = [];
      snapshot.forEach(doc => allLeads.push({ id: doc.id, ...doc.data() }));
      setLeads(allLeads);
    });

    const unsubActivities = onSnapshot(collection(db, 'activity_logs'), (snapshot) => {
      const allActivities: any[] = [];
      snapshot.forEach(doc => allActivities.push({ id: doc.id, ...doc.data() }));
      setActivities(allActivities);
    });

    return () => {
      unsubUsers();
      unsubLeads();
      unsubActivities();
    };
  }, []);

  const performanceData = salesUsers.map(user => {
    const userLeads = leads.filter(l => l.salesUserId === user.id);
    const leadsHandled = userLeads.length;
    
    // Using APPROVED status as proxy for conversion
    const conversions = userLeads.filter(l => l.status === LeadStatus.APPROVED).length;
    
    const revenue = userLeads
      .filter(l => l.status === LeadStatus.APPROVED)
      .reduce((sum, l) => sum + (l.potentialValue || 0), 0);

    const userActivities = activities.filter(a => a.userId === user.id);
    const followUpsCompleted = userActivities.filter(a => a.type === ActivityType.FOLLOW_UP).length;

    return {
      ...user,
      leadsHandled,
      conversions,
      revenue,
      followUpsCompleted
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Team Performance</h1>
          <p className="text-slate-500 mt-1">Deep-dive into sales metrics, conversions, and activities.</p>
        </div>
      </div>

      <div className="bg-white border text-left border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Rep Name</th>
                <th className="px-6 py-4 font-medium text-center">Leads Handled</th>
                <th className="px-6 py-4 font-medium text-center">Conversions</th>
                <th className="px-6 py-4 font-medium text-center">Follow ups Completed</th>
                <th className="px-6 py-4 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {performanceData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <BarChart2 className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                    <p>No performance data available yet.</p>
                  </td>
                </tr>
              ) : (
                performanceData.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{user.displayName || 'Unnamed User'}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">
                        <Target className="w-4 h-4 mr-1.5 text-indigo-500" />
                        {user.leadsHandled}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">
                        <Activity className="w-4 h-4 mr-1.5 text-emerald-500" />
                        {user.conversions}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="inline-flex items-center text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">
                        <PhoneCall className="w-4 h-4 mr-1.5 text-amber-500" />
                        {user.followUpsCompleted}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-semibold text-slate-800">
                        ${user.revenue.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
