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
          <Link to="/login" className="login-btn">Giriş Yap</Link>
          <button className="primary-btn" onClick={() => scrollToSection('paketler')}>Hemen Başla</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
