import React from 'react';
import { Target, ShieldCheck, Cpu, Zap } from 'lucide-react';

interface ThemeProps {
  theme: 'dark' | 'light';
}

export const About: React.FC<ThemeProps> = ({ theme }) => {
  return (
    <section id="about" className={`py-24 md:py-40 relative overflow-hidden ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="reveal">
            <h4 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-8">Our DNA</h4>
            <h2 className={`text-4xl md:text-6xl font-extrabold mb-10 leading-tight tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Foundation with intent <br />
              <span className="text-slate-500 font-light italic">Small start. Solid core.</span>
            </h2>
            <p className={`text-xl leading-relaxed mb-12 max-w-xl font-light ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Synckraft is a strategic holding company. We don't just deliver products — we build structured, scalable, and sustainable digital systems.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-10">
               <div className="group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    theme === 'dark' ? 'bg-white/5 text-blue-500 group-hover:bg-blue-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                  }`}>
                    <Cpu size={24} />
                  </div>
                  <h4 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Architecture First</h4>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Engineered for lasting performance and longevity.</p>
               </div>
               <div className="group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    theme === 'dark' ? 'bg-white/5 text-blue-500 group-hover:bg-blue-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                  }`}>
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Holding Strategy</h4>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Every venture is a proprietary asset in our portfolio.</p>
               </div>
            </div>
          </div>

          <div className="relative reveal lg:pl-12" style={{ transitionDelay: '0.2s' }}>
            <div className={`aspect-square rounded-[4rem] overflow-hidden flex items-center justify-center relative group border ${
              theme === 'dark' ? 'bg-[#111112] border-white/5' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap size={400} className="text-blue-600" />
              </div>
              <div className="relative z-10 p-12 text-center">
                 <div className="w-24 h-24 rounded-[2rem] bg-blue-600 flex items-center justify-center mx-auto mb-10 shadow-2xl">
                    <Target size={44} className="text-white" />
                 </div>
                 <p className={`text-3xl font-bold italic leading-snug tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                   "Building the systems <br /> that redefine growth."
                 </p>
              </div>
            </div>
            
            {/* Visual Accents */}
            <div className={`absolute -bottom-8 -right-8 w-40 h-40 bg-blue-600/5 blur-3xl rounded-full -z-10`} />
          </div>
        </div>
      </div>
    </section>
  );
};