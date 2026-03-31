import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MapPin, HardHat, CheckCircle, PenTool } from 'lucide-react';
import { Project, SiteVisit, Installation, CompletedProject, ProjectStatus, InstallationStatus } from '../types';

export const OpsDashboard = () => {
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [completed, setCompleted] = useState<CompletedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loadedCount = 0;
    const checkLoading = () => {
      loadedCount++;
      if (loadedCount === 4) setLoading(false);
    };

    const unsubVisits = onSnapshot(query(collection(db, 'siteVisits')), (snap) => {
      setSiteVisits(snap.docs.map(d => d.data() as SiteVisit));
      checkLoading();
    });

    const unsubProjects = onSnapshot(query(collection(db, 'projects')), (snap) => {
      setProjects(snap.docs.map(d => d.data() as Project));
      checkLoading();
    });

    const unsubInstalls = onSnapshot(query(collection(db, 'installations')), (snap) => {
      setInstallations(snap.docs.map(d => d.data() as Installation));
      checkLoading();
    });

    const unsubComp = onSnapshot(query(collection(db, 'completedProjects')), (snap) => {
      setCompleted(snap.docs.map(d => d.data() as CompletedProject));
      checkLoading();
    });

    return () => {
      unsubVisits(); unsubProjects(); unsubInstalls(); unsubComp();
    };
  }, []);

  if (loading) return <div className="p-8 flex items-center justify-center h-full"><div className="w-12 h-12 rounded-full border-b-2 border-indigo-500 animate-spin" /></div>;

  const totalVisits = siteVisits.length;
  const activeProjects = projects.filter(p => [ProjectStatus.ACTIVE, ProjectStatus.PLANNING].includes(p.status)).length;
  const pendingInstalls = installations.filter(i => i.status === InstallationStatus.PENDING).length;
  const totalCompleted = completed.length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Operations Dashboard</h1>
        <p className="text-slate-500 mt-2">High-level overview of execution queues and logistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Site Visits</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalVisits}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Projects</h3>
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <HardHat className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{activeProjects}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending Installs</h3>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{pendingInstalls}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completed</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalCompleted}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Operations Activity</h2>
        <div className="mt-4 border border-slate-100 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium tracking-wider">
              <tr>
                <th className="p-4">Queue Item</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Status / Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.slice(0, 3).map(p => (
                <tr key={p.id}>
                  <td className="p-4 font-medium text-slate-900">{p.customerName}</td>
                  <td className="p-4 text-slate-500">Project Event</td>
                  <td className="p-4 text-slate-600 font-semibold">{p.status}</td>
                </tr>
              ))}
              {installations.slice(0, 3).map(i => (
                <tr key={i.id}>
                  <td className="p-4 font-medium text-slate-900">{i.customerName}</td>
                  <td className="p-4 text-slate-500">Installation Event</td>
                  <td className="p-4 text-slate-600 font-semibold">{i.status}</td>
                </tr>
              ))}
              {(projects.length === 0 && installations.length === 0) && (
                <tr><td colSpan={3} className="p-8 text-center text-slate-400">No active recent items streaming from the database.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
