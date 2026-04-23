import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import IndirimButton from '../../components/IndirimButton';
import './HeroSection.css';

const HeroSection = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(".indirim-wrapper",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3 }
      )
        .fromTo(".hero-title-line",
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "expo.out" },
          "-=0.5"
        )
        .fromTo(".hero-subtitle",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(".hero-cta-group",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section relative" id="top" ref={heroRef}>
      {/* Background Image (Transparan - Yapay Zeka ile Temizlendi) */}
      <div 
        className="absolute inset-0 z-0 opacity-100 bg-no-repeat pointer-events-none hidden md:block"
        style={{ 
          backgroundImage: "url('/hero-cutout.png')",
          backgroundPosition: "80% 100%", /* Tam sağa yapışmak yerine merkeze daha yakın (Sağdan %20 içeride) */
          backgroundSize: "auto 105%" /* %90'dan %105'e çıkarıldı, ekran yüksekliğinden de büyük, çok daha heybetli */
        }}
      />
      {/* Mobilde aynı görselin ortalanmış ve daha flu hali olabilir ya da bg olarak kullanılabilir */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat pointer-events-none md:hidden"
        style={{ 
          backgroundImage: "url('/hero-cutout.png')",
          backgroundPosition: "center 82%",
          backgroundSize: "125% auto",
          opacity: 0.42
        }}
      />
        
      <div className="container hero-inner relative z-10 w-full px-6">

        <div className="hero-main-grid">
          <div className="hero-copy">
            <h1 className="hero-title">
              <div className="hero-title-line title-accent">Ruh Harbiyeli,</div>
              <div className="hero-title-line title-accent">Fizik Harbiyeli<span className="hero-dot">.</span></div>
              <div className="hero-title-line title-bold title-highlight">Ya Sen<span className="hero-question">?</span></div>
            </h1>

            <p className="hero-subtitle">
              Bilimsel antrenman programları, kişisel beslenme planları ve birebir koçluk
              desteğiyle vücut dönüşümünü başlat — daha önce hiç spor yapmamış olsan bile.
            </p>

            <div className="hero-cta-group">
              {/* Sadece Kamuflaj Desenli Program İnceleme Butonu Kaldı */}
              <button className="cta-primary" onClick={() => {
                document.getElementById('paketler')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Programları İncele ↓
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default HeroSection;
