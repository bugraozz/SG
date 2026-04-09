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
    <section className="hero-section" id="top" ref={heroRef}>
      <div className="container hero-inner">

        <div className="hero-main-grid">
          <div className="hero-copy">

            <div className="indirim-wrapper" style={{ marginBottom: "2.5rem" }}>
              <IndirimButton />
            </div>

            <h1 className="hero-title">
              <div className="hero-title-line title-light">Hedef Değil,</div>
              <div className="hero-title-line title-bold">Sistem Kur.</div>
              <div className="hero-title-line title-bold">Sonuç Al.</div>
            </h1>

            <p className="hero-subtitle">
              Bilimsel antrenman programları, kişisel beslenme planları ve birebir koçluk
              desteğiyle vücut dönüşümünü başlat — daha önce hiç spor yapmamış olsan bile.
            </p>

            <div className="hero-cta-group">
              <button className="cta-primary" onClick={() => {
                document.getElementById('paketler')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Hemen Başla — Sınırlı Kontenjan
              </button>
              <button className="cta-secondary" onClick={() => {
                document.getElementById('hizmetler')?.scrollIntoView({ behavior: 'smooth' });
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
