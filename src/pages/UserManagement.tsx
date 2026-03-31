import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserStatus, UserRole } from '../types';
import { approveUser, rejectUser, deactivateUser, updateUserRole, deleteUserAccount } from '../services/userService';
import { Shield, ShieldAlert, Check, X, Trash2, Edit } from 'lucide-react';

export const UserManagement = () => {
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "sales_users"), s =>
      setAllUsers(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, []);

  const pendingUsers = allUsers.filter(u => u.status === UserStatus.PENDING);
  const activeUsers = allUsers.filter(u => u.status !== UserStatus.PENDING);

  const handleApprove = async (id: string) => {
    try { await approveUser(id); } catch(e: any) { alert(e.message); }
  }

  const handleReject = async (id: string) => {
    try { await rejectUser(id); } catch(e: any) { alert(e.message); }
  }

  const handleDeactivate = async (id: string) => {
    try { await deactivateUser(id); } catch(e: any) { alert(e.message); }
  }

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to permanently delete this user? This cannot be undone.')){
        try { await deleteUserAccount(id); } catch(e: any) { alert(e.message); }
    }
  }

  const handleRoleChange = async (id: string, newRole: UserRole) => {
    try { await updateUserRole(id, newRole); } catch(e: any) { alert(e.message); }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Users & Approvals</h1>
        <p className="text-slate-500 text-sm mt-1">Manage platform access, roles, and pending registrations.</p>
      </div>

      {pendingUsers.length > 0 && (
        <section className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-200 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-amber-900">Pending Approvals ({pendingUsers.length})</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingUsers.map(u => (
              <div key={u.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                    {u.displayName?.charAt(0) || u.email?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{u.displayName || 'No Name Provided'}</h3>
                    <p className="text-sm text-slate-500">{u.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                      Requested: {u.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleReject(u.id)}
                    className="flex items-center space-x-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-red-600 transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button 
                    onClick={() => handleApprove(u.id)}
                    className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Access</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center space-x-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-800">Active Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">User Info</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                        {u.displayName?.charAt(0) || u.email?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{u.displayName}</p>
                        <p className="text-sm text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                    >
                      <option value={UserRole.MASTER_ADMIN}>Master Admin</option>
                      <option value={UserRole.SALES_ADMIN}>Sales Admin</option>
                      <option value={UserRole.SALES_USER}>Sales User</option>
                      <option value={UserRole.OPS_USER}>Ops User</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      u.status === UserStatus.ACTIVE ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {u.status === UserStatus.ACTIVE && u.email !== 'admin@gmail.com' && (
                        <button 
                          onClick={() => handleDeactivate(u.id)}
                          className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Deactivate User"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      {u.email !== 'admin@gmail.com' && (
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
