import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { Note, Lead } from '../../types';
import { collection, getDocs, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { FileText, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState<(Note & { leadName?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // 1. Fetch user's leads to map names
    const fetchLeadsAndNotes = async () => {
       const qLeads = query(collection(db, 'leads'), where('salesUserId', '==', user.uid));
       const leadSnap = await getDocs(qLeads);
       const leadMap = new Map<string, string>();
       leadSnap.forEach(doc => {
           leadMap.set(doc.id, doc.data().companyName);
       });

       // 2. Fetch all notes by this user
       const qNotes = query(collection(db, 'Lead_Notes'), where('userId', '==', user.uid));
       
       const unsub = onSnapshot(qNotes, (snapshot) => {
          const fetchedNotes: (Note & { leadName?: string })[] = [];
          snapshot.forEach(doc => {
              const data = doc.data() as Note;
              fetchedNotes.push({
                 id: doc.id,
                 ...data,
                 leadName: leadMap.get(data.leadId) || 'Unknown Lead'
              });
          });
          // sort descending by date manually if composite index is absent
          fetchedNotes.sort((a,b) => b.createdAt - a.createdAt);
          setNotes(fetchedNotes);
          setLoading(false);
       });

       return unsub;
    };

    let unsubscribe: any;
    fetchLeadsAndNotes().then(unsub => { unsubscribe = unsub; });

    return () => {
        if (unsubscribe) unsubscribe();
    };
  }, [user]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading notes...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Notes</h1>
          <p className="text-slate-500 mt-2">Global timeline of all notes you've written.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[600px]">
        {notes.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
              <FileText className="w-12 h-12 mb-4 opacity-50 text-indigo-300" />
              <p className="text-lg font-medium text-slate-900">No notes found.</p>
              <p className="text-sm">Start adding notes to your leads and they will appear here.</p>
           </div>
        ) : (
           <div className="space-y-6">
              {notes.map(note => (
                 <div key={note.id} className="group relative bg-slate-50 border border-slate-100 rounded-xl p-5 hover:border-indigo-100 hover:bg-slate-50/50 transition-all">
                    <div className="flex justify-between items-start mb-3">
                       <h3 className="font-bold text-slate-800 text-sm flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                          {note.leadName}
                       </h3>
                       <span className="text-xs font-semibold text-slate-400 flex items-center bg-white px-2 py-1 rounded shadow-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(note.createdAt).toLocaleString()}
                       </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                       {note.note}
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-200/50 flex justify-end">
                       <button 
                         onClick={() => navigate(`/leads/${note.leadId}`)}
                         className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center transition-colors px-3 py-1.5 rounded-md hover:bg-indigo-50"
                       >
                          Go to Lead <ArrowRight className="w-3.5 h-3.5 ml-1" />
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};
