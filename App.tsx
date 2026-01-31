import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Pillars } from './components/Pillars';
import { Ecosystem } from './components/Ecosystem';
import { Metrics } from './components/Metrics';
import { Testimonials } from './components/Testimonials';
import { ContactForm } from './components/ContactForm';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Reveal animation logic via IntersectionObserver (better performance)
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const reveals = Array.from(document.querySelectorAll('.reveal')) as HTMLElement[];
    if (prefersReduced) {
      // Respect reduced motion: activate all reveals immediately
      reveals.forEach((el) => el.classList.add('active'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add('active');
          obs.unobserve(el);
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.06 });

    reveals.forEach((el) => observer.observe(el));

    // Persist theme
    const savedTheme = localStorage.getItem('synckraft-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    } else {
      document.body.className = 'dark';
    }

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('synckraft-theme', newTheme);
    document.body.className = newTheme;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A0A0B] text-slate-100' : 'bg-white text-slate-900'} selection:bg-blue-600/20`}>
      <header>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
      </header>
      <main role="main">
        <Hero theme={theme} />
        <About theme={theme} />
        <Pillars theme={theme} />
        <Ecosystem theme={theme} />
        <Metrics theme={theme} />
        <Testimonials />
        <ContactForm theme={theme} />
        <CTA theme={theme} />
      </main>
      <Footer theme={theme} />
    </div>
  );
}