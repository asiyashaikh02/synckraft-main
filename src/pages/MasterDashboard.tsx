import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  CheckCircle, 
  Flame, 
  DollarSign, 
  TrendingUp 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { LeadStatus } from '../../types';

export const MasterDashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const unsubLeads = onSnapshot(collection(db, "leads"), s =>
      setLeads(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    const unsubCustomers = onSnapshot(collection(db, "customers"), s =>
      setCustomers(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    return () => {
      unsubLeads();
      unsubCustomers();
    };
  }, []);

  // Compute Metrics
  const totalLeads = leads.length;
  const activeLeads = leads.filter(l => l.status !== LeadStatus.REJECTED && l.status !== LeadStatus.APPROVED).length;
  const convertedLeads = customers.length;
  const hotLeads = leads.filter(l => l.potentialValue > 10000).length; // Arbitrary "hot" definition
  
  const totalRevenue = customers.reduce((acc, curr) => acc + (Number(curr.billingAmount) || 0), 0);
  const conversionRate = totalLeads ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  // Chart Data: Lead Status
  const leadStatusData = [
    { name: 'New', value: leads.filter(l => l.status === LeadStatus.NEW).length },
    { name: 'Negotiation', value: leads.filter(l => l.status === LeadStatus.NEGOTIATION).length },
    { name: 'Approved', value: leads.filter(l => l.status === LeadStatus.APPROVED).length },
    { name: 'Rejected', value: leads.filter(l => l.status === LeadStatus.REJECTED).length },
  ];

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444'];

  // Chart Data: Mock Leads Over Time (using createdAt if available, otherwise just mock data)
  const leadsOverTime = [
    { name: 'Jan', leads: 4 },
    { name: 'Feb', leads: 7 },
    { name: 'Mar', leads: 15 },
    { name: 'Apr', leads: 22 },
    { name: 'May', leads: totalLeads },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-slate-800">{value}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of your entire system performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Total Leads" value={totalLeads} icon={Users} colorClass="bg-indigo-50 text-indigo-600" trend="+12%" />
        <StatCard title="Active Leads" value={activeLeads} icon={Briefcase} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Converted" value={convertedLeads} icon={CheckCircle} colorClass="bg-emerald-50 text-emerald-600" trend="+5%" />
        <StatCard title="Hot Leads" value={hotLeads} icon={Flame} colorClass="bg-orange-50 text-orange-600" />
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} colorClass="bg-amber-50 text-amber-600" trend="+24%" />
        <StatCard title="Win Rate" value={`${conversionRate}%`} icon={TrendingUp} colorClass="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Leads Generation (YTD)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadsOverTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Lead Pipeline Distribution</h3>
          <div className="flex-1 flex items-center justify-center">
            {totalLeads > 0 ? (
              <div className="h-72 w-full flex items-center">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadStatusData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {leadStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-1/2 space-y-4">
                  {leadStatusData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm text-slate-600 font-medium">{entry.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
                <div className="text-sm text-slate-400">Not enough data to generate chart.</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
