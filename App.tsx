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
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      if (typeof window === 'undefined') return 'dark';
      return (localStorage.getItem('theme') || localStorage.getItem('synckraft-theme') || 'dark') as 'dark' | 'light';
    } catch (e) {
      return 'dark';
    }
  });

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

    // Ensure theme is synced from storage and applied to the root element
    try {
      const savedTheme = (localStorage.getItem('theme') || localStorage.getItem('synckraft-theme') || 'dark') as 'dark' | 'light';
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      // keep body in sync as some legacy CSS uses body.dark
      if (document.body) document.body.classList.toggle('dark', savedTheme === 'dark');
      setTheme(savedTheme);
    } catch (e) {
      document.documentElement.classList.toggle('dark', true);
      if (document.body) document.body.classList.toggle('dark', true);
      setTheme('dark');
    }

    // Mobile touch interactions: tap, press & hold for tactile feedback
    const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const touchableEls: Array<HTMLElement> = [];
    const cardEls: Array<HTMLElement> = [];
    const holdTimers = new WeakMap<HTMLElement, number>();

    if (supportsTouch && !prefersReduced) {
      document.querySelectorAll<HTMLElement>('.touchable').forEach((el) => {
        const onStart = () => el.classList.add('pressed');
        const onEnd = () => el.classList.remove('pressed');
        el.addEventListener('touchstart', onStart, { passive: true });
        el.addEventListener('touchend', onEnd);
        el.addEventListener('touchcancel', onEnd);
        touchableEls.push(el);
      });

      document.querySelectorAll<HTMLElement>('.card-glow').forEach((el) => {
        const onStart = () => {
          el.classList.add('pressing');
          // if user holds >300ms, add hold state
          const t = window.setTimeout(() => el.classList.add('hold'), 300);
          holdTimers.set(el, t);
        };
        const onEnd = () => {
          el.classList.remove('pressing');
          el.classList.remove('hold');
          const t = holdTimers.get(el);
          if (t) { window.clearTimeout(t); holdTimers.delete(el); }
        };
        el.addEventListener('touchstart', onStart, { passive: true });
        el.addEventListener('touchend', onEnd);
        el.addEventListener('touchcancel', onEnd);
        cardEls.push(el);
      });
    }

    return () => {
      observer.disconnect();
      // clean up touch listeners
      touchableEls.forEach((el) => {
        el.classList.remove('pressed');
        el.replaceWith(el.cloneNode(true) as HTMLElement);
      });
      cardEls.forEach((el) => {
        el.classList.remove('pressing');
        el.classList.remove('hold');
        el.replaceWith(el.cloneNode(true) as HTMLElement);
      });
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {}
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    if (document.body) document.body.classList.toggle('dark', newTheme === 'dark');
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