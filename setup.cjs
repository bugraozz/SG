const fs = require('fs');
const path = require('path');

const dirs = ['src', 'src/components', 'src/pages'];
for (const dir of dirs) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync('vite.config.js', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`);

fs.writeFileSync('index.html', `<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap" rel="stylesheet">
    <title>Serhat Gündar | Hedef Değil Sistem</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

fs.writeFileSync('src/main.jsx', `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
`);

fs.writeFileSync('src/App.jsx', `import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
`);

fs.writeFileSync('src/index.css', `:root {
  --bg-color: #050505;
  --bg-color-rgb: 5,5,5;
  --neon-red: #ff1010;
  --neon-red-glow: rgba(255, 16, 16, 0.6);
  --text-main: #ffffff;
  --text-muted: #a0a0a0;
  --card-bg: rgba(255, 255, 255, 0.03);
  --border-color: rgba(255, 255, 255, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-color);
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

h1, h2, h3, h4, .oswald-text {
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Utils */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
}
`);

fs.writeFileSync('src/components/Navbar.jsx', `import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo">
          <Link to="/">
            <span className="logo-text">ALAF</span>
          </Link>
        </div>
        
        <ul className="nav-links">
          <li><Link to="/" className="active">ANASAYFA</Link></li>
          <li><Link to="/hakkimda">HAKKIMDA</Link></li>
          <li><Link to="/araclar">ARAÇLAR</Link></li>
          <li><Link to="/yazilar">YAZILAR</Link></li>
          <li><Link to="/egzersiz">EGZERSİZ AKADEMİSİ</Link></li>
          <li><Link to="/paketler">PAKETLER</Link></li>
        </ul>

        <div className="nav-actions">
          <Link to="/login" className="login-btn">GİRİŞ YAP</Link>
          <button className="primary-btn">HEMEN BAŞLA</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
`);

fs.writeFileSync('src/components/Navbar.css', `.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 1.5rem 0;
  background: linear-gradient(to bottom, rgba(5,5,5,1) 0%, rgba(5,5,5,0) 100%);
  backdrop-filter: blur(5px);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-text {
  font-family: 'Oswald', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: white;
  text-shadow: 0 0 10px rgba(255,255,255,0.2);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.3s ease;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-links a:hover, .nav-links a.active {
  color: var(--neon-red);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.login-btn {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.3s;
}

.login-btn:hover {
  color: white;
}

.primary-btn {
  background-color: var(--neon-red);
  color: black;
  border: none;
  padding: 0.8rem 1.8rem;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 0 15px var(--neon-red-glow);
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px var(--neon-red-glow);
  background-color: #ff3333;
}
`);

fs.writeFileSync('src/pages/Home.jsx', `import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import './Home.css';
// TODO: Vücut geliştirici görselini ekle
// import bodyBuilderImage from '../assets/bodybuilder.png'; 

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      const tl = gsap.timeline();
      
      tl.from(".discount-badge", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.2
      })
      .from(".hero-title-line", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power4.out"
      }, "-=0.4")
      .from(".hero-desc", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4")
      .from(".hero-actions", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4")
      .from(".hero-image", {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=1");

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="home-wrapper">
      <section className="hero-section" ref={heroRef}>
        <div className="container hero-container">
          
          <div className="hero-content" ref={textRef}>
            <div className="discount-badge">
              <div className="discount-tag">%10 İndirim</div>
              <div className="discount-text">
                <span className="tiny-text">Proteinocean'da</span>
                <span className="code-text">ALAF10</span>
              </div>
              <ChevronRight size={18} className="discount-icon" />
            </div>

            <h1 className="hero-title">
              <div className="hero-title-line">HEDEF DEĞİL</div>
              <div className="hero-title-line highlight">SİSTEM</div>
            </h1>

            <p className="hero-desc">
              Türkiye'nin önde gelen <strong className="white-text">online fitness koçluk</strong> platformu. Kişiselleştirilmiş antrenman ve beslenme programlarıyla <strong className="white-text">vücut geliştirme</strong> hedeflerine ulaş. Bilimsel veriler, disiplinli takip ve birebir koçluk desteğiyle potansiyelini açığa çıkar.
            </p>

            <div className="hero-actions">
              <button className="primary-btn hero-btn">HEMEN BAŞLA</button>
            </div>
          </div>

          <div className="hero-visual" ref={imageRef}>
            {/* Using a placeholder div with the red aura style until image is linked */}
            <div className="hero-image placeholder-image"></div>
          </div>

        </div>
        
        <div className="scroll-indicator">
          <span>AŞAĞI KAYDIR</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
`);

fs.writeFileSync('src/pages/Home.css', `.home-wrapper {
  width: 100%;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding-top: 80px; /* navbar offset */
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  z-index: 10;
}

.discount-badge {
  display: inline-flex;
  align-items: center;
  background: var(--card-bg);
  border: 1px solid rgba(0, 100, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  width: max-content;
  cursor: pointer;
  transition: border-color 0.3s;
}

.discount-badge:hover {
  border-color: rgba(0, 100, 255, 0.6);
}

.discount-tag {
  background: linear-gradient(135deg, #0055ff, #0088ff);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.9rem;
  margin-right: 1rem;
}

.discount-text {
  display: flex;
  flex-direction: column;
  margin-right: 1.5rem;
}

.tiny-text {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.code-text {
  font-weight: 700;
  color: var(--neon-red);
  font-size: 1rem;
}

.discount-icon {
  color: var(--text-muted);
}

.hero-title {
  font-size: 7vw;
  line-height: 1.05;
  margin: 0;
  text-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.hero-title .highlight {
  color: var(--neon-red);
  text-shadow: 0 0 40px var(--neon-red-glow);
}

.hero-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 90%;
}

.white-text {
  color: white;
}

.hero-btn {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.hero-visual {
  position: relative;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom center;
  filter: drop-shadow(0 0 20px var(--neon-red-glow));
}

.placeholder-image {
  background: url('/image.png') no-repeat center bottom;
  background-size: contain;
  min-height: 600px;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.scroll-indicator:hover {
  opacity: 1;
}

.scroll-indicator span {
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.scroll-arrow {
  width: 12px;
  height: 12px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: rotate(45deg) translateY(0); }
  40% { transform: rotate(45deg) translateY(-10px); }
  60% { transform: rotate(45deg) translateY(-5px); }
}

@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    padding-top: 4rem;
  }
  
  .hero-content {
    align-items: center;
  }
  
  .hero-desc {
    max-width: 100%;
  }
  
  .hero-visual {
    height: 50vh;
  }
  
  .hero-title {
    font-size: 4rem;
  }
}
`);
