import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SolarProposal } from '../types';
import { FileText, Zap } from 'lucide-react';

export const Proposals = () => {
    const [data, setData] = useState<SolarProposal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'proposals'));
        const unsub = onSnapshot(q, (snapshot) => {
            setData(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SolarProposal)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) return <div className="p-8 flex justify-center"><div className="w-8 h-8 rounded-full border-4 border-t-transparent border-indigo-600 animate-spin" /></div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Proposals</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                    Create Proposal
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Lead ID</th>
                            <th className="px-6 py-4">System Size</th>
                            <th className="px-6 py-4">Panels</th>
                            <th className="px-6 py-4">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map(prop => (
                            <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                                    {prop.leadId || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <div className="flex items-center">
                                        <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                                        {prop.panelSizeKw} kW
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{prop.panelCount} ({prop.roofArea} sqft)</td>
                                <td className="px-6 py-4 font-semibold text-slate-900">${prop.finalAmount?.toLocaleString() || prop.proposalAmount?.toLocaleString()}</td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    No ongoing proposals generated yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
