import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './Navbar.css';

gsap.registerPlugin(ScrollToPlugin);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const act = () => {
      if (sectionId === 'top') {
        gsap.to(window, { duration: 1.2, scrollTo: 0, ease: "power3.inOut" });
      } else {
        gsap.to(window, { duration: 1.2, scrollTo: { y: `#${sectionId}`, offsetY: 80 }, ease: "power3.inOut" });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(act, 200);
    } else {
      act();
    }
  };

  const btnStyle = { background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', outline: 'none' };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <button onClick={() => scrollToSection('top')} style={btnStyle}>
            <span className="logo-text">SG</span>
          </button>
        </div>
        
        <ul className="nav-links">
          <li><button onClick={() => scrollToSection('top')} style={btnStyle}>Anasayfa</button></li>
          <li><button onClick={() => scrollToSection('hakkimda')} style={btnStyle}>Hakkımda</button></li>
          <li><button onClick={() => scrollToSection('hizmetler')} style={btnStyle}>Hizmetler</button></li>
          <li><button onClick={() => scrollToSection('donusum')} style={btnStyle}>Dönüşüm</button></li>
          <li><button onClick={() => scrollToSection('paketler')} style={btnStyle}>Paketler</button></li>
          <li><button onClick={() => scrollToSection('sss')} style={btnStyle}>SSS</button></li>
        </ul>

        <div className="nav-actions">
          <a
            href="https://drsupplement.com.tr/"
            target="_blank"
            rel="noreferrer"
            className="bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-3 py-2 rounded-xl hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group flex items-center gap-3 cursor-pointer no-underline"
          >
            <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-[300px] h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
            
            {/* Sol - İndirim Kutusu */}
            <div className="bg-red-600 text-white font-extrabold text-[13px] md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg whitespace-nowrap shadow-[0_4px_15px_rgba(220,38,38,0.4)] z-10 relative">
              %10 İndirim
            </div>
            
            {/* Orta - Yazı Katmanı */}
            <div className="flex flex-col items-start leading-tight justify-center space-y-1.5 z-10 relative">
              <span className="text-[10px] md:text-[11px] text-red-200 font-medium tracking-wide">
                drsupplement'de
              </span>
              <span className="text-[12px] md:text-[13px] font-black text-red-950 bg-red-400 px-1.5 py-0.5 rounded-sm inline-flex uppercase">
                TEGMEN10
              </span>
            </div>
            
            {/* Sağ - İkon */}
            <div className="text-red-400 group-hover:text-red-100 group-hover:translate-x-1 transition-all ml-1 pr-1 z-10 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
