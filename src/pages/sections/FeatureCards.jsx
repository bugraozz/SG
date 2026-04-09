import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FeatureCards.css';

gsap.registerPlugin(ScrollTrigger);

const FeatureCards = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".why-badge",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".why-heading",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".why-sub",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: ".why-sub", start: "top 85%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".why-card",
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: ".why-cards-grid", start: "top 80%", toggleActions: "play none none none", once: true }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const cards = [
    {
      num: "01",
      badge: "Bilimsel Yaklaşım",
      title: "Kanıta Dayalı Programlar",
      desc: "Her program akademik araştırmalara ve spor bilimi verilerine dayanır. Rastgele değil, sistemli çalışırsın.",
      color: "#0145F2",
      items: ["Periodizasyon planlaması", "Kas hipertrofisi prensipleri", "Progressif overload takibi"]
    },
    {
      num: "02",
      badge: "Kişiselleştirme",
      title: "Sana Özel Her Detay",
      desc: "Vücut tipine, deneyimine ve hedefine göre tamamen özelleştirilmiş antrenman ve beslenme.",
      color: "#0145F2",
      items: ["Vücut tipi analizi", "Metabolizma hızı hesaplaması", "Hedef bazlı programlama"]
    },
    {
      num: "03",
      badge: "Gerçek Sonuçlar",
      title: "Kanıtlanmış Dönüşümler",
      desc: "500'den fazla başarılı dönüşüm hikayesi. Gerçek insanlar, gerçek sonuçlar, gerçek değişim.",
      color: "#0145F2",
      items: ["Haftalık ilerleme fotoğrafları", "Vücut ölçüm takibi", "Before/After dokümantasyonu"]
    },
    {
      num: "04",
      badge: "Sürekli Destek",
      title: "Asla Yalnız Değilsin",
      desc: "7/24 WhatsApp desteği, video form analizi ve motivasyon koçluğu ile her adımda yanındayım.",
      color: "#0145F2",
      items: ["Anlık mesajlaşma", "Video form kontrolü", "Haftalık check-in görüşmeleri"]
    }
  ];

  return (
    <section className="why-section" id="hizmetler" ref={sectionRef}>
      <div className="container">
        <div className="why-header">
          <span className="why-badge">Neden Serhat Gündar?</span>
          <h2 className="why-heading">
            Türkiye'nin en güvenilir online<br />
            fitness koçluk sistemi
          </h2>
          <p className="why-sub">
            Sadece program yazmıyorum — hayatını değiştirecek bir sistem kuruyorum.
          </p>
        </div>

        <div className="why-cards-grid">
          {cards.map((card, i) => (
            <div key={i} className="why-card" style={{ '--card-accent': card.color }}>
              <div className="why-card-inner">
                <span className="why-card-badge">{card.badge}</span>
                <span className="why-card-num">{card.num}</span>
                <h3 className="why-card-title">{card.title}</h3>
                <p className="why-card-desc">{card.desc}</p>
                <ul className="why-card-list">
                  {card.items.map((item, j) => (
                    <li key={j}>
                      <span className="list-arrow">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
