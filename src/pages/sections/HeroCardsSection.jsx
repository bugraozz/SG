import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroCardsSection.css';

gsap.registerPlugin(ScrollTrigger);

const HeroCardsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-cards-item',
        { y: 90, opacity: 0, rotation: 0 },
        {
          y: 0,
          opacity: 1,
          rotation: (i, el) => parseFloat(el.dataset.rotation),
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { tag: 'ANTRENMAN', title: 'Kisisel Program', desc: 'Bilimsel verilere dayali, hedefe ozel antrenman programlari ile maksimum verim.', color: '#0145F2', rotation: -10 },
    { tag: 'BESLENME', title: 'Makro Takip', desc: 'Kisisellestirilmis beslenme planlari, makro hesaplamalari ve diyet stratejileri.', color: '#0145F2', rotation: -4 },
    { tag: 'DONUSUM', title: 'Form Takibi', desc: 'Haftalik vucut analizleri, fotograf karsilastirmalari ve ilerleme raporlari.', color: '#0145F2', rotation: 4 },
    { tag: 'DESTEK', title: '7/24 Iletisim', desc: 'WhatsApp ile birebir kocluk destegi, motivasyon saglayan topluluk.', color: '#0145F2', rotation: 10, badge: 'Hedefine Ulas!' },
  ];

  return (
    <section className="hero-cards-section" ref={sectionRef}>
      <div className="container">
        <div className="hero-cards-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className="hero-cards-item"
              style={{ '--card-color': f.color }}
              data-rotation={f.rotation}
            >
              {f.badge && <div className="hero-cards-badge">{f.badge}</div>}
              <span className="hero-cards-tag">{f.tag}</span>
              <h3 className="hero-cards-title">{f.title}</h3>
              <p className="hero-cards-desc">{f.desc}</p>

              <div className="hero-cards-graphics">
                <div className="hero-cards-shape hero-cards-shape-1"></div>
                <div className="hero-cards-shape hero-cards-shape-2"></div>
                <div className="hero-cards-shape hero-cards-shape-3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCardsSection;
