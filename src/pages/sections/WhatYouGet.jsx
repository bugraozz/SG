import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WhatYouGet.css';

gsap.registerPlugin(ScrollTrigger);

const WhatYouGet = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".wyg-header > *",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".wyg-item",
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: ".wyg-list", start: "top 80%", toggleActions: "play none none none", once: true }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const items = [
    {
      title: "Scroll-Triggered Vücut Dönüşüm Planı",
      tags: ["Antrenman", "Periodizasyon", "Pratik"],
      desc: "Hedefine göre hazırlanmış, her hafta güncellenen kişisel antrenman programı."
    },
    {
      title: "Makro-Bazlı Kişisel Beslenme Planı",
      tags: ["Beslenme", "Makro Takip", "Strateji"],
      desc: "Kilona, aktivite seviyene ve hedefine göre hesaplanmış beslenme programı."
    },
    {
      title: "Haftalık Video Form Analizi",
      tags: ["Form Kontrolü", "Video", "Teknik"],
      desc: "Gönderdiğin egzersiz videolarını analiz edip detaylı geri bildirim veriyorum."
    },
    {
      title: "7/24 WhatsApp Koçluk Desteği",
      tags: ["İletişim", "Motivasyon", "Rehberlik"],
      desc: "Sorularını anında yanıtlıyorum. Motivasyon düştüğünde seni ayağa kaldırıyorum."
    },
    {
      title: "Aylık İlerleme Raporu ve Analiz",
      tags: ["Veri Analizi", "İlerleme", "Karşılaştırma"],
      desc: "Her ay detaylı vücut analizi, fotoğraf karşılaştırması ve performans raporu."
    },
  ];

  return (
    <section className="wyg-section" ref={sectionRef}>
      <div className="container">
        <div className="wyg-header">
          <h2 className="wyg-title">Bu Sistemle Neler<br />Elde Edeceksin</h2>
          <p className="wyg-subtitle">
            Programa katıldığında, hedeflerine ulaşman için gereken her şeyi yanında bulacaksın:
          </p>
        </div>

        <div className="wyg-list">
          {items.map((item, i) => (
            <div key={i} className="wyg-item">
              <div className="wyg-index">{(i + 1).toString().padStart(2, '0')}</div>
              <div className="wyg-content">
                <h3 className="wyg-item-title">{item.title}</h3>
                <div className="wyg-tags">
                  {item.tags.map((tag, j) => (
                    <span key={j} className="wyg-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <p className="wyg-item-desc">{item.desc}</p>
              <div className="wyg-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGet;
