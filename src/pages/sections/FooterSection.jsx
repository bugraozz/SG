import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { API_URL } from '../../config';
import './FooterSection.css';

gsap.registerPlugin(ScrollToPlugin);

const FooterSection = () => {
  const [settings, setSettings] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        const data = await res.json();
        if (data.success) {
          setSettings(data.data || {});
        }
      } catch (err) {
        console.error("Footer ayarları çekilemedi:", err);
      }
    };
    fetchSettings();
  }, []);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="footer-logo">SG<span className="footer-dot">.</span></h3>
            <p className="footer-tagline">Hedef Değil, Sistem.</p>
            <p className="footer-desc">
              Bilimsel antrenman ve beslenme programlarıyla 
              Türkiye'nin en güvenilir online fitness koçluk platformu.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4 className="footer-col-title">Hızlı Erişim</h4>
              <ul className="footer-col-links">
                <li><a href="#top" onClick={(e) => scrollToSection(e, 'top')}>Anasayfa</a></li>
                <li><a href="#hizmetler" onClick={(e) => scrollToSection(e, 'hizmetler')}>Hizmetler</a></li>
                <li><a href="#donusum" onClick={(e) => scrollToSection(e, 'donusum')}>Dönüşüm</a></li>
                <li><a href="#paketler" onClick={(e) => scrollToSection(e, 'paketler')}>Paketler</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Destek</h4>
              <ul className="footer-col-links">
                <li><a href="#sss" onClick={(e) => scrollToSection(e, 'sss')}>SSS</a></li>
                <li><a href="#">İletişim</a></li>
                <li><Link to="/gizlilik-politikasi">Gizlilik Politikası</Link></li>
                <li><Link to="/kullanim-kosullari">Kullanım Koşulları</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Sosyal Medya</h4>
              <ul className="footer-col-links">
                {settings.social_instagram && (
                  <li><a href={settings.social_instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                )}
                {settings.social_youtube && (
                  <li><a href={settings.social_youtube} target="_blank" rel="noopener noreferrer">YouTube</a></li>
                )}
                {settings.social_tiktok && (
                  <li><a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer">TikTok</a></li>
                )}
                {settings.social_twitter && (
                  <li><a href={settings.social_twitter} target="_blank" rel="noopener noreferrer">Twitter / X</a></li>
                )}
                {/* Eğer hiç link girilmemişse varsayılan bir bilgi gösterebiliriz ya da boş kalabilir */}
                {!settings.social_instagram && !settings.social_youtube && !settings.social_tiktok && !settings.social_twitter && (
                  <li><span style={{color: '#888', fontSize: '0.9rem'}}>Bağlantılar yakında</span></li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 Serhat Gündar. Tüm hakları saklıdır.
          </p>
          
          <button className="back-to-top" onClick={scrollToTop}>
            ↑ Yukarı Dön
          </button>
        </div>
        
      </div>
    </footer>
  );
};

export default FooterSection;
