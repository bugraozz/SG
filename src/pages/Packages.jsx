import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import './Panels.css';

gsap.registerPlugin(ScrollTrigger);

const Packages = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const titles = new SplitType('.panel-title', { types: 'lines, words' });
      gsap.set(titles.lines, { overflow: 'hidden' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      tl.from(titles.words, { y: '100%', duration: 1.2, ease: "expo.out", stagger: 0.05 })
        .from(".panel-line", { scaleX: 0, opacity: 0, duration: 1.2, ease: "expo.out", transformOrigin: "left" }, "-=0.8")
        .from(".package-card", {
          opacity: 0,
          scale: 0.9,
          y: 70,
          stagger: 0.15,
          duration: 1.4,
          ease: "expo.out"
        }, "-=1");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="panel-section packages-panel" id="paketler" ref={sectionRef}>
      <div className="container panel-container">
        <div className="panel-header">
          <h2 className="panel-title">KOÇLUK <span className="highlight">PAKETLERİ</span></h2>
          <div className="panel-line"></div>
        </div>

        <div className="packages-grid">
          <div className="package-card">
            <h3 className="pkg-title">Standart</h3>
            <p className="pkg-desc">Kişiye özel antrenman programı.</p>
            <div className="pkg-price">1500₺ <span className="period">/ay</span></div>
            <ul className="pkg-features">
              <li>Özel Antrenman Programı</li>
              <li>Aylık İlerleme Takibi</li>
              <li>Soru-Cevap Desteği (Haftalık)</li>
            </ul>
            <button className="pkg-btn">Seç</button>
          </div>

          <div className="package-card premium-card">
            <div className="popular-badge">En Çok Tercih Edilen</div>
            <h3 className="pkg-title">Premium</h3>
            <p className="pkg-desc">Detaylı beslenme ve antrenman.</p>
            <div className="pkg-price">2500₺ <span className="period">/ay</span></div>
            <ul className="pkg-features">
              <li>Özel Antrenman Programı</li>
              <li>Kişiselleştirilmiş Diyet</li>
              <li>7/24 WhatsApp Desteği</li>
              <li>Haftalık Form Kontrolü</li>
            </ul>
            <button className="pkg-btn active-btn">Seç</button>
          </div>

          <div className="package-card">
            <h3 className="pkg-title">Elite</h3>
            <p className="pkg-desc">Tam kapsamlı birebir danışmanlık.</p>
            <div className="pkg-price">4000₺ <span className="period">/ay</span></div>
            <ul className="pkg-features">
              <li>Tüm Premium Özellikleri</li>
              <li>Günlük Etkileşim</li>
              <li>Video Form Analizi</li>
              <li>Özel Takviye Rehberi</li>
            </ul>
            <button className="pkg-btn">Seç</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Packages;
