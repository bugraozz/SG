const fs = require('fs');

const pages = [
  { name: 'About', path: 'hakkimda', title: 'HAKKIMDA', bg: 'transparent' },
  { name: 'Tools', path: 'araclar', title: 'ARAÇLAR', bg: 'transparent' },
  { name: 'Blog', path: 'yazilar', title: 'YAZILAR', bg: 'transparent' },
  { name: 'Academy', path: 'egzersiz', title: 'EGZERSİZ AKADEMİSİ', bg: 'transparent' },
  { name: 'Packages', path: 'paketler', title: 'PAKETLER', bg: 'transparent' },
  { name: 'Login', path: 'login', title: 'GİRİŞ YAP', bg: 'transparent' }
];

pages.forEach(p => {
  fs.writeFileSync(\`src/pages/\${p.name}.jsx\`, \`import React, { useEffect } from 'react';
import gsap from 'gsap';

const \${p.name} = () => {
  useEffect(() => {
    gsap.fromTo('.page-content', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '100px', backgroundColor: '\${p.bg}' }} className="container page-content">
      <h1 style={{ fontSize: '4rem', color: 'var(--text-main)', textAlign: 'center', margin: '4rem 0' }} className="oswald-text">
        <span style={{ color: 'var(--neon-red)', textShadow: '0 0 20px var(--neon-red-glow)' }}>\${p.title}</span> SAYFASI
      </h1>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
          Bu sayfa yapım aşamasındadır. Yakında neon kırmızı konseptine uygun olarak profesyonel içeriklerle doldurulacaktır.
        </p>
      </div>
    </div>
  );
};

export default \${p.name};
\`);
});

fs.writeFileSync('src/components/FloatingWidgets.jsx', \`import React from 'react';
import { MessageCircle } from 'lucide-react';
import './FloatingWidgets.css';

const FloatingWidgets = () => {
  return (
    <div className="floating-widgets">
      <a href="https://wa.me/905555555555" target="_blank" rel="noreferrer" className="whatsapp-btn">
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default FloatingWidgets;
\`);

fs.writeFileSync('src/components/FloatingWidgets.css', \`.floating-widgets {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.whatsapp-btn {
  background-color: #25D366;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
}

.whatsapp-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
}
\`);
