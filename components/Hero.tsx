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
    <section
      ref={heroRef}
      className={`hero-animate relative w-full overflow-hidden pt-[calc(var(--header-height)+56px)] sm:pt-[calc(var(--header-height)+64px)] md:pt-[calc(var(--header-height)+72px)] lg:pt-[calc(var(--header-height)+88px)] pb-[120px] ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-white'}`}
    >

      <div className="max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2 gap-16 items-start relative z-10">
        <div className="reveal">
          <h1 className={`mt-5 font-extrabold leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'} text-[clamp(2.25rem,6vw,4.25rem)]`}> 
            Building <span className="text-blue-500">Scalable</span><br />
            Digital Ventures
          </h1>
          
          <p className={`mt-5 text-sm sm:text-base text-gray-400 max-w-xl`}>
            Synckraft Technologies architects, launches, and scales high-potential technology platforms through precision framework execution.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <a href="#ecosystem" className="px-8 py-4 rounded-[12px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all flex items-center justify-center gap-3 w-full sm:w-auto touchable">
              Explore Our Ventures <ArrowRight size={20} className="ml-1" />
            </a>
            <a href="#contact" className={`px-8 py-4 rounded-[12px] border-2 font-bold text-lg transition-all text-center w-full sm:w-auto ${
                theme === 'dark' ? 'border-white/10 bg-transparent text-white hover:bg-white/5' : 'border-slate-200 bg-transparent text-slate-900 hover:bg-slate-50'
              } touchable`}>
              Partner With Us
            </a>
          </div>
        </div>

        <div className="hidden lg:flex justify-center items-center reveal" style={{ transitionDelay: '0.2s' }}>
          <div className="w-full max-w-xl">
            <div className={`rounded-[1.25rem] border shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-[#111112] border-white/5' : 'bg-white border-slate-100'}`}>
               <div className="w-full h-full p-8 flex flex-col justify-between">
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
                      { label: 'Architecture', val: '92%', color: 'bg-blue-600' },
                      { label: 'Execution', val: '88%', color: 'bg-blue-400' },
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

      <div className={`relative mt-8 reveal ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>
        <ChevronDown size={32} />
      </div>
    </section>
  );
};