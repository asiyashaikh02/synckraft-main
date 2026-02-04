// // // // import React, { useState, useEffect } from 'react';
// // // // import { Menu, X, Sun, Moon } from 'lucide-react';

// // // // interface NavbarProps {
// // // //   theme: 'dark' | 'light';
// // // //   toggleTheme: () => void;
// // // // }

// // // // export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
// // // //   const [scrolled, setScrolled] = useState(false);
// // // //   const [isOpen, setIsOpen] = useState(false);

// // // //   useEffect(() => {
// // // //     const handleScroll = () => setScrolled(window.scrollY > 20);
// // // //     window.addEventListener('scroll', handleScroll);
// // // //     return () => window.removeEventListener('scroll', handleScroll);
// // // //   }, []);

// // // //   const navLinks = [
// // // //     { name: 'Venture Ecosystem', href: '#ecosystem' },
// // // //     { name: 'Incubation Strategy', href: '#pillars' },
// // // //     { name: 'Growth Impact', href: '#metrics' },
// // // //   ];

// // // //   return (
// // // //     <>
// // // //       <header className="fixed top-0 left-0 right-0 z-[100] bg-black/80" style={{ backdropFilter: 'blur(12px)' }}>
// // // //         <div className="h-[64px] max-w-7xl mx-auto px-6 flex items-center justify-between border-b border-white/5">
// // // //           <div className="flex flex-col items-start gap-2">{/* logo stack */}
// // // //             <a href="/" className="flex items-center group focus:outline-none" aria-label="Homepage">
// // // //               <img
// // // //                 src={theme === 'dark' ? '/logos/synckraft-dark.png' : '/logos/synckraft-light.png'}
// // // //                 className="logo h-8 sm:h-9 w-auto"
// // // //                 alt="Synckraft Logo"
// // // //                 loading="eager"
// // // //               />
// // // //             </a>
// // // //             <div className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] tracking-widest uppercase font-bold ${theme === 'dark' ? 'bg-white/5 text-blue-400' : 'bg-slate-900/5 text-blue-600'}`}>
// // // //               BUILDING WHAT MATTERS
// // // //             </div>
// // // //           </div>

// // // //         {/* Desktop Nav */}
// // // //         <div className="hidden lg:flex items-center gap-10">
// // // //           {navLinks.map((link) => (
// // // //             <a key={link.name} href={link.href} className={`text-sm font-medium transition-all hover:text-blue-600 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} touchable`}>
// // // //               {link.name}
// // // //             </a>
// // // //           ))}
          
// // // //           <button 
// // // //             onClick={toggleTheme}
// // // //             className={`p-2 rounded-xl transition-colors touchable ${theme === 'dark' ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
// // // //             aria-label="Toggle Theme"
// // // //           >
// // // //             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
// // // //           </button>

// // // //           <a href="#contact" className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] touchable force-full-mobile">
// // // //             Partner With Us
// // // //           </a>
// // // //         </div>

// // // //         {/* Mobile Toggle */}
// // // //         <div className="flex items-center gap-4 lg:hidden">
// // // //           <button onClick={toggleTheme} className={`p-2 touchable ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
// // // //             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
// // // //           </button>
// // // //           <button className={`touchable ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} onClick={() => setIsOpen(!isOpen)}>
// // // //             {isOpen ? <X size={24} /> : <Menu size={24} />}
// // // //           </button>
// // // //         </div>
// // // //         </div>
// // // //       </header>

// // // //       </header>

// // // //       {/* Header spacer: ensures content starts below fixed header on all devices */}
// // // //       <div className="h-[64px] w-full" aria-hidden="true" />

