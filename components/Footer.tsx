import React from 'react';
import { Linkedin, Instagram, Facebook, MapPin, ChevronRight, Twitter, ExternalLink } from 'lucide-react';

interface ThemeProps {
  theme: 'dark' | 'light';
}

export const Footer: React.FC<ThemeProps> = ({ theme }) => {
  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Facebook, label: "Facebook", href: "#" },
  ];

  return (
    <footer id="footer" className={`pt-40 pb-12 relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#080809] text-white' : 'bg-[#1E40AF] text-white'
    }`}>
      {/* Decorative Blur */}
      <div className={`absolute top-[-10%] right-[-5%] w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none ${
        theme === 'dark' ? 'bg-blue-600/5' : 'bg-blue-500/10'
      }`} />
      
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-20 mb-32">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-5 mb-12 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-105 shadow-xl">
                 <div className="w-6 h-6 bg-blue-600 rounded-sm rotate-45" />
              </div>
              <div>
                <span className="text-4xl font-bold tracking-tight font-display block leading-none">Synckraft</span>
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] mt-2 block opacity-60 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-200'
                }`}>Venture Studio Institutional</span>
              </div>
            </div>
            
            <p className="text-blue-50 text-xl leading-relaxed max-w-lg mb-14 font-light opacity-70">
              Architecting the future through institutional execution. We build, launch, and scale the technology platforms that define tomorrow's digital infrastructure.
            </p>
            
            <div className="flex flex-col gap-4">
              <span className="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Direct Correspondence</span>
              <a href="mailto:synckraft.me@gmail.com" className="text-white hover:text-blue-300 transition-all font-bold text-2xl flex items-center gap-3 group">
                synckraft.me@gmail.com <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform text-blue-400" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-8">
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[11px] mb-12 opacity-40">Ecosystem</h4>
            <ul className="space-y-7 text-blue-100 font-bold text-sm tracking-wide">
              <li><a href="https://solaroft.com" target="_blank" className="hover:text-blue-400 flex items-center gap-2 transition-colors">Solaroft Digital <ExternalLink size={14} className="opacity-30" /></a></li>
              <li><a href="#ecosystem" className="hover:text-blue-400 transition-colors">SolveItIndia</a></li>
              <li><a href="#ecosystem" className="hover:text-blue-400 transition-colors">Internal Labs</a></li>
              <li><a href="#pillars" className="hover:text-blue-400 transition-colors">Venture Strategy</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[11px] mb-12 opacity-40">Corporate</h4>
            <ul className="space-y-7 text-blue-100 font-bold text-sm tracking-wide">
              <li><a href="#about" className="hover:text-blue-400 transition-colors">Our DNA</a></li>
              <li><a href="#metrics" className="hover:text-blue-400 transition-colors">Impact & Scale</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Governance</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Venture</a></li>
            </ul>
          </div>
        </div>

        {/* Social Presence Layer */}
        <div className="flex flex-wrap items-center justify-between gap-10 py-12 border-y border-white/5 mb-20">
          <div className="flex items-center gap-10">
            {socialLinks.map((social, i) => (
              <a 
                key={i} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-200 hover:text-white transition-all transform hover:scale-125 hover:-translate-y-1"
                aria-label={social.label}
              >
                <social.icon size={26} strokeWidth={1.5} />
              </a>
            ))}
            <a href="#" className="text-blue-200 hover:text-white transition-all transform hover:scale-125 hover:-translate-y-1">
              <MapPin size={26} strokeWidth={1.5} />
            </a>
          </div>
          <div className="text-blue-400/20 text-[10px] font-black uppercase tracking-[0.6em] hidden lg:block">
            Venture Standard v1.02.2025
          </div>
        </div>

        {/* Executive Bottom Layer */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-16 text-blue-200">
          <div className="max-w-xs">
            <div className="text-[12px] font-bold uppercase tracking-[0.25em] mb-2 text-white">
              Synckraft Technologies
            </div>
            <div className="text-[10px] font-medium opacity-40 leading-relaxed">
              Proprietary Venture Studio. All concepts, code, and frameworks are the intellectual property of Synckraft Technologies © 2025.
            </div>
          </div>
          
          <div className="text-[11px] font-medium opacity-20 uppercase tracking-[0.2em]">
            Institutional Grade Development
          </div>
        </div>
      </div>
    </footer>
  );
};