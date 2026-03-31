import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { FollowUp, FollowUpStatus, Lead } from '../types';
import { subscribeToUserFollowUps, createFollowUp, updateFollowUpStatus } from '../services/taskService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';

export const FollowUps = () => {
  const { user } = useAuth();
  
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [myLeads, setMyLeads] = useState<Lead[]>([]); // for dropdown

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [reminderNote, setReminderNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsub = subscribeToUserFollowUps(user.uid, (data) => {
      setFollowUps(data);
      setLoading(false);
    });

    // Fetch leads for the dropdown once
    const fetchLeads = async () => {
       const q = query(collection(db, 'leads'), where('salesUserId', '==', user.uid));
       const snapshot = await getDocs(q);
       const fetched: Lead[] = [];
       snapshot.forEach(doc => fetched.push({ id: doc.id, ...doc.data() } as Lead));
       setMyLeads(fetched);
    };
    fetchLeads();

    return () => unsub();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedLeadId || !followUpDate || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const lead = myLeads.find(l => l.id === selectedLeadId);
      await createFollowUp({
         userId: user.uid,
         leadId: selectedLeadId,
         leadName: lead ? lead.companyName : 'Unknown Lead',
         followUpDate: new Date(followUpDate).getTime(),
         reminderNote,
         status: FollowUpStatus.SCHEDULED
      });
      setShowForm(false);
      setReminderNote('');
      setFollowUpDate('');
      setSelectedLeadId('');
    } catch (err) {
      console.error(err);
      alert('Failed to schedule follow up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: FollowUpStatus) => {
     try {
       await updateFollowUpStatus(id, newStatus);
     } catch(err) {
       alert("Failed to update status.");
     }
  };

  const getStatusBadge = (status: FollowUpStatus) => {
      switch(status) {
         case FollowUpStatus.SCHEDULED: return 'bg-blue-100 text-blue-800';
         case FollowUpStatus.COMPLETED: return 'bg-emerald-100 text-emerald-800';
         case FollowUpStatus.MISSED: return 'bg-red-100 text-red-800';
      }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading schedules...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Follow Ups</h1>
          <p className="text-slate-500 mt-2">Manage your calls, meetings, and lead touchpoints.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center"
        >
          {showForm ? 'Cancel' : <><Plus className="w-5 h-5 mr-1" /> Schedule</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
           <h2 className="text-lg font-bold text-slate-900 mb-4">Schedule New Follow Up</h2>
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Related Lead</label>
                 <select 
                   required
                   value={selectedLeadId}
                   onChange={e => setSelectedLeadId(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                 >
                    <option value="">Select a lead...</option>
                    {myLeads.map(l => (
                      <option key={l.id} value={l.id}>{l.companyName} ({l.contactPerson})</option>
                    ))}
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                 <input 
                   required
                   type="datetime-local" 
                   value={followUpDate}
                   onChange={e => setFollowUpDate(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                 />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Reminder Note / Agenda</label>
                 <textarea 
                   value={reminderNote}
                   onChange={e => setReminderNote(e.target.value)}
                   placeholder="e.g. Call to discuss Phase 2 pricing..."
                   rows={2}
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 resize-none"
                 />
              </div>
              <div className="md:col-span-2 flex justify-end">
                 <button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                 >
                   {isSubmitting ? 'Saving...' : 'Save Follow Up'}
                 </button>
              </div>
           </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {followUps.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
             <Calendar className="w-12 h-12 text-slate-300 mb-4" />
             <h3 className="text-lg font-medium text-slate-900">Your schedule is clear</h3>
             <p className="text-slate-500 mt-1">Schedule follow ups to stay on top of your deals.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
             {followUps.map(fu => {
                const isPastDue = fu.status === FollowUpStatus.SCHEDULED && fu.followUpDate < Date.now();
                return (
                  <li key={fu.id} className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-slate-50 transition-colors">
                     <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full mt-1 ${fu.status === FollowUpStatus.COMPLETED ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                           {fu.status === FollowUpStatus.COMPLETED ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 flex items-center gap-2">
                             {fu.leadName || 'Unknown Lead'}
                             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusBadge(fu.status)}`}>
                               {fu.status}
                             </span>
                             {isPastDue && (
                                <span className="flex items-center text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                                   <AlertCircle className="w-3 h-3 mr-1" /> Overdue
                                </span>
                             )}
                           </h4>
                           <p className="text-sm text-slate-500 mt-1 flex items-center">
                              <Calendar className="w-3.5 h-3.5 mr-1" />
                              {new Date(fu.followUpDate).toLocaleString()}
                           </p>
                           {fu.reminderNote && (
                              <p className="text-sm text-slate-700 mt-2 bg-slate-50 p-2 rounded border border-slate-100 inline-block w-full">
                                "{fu.reminderNote}"
                              </p>
                           )}
                        </div>
                     </div>
                     
                     {fu.status === FollowUpStatus.SCHEDULED && (
                        <div className="flex gap-2 w-full sm:w-auto">
                           <button 
                             onClick={() => handleStatusUpdate(fu.id, FollowUpStatus.COMPLETED)}
                             className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                           >
                             <CheckCircle className="w-4 h-4 mr-1.5" /> Done
                           </button>
                           <button 
                             onClick={() => handleStatusUpdate(fu.id, FollowUpStatus.MISSED)}
                             className="flex-1 sm:flex-none px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                           >
                             <XCircle className="w-4 h-4 mr-1.5" /> Missed
                           </button>
                        </div>
                     )}
                  </li>
                );
             })}
          </ul>
        )}
      </div>

    </div>
  );
};