// // // //       {/* Mobile Menu (flows below header; not absolutely positioned) */}
// // // //       {isOpen && (
// // // //         <div className={`lg:hidden border-b w-full animate-in fade-in slide-in-from-top-4 duration-300 ${
// // // //           theme === 'dark' ? 'bg-[#0A0A0B] border-white/5' : 'bg-white border-slate-200'
// // // //         } px-6 py-10 shadow-2xl`}>
// // // //           <div className="flex flex-col gap-6">
// // // //             {navLinks.map((link) => (
// // // //               <a key={link.name} href={link.href} className="text-lg font-bold block w-full py-4 touchable" onClick={() => setIsOpen(false)}>
// // // //                 {link.name}
// // // //               </a>
// // // //             ))}
// // // //             <a href="#contact" className="mt-4 w-full text-center px-6 py-4 rounded-xl bg-blue-600 text-white font-bold" onClick={() => setIsOpen(false)}>
// // // //               Partner With Us
// // // //             </a>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </>
// // // //   );
// // // // };
// // // import React, { useState, useEffect } from 'react';
// // // import { Menu, X, Sun, Moon } from 'lucide-react';

// // // interface NavbarProps {
// // //   theme: 'dark' | 'light';
// // //   toggleTheme: () => void;
// // // }

// // // export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
// // //   const [scrolled, setScrolled] = useState(false);
// // //   const [isOpen, setIsOpen] = useState(false);

// // //   useEffect(() => {
// // //     const handleScroll = () => setScrolled(window.scrollY > 20);
// // //     window.addEventListener('scroll', handleScroll);
// // //     return () => window.removeEventListener('scroll', handleScroll);
// // //   }, []);

// // //   const navLinks = [
// // //     { name: 'Venture Ecosystem', href: '#ecosystem' },
// // //     { name: 'Incubation Strategy', href: '#pillars' },
// // //     { name: 'Growth Impact', href: '#metrics' },
// // //   ];

// // //   return (
// // //     <>
// // //       <header 
// // //         className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
// // //           scrolled 
// // //             ? (theme === 'dark' ? 'bg-black/90 border-b border-white/10' : 'bg-white/90 border-b border-slate-200') 
// // //             : 'bg-transparent'
// // //         }`} 
// // //         style={{ backdropFilter: 'blur(12px)' }}
// // //       >
// // //         {/* Removed fixed h-[64px] to allow logo + badge to fit */}
// // //         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
// // //           {/* LOGO STACK: This is the fix for the overlap */}
// // //           <div className="flex flex-col items-start gap-1">
// // //             <a href="/" className="flex items-center group focus:outline-none" aria-label="Homepage">
// // //               <img
// // //                 src={theme === 'dark' ? '/logos/synckraft-dark.png' : '/logos/synckraft-light.png'}
// // //                 className="h-8 sm:h-9 w-auto object-contain"
// // //                 alt="Synckraft Logo"
// // //                 loading="eager"
// // //               />
// // //             </a>
// // //             <div className={`inline-flex items-center rounded-full px-3 py-0.5 text-[10px] tracking-[0.2em] uppercase font-bold border ${
// // //               theme === 'dark' 
// // //                 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
// // //                 : 'bg-blue-50 text-blue-600 border-blue-200'
// // //             }`}>
// // //               Building What Matters
// // //             </div>
// // //           </div>

// // //           {/* Desktop Nav */}
// // //           <div className="hidden lg:flex items-center gap-8">
// // //             {navLinks.map((link) => (
// // //               <a key={link.name} href={link.href} className={`text-sm font-medium transition-all hover:text-blue-500 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
// // //                 {link.name}
// // //               </a>
// // //             ))}
            
// // //             <button 
// // //               onClick={toggleTheme}
// // //               className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
// // //               aria-label="Toggle Theme"
// // //             >
// // //               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
// // //             </button>

// // //             <a href="#contact" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
// // //               Partner With Us
// // //             </a>
// // //           </div>

// // //           {/* Mobile Toggle */}
// // //           <div className="flex items-center gap-3 lg:hidden">
// // //             <button onClick={toggleTheme} className={`p-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
// // //               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
// // //             </button>
// // //             <button className={`${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} onClick={() => setIsOpen(!isOpen)}>
// // //               {isOpen ? <X size={24} /> : <Menu size={24} />}
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       {/* DYNAMIC SPACER: This prevents the Hero from going under the header */}
// // //       <div className="h-[90px] lg:h-[100px] w-full" aria-hidden="true" />

