import React from 'react';
import { Rocket, Layers, TrendingUp, ChevronRight } from 'lucide-react';

interface ThemeProps {
  theme: 'dark' | 'light';
}

const pillarData = [
  {
    title: 'Venture Incubation',
    description: 'We take high-potential concepts from zero to institutional scale, providing deep strategy and capital execution.',
    icon: Rocket,
  },
  {
    title: 'Platform Holdings',
    description: 'Proprietary software, SaaS, and digital infrastructure built for global distribution and resilience.',
    icon: Layers,
  },
  {
    title: 'Operational Logic',
    description: 'Go-to-market frameworks and institutional systems designed for high-velocity, predictable expansion.',
    icon: TrendingUp,
  },
];

export const Pillars: React.FC<ThemeProps> = ({ theme }) => {
  return (
    <section id="pillars" className={`py-40 ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-28 reveal">
          <h4 className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-8">Our Core Framework</h4>
          <h2 className={`text-4xl md:text-6xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Strategic Execution Pillars</h2>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-10">
          {pillarData.map((pillar, index) => (
            <div key={index} className={`group p-12 rounded-[3rem] border transition-all duration-500 hover:-translate-y-2 reveal card-glow ${
              theme === 'dark' ? 'bg-[#111112] border-white/5 hover:border-blue-500/30' : 'bg-white border-slate-100 hover:border-blue-600/30'
            }`} style={{ transitionDelay: `${index * 0.1}s` }}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:rotate-6 ${
                theme === 'dark' ? 'bg-blue-600/10 text-blue-500' : 'bg-blue-50 text-blue-600'
              }`}>
                <pillar.icon size={32} />
              </div>
              <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{pillar.title}</h3>
              <p className={`text-lg leading-relaxed mb-10 font-light ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{pillar.description}</p>
              
              <div className="flex items-center gap-2 text-blue-500 font-bold text-sm uppercase tracking-widest cursor-pointer hover:gap-3 transition-all group-hover:text-blue-400">
                Explore Logic <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};