import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteVisit, SiteVisitStatus } from '../types';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';

export const SiteVisits = () => {
    const [data, setData] = useState<SiteVisit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'siteVisits'));
        const unsub = onSnapshot(q, (snapshot) => {
            setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SiteVisit)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const updateStatus = async (id: string, status: SiteVisitStatus) => {
        if (!window.confirm(`Are you sure you want to mark this site visit as ${status}?`)) return;
        try {
            await setDoc(doc(db, 'siteVisits', id), { status }, { merge: true });
        } catch (e) {
            console.error("Failed to update site visit:", e);
            alert("An error occurred while updating the status.");
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-t-transparent border-indigo-600 animate-spin" /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Site Visits</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Schedule Visit
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map(visit => (
                            <tr key={visit.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{visit.customerName || 'Pending Assignment'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                        {visit.date ? new Date(visit.date).toLocaleDateString() : 'Unscheduled'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                        {visit.location || 'N/A'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${visit.status === SiteVisitStatus.COMPLETED ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                        visit.status === SiteVisitStatus.CANCELLED ? 'bg-red-100 text-red-800 border-red-200' :
                                            'bg-orange-100 text-orange-800 border-orange-200'
                                        }`}>
                                        {visit.status || 'UNKNOWN'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {visit.status !== SiteVisitStatus.COMPLETED && (
                                        <button
                                            onClick={() => updateStatus(visit.id, SiteVisitStatus.COMPLETED)}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors flex items-center"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Mark Done
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    No site visits found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
