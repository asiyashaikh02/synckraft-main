import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Clock, Globe, Zap, Box, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface ThemeProps {
  theme: 'dark' | 'light';
}

const ventures = [
  { 
    title: "Solaroft", 
    tag: "Software Engineering",
    description: "Our primary technology flagship delivering bespoke enterprise automation and full-stack digital transformations.",
    status: "Active Portfolio",
    isLive: true,
    link: "https://solaroft.com",
    icon: <Globe size={28} />
  },
  { 
    title: "SolveItIndia", 
    tag: "Marketplace",
    description: "An institutional-scale logistics marketplace redesigning delivery ecosystems in Tier-2 Indian cities.",
    status: "Upcoming Venture",
    isLive: false,
    link: "#",
    icon: <Zap size={28} />
  },
  { 
    title: "Internal Labs", 
    tag: "Proprietary SaaS",
    description: "Incubating next-gen internal SaaS tools and AI-driven business architecture modules in stealth.",
    status: "In Development",
    isLive: false,
    link: "#",
    icon: <LayoutGrid size={28} />
  }
];

export const Ecosystem: React.FC<ThemeProps> = ({ theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ventures.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="ecosystem" className={`py-40 relative overflow-hidden ${theme === 'dark' ? 'bg-[#080809]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-28 reveal">
          <div className="max-w-2xl">
            <h4 className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-8">Venture Ecosystem</h4>
            <h2 className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Institutional <br />Holdings</h2>
            <p className={`text-xl font-light leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Synckraft architects a diverse portfolio of specialized digital platforms designed for massive scale and disruption.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + ventures.length) % ventures.length)}
              className={`w-14 h-14 rounded-2xl border transition-all flex items-center justify-center ${
                theme === 'dark' ? 'bg-white/5 border-white/5 text-slate-500 hover:text-blue-500 hover:border-blue-500' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 shadow-md'
              }`}
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % ventures.length)}
              className={`w-14 h-14 rounded-2xl border transition-all flex items-center justify-center ${
                theme === 'dark' ? 'bg-white/5 border-white/5 text-slate-500 hover:text-blue-500 hover:border-blue-500' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-600 shadow-md'
              }`}
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-10">
          {ventures.map((venture, index) => (
            <div 
              key={index} 
              className={`group p-12 rounded-[3.5rem] border transition-all duration-700 h-full flex flex-col reveal card-glow ${
                index === currentIndex 
                ? (theme === 'dark' ? 'bg-[#111112] border-blue-600/50 shadow-2xl' : 'bg-white border-blue-600 shadow-2xl') 
                : (theme === 'dark' ? 'bg-[#0C0C0D] border-white/5' : 'bg-white border-transparent shadow-sm')
              }`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div className="flex justify-between items-start mb-12">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6 ${
                  venture.isLive ? 'bg-blue-600 text-white' : (theme === 'dark' ? 'bg-white/5 text-slate-600' : 'bg-slate-50 text-slate-300')
                }`}>
                  {venture.icon}
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                  venture.isLive 
                  ? 'bg-blue-600/10 text-blue-500 border-blue-500/20' 
                  : 'bg-white/5 text-slate-500 border-white/5'
                }`}>
                  {venture.status}
                </div>
              </div>
              
              <div className="mb-4">
                 <span className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest">{venture.tag}</span>
                 <h3 className={`text-3xl font-bold mt-1 mb-6 group-hover:text-blue-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{venture.title}</h3>
              </div>
              
              <p className={`text-lg leading-relaxed mb-12 flex-grow font-light ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{venture.description}</p>
              
              <div className={`pt-8 border-t mt-auto ${theme === 'dark' ? 'border-white/5' : 'border-slate-50'}`}>
                {venture.isLive ? (
                  <a href={venture.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-500 font-bold text-sm uppercase tracking-[0.15em] group/link">
                    Explore Venture <ArrowUpRight size={20} className="transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                  </a>
                ) : (
                  <div className="flex items-center gap-3 text-slate-600 font-bold text-sm uppercase tracking-[0.15em] italic">
                    <Clock size={20} /> Incubation
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};