// // //       {/* Mobile Menu */}
// // //       {isOpen && (
// // //         <div className={`fixed inset-0 z-[90] lg:hidden pt-[100px] ${theme === 'dark' ? 'bg-[#0A0A0B]' : 'bg-white'} px-6`}>
// // //           <div className="flex flex-col gap-4">
// // //             {navLinks.map((link) => (
// // //               <a key={link.name} href={link.href} className="text-xl font-bold py-4 border-b border-white/5" onClick={() => setIsOpen(false)}>
// // //                 {link.name}
// // //               </a>
// // //             ))}
// // //             <a href="#contact" className="mt-6 w-full text-center px-6 py-4 rounded-xl bg-blue-600 text-white font-bold" onClick={() => setIsOpen(false)}>
// // //               Partner With Us
// // //             </a>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // };

// // import React, { useState, useEffect } from 'react';
// // import { Menu, X, Sun, Moon } from 'lucide-react';

// // interface NavbarProps {
// //   theme: 'dark' | 'light';
// //   toggleTheme: () => void;
// // }

// // export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
// //   const [scrolled, setScrolled] = useState(false);
// //   const [isOpen, setIsOpen] = useState(false);

// //   useEffect(() => {
// //     const handleScroll = () => setScrolled(window.scrollY > 20);
// //     window.addEventListener('scroll', handleScroll);
// //     return () => window.removeEventListener('scroll', handleScroll);
// //   }, []);

// //   return (
// //     <>
// //       <header 
// //         className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
// //           scrolled 
// //             ? (theme === 'dark' ? 'bg-black/90 border-b border-white/10 py-2' : 'bg-white/90 border-b border-slate-200 py-2') 
// //             : 'bg-transparent py-4'
// //         }`} 
// //         style={{ backdropFilter: 'blur(12px)' }}
// //       >
// //         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
// //           {/* MUCH LARGER LOGO SIZING */}
// //           {/* <a href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
// //             <img
// //               src={theme === 'dark' ? '/logos/synckraft-dark.png' : '/logos/synckraft-light.png'}
// //               className="h-12 sm:h-14 md:h-16 w-auto object-contain" 
// //               alt="Synckraft Logo"
// //             />
// //           </a> */}
// //         <a href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
// //   <img
// //     src={theme === 'dark' ? '/logos/synckraft-dark.png' : '/logos/synckraft-light.png'}
// //     /* Increased height: h-16 (mobile), h-20 (tablet), h-24 (desktop) */
// //     className="h-16 sm:h-20 md:h-24 w-auto object-contain block" 
// //     alt="Synckraft Logo"
// //     key={theme} /* This forces the browser to re-render the image when theme changes */
// //   />
// // </a>
// //           <div className="flex items-center gap-5">
// //             <button 
// //               onClick={toggleTheme}
// //               className={`p-2.5 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
// //               aria-label="Toggle Theme"
// //             >
// //               {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
// //             </button>
            
// //             <a href="#contact" className="hidden sm:block px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
// //               Partner With Us
// //             </a>

// //             <button className="lg:hidden p-2 text-current" onClick={() => setIsOpen(!isOpen)}>
// //               {isOpen ? <X size={32} /> : <Menu size={32} />}
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Mobile Menu Overlay */}
// //       {isOpen && (
// //         <div className={`fixed inset-0 z-[90] lg:hidden flex flex-col justify-center items-center gap-10 animate-in fade-in duration-300 ${
// //           theme === 'dark' ? 'bg-[#0A0A0B] text-white' : 'bg-white text-slate-900'
// //         }`}>
// //            <a href="#ecosystem" className="text-3xl font-bold hover:text-blue-500 transition-colors" onClick={() => setIsOpen(false)}>Venture Ecosystem</a>
// //            <a href="#pillars" className="text-3xl font-bold hover:text-blue-500 transition-colors" onClick={() => setIsOpen(false)}>Incubation Strategy</a>
// //            <a href="#contact" className="px-10 py-5 rounded-full bg-blue-600 text-white text-xl font-bold shadow-2xl shadow-blue-600/40" onClick={() => setIsOpen(false)}>Partner With Us</a>
// //         </div>
// //       )}
// //     </>
// //   );
// // };


// // import React, { useState, useEffect } from 'react';
// // import { Menu, X, Sun, Moon } from 'lucide-react';

