import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import { 
  Lead, LeadStatus, Note, ActivityLog, SolarProposal,
  ActivityType
} from '../../types';
import { subscribeToLeadNotes, addNote } from '../../services/noteService';
import { logActivity, subscribeToLeadActivities } from '../../services/activityService';
import { 
  ArrowLeft, Building2, User, Phone, Mail, MapPin, 
  Brain, Send, FileText, Activity, Zap, CheckCircle, Clock
} from 'lucide-react';

const PIPELINE_STAGES = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.NEGOTIATION,
  LeadStatus.CONTRACTED,
  LeadStatus.APPROVED,
  LeadStatus.CONVERTED
];

export const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [proposal, setProposal] = useState<SolarProposal | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    // Subscribe to Lead
    const unsubLead = onSnapshot(doc(db, 'leads', id), (docSnap) => {
      if (docSnap.exists()) {
        const leadData = { id: docSnap.id, ...docSnap.data() } as Lead;
        // Basic permission check (Sales_user can only view their own)
        if (user.role === 'SALES_USER' && leadData.salesUserId !== user.uid) {
           navigate('/sales-dashboard');
           return;
        }
        setLead(leadData);
      } else {
        navigate('/my-leads');
      }
      setLoading(false);
    });

    // Subscribe to Notes
    const unsubNotes = subscribeToLeadNotes(id, setNotes);

    // Subscribe to Activities
    const unsubActivities = subscribeToLeadActivities(id, setActivities);

    // Fetch Proposal (mocking phase 2 details logic - fetching from fake Phase2_details collection if it exists)
    const fetchProposal = async () => {
       try {
         const propSnap = await getDoc(doc(db, 'Phase2_details', id));
         if (propSnap.exists()) {
            setProposal({ id: propSnap.id, ...propSnap.data() } as SolarProposal);
         } else {
            // Provide a dummy proposal for demonstration if none exists yet
            setProposal({
               id: 'dummy', leadId: id, panelCount: 24, panelSizeKw: 12.5, 
               proposalAmount: 25000, finalAmount: 23500, roofArea: 800
            });
         }
       } catch (err) {
           console.error("No proposal found or error fetching");
       }
    };
    fetchProposal();

    return () => {
      unsubLead();
      unsubNotes();
      unsubActivities();
    };
  }, [id, user, navigate]);

  const handleStatusUpdate = async (newStatus: LeadStatus) => {
    if (!lead || !id || !user || lead.status === newStatus || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    
    try {
      const oldStatus = lead.status;
      await updateDoc(doc(db, 'leads', id), {
        status: newStatus,
        updatedAt: Date.now()
      });

       // Log the activity
       await logActivity(
          user.uid,
          ActivityType.STATUS_CHANGE,
          `Changed status from ${oldStatus} to ${newStatus}`,
          { leadId: id }
       );

    } catch (error) {
       console.error("Failed to update status", error);
       alert("Failed to update lead status.");
    } finally {
       setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !id || !user) return;
    
    const text = newNote.trim();
    setNewNote('');
    
    try {
       await addNote(id, user.uid, text);
       await logActivity(
          user.uid,
          ActivityType.NOTE_ADDED,
          `Added a note: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
          { leadId: id }
       );
    } catch (error) {
       console.error("Failed to add note", error);
       setNewNote(text); // revert
    }
  };

  if (loading || !lead) {
      return (
        <div className="p-8 flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      );
  }

  // Calculate Pipeline Progress
  const currentStageIndex = PIPELINE_STAGES.indexOf(lead.status as any);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/my-leads')}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{lead.companyName}</h1>
            <p className="text-slate-500 mt-1 flex items-center">
               <span className="font-mono text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-700 mr-2">
                 #{lead.clientCode || lead.id.substring(0,6)}
               </span>
               Created {new Date(lead.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Quick actions can go here */}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lead Info & Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Pipeline Component */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
             <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
               <Activity className="w-5 h-5 mr-2 text-indigo-500" />
               Sales Pipeline Status
             </h3>
             <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full hidden sm:block z-0"></div>
                <div 
                   className="absolute top-1/2 left-0 h-1 bg-indigo-500 -translate-y-1/2 rounded-full hidden sm:block z-0 transition-all duration-500"
                   style={{ 
                     width: currentStageIndex >= 0 
                       ? `${(currentStageIndex / (PIPELINE_STAGES.length - 1)) * 100}%` 
                       : '0%' 
                   }}
                ></div>

                <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-4 sm:gap-0">
                   {PIPELINE_STAGES.map((stage, idx) => {
                     const isCompleted = currentStageIndex >= idx;
                     const isCurrent = currentStageIndex === idx;
                     const isLost = lead.status === LeadStatus.LOST;

                     let circleColor = 'bg-white border-2 border-slate-300 text-slate-400';
                     let textColor = 'text-slate-400';

                     if (isLost && isCurrent) {
                        circleColor = 'bg-red-500 border-2 border-red-500 text-white';
                        textColor = 'text-red-600 font-bold';
                     } else if (isCurrent) {
                        circleColor = 'bg-indigo-600 border-2 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50';
                        textColor = 'text-indigo-700 font-bold';
                     } else if (isCompleted) {
                        circleColor = 'bg-indigo-500 border-2 border-indigo-500 text-white';
                        textColor = 'text-slate-700 font-medium';
                     }
                     
                     return (
                       <div key={stage} className="flex flex-row sm:flex-col items-center sm:w-24 group relative">
                          <button
                             disabled={isUpdatingStatus || isLost}
                             onClick={() => handleStatusUpdate(stage)}
                             className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-10 hover:scale-110 ${circleColor} ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                             title={`Move to ${stage}`}
                          >
                             {isCompleted ? <CheckCircle className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-current"></div>}
                          </button>
                          <span className={`mt-0 sm:mt-3 ml-4 sm:ml-0 text-xs text-center uppercase tracking-wider ${textColor}`}>
                            {stage}
                          </span>
                       </div>
                     );
                   })}
                   
                   {/* Explicit Lost Button Trigger */}
                   {lead.status !== LeadStatus.LOST && lead.status !== LeadStatus.CONVERTED && (
                      <div className="flex flex-row sm:flex-col items-center sm:w-24">
                          <button
                            onClick={() => {
                               if (window.confirm('Are you sure you want to mark this lead as Lost?')) {
                                   handleStatusUpdate(LeadStatus.LOST);
                               }
                            }}
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white border-2 border-red-200 text-red-400 hover:bg-red-50 hover:border-red-400 hover:text-red-500"
                            title="Mark as Lost"
                          >
                             <div className="w-3 h-3 rounded-full bg-current"></div>
                          </button>
                          <span className="mt-0 sm:mt-3 ml-4 sm:ml-0 text-xs text-center uppercase tracking-wider text-red-400">Mark Lost</span>
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-500" />
              Lead Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Contact Person</p>
                    <div className="flex items-center text-slate-900 font-medium">
                      <User className="w-4 h-4 mr-2 text-slate-400" />
                      {lead.contactPerson}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company</p>
                    <div className="flex items-center text-slate-900 font-medium">
                      <Building2 className="w-4 h-4 mr-2 text-slate-400" />
                      {lead.companyName}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</p>
                    <div className="flex items-center text-slate-900 font-medium">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" />
                      {lead.phone}
                    </div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                    <div className="flex items-center text-slate-900 font-medium">
                      <Mail className="w-4 h-4 mr-2 text-slate-400" />
                      {lead.email}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Location / City</p>
                    <div className="flex items-center text-slate-900 font-medium">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {lead.city || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">AI Score Priority</p>
                    <div className="flex items-center font-bold">
                      <Brain className={`w-4 h-4 mr-2 ${lead.aiScore && lead.aiScore >= 80 ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <span className={lead.aiScore && lead.aiScore >= 80 ? 'text-emerald-600' : 'text-slate-700'}>
                        {lead.aiScore ? `${lead.aiScore}/100` : 'Not Scored'}
                      </span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                Notes History
             </h3>
             <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 custom-scrollbar">
                {notes.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                     <FileText className="w-8 h-8 opacity-20 mb-2" />
                     No notes recorded yet.
                  </div>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                       <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{note.note}</p>
                       <p className="text-xs text-slate-400 mt-2 font-medium">
                         {new Date(note.createdAt).toLocaleString()}
                       </p>
                    </div>
                  ))
                )}
             </div>
             
             <form onSubmit={handleAddNote} className="relative mt-auto">
                <textarea
                   value={newNote}
                   onChange={(e) => setNewNote(e.target.value)}
                   placeholder="Type a note here..."
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                   rows={2}
                   required
                />
                <button 
                  type="submit"
                  disabled={!newNote.trim()}
                  className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                   <Send className="w-4 h-4" />
                </button>
             </form>
          </div>

        </div>

        {/* Right Column: Proposals & Activity */}
        <div className="space-y-6">
           
           {/* Solar Proposal Widget */}
           <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
              <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-indigo-500/10" />
              <h3 className="text-lg font-bold mb-4 flex items-center relative z-10">
                 <Zap className="w-5 h-5 mr-2 text-amber-400" />
                 Solar Proposal
              </h3>
              
              {proposal ? (
                 <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                       <span className="text-sm text-indigo-200">System Size</span>
                       <span className="font-bold">{proposal.panelSizeKw} kW</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                       <span className="text-sm text-indigo-200">Panel Qty</span>
                       <span className="font-bold">{proposal.panelCount} units</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                       <span className="text-sm text-indigo-200">Roof Area</span>
                       <span className="font-bold">{proposal.roofArea} sq ft</span>
                    </div>
                    <div className="pt-2 border-t border-indigo-500/30 flex justify-between items-center">
                       <span className="text-sm text-indigo-200">Total Value</span>
                       <span className="text-xl font-black text-amber-400">${proposal.finalAmount.toLocaleString()}</span>
                    </div>
                 </div>
              ) : (
                 <div className="py-8 text-center text-indigo-200/60 text-sm relative z-10">
                    No proposal generated yet.
                 </div>
              )}
           </div>

           {/* Activity Timeline */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
             <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                Activity Timeline
             </h3>
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {activities.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                     No activity recorded.
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                     {activities.map((activity) => {
                       let Icon = Activity;
                       let iconBg = 'bg-slate-100 text-slate-500';
                       
                       switch(activity.type) {
                         case ActivityType.CALL: Icon = Phone; iconBg = 'bg-blue-100 text-blue-600'; break;
                         case ActivityType.NOTE_ADDED: Icon = FileText; iconBg = 'bg-purple-100 text-purple-600'; break;
                         case ActivityType.STATUS_CHANGE: Icon = Zap; iconBg = 'bg-amber-100 text-amber-600'; break;
                         case ActivityType.PROPOSAL_GENERATED: Icon = Zap; iconBg = 'bg-indigo-100 text-indigo-600'; break;
                       }

                       return (
                         <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                             <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${iconBg} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                               <Icon className="w-4 h-4" />
                             </div>
                             <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                               <div className="flex items-center justify-between mb-1">
                                 <span className="font-bold text-sm text-slate-900">{activity.type.replace('_', ' ')}</span>
                                 <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {new Date(activity.createdAt).toLocaleDateString()}
                                 </span>
                               </div>
                               <p className="text-xs text-slate-600 leading-snug">{activity.description}</p>
                             </div>
                         </div>
                       );
                     })}
                  </div>
                )}
             </div>
           </div>

        </div>

      </div>
    </div>
  );
};
