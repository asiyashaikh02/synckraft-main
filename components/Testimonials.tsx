
import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    text: "Synckraft helped us transform an idea into a scalable digital system. Their strategic depth is what sets them apart from typical development firms.",
    author: "Founder",
    location: "Logistics Startup, Mumbai"
  },
  {
    text: "Working with the Synckraft team has been a masterclass in execution. They don't just build software; they build business models that work.",
    author: "Director",
    location: "EdTech Platform, Pune"
  }
];

export const Testimonials: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 bg-white border-y border-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <div className="text-center mb-16 reveal">
          <h4 className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">Testimonials</h4>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trusted by Visionaries</h2>
        </div>
        
        <div className="relative reveal">
          <div className="p-12 md:p-16 rounded-[3rem] bg-blue-50/30 border border-blue-100 text-center relative">
             <Quote className="text-blue-200 absolute top-10 left-10" size={48} />
             <div className="min-h-[140px] flex flex-col justify-center items-center">
                <p className="text-xl md:text-2xl text-slate-700 italic leading-relaxed mb-10 transition-all duration-500">
                  "{testimonials[index].text}"
                </p>
                <div>
                   <p className="font-bold text-slate-900">{testimonials[index].author}</p>
                   <p className="text-sm text-slate-400 uppercase tracking-widest font-medium mt-1">{testimonials[index].location}</p>
                </div>
             </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-10">
            <button 
              onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2 items-center">
               {testimonials.map((_, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-blue-600 w-6' : 'bg-blue-100'}`} />
               ))}
            </div>
            <button 
              onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
              className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
