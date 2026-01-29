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
    // Reveal animation logic
    const reveal = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', reveal);
    reveal();

    // Persist theme
    const savedTheme = localStorage.getItem('synckraft-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme;
    } else {
      document.body.className = 'dark';
    }

    return () => window.removeEventListener('scroll', reveal);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('synckraft-theme', newTheme);
    document.body.className = newTheme;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0A0A0B] text-slate-100' : 'bg-white text-slate-900'} selection:bg-blue-600/20`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
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