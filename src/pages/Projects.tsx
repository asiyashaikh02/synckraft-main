import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, ProjectStatus } from '../types';
import { HardHat, Activity, User, ArrowRight } from 'lucide-react';

export const Projects = () => {
    const [data, setData] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'projects'));
        const unsub = onSnapshot(q, (snapshot) => {
            setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const advanceProjectStatus = async (id: string, status: ProjectStatus) => {
        if (!window.confirm(`Are you sure you want to advance this project to ${status}?`)) return;
        try {
            await setDoc(doc(db, 'projects', id), { status }, { merge: true });
        } catch (e) {
            console.error("Failed to update project:", e);
            alert("An error occurred while updating the status.");
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-t-transparent border-indigo-600 animate-spin" /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Projects</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Initialize Project
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Manager</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map(project => (
                            <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{project.customerName || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-slate-400" />
                                        {project.managerId || 'Unassigned'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${project.status === ProjectStatus.READY_FOR_INSTALLATION ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                                        project.status === ProjectStatus.ACTIVE ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                            'bg-slate-100 text-slate-800 border-slate-200'
                                        }`}>
                                        {project.status || 'UNKNOWN'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {project.status === ProjectStatus.PLANNING && (
                                        <button onClick={() => advanceProjectStatus(project.id, ProjectStatus.ACTIVE)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors">START ACTIVATION</button>
                                    )}
                                    {project.status === ProjectStatus.ACTIVE && (
                                        <button onClick={() => advanceProjectStatus(project.id, ProjectStatus.READY_FOR_INSTALLATION)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors flex items-center">
                                            <ArrowRight className="w-4 h-4 mr-1" /> Ready to Install
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    No ongoing projects. Converting new leads or activating customers will populate this panel.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
