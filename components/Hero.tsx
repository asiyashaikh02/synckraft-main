import React, { useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Rocket, Layers, Cpu } from 'lucide-react';

interface HeroProps {
  theme: 'dark' | 'light';
}

export const Hero: React.FC<HeroProps> = ({ theme }) => {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Trigger first-screen staggered animation on mount (mobile-first)
    const el = heroRef.current;
    if (!el) return;
    // small delay to allow paint, then add active to trigger CSS transitions
    requestAnimationFrame(() => setTimeout(() => el.classList.add('active'), 40));
  }, []);

  return (
    <section ref={heroRef} className={`hero-animate relative min-h-[95vh] flex flex-col justify-center overflow-hidden pt-20 ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-white'}`}>
      {/* Background Orbs */}
      <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] left-[5%] w-72 h-72 bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="reveal">
          <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-[0.25em] uppercase mb-10 ${
            theme === 'dark' ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            Venture Studio Institutional Standard
          </div>
          
          <h1 className={`h-title text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05] ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Building <br />
            <span className="text-blue-600">Scalable</span> <br />
            Digital Ventures
          </h1>
          
          <p className={`h-sub text-xl md:text-2xl max-w-xl mb-14 leading-relaxed font-light ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Synckraft Technologies architects, launches, and scales high-potential technology platforms through precision framework execution.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <a href="#ecosystem" className="h-cta group px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 w-full sm:w-auto text-center touchable force-full-mobile">
              Explore Our Ventures <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className={`h-cta px-10 py-5 rounded-2xl border-2 font-bold text-lg transition-all text-center hover:-translate-y-1 w-full sm:w-auto ${
              theme === 'dark' ? 'border-white/10 hover:bg-white/5 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-900'
            } touchable force-full-mobile`}>
              Partner With Us
            </a>
          </div>
        </div>

        <div className="hidden lg:flex justify-center items-center reveal" style={{ transitionDelay: '0.2s' }}>
          <div className="relative w-full max-w-xl aspect-square">
            <div className={`absolute inset-0 rounded-[5rem] rotate-3 transform scale-105 ${theme === 'dark' ? 'bg-blue-600/5' : 'bg-blue-600/5'}`} />
            <div className={`absolute inset-0 border rounded-[5rem] shadow-2xl flex items-center justify-center overflow-hidden animate-float ${
              theme === 'dark' ? 'bg-[#111112] border-white/5' : 'bg-white border-slate-100'
            }`}>
               <div className="relative w-full h-full p-16 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-600 shadow-inner">
                        <Rocket size={38} />
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">Scale Index</p>
                        <p className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>9.8</p>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {[
                      { label: "Architecture", val: "92%", color: "bg-blue-600" },
                      { label: "Execution", val: "88%", color: "bg-blue-400" }
                    ].map(bar => (
                      <div key={bar.label} className="space-y-3">
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>{bar.label}</span>
                            <span>{bar.val}</span>
                         </div>
                         <div className={`h-2.5 w-full rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                            <div className={`h-full ${bar.color} rounded-full transition-all duration-1000`} style={{ width: bar.val }} />
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end justify-between">
                     <div className="flex -space-x-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-blue-500 font-bold text-sm shadow-sm ${
                            theme === 'dark' ? 'border-[#111112] bg-white/5' : 'border-white bg-slate-50'
                          }`}>
                            V{i}
                          </div>
                        ))}
                     </div>
                     <div className="w-20 h-20 rounded-full bg-blue-600/10 flex items-center justify-center relative">
                        <Cpu size={36} className="text-blue-500" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 reveal ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>
        <ChevronDown size={32} />
      </div>
    </section>
  );
};