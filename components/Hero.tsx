import React, { useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Rocket } from 'lucide-react';

interface HeroProps {
  theme: 'dark' | 'light';
}

export const Hero: React.FC<HeroProps> = ({ theme }) => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Small delay to ensure the reveal animation triggers smoothly
    const timer = setTimeout(() => {
      heroRef.current?.classList.add('active');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      className={`relative min-h-[90vh] flex flex-col justify-center items-center pt-24 pb-12 overflow-hidden transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-white'
      }`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        <div className="reveal flex flex-col items-start">
          {/* THE BADGE WITH PULSING DOT */}
          <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6 border transition-all ${
            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-blue-50 border-blue-100'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className={`text-[10px] tracking-[0.3em] font-black uppercase ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Building What Matters
            </span>
          </div>

          <h1 className={`font-black leading-[1.1] ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          } text-[clamp(2.5rem,8vw,4.5rem)]`}> 
            Building <span className="text-blue-500">Scalable</span><br />
            Digital Ventures
          </h1>
          
          <p className="mt-5 text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
            Synckraft Technologies architects, launches, and scales high-potential technology platforms through precision framework execution.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
            <a href="#ecosystem" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 group">
              Explore Our Ventures 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className={`px-8 py-4 rounded-xl border-2 font-bold text-lg transition-all text-center ${
              theme === 'dark' ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-900 hover:bg-slate-50'
            }`}>
              Partner With Us
            </a>
          </div>
        </div>

        {/* RIGHT SIDE VISUAL CARD */}
        <div className="hidden lg:flex justify-end reveal" style={{ transitionDelay: '0.2s' }}>
          <div className={`p-8 rounded-[2rem] border shadow-2xl w-full max-w-md ${
            theme === 'dark' ? 'bg-[#111112] border-white/10' : 'bg-white border-slate-100'
          }`}>
             <div className="flex justify-between items-center mb-10">
                <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-500">
                  <Rocket size={32} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-blue-500 tracking-widest uppercase mb-1">Venture Growth</p>
                   <p className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>9.8x</p>
                </div>
             </div>
             
             <div className="space-y-6">
                {[
                  { label: 'Architecture', val: '85%', color: 'bg-blue-600' },
                  { label: 'Market Execution', val: '72%', color: 'bg-blue-400' }
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>{item.label}</span>
                      <span>{item.val}</span>
                    </div>
                    <div className={`h-2 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                       <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: item.val }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Bounce Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-500 opacity-50">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};