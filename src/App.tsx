import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { UserRole, UserStatus } from './types';
import { Icons } from './constants';
import { registerUser, loginUser, logoutUser } from './lib/auth';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { MasterDashboard } from './pages/MasterDashboard';
import { UserManagement } from './pages/UserManagement';
import { SalesAdminDashboard } from './pages/SalesAdminDashboard';
import { TeamLeads } from './pages/TeamLeads';
import { SalesTeam } from './pages/SalesTeam';
import { TeamPerformance } from './pages/TeamPerformance';
import { ActivityMonitoring } from './pages/ActivityMonitoring';
import { SalesDashboard } from './pages/SalesDashboard';
import { MyLeads } from './pages/MyLeads';
import { LeadDetail } from './pages/LeadDetail';
import { FollowUps } from './pages/FollowUps';
import { Tasks } from './pages/Tasks';
import { NotesPage } from './pages/NotesPage';
import ProfileView from './Profile';
import { OpsDashboard } from './pages/OpsDashboard';
import { SiteVisits } from './pages/SiteVisits';
import { Proposals } from './pages/Proposals';
import { Installations } from './pages/Installations';
import { Projects } from './pages/Projects';
import { CompletedProjects } from './pages/CompletedProjects';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        Initializing Synckraft...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthView initialMode="login" />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <AuthView initialMode="register" />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
            <Route path="/" element={<HomeRedirect user={user} />} />

            {/* Master Admin Only */}
            <Route element={<RoleRoute user={user} allowedRoles={[UserRole.MASTER_ADMIN]} />}>
              <Route path="/master-dashboard" element={<MasterDashboard />} />
              <Route path="/user-approvals" element={<UserManagement />} />
              <Route path="/settings" element={<div>Settings Placeholder</div>} />
              <Route path="/plans" element={<div>Plans Placeholder</div>} />
              <Route path="/analytics" element={<MasterDashboard />} /> {/* Fallback to dashboard for now */}
            </Route>

            {/* Sales Admin Access */}
            <Route element={<RoleRoute user={user} allowedRoles={[UserRole.MASTER_ADMIN, UserRole.SALES_ADMIN]} />}>
              <Route path="/sales-admin-dashboard" element={<SalesAdminDashboard />} />
              <Route path="/team-leads" element={<TeamLeads />} />
              <Route path="/sales-team" element={<SalesTeam />} />
              <Route path="/performance" element={<TeamPerformance />} />
              <Route path="/activities" element={<ActivityMonitoring />} />
            </Route>

            {/* Sales Dashboard Access (Assuming Sales Admin & Sales User can access) */}
            <Route element={<RoleRoute user={user} allowedRoles={[UserRole.MASTER_ADMIN, UserRole.SALES_ADMIN, UserRole.SALES_USER]} />}>
              <Route path="/sales-dashboard" element={<SalesDashboard />} />
              <Route path="/my-leads" element={<MyLeads />} />
              <Route path="/leads/:id" element={<LeadDetail />} />
              <Route path="/follow-ups" element={<FollowUps />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/notes" element={<NotesPage />} />
              {/* Note: /activities could be shared or we can map them directly later */}
            </Route>

            {/* Ops Access */}
            <Route element={<RoleRoute user={user} allowedRoles={[UserRole.MASTER_ADMIN, UserRole.OPS_USER]} />}>
              <Route path="/ops-dashboard" element={<OpsDashboard />} />
              <Route path="/ops/site-visits" element={<SiteVisits />} />
              <Route path="/ops/proposals" element={<Proposals />} />
              <Route path="/ops/installations" element={<Installations />} />
              <Route path="/ops/projects" element={<Projects />} />
              <Route path="/ops/completed-projects" element={<CompletedProjects />} />

              {/* Back-compat: old placeholder route */}
              <Route path="/customers" element={<Navigate to="/ops-dashboard" replace />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const HomeRedirect = ({ user }: { user: any }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === UserRole.MASTER_ADMIN) return <Navigate to="/master-dashboard" replace />;
  if (user.role === UserRole.SALES_ADMIN) return <Navigate to="/sales-admin-dashboard" replace />;
  if (user.role === UserRole.SALES_USER) return <Navigate to="/sales-dashboard" replace />;
  if (user.role === UserRole.OPS_USER) return <Navigate to="/ops-dashboard" replace />;
  return <Navigate to="/my-leads" replace />;
};

const ProtectedRoute = ({ user }: { user: any }) => {
  if (!user) return <Navigate to="/login" replace />;

  if (user.status === UserStatus.PENDING) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-center p-8">
        <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-amber-500">
          <div className="animate-pulse">
            <Icons.Users />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Account Pending Approval</h1>
        <p className="text-slate-400 max-w-md mb-8">
          Hello {user.displayName || user.email}, a Master Admin needs to verify your role.
        </p>
        <button
          onClick={logoutUser}
          className="text-indigo-400 font-bold hover:underline transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
    );
  }

  if (user.status === UserStatus.REJECTED) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-center p-8">
        <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-red-500">
          <Icons.Users />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Account Access Revoked</h1>
        <p className="text-slate-400 max-w-md mb-8">
          Your account has been rejected or deactivated. Please contact support.
        </p>
        <button
          onClick={logoutUser}
          className="text-indigo-400 font-bold hover:underline transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return <Outlet />;
};

