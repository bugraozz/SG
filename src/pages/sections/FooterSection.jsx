import React from 'react';
import './FooterSection.css';

const FooterSection = () => {
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
                <li><a href="#top" onClick={(e) => { e.preventDefault(); scrollToTop(); }}>Anasayfa</a></li>
                <li><a href="#hizmetler">Hizmetler</a></li>
                <li><a href="#donusum">Dönüşüm</a></li>
                <li><a href="#paketler">Paketler</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Destek</h4>
              <ul className="footer-col-links">
                <li><a href="#sss">SSS</a></li>
                <li><a href="#">İletişim</a></li>
                <li><a href="#">Gizlilik Politikası</a></li>
                <li><a href="#">Kullanım Koşulları</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Sosyal Medya</h4>
              <ul className="footer-col-links">
                <li><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer">TikTok</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer">Twitter / X</a></li>
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
