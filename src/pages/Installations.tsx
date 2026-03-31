import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Installation, InstallationStatus } from '../types';
import { Calendar, Users, Briefcase } from 'lucide-react';

export const Installations = () => {
    const [data, setData] = useState<Installation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'installations'));
        const unsub = onSnapshot(q, (snapshot) => {
            setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Installation)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const updateStatus = async (id: string, status: InstallationStatus) => {
        try {
            await setDoc(doc(db, 'installations', id), { status }, { merge: true });
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-t-transparent border-indigo-600 animate-spin" /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Installations</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Assign Crew
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Crew Details</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map(inst => (
                            <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{inst.customerName || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                        {inst.scheduledDate ? new Date(inst.scheduledDate).toLocaleDateString() : 'Holding'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-2 text-slate-400" />
                                        {inst.crewDetails || 'TBD'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${inst.status === InstallationStatus.COMPLETED ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                            inst.status === InstallationStatus.IN_PROGRESS ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                                                'bg-slate-100 text-slate-800 border-slate-200'
                                        }`}>
                                        {inst.status || 'UNKNOWN'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {inst.status === InstallationStatus.PENDING && (
                                        <button onClick={() => updateStatus(inst.id, InstallationStatus.IN_PROGRESS)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">Deploy Crew</button>
                                    )}
                                    {inst.status === InstallationStatus.IN_PROGRESS && (
                                        <button onClick={() => updateStatus(inst.id, InstallationStatus.COMPLETED)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors">Complete Job</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No pending installations. Push projects forward to generate installation arrays.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
