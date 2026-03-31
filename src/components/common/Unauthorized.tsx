import React from 'react';
import { ShieldAlert, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../lib/firebase';

export const Unauthorized = () => {
    const { user } = useAuth();
    
    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-8 bg-slate-50/50 text-center animate-in zoom-in-95 duration-500">
            <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform duration-300">
                    <ShieldAlert className="w-10 h-10 text-indigo-600" />
                </div>
                
                <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Access Restricted</h1>
                <p className="text-slate-500 text-base leading-relaxed mb-10">
                    Your current account role ({user?.role || 'Guest'}) does not have permission to view this module. Please contact your system administrator.
                </p>
                
                <div className="space-y-3">
                    <a 
                        href="mailto:it@synckraft.com"
                        className="flex items-center justify-center w-full px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
                    >
                        <Mail className="w-5 h-5 mr-3" />
                        Request Access
                    </a>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                    >
                        <LogIn className="w-5 h-5 mr-3" />
                        Switch Account / Logout
                    </button>
                </div>
                
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                    Synckraft Security Protocol
                </p>
            </div>
        </div>
    );
};
