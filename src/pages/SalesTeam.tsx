import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { UserRole, LeadStatus } from '../../types';
import { User, Mail, Briefcase, DollarSign, TrendingUp } from 'lucide-react';

export const SalesTeam = () => {
  const [salesUsers, setSalesUsers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Sales Users
    const qUsers = query(collection(db, 'sales_users'), where('role', '==', UserRole.SALES_USER));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const users: any[] = [];
      snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
      setSalesUsers(users);
    });

    // Fetch all leads to compute stats per user
    const unsubLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const allLeads: any[] = [];
      snapshot.forEach(doc => allLeads.push({ id: doc.id, ...doc.data() }));
      setLeads(allLeads);
    });

    return () => {
      unsubUsers();
      unsubLeads();
    };
  }, []);

  // Compute stats per user
  const userStats = salesUsers.map(user => {
    const userLeads = leads.filter(l => l.salesUserId === user.id);
    const activeLeads = userLeads.filter(l => l.status === LeadStatus.NEW || l.status === LeadStatus.NEGOTIATION).length;
    const convertedLeads = userLeads.filter(l => l.status === LeadStatus.APPROVED).length;
    
    // Revenue Generated
    const revenueGenerated = userLeads
      .filter(l => l.status === LeadStatus.APPROVED)
      .reduce((sum, l) => sum + (l.potentialValue || 0), 0);
    
    // Conversion Rate
    const conversionRate = userLeads.length > 0 
      ? ((convertedLeads / userLeads.length) * 100).toFixed(1)
      : '0.0';

    return {
      ...user,
      totalLeadsAssigned: userLeads.length,
      activeLeads,
      convertedLeads,
      revenueGenerated,
      conversionRate
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Sales Team</h1>
          <p className="text-slate-500 mt-1">Overview of all active sales representatives and their metrics.</p>
        </div>
      </div>

      <div className="bg-white border text-left border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Rep Name</th>
                <th className="px-6 py-4 font-medium text-center">Active Leads</th>
                <th className="px-6 py-4 font-medium text-center">Conversion Rate</th>
                <th className="px-6 py-4 font-medium text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userStats.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <User className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                    <p>No sales users found in the system.</p>
                  </td>
                </tr>
              ) : (
                userStats.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.displayName || 'Unnamed User'}</div>
                        <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">
                        <Briefcase className="w-4 h-4 mr-1.5 text-slate-500" />
                        {user.activeLeads}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        parseFloat(user.conversionRate) > 20 ? 'bg-emerald-100 text-emerald-700' :
                        parseFloat(user.conversionRate) > 5 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <TrendingUp className="w-4 h-4 mr-1.5" />
                        {user.conversionRate}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-semibold text-slate-800 flex items-center justify-end">
                        <DollarSign className="w-4 h-4 text-slate-400 mr-0.5" />
                        {user.revenueGenerated.toLocaleString()}
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
