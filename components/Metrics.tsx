import React, { useEffect, useState, useRef } from 'react';

interface ThemeProps {
  theme: 'dark' | 'light';
}

const Counter: React.FC<{ end: number; suffix?: string; title: string; theme: string }> = ({ end, suffix = "", title, theme }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setHasStarted(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startValue = 0;
    const duration = 2500;
    const interval = 16;
    const step = (end / duration) * interval;
    
    const timer = setInterval(() => {
      startValue += step;
      if (startValue >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startValue));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [hasStarted, end]);

  return (
    <div ref={ref} className="text-center group reveal py-10">
      <div className={`text-6xl md:text-8xl font-extrabold font-display mb-6 group-hover:text-blue-500 transition-all duration-500 tracking-tighter ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        {count}{suffix}
      </div>
      <div className="w-10 h-1 bg-blue-600 mx-auto mb-8 transform transition-transform group-hover:scale-x-[2.5]" />
      <div className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black">{title}</div>
    </div>
  );
};

export const Metrics: React.FC<ThemeProps> = ({ theme }) => {
  return (
    <section id="metrics" className={`py-44 relative ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <Counter end={100} suffix="+" title="Institutional Projects" theme={theme} />
          <Counter end={15} suffix="+" title="Venture Alliances" theme={theme} />
          <Counter end={6} title="Active Holdings" theme={theme} />
          <Counter end={100} suffix="%" title="Execution Uptime" theme={theme} />
        </div>
      </div>
    </section>
  );
};