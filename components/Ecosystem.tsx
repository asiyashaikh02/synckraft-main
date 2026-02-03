import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Clock, Globe, Zap, Box, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface ThemeProps {
  theme: 'dark' | 'light';
}

const ventures = [
  { 
    title: "Solaroft", 
    tag: "Green Energy Services",
    description: `From precision installation support and scheduled cleaning to deep system health checks and long-term asset care, Solaroft manages solar systems for homes and businesses end-to-end.

Your solar doesn’t just turn on —
it performs, consistently.`,
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
    <section id="ecosystem" className={`py-24 md:py-40 relative overflow-hidden ${theme === 'dark' ? 'bg-[#080809]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 reveal">
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
        
        <div className="grid lg:grid-cols-3 lg:grid-rows-2 gap-8 items-stretch">
          {ventures.map((venture, index) => (
            <div 
              key={index} 
              className={`group p-8 sm:p-12 rounded-[3.5rem] border transition-transform transition-shadow transition-colors duration-200 ease-out flex flex-col reveal card-glow will-change-transform ${
                // Solaroft: primary, spans left column and two rows on large screens
                venture.title === 'Solaroft'
                ? 'lg:col-span-2 lg:row-span-2 min-h-[460px] lg:min-h-[460px] border-l-4 border-blue-500/20 shadow-2xl'
                : 'min-h-[220px] lg:min-h-[220px] h-full'
              }`}>
              <div className="flex justify-between items-start mb-12">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 ease-out transform-gpu group-hover:-translate-y-1 group-hover:shadow-xl will-change-transform ${
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
                 <h3 className={`text-3xl font-bold mt-1 mb-3 ${venture.title === 'Solaroft' ? 'text-4xl' : ''} transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{venture.title}</h3>
                 {venture.title === 'Solaroft' && (
                   <div className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                     Solar AMC • Cleaning • Maintenance • Efficiency Optimization
                   </div>
                 )}
              </div>
              
              <p className={`text-lg leading-relaxed mb-12 flex-grow font-light ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{venture.description}</p>
              {venture.title === 'Solaroft' && (
                <ul className="mt-2 space-y-2 text-sm font-medium">
                  <li>Trusted by 500+ customers</li>
                  <li>Annual Maintenance Contracts (AMC)</li>
                  <li>Solar cleaning & efficiency optimization</li>
                  <li>Eco-friendly practices</li>
                  <li>Certified solar technicians</li>
                  <li>Up to 30% energy boost</li>
                  <li>Residential & Commercial services</li>
                </ul>
              )}
              
              <div className={`pt-8 border-t mt-auto ${theme === 'dark' ? 'border-white/5' : 'border-slate-50'}`}>
                {venture.isLive ? (
                  <a href={venture.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-500 font-bold text-sm uppercase tracking-[0.15em] group/link transition-colors">
                    Explore Venture <ArrowUpRight size={20} className="transition-transform group-hover/link:-translate-y-1" />
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