// // interface NavbarProps {
// //   theme: 'dark' | 'light';
// //   toggleTheme: () => void;
// // }

// // export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
// //   const [scrolled, setScrolled] = useState(false);
// //   const [isOpen, setIsOpen] = useState(false);

// //   useEffect(() => {
// //     const handleScroll = () => setScrolled(window.scrollY > 20);
// //     window.addEventListener('scroll', handleScroll);
// //     return () => window.removeEventListener('scroll', handleScroll);
// //   }, []);

// //   const navLinks = [
// //     { name: 'Venture Ecosystem', href: '#ecosystem' },
// //     { name: 'Incubation Strategy', href: '#pillars' },
// //   ];

// //   return (
// //     <>
// //       <header 
// //         className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
// //           scrolled 
// //             ? (theme === 'dark' ? 'bg-black/90 border-b border-white/10 py-2' : 'bg-white/90 border-b border-slate-200 py-2') 
// //             : 'bg-transparent py-4'
// //         }`} 
// //         style={{ backdropFilter: 'blur(12px)' }}
// //       >
// //         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
// //           {/* LARGE LOGO SIZING WITH THEME-SYNC FIX */}
// //           <a href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
// //             <img
// //               key={theme} 
// //               src={theme === 'dark' ? '/logos/synckraft-dark.png' : '/logos/synckraft-light.png'}
// //               className="h-16 sm:h-20 md:h-24 w-auto object-contain block antialiased" 
// //               alt="Synckraft Logo"
// //               loading="eager"
// //             />
// //           </a>

// //           <div className="flex items-center gap-5">
// //             {/* Desktop Navigation Links */}
// //             <nav className="hidden lg:flex items-center gap-8 mr-4">
// //               {navLinks.map((link) => (
// //                 <a 
// //                   key={link.name} 
// //                   href={link.href} 
// //                   className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'}`}
// //                 >
// //                   {link.name}
// //                 </a>
// //               ))}
// //             </nav>

// //             <button 
// //               onClick={toggleTheme}
// //               className={`p-2.5 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
// //               aria-label="Toggle Theme"
// //             >
// //               {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
// //             </button>
            
// //             <a href="#contact" className="hidden sm:block px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
// //               Partner With Us
// //             </a>

// //             <button 
// //               className={`lg:hidden p-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} 
// //               onClick={() => setIsOpen(!isOpen)}
// //             >
// //               {isOpen ? <X size={32} /> : <Menu size={32} />}
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Mobile Menu Overlay */}
// //       {isOpen && (
// //         <div className={`fixed inset-0 z-[90] lg:hidden flex flex-col justify-center items-center gap-10 animate-in fade-in duration-300 ${
// //           theme === 'dark' ? 'bg-[#0A0A0B] text-white' : 'bg-white text-slate-900'
// //         }`}>
// //            <a href="#ecosystem" className="text-3xl font-bold hover:text-blue-500 transition-colors" onClick={() => setIsOpen(false)}>Venture Ecosystem</a>
// //            <a href="#pillars" className="text-3xl font-bold hover:text-blue-500 transition-colors" onClick={() => setIsOpen(false)}>Incubation Strategy</a>
// //            <a href="#contact" className="px-10 py-5 rounded-full bg-blue-600 text-white text-xl font-bold shadow-2xl shadow-blue-600/40" onClick={() => setIsOpen(false)}>Partner With Us</a>
// //         </div>
// //       )}
// //     </>
// //   );
// // };



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
//     const handleScroll = () => setScrolled(window.scrollY > 20);
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
//         className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
//           scrolled 
//             ? (theme === 'dark' ? 'bg-black/90 border-b border-white/10 py-2' : 'bg-white/90 border-b border-slate-200 py-2') 
//             : 'bg-transparent py-4'
//         }`} 
//         style={{ backdropFilter: 'blur(12px)' }}
//       >
//         <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
//           {/* LOGO SECTION: Dark aur Light dono ke liye exact same large size */}
//           <a href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
//             <img
//               key={theme} 
//               src={theme === 'dark' ? '/logos/synckraft-dark.png' : '/logos/synckraft-light.png'}
//               /* 'h-16 sm:h-20 md:h-24' ensures large size across all screen modes */
//               className="h-16 sm:h-20 md:h-24 w-auto object-contain block antialiased" 
//               alt="Synckraft Logo"
//               loading="eager"
//             />
//           </a>