const RoleRoute = ({ user, allowedRoles }: { user: any, allowedRoles: UserRole[] }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === UserRole.MASTER_ADMIN) return <Outlet />;
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect unauthorized away from specific role paths
  }
  return <Outlet />;
};

/* ---------------- AUTH VIEWS ---------------- */
const AuthView = ({ initialMode }: { initialMode: 'login' | 'register' }) => {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', email: '', pass: '', companyName: '', phone: '', role: UserRole.SALES_USER });
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(form.email)) return alert('Invalid email');
    if (form.pass.length < 6) return alert('Password must be at least 6 characters');

    try {
      if (mode === 'login') {
        await loginUser(form.email, form.pass);
      } else {
        if (!form.name) return alert('Name required');
        await registerUser(form.email, form.pass, form.name, form.role, form.companyName, form.phone);
        alert('Registration successful. Awaiting admin approval.');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white space-y-4"
    >
      <div className="text-2xl font-black text-indigo-500 mb-4">Synckraft CRM</div>
      {mode === 'register' && (
        <div className="space-y-4 flex flex-col">
          <input
            placeholder="Full Name"
            className="p-2 rounded-md text-slate-900 w-64"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Company Name"
            className="p-2 rounded-md text-slate-900 w-64"
            onChange={e => setForm({ ...form, companyName: e.target.value })}
          />
          <input
            placeholder="Phone Number"
            className="p-2 rounded-md text-slate-900 w-64"
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      )}
      <input
        placeholder="Email"
        className="p-2 rounded-md text-black w-64"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        className="p-2 rounded-md text-black w-64"
        onChange={e => setForm({ ...form, pass: e.target.value })}
      />
      {mode === 'register' && (
        <select
          className="p-2 rounded-md text-black w-64"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
        >
          <option value={UserRole.SALES_USER}>Sales User</option>
          <option value={UserRole.OPS_USER}>Ops User</option>
        </select>
      )}
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-bold transition-colors duration-200">
        {mode === 'login' ? 'Login' : 'Request Access'}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="text-indigo-400 text-sm font-bold hover:underline transition-colors duration-200"
      >
        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </form>
  );
};


/* ---------------- PLACEHOLDERS FOR OLD ROUTES TO PREVENT BREAKING APP LOGIC ---------------- */
const LeadsPlaceholder = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads Module</h1>
      <p className="text-slate-500 text-sm mt-1">This module will be refactored in a future phase.</p>
    </div>
  )
}

const CustomersPlaceholder = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operations Module</h1>
      <p className="text-slate-500 text-sm mt-1">This module will be refactored in a future phase.</p>
    </div>
  )
}

// Profile modal wrapper usage
const ProfileModal = ({ visible, onClose }: any) => {
  if (!visible) return null;
  return <ProfileView onClose={onClose} />;
};
