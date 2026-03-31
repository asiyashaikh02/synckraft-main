import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CompletedProject } from '../types';
import { CheckCircle, Zap } from 'lucide-react';

export const CompletedProjects = () => {
    const [data, setData] = useState<CompletedProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'completedProjects'));
        const unsub = onSnapshot(q, (snapshot) => {
            setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CompletedProject)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-t-transparent border-indigo-600 animate-spin" /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Completed Projects</h1>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Completion Date</th>
                            <th className="px-6 py-4">Final Capacity</th>
                            <th className="px-6 py-4">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map(proj => (
                            <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                                    {proj.customerName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {proj.completionDate ? new Date(proj.completionDate).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center">
                                        <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                                        {proj.finalCapacityKw} kW
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{proj.handoverNotes || '-'}</td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    No completed projects yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