//           <div className="flex items-center gap-5">
//             {/* Desktop Navigation */}
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

//             {/* Theme Toggle Button */}
//             <button 
//               onClick={toggleTheme}
//               className={`p-2.5 rounded-xl transition-colors ${
//                 theme === 'dark' ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
//               }`}
//               aria-label="Toggle Theme"
//             >
//               {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
//             </button>
            
//             {/* CTA Button */}
//             <a href="#contact" className="hidden sm:block px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
//               Partner With Us
//             </a>

//             {/* Mobile Menu Toggle */}
//             <button 
//               className={`lg:hidden p-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} 
//               onClick={() => setIsOpen(!isOpen)}
//             >
//               {isOpen ? <X size={32} /> : <Menu size={32} />}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Menu Overlay */}
//       {isOpen && (
//         <div className={`fixed inset-0 z-[90] lg:hidden flex flex-col justify-center items-center gap-10 animate-in fade-in duration-300 ${
//           theme === 'dark' ? 'bg-[#0A0A0B] text-white' : 'bg-white text-slate-900'
//         }`}>
//            <a href="#ecosystem" className="text-3xl font-bold hover:text-blue-500 transition-colors" onClick={() => setIsOpen(false)}>Venture Ecosystem</a>
//            <a href="#pillars" className="text-3xl font-bold hover:text-blue-500 transition-colors" onClick={() => setIsOpen(false)}>Incubation Strategy</a>
//            <a href="#contact" className="px-10 py-5 rounded-full bg-blue-600 text-white text-xl font-bold shadow-2xl shadow-blue-600/40" onClick={() => setIsOpen(false)}>Partner With Us</a>
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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Venture Ecosystem', href: '#ecosystem' },
    { name: 'Incubation Strategy', href: '#pillars' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled 
            ? (theme === 'dark' ? 'bg-black/95 border-b border-white/10 py-4' : 'bg-white/95 border-b border-slate-200 py-4') 
            : 'bg-transparent py-6'
        }`} 
        style={{ backdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* LOGO & BADGE STACK */}
          <div className="flex flex-col items-start gap-2">
            <a href="/" className="flex items-center group transition-transform duration-300 hover:scale-105 focus:outline-none">
              <img
                key={theme} 
                src={theme === 'dark' ? '/logos/synckraft-dark.png' : '/logos/synckraft-light.png'}
                className="h-16 sm:h-20 md:h-24 w-auto object-contain block antialiased" 
                alt="Synckraft Logo"
                loading="eager"
              />
            </a>
            
            <div className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-bold border transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm'
            }`}>
              Building What Matters
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className={`text-sm font-bold tracking-tight transition-colors ${
                    theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* CTA Button */}
              <a href="#contact" className="hidden sm:block px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-xl shadow-blue-600/25 active:scale-95">
                Partner With Us
              </a>

              {/* Mobile Menu Button */}
              <button 
                className={`lg:hidden p-2 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} 
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HEADER SPACER: Ye content ko header ke niche push karta hai */}
      <div className="h-[140px] sm:h-[160px] md:h-[180px] w-full" aria-hidden="true" />

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className={`fixed inset-0 z-[90] lg:hidden flex flex-col justify-center items-center gap-12 animate-in fade-in zoom-in duration-300 ${
          theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-900'
        }`}>
           <a href="#ecosystem" className="text-4xl font-black tracking-tighter hover:text-blue-500 transition-colors" onClick={() => setIsOpen(false)}>Venture Ecosystem</a>
           <a href="#pillars" className="text-4xl font-black tracking-tighter hover:text-blue-500 transition-colors" onClick={() => setIsOpen(false)}>Incubation Strategy</a>
           <a href="#contact" className="mt-4 px-12 py-6 rounded-full bg-blue-600 text-white text-2xl font-black shadow-2xl shadow-blue-600/40" onClick={() => setIsOpen(false)}>Partner With Us</a>
        </div>
      )}
    </>
  );
};