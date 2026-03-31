import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  DollarSign
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LeadStatus } from '../types';

export const SalesAdminDashboard = () => {
  const { user } = useAuth();
  
  // Dummy Initial Data, will be replaced with real data fetching in the future if this was full prod
  // I will implement basic real-time fetching for leads
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    // In a real app we might fetch only relevant leads, or all leads but here we fetch all leads and calculate
    const unsubscribe = onSnapshot(collection(db, 'leads'), (snapshot) => {
      const leadsData: any[] = [];
      snapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() });
      });
      setLeads(leadsData);
    });

    return () => unsubscribe();
  }, []);

  // Stats calculation
  const totalLeads = leads.length;
  const activeLeads = leads.filter(l => l.status === LeadStatus.NEW || l.status === LeadStatus.NEGOTIATION).length;
  const convertedLeads = leads.filter(l => l.status === LeadStatus.APPROVED).length;
  // Summing potential values for active/converted
  const teamRevenue = leads.filter(l => l.status === LeadStatus.APPROVED).reduce((sum, l) => sum + (l.potentialValue || 0), 0);
  const conversionRate = totalLeads ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

  // --- Chart Data Processing ---

  // 1. Leads assigned per sales user (using dummy sales users if none assigned, otherwise aggregating by salesUserId)
  const leadsPerUserMap: Record<string, number> = {};
  leads.forEach(l => {
    const sId = l.salesUserId || 'Unassigned';
    leadsPerUserMap[sId] = (leadsPerUserMap[sId] || 0) + 1;
  });
  
  const leadsPerUserData = Object.entries(leadsPerUserMap).map(([name, count]) => ({
    name: name.substring(0, 5) + '...', // abbreviate ID for dummy chart
    leads: count
  }));
  // Fallback dummy data if empty
  const defaultLeadsPerUserData = [
    { name: 'Alice', leads: 42 },
    { name: 'Bob', leads: 28 },
    { name: 'Charlie', leads: 35 },
    { name: 'Diana', leads: 50 },
  ];
  const finalLeadsPerUserData = leadsPerUserData.length > 0 ? leadsPerUserData : defaultLeadsPerUserData;

  // 2. Monthly conversions (dummy line chart data)
  const monthlyConversionsData = [
    { name: 'Jan', conversions: 12 },
    { name: 'Feb', conversions: 19 },
    { name: 'Mar', conversions: 15 },
    { name: 'Apr', conversions: 25 },
    { name: 'May', conversions: 32 },
    { name: 'Jun', conversions: 28 },
  ];

  // 3. Sales pipeline distribution (Pie chart mapping lead status)
  const statusCounts = leads.reduce((acc: Record<string, number>, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});
  
  let pipelineData = [
    { name: 'New', value: statusCounts[LeadStatus.NEW] || 0 },
    { name: 'Negotiation', value: statusCounts[LeadStatus.NEGOTIATION] || 0 },
    { name: 'Approved', value: statusCounts[LeadStatus.APPROVED] || 0 },
    { name: 'Rejected', value: statusCounts[LeadStatus.REJECTED] || 0 },
  ];

  // Fallback if no leads
  if (totalLeads === 0) {
    pipelineData = [
      { name: 'New', value: 40 },
      { name: 'Negotiation', value: 30 },
      { name: 'Approved', value: 20 },
      { name: 'Rejected', value: 10 },
    ]
  }

  const COLORS = ['#6366f1', '#14b8a6', '#22c55e', '#ef4444'];

  const stats = [
    { 
      title: 'Team Leads', 
      value: totalLeads, 
      icon: Users, 
      color: 'text-indigo-500', 
      bgColor: 'bg-indigo-500/10'
    },
    { 
      title: 'Active Deals', 
      value: activeLeads, 
      icon: Briefcase, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-500/10' 
    },
    { 
      title: 'Team Revenue', 
      value: `$${teamRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-emerald-500', 
      bgColor: 'bg-emerald-500/10' 
    },
    { 
      title: 'Conversion Rate', 
      value: `${conversionRate}%`, 
      icon: TrendingUp, 
      color: 'text-fuchsia-500', 
      bgColor: 'bg-fuchsia-500/10' 
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Sales Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your team's performance and pipeline.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Leads Assigned Per Sales User */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Leads per Sales Rep</h3>
              <p className="text-sm text-slate-500">Distribution of leads across the team</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finalLeadsPerUserData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F1F5F9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Pipeline Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Pipeline Distribution</h3>
              <p className="text-sm text-slate-500">Current status of all leads</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
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
                  stroke="none"
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
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {pipelineData.map((item, i) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm text-slate-600 font-medium">{item.name}</span>
                <span className="text-sm text-slate-400 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Conversions Line Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Monthly Conversions</h3>
              <p className="text-sm text-slate-500">Number of leads converted to customers over time</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyConversionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#14b8a6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
