// import React, { useState, useEffect } from 'react';
// import { Menu, X, Sun, Moon } from 'lucide-react';

// interface NavbarProps {
//   theme: 'dark' | 'light';
//   toggleTheme: () => void;
// }

// export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
//   const [scrolled, setScrolled] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navLinks = [
//     { name: 'Venture Ecosystem', href: '#ecosystem' },
//     { name: 'Incubation Strategy', href: '#pillars' },
//   ];

//   return (
//     <>
//       <header 
//         className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
//           scrolled 
//             ? (theme === 'dark' ? 'bg-black/95 border-b border-white/10 py-2' : 'bg-white/95 border-b border-slate-200 py-2 shadow-md') 
//             : 'bg-transparent py-4'
//         }`} 
//         style={{ backdropFilter: 'blur(12px)' }}
//       >
//         <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          
//           {/* LOGO SECTION - Hardcoded & Locked */}
//           <div className="flex items-center justify-start overflow-hidden" style={{ height: '70px', width: '220px' }}>
//             <a href="/" className="block focus:outline-none">
//               <img
//                 key={theme} 
//                 src={theme === 'dark' ? '/logos/synckraft-dark.png' : '/logos/synckraft-light.png'}
//                 /* Strict Inline Styles to override everything */
//                 style={{ 
//                   height: '70px', 
//                   width: 'auto',
//                   maxHeight: '70px',
//                   display: 'block',
//                   objectFit: 'contain'
//                 }}
//                 className="md:scale-100 scale-75 origin-left transition-transform duration-300"
//                 alt="Synckraft Logo"
//                 loading="eager"
//               />
//             </a>
//           </div>

//           {/* RIGHT SIDE ACTIONS */}
//           <div className="flex items-center gap-2 md:gap-5">
//             <nav className="hidden lg:flex items-center gap-8 mr-4">
//               {navLinks.map((link) => (
//                 <a 
//                   key={link.name} 
//                   href={link.href} 
//                   className={`text-sm font-bold transition-colors ${
//                     theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'
//                   }`}
//                 >
//                   {link.name}
//                 </a>
//               ))}
//             </nav>

//             <button 
//               onClick={toggleTheme}
//               className={`p-2.5 rounded-xl transition-all active:scale-90 ${
//                 theme === 'dark' ? 'bg-white/5 text-slate-300' : 'bg-slate-100 text-slate-600 border border-slate-200'
//               }`}
//             >
//               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
//             </button>
            
//             <a href="#contact" className="hidden sm:block px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95">
//               Partner With Us
//             </a>

//             <button 
//               className={`lg:hidden p-2 ml-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} 
//               onClick={() => setIsOpen(!isOpen)}
//             >
//               {isOpen ? <X size={28} /> : <Menu size={28} />}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* FIXED SPACER - Ensures Hero content starts after Navbar */}
//       <div className="h-[90px] md:h-[110px]" aria-hidden="true" />

//       {/* MOBILE MENU */}
//       {isOpen && (
//         <div className={`fixed inset-0 z-[90] lg:hidden flex flex-col justify-center px-8 gap-8 ${
//           theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-900'
//         }`}>
//            <a href="#ecosystem" className="text-3xl font-black border-b border-white/10 pb-4" onClick={() => setIsOpen(false)}>Venture Ecosystem</a>
//            <a href="#pillars" className="text-3xl font-black border-b border-white/10 pb-4" onClick={() => setIsOpen(false)}>Incubation Strategy</a>
//            <a href="#contact" className="w-full py-5 rounded-2xl bg-blue-600 text-white text-center text-xl font-black" onClick={() => setIsOpen(false)}>Partner With Us</a>
//         </div>
//       )}
//     </>
//   );
// };

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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Venture Ecosystem', href: '#ecosystem' },
    { name: 'Incubation Strategy', href: '#pillars' },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? theme === 'dark'
              ? 'bg-black/95 border-b border-white/10 py-2'
              : 'bg-white/95 border-b border-slate-200 py-2 shadow-sm'
            : 'bg-transparent py-4'
        }`}
        style={{ backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">

          {/* ================= LOGO ================= */}
          <a href="/" aria-label="Homepage" className="block focus:outline-none">
            <div
              className="
                w-[170px]
                sm:w-[190px]
                md:w-[210px]
                lg:w-[230px]
                h-auto
                flex
                items-center
              "
            >
              {/* Light logo */}
              <img
                src="/logos/synckraft-light.png"
                alt="Synckraft Logo"
                className={`w-full h-auto object-contain ${
                  theme === 'dark' ? 'hidden' : 'block'
                }`}
                loading="eager"
              />

              {/* Dark logo */}
              <img
                src="/logos/synckraft-dark.png"
                alt="Synckraft Logo"
                className={`w-full h-auto object-contain ${
                  theme === 'dark' ? 'block' : 'hidden'
                }`}
                loading="eager"
              />
            </div>
          </a>

          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center gap-2 md:gap-5">

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8 mr-4">
              {navLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all active:scale-95 ${
                theme === 'dark'
                  ? 'bg-white/5 text-slate-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* CTA */}
            <a
              href="#contact"
              className="hidden sm:block px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Partner With Us
            </a>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 ml-1 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* ================= SPACER ================= */}
      <div className="h-[80px] md:h-[96px]" aria-hidden="true" />

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-[90] lg:hidden flex flex-col justify-center px-8 gap-8 ${
            theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-900'
          }`}
        >
          <a
            href="#ecosystem"
            className="text-3xl font-black border-b border-white/10 pb-4"
            onClick={() => setIsOpen(false)}
          >
            Venture Ecosystem
          </a>
          <a
            href="#pillars"
            className="text-3xl font-black border-b border-white/10 pb-4"
            onClick={() => setIsOpen(false)}
          >
            Incubation Strategy
          </a>
          <a
            href="#contact"
            className="w-full py-5 rounded-2xl bg-blue-600 text-white text-center text-xl font-black"
            onClick={() => setIsOpen(false)}
          >
            Partner With Us
          </a>
        </div>
      )}
    </>
  );
};
