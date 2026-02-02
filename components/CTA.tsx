import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';

interface ThemeProps {
  theme: 'dark' | 'light';
}

export const CTA: React.FC<ThemeProps> = ({ theme }) => {
  return (
    <section id="cta" className={`py-24 md:py-40 relative ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-8 relative">
        <div className={`relative rounded-[4rem] overflow-hidden p-8 sm:p-12 md:p-24 text-center reveal elev-3 ${
          theme === 'dark' ? 'bg-blue-600 shadow-blue-900/20' : 'bg-blue-600 shadow-blue-100'
        }`}>
          {/* Visual Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white blur-[120px] rounded-full" />
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400 blur-[120px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-extrabold mb-10 tracking-tight leading-tight text-white">
              Have an Idea <br /> Worth <span className="text-blue-100 italic">Scaling?</span>
            </h2>
            <p className="text-xl text-blue-50 mb-14 leading-relaxed opacity-90 font-light">
              Let's turn it into a structured, scalable business. Our incubation engine is designed to deploy institutional-grade strategy and tech.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
               <a href="mailto:grow@synckraft.in" className="group px-8 py-5 rounded-2xl bg-white text-blue-600 font-bold text-xl transition-all flex items-center gap-3 hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto justify-center text-center touchable">
                 Start a Conversation <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
               </a>
               <div className="flex items-center gap-3 text-blue-100 font-bold text-lg">
                  <Mail size={24} className="text-blue-200" />
                  grow@synckraft.in
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};