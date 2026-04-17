import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WhySection.css';

gsap.registerPlugin(ScrollTrigger);

const WhySection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".advantage-badge",
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".advantage-title",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".advantage-subtitle",
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".advantage-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out", stagger: 0.2,
          scrollTrigger: { trigger: ".advantage-cards", start: "top 80%", toggleActions: "play none none none", once: true }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const advantages = [
    {
      title: "Performans Sıçraması",
      text: "Profesyonel programlama ile güç, hacim ve kondisyon artışını daha kısa sürede gör.",
      points: ["Sistemli yük artışı", "Hedef odaklı dönemleme", "Ölçülebilir ilerleme"],
      customClass: "tilt-left"
    },
    {
      title: "Disiplin ve Süreklilik",
      text: "Koçluk sistemi motivasyon dalgalansa bile seni rotada tutar ve istikrar sağlar.",
      points: ["Haftalık kontrol", "Sürdürülebilir rutin", "Birebir geri bildirim"],
      customClass: "center-down"
    },
    {
      title: "Daha Hızlı Dönüşüm",
      text: "Bilimsel beslenme stratejisiyle yağ kaybı ve kas gelişimini aynı anda optimize et.",
      points: ["Kişiye özel makro plan", "Esnek beslenme yaklaşımı", "Net sonuç takibi"],
      customClass: "tilt-right"
    }
  ];

  return (
    <section className="advantage-section" id="avantajlar" ref={sectionRef}>
      <div className="container">
        <div className="advantage-header">
          <span className="advantage-badge">Sana Ne Kazandırır</span>
          <h2 className="advantage-title">Bunun Senin İçin Anlamı:</h2>
          <p className="advantage-subtitle">
            Bu sistem, yalnızca antrenman değil; sonuç üreten bir çalışma düzeni kazandırır.
          </p>
        </div>

        <div className="advantage-cards">
          {advantages.map((adv, i) => (
            <div key={i} className={`advantage-card ${adv.customClass}`}>
              <div className="advantage-card-inner">
                <span className="advantage-card-no">0{i + 1}</span>
                <h3 className="advantage-card-title">{adv.title}</h3>
                <p className="advantage-text">{adv.text}</p>
                <ul className="advantage-points">
                  {adv.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
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

export default WhySection;
