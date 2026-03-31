import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  CheckCircle,
  Flame,
  DollarSign,
  TrendingUp,
  MapPin,
  HardHat,
  PenTool,
  Plus
} from 'lucide-react';
import {
  LineChart,
  Line,
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
import { LeadStatus, UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { runDataMigration } from '../services/migrationService';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorAlert } from '../components/common/ErrorAlert';
import { Unauthorized } from '../components/common/Unauthorized';

export const MasterDashboard = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [installations, setInstallations] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const navigate = useNavigate();

  // RBAC Guard
  if (user?.role !== UserRole.MASTER_ADMIN) {
    return <Unauthorized />;
  }

  const handleMigration = async () => {
    if (!window.confirm("Run data migration to standardize collections?")) return;
    setMigrating(true);
    const res = await runDataMigration();
    setMigrating(false);
    if (res.success) {
      alert(`Migration successful. Documents fixed: ${res.count}`);
    } else {
      alert("Migration failed. Check console.");
    }
  };

  useEffect(() => {
    const handleError = (err: any) => {
      console.error("MasterDashboard sync error:", err);
      setError(true);
      setLoading(false);
    };

    const unsubLeads = onSnapshot(collection(db, "leads"), s => {
      setLeads(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, handleError);

    const unsubCustomers = onSnapshot(collection(db, "customers"), s => {
      setCustomers(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, handleError);

    const unsubProjects = onSnapshot(query(collection(db, "projects"), where("status", "in", ["ACTIVE", "PLANNING"])), s => {
      setProjects(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, handleError);

    const unsubInstalls = onSnapshot(query(collection(db, "installations"), where("status", "==", "PENDING")), s => {
      setInstallations(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, handleError);

    const unsubComp = onSnapshot(collection(db, "completedProjects"), s => {
      setCompleted(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, handleError);

    return () => {
      unsubLeads();
      unsubCustomers();
      unsubProjects();
      unsubInstalls();
      unsubComp();
    };
  }, []);

  const totalLeads = leads.length;
  const activeProjects = projects.length;
  const pendingInstalls = installations.length;
  const completedCount = completed.length;
  const hotLeads = leads.filter(l => l.potentialValue > 10000).length;
  const totalRevenue = customers.reduce((acc, curr) => acc + (Number(curr.billingAmount) || 0), 0);

  const leadStatusData = [
    { name: 'New', value: leads.filter(l => l.status === LeadStatus.NEW).length },
    { name: 'Negotiation', value: leads.filter(l => l.status === LeadStatus.NEGOTIATION).length },
    { name: 'Approved', value: leads.filter(l => l.status === LeadStatus.APPROVED).length },
    { name: 'Rejected', value: leads.filter(l => l.status === LeadStatus.REJECTED).length },
  ];

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444'];

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

  if (error) return <ErrorAlert onRetry={() => window.location.reload()} />;
  if (loading) return <LoadingSpinner message="Reconstructing global dashboard data..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Holistic overview of the organizational pipeline.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => alert("Lead creation dialog opened")} className="flex items-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition">
            <Plus className="w-4 h-4 mr-2" /> Lead
          </button>
          <button onClick={() => alert("Proposal generation opened")} className="flex items-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition">
            <Plus className="w-4 h-4 mr-2" /> Proposal
          </button>
          <button 
            disabled={migrating}
            onClick={handleMigration} 
            className="flex items-center bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition disabled:opacity-50"
          >
            {migrating ? 'Migrating...' : 'Run Migration'}
          </button>
          <button onClick={() => navigate('/site-visit-scheduling')} className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            <Plus className="w-4 h-4 mr-2" /> Site Visit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Total Leads" value={totalLeads} icon={Users} colorClass="bg-indigo-50 text-indigo-600" trend="+12%" />
        <StatCard title="Hot Leads" value={hotLeads} icon={Flame} colorClass="bg-orange-50 text-orange-600" />
        <StatCard title="Active Projects" value={activeProjects} icon={HardHat} colorClass="bg-blue-50 text-blue-600" />
        <StatCard title="Pending Installs" value={pendingInstalls} icon={PenTool} colorClass="bg-amber-50 text-amber-600" />
        <StatCard title="Completed" value={completedCount} icon={CheckCircle} colorClass="bg-emerald-50 text-emerald-600" trend="+5%" />
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} colorClass="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Lead Pipeline Distribution</h3>
          <div className="flex-1 flex items-center justify-center">
            {totalLeads > 0 ? (
              <div className="h-72 w-full flex items-center">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie data={leadStatusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {leadStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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
              <div className="text-sm text-slate-400 p-8 text-center w-full">No active leads currently tracking in database.</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Operations Queue Insight</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50">
              <div>
                <p className="font-semibold text-slate-800">Projects Staging</p>
                <p className="text-sm text-slate-500">Awaiting installation dates</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">{activeProjects}</span>
            </div>
            <div className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:bg-slate-50">
              <div>
                <p className="font-semibold text-slate-800">Pending Operations</p>
                <p className="text-sm text-slate-500">Installation crews deploying</p>
              </div>
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">{pendingInstalls}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
