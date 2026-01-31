import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Venture Ecosystem', href: '#ecosystem' },
    { name: 'Incubation Strategy', href: '#pillars' },
    { name: 'Growth Impact', href: '#metrics' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled 
        ? (theme === 'dark' ? 'bg-[#0A0A0B]/80 glass-nav border-b border-white/5' : 'bg-white/80 glass-nav border-b border-slate-200') 
        : 'bg-transparent py-4'
    } ${scrolled ? 'py-4 shadow-xl' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center transform transition-all duration-300 group-hover:rotate-6">
             <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className={`text-xl font-bold tracking-tight font-display ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Sync<span className="text-blue-600">kraft</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className={`text-sm font-medium transition-all hover:text-blue-600 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} touchable`}>
              {link.name}
            </a>
          ))}
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-colors touchable ${theme === 'dark' ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <a href="#contact" className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] touchable force-full-mobile">
            Partner With Us
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <button onClick={toggleTheme} className={`p-2 touchable ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className={`touchable ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`lg:hidden border-b absolute w-full left-0 animate-in fade-in slide-in-from-top-4 duration-300 ${
          theme === 'dark' ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-200'
        } px-8 py-10 shadow-2xl`}>
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-lg font-bold block w-full py-4 touchable" onClick={() => setIsOpen(false)}>
                {link.name}
              </a>
            ))}
            <a href="#contact" className="mt-4 w-full text-center px-6 py-4 rounded-xl bg-blue-600 text-white font-bold" onClick={() => setIsOpen(false)}>
              Partner With Us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};