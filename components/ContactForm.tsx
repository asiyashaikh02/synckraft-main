import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

interface ContactFormProps {
  theme: 'dark' | 'light';
}

export const ContactForm: React.FC<ContactFormProps> = ({ theme }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  if (status === 'success') {
    return (
      <section id="contact" className={`py-20 flex items-center justify-center ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-white'}`}>
        <div className="max-w-xl w-full px-8 text-center reveal active">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600/10 text-blue-500 mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Message Received</h2>
          <p className={`text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Thank you for reaching out. A Synckraft representative will review your query and respond shortly.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-8 px-8 py-3 rounded-xl bg-blue-600 text-white font-bold transition-all hover:bg-blue-700"
          >
            Send Another Message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className={`py-24 md:py-40 relative overflow-hidden ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="reveal">
            <h4 className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-8">Get In Touch</h4>
            <h2 className={`text-4xl md:text-6xl font-extrabold mb-10 tracking-tight leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Partner With <br />
              <span className="text-blue-600 font-light italic">Synckraft</span>
            </h2>
            <p className={`text-xl leading-relaxed mb-12 max-w-md font-light ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Have a high-potential project or a strategic proposal? Let's discuss how Synckraft can provide the execution framework you need.
            </p>
            
            <div className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-blue-50 border-blue-100'}`}>
              <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Quick Response</p>
              <p className={`text-lg font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Our average response time for strategic queries is under 24 hours.</p>
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className={`p-6 sm:p-10 rounded-[3rem] border shadow-2xl ${
              theme === 'dark' ? 'bg-[#111112] border-white/5 shadow-blue-900/10' : 'bg-white border-slate-100'
            }`}>
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label htmlFor="name" className={`text-xs font-bold uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Full Name</label>
                  <input 
                    required
                    type="text" 
                    id="name"
                    placeholder="Enter your name"
                    className={`w-full px-6 py-4 rounded-2xl outline-none transition-all border ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-blue-500 focus:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className={`text-xs font-bold uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Email Address</label>
                  <input 
                    required
                    type="email" 
                    id="email"
                    placeholder="name@company.com"
                    className={`w-full px-6 py-4 rounded-2xl outline-none transition-all border ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-blue-500 focus:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label htmlFor="subject" className={`text-xs font-bold uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Subject</label>
                <select 
                  id="subject"
                  className={`w-full px-6 py-4 rounded-2xl outline-none transition-all border appearance-none ${
                    theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                  }`}
                >
                  <option value="venture">Venture Proposal</option>
                  <option value="partnership">Strategic Partnership</option>
                  <option value="investment">Investment Inquiry</option>
                  <option value="other">Other Query</option>
                </select>
              </div>

              <div className="space-y-2 mb-10">
                <label htmlFor="message" className={`text-xs font-bold uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Your Message</label>
                <textarea 
                  required
                  id="message"
                  rows={4}
                  placeholder="Describe your proposal or query..."
                  className={`w-full px-6 py-4 rounded-2xl outline-none transition-all border resize-none ${
                    theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-blue-500 focus:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white'
                  }`}
                ></textarea>
              </div>

              <button 
                disabled={status === 'submitting'}
                type="submit" 
                className={`w-full py-5 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center gap-3 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50`}
              >
                {status === 'submitting' ? 'Processing...' : 'Submit Inquiry'}
                <Send size={20} className={status === 'submitting' ? 'animate-pulse' : ''} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};