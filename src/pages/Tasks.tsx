import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { Task, TaskStatus, TaskPriority, Lead } from '../../types';
import { subscribeToUserTasks, createTask, updateTaskStatus } from '../../services/taskService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { CheckSquare, Clock, CheckCircle, AlertCircle, Plus, Calendar } from 'lucide-react';

export const Tasks = () => {
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [myLeads, setMyLeads] = useState<Lead[]>([]);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsub = subscribeToUserTasks(user.uid, (data) => {
      setTasks(data);
      setLoading(false);
    });

    // Fetch leads for relation dropdown
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
    if (!user || !title || !dueDate || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await createTask({
         userId: user.uid,
         title,
         relatedLeadId: selectedLeadId || undefined,
         dueDate: new Date(dueDate).getTime(),
         priority,
         status: TaskStatus.PENDING
      });
      setShowForm(false);
      setTitle('');
      setDueDate('');
      setPriority(TaskPriority.MEDIUM);
      setSelectedLeadId('');
    } catch (err) {
      console.error(err);
      alert('Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: TaskStatus) => {
     try {
       await updateTaskStatus(id, newStatus);
     } catch(err) {
       alert("Failed to update status.");
     }
  };

  const getPriorityColor = (p: TaskPriority) => {
      switch(p) {
          case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
          case 'MEDIUM': return 'text-orange-600 bg-orange-50 border-orange-200';
          case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
          default: return 'text-slate-600 bg-slate-50 border-slate-200';
      }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading tasks...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tasks</h1>
          <p className="text-slate-500 mt-2">Track to-dos and priorities for your pipeline.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center"
        >
          {showForm ? 'Cancel' : <><Plus className="w-5 h-5 mr-1" /> New Task</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
           <h2 className="text-lg font-bold text-slate-900 mb-4">Create New Task</h2>
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                 <input 
                   required
                   type="text"
                   value={title}
                   onChange={e => setTitle(e.target.value)}
                   placeholder="e.g. Prepare tailored proposal..."
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Related Lead (Optional)</label>
                 <select 
                   value={selectedLeadId}
                   onChange={e => setSelectedLeadId(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                 >
                    <option value="">None</option>
                    {myLeads.map(l => (
                      <option key={l.id} value={l.id}>{l.companyName}</option>
                    ))}
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                 <select 
                   value={priority}
                   onChange={e => setPriority(e.target.value as TaskPriority)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                 >
                    <option value={TaskPriority.LOW}>Low</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.HIGH}>High</option>
                 </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                 <input 
                   required
                   type="date" 
                   value={dueDate}
                   onChange={e => setDueDate(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                 />
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                 <button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                 >
                   {isSubmitting ? 'Saving...' : 'Save Task'}
                 </button>
              </div>
           </form>
        </div>
      )}

      {/* Kanban-ish Board or List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         {/* Pending Column */}
         <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center uppercase tracking-wider text-xs">
               <Clock className="w-4 h-4 mr-2" /> Pending
            </h3>
            <div className="space-y-3">
               {tasks.filter(t => t.status === TaskStatus.PENDING).map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                     <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(task.priority)} mb-2 inline-block`}>
                        {task.priority}
                     </span>
                     <h4 className="font-medium text-slate-900 text-sm leading-snug">{task.title}</h4>
                     
                     {task.relatedLeadId && (
                        <p className="text-xs text-indigo-600 mt-2 font-medium">
                           {myLeads.find(l => l.id === task.relatedLeadId)?.companyName || 'Unknown Lead'}
                        </p>
                     )}
                     
                     <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                        <span className="text-slate-500 flex items-center">
                           <Calendar className="w-3 h-3 mr-1" />
                           {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={() => handleStatusUpdate(task.id, TaskStatus.IN_PROGRESS)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                          Start →
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* In Progress Column */}
         <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100">
            <h3 className="font-bold text-indigo-800 mb-4 flex items-center uppercase tracking-wider text-xs">
               <AlertCircle className="w-4 h-4 mr-2 text-indigo-500" /> In Progress
            </h3>
            <div className="space-y-3">
               {tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm border-l-4 border-l-indigo-500">
                     <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(task.priority)} mb-2 inline-block`}>
                        {task.priority}
                     </span>
                     <h4 className="font-medium text-slate-900 text-sm leading-snug">{task.title}</h4>
                     
                     <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                        <span className="text-slate-500 flex items-center">
                           <Calendar className="w-3 h-3 mr-1" />
                           {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={() => handleStatusUpdate(task.id, TaskStatus.COMPLETED)}
                          className="text-emerald-600 hover:text-emerald-800 font-semibold flex items-center"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> Done
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Completed Column */}
         <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 opacity-75">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center uppercase tracking-wider text-xs">
               <CheckSquare className="w-4 h-4 mr-2" /> Completed
            </h3>
            <div className="space-y-3">
               {tasks.filter(t => t.status === TaskStatus.COMPLETED).map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                     <h4 className="font-medium text-slate-500 line-through text-sm leading-snug">{task.title}</h4>
                     <div className="mt-3 flex items-center text-xs pt-3 border-t border-slate-100 text-slate-400">
                        <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                        Completed
                     </div>
                  </div>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
};
