import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Briefcase, 
  Flame, 
  Clock, 
  CheckCircle,
  CalendarDays
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LeadStatus, Lead, FollowUp, FollowUpStatus } from '../types';

export const SalesDashboard = () => {
  const { user } = useAuth();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch leads assigned to this user
    const qLeads = query(
      collection(db, 'leads'),
      where('salesUserId', '==', user.uid)
    );

    const unsubLeads = onSnapshot(qLeads, (snapshot) => {
      const fetchedLeads: Lead[] = [];
      snapshot.forEach(doc => {
        fetchedLeads.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(fetchedLeads);
    });

    // Fetch follow ups assigned to this user
    const qFollowUps = query(
      collection(db, 'follow_ups'),
      where('userId', '==', user.uid)
    );

    const unsubFollowUps = onSnapshot(qFollowUps, (snapshot) => {
      const fetchedFollowUps: FollowUp[] = [];
      snapshot.forEach(doc => {
        fetchedFollowUps.push({ id: doc.id, ...doc.data() } as FollowUp);
      });
      setFollowUps(fetchedFollowUps);
      setLoading(false);
    });

    return () => {
      unsubLeads();
      unsubFollowUps();
    };
  }, [user]);

  // Derived metrics
  const totalLeads = leads.length;
  const activeDeals = leads.filter(l => [LeadStatus.NEGOTIATION, LeadStatus.CONTACTED].includes(l.status)).length;
  const hotLeads = leads.filter(l => (l.aiScore || 0) > 80).length;
  const pendingFollowUps = followUps.filter(f => f.status === FollowUpStatus.SCHEDULED).length;

  // Pie chart data: Lead Pipeline Distribution
  const pipelineData = [
    { name: 'New', value: leads.filter(l => l.status === LeadStatus.NEW).length },
    { name: 'Contacted', value: leads.filter(l => l.status === LeadStatus.CONTACTED).length },
    { name: 'Negotiation', value: leads.filter(l => l.status === LeadStatus.NEGOTIATION).length },
    { name: 'Contracted', value: leads.filter(l => l.status === LeadStatus.CONTRACTED).length },
  ].filter(d => d.value > 0);

  const COLORS = ['#6366f1', '#3b82f6', '#f59e0b', '#10b981'];

  // Bar chart data for completed follow ups vs scheduled
  const followUpData = [
    { name: 'Scheduled', count: followUps.filter(f => f.status === FollowUpStatus.SCHEDULED).length },
    { name: 'Completed', count: followUps.filter(f => f.status === FollowUpStatus.COMPLETED).length },
    { name: 'Missed', count: followUps.filter(f => f.status === FollowUpStatus.MISSED).length },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sales Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back. Here's your performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">My Leads</h3>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalLeads}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Deals</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{activeDeals}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Hot Leads</h3>
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{hotLeads}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Follow Ups</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{pendingFollowUps}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <span className="w-5 h-5 mr-2 flex items-center justify-center text-indigo-500">📊</span>
            Lead Pipeline Distribution
          </h2>
          <div className="h-80 w-full flex items-center justify-center">
             {pipelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                 <p className="text-slate-400">No pipeline data available.</p>
             )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {pipelineData.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-sm font-medium text-slate-600">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

        {/* Follow Ups Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-indigo-500" />
            Follow Ups Overview
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={followUpData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#6366f1" 
                  radius={[6, 6, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
