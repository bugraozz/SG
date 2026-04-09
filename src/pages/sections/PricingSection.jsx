import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ElectricBorder from '../../components/ElectricBorder';
import './PricingSection.css';

gsap.registerPlugin(ScrollTrigger);

const PricingSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".pricing-header > *", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".pricing-card", 
        { y: 80, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "expo.out", stagger: 0.2,
          scrollTrigger: { trigger: ".pricing-grid", start: "top 80%", toggleActions: "play none none none", once: true }
        }
      );

      // 3D tilt effect on hover
      const cards = document.querySelectorAll('.pricing-card');
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: x * 8,
            rotateX: -y * 8,
            duration: 0.3,
            ease: "power2.out",
            transformPerspective: 800,
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateY: 0, rotateX: 0, duration: 0.5, ease: "elastic.out(1, 0.5)"
          });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const plans = [
    {
      name: "Standart",
      badge: null,
      price: "1.500₺",
      period: "/ay",
      desc: "Başlangıç seviyesi için ideal temel paket.",
      features: [
        "Kişiye özel antrenman programı",
        "Aylık ilerleme takibi",
        "Haftalık soru-cevap desteği",
        "Temel beslenme rehberi",
      ],
      unavailable: [
        "Video form analizi",
        "7/24 WhatsApp desteği",
        "Kişisel beslenme planı",
      ],
      color: "var(--accent-blue)",
      btnClass: "pricing-btn",
    },
    {
      name: "Premium",
      badge: "En Çok Tercih Edilen",
      price: "2.500₺",
      period: "/ay",
      desc: "Ciddi dönüşüm arayanlar için eksiksiz paket.",
      features: [
        "Kişiye özel antrenman programı",
        "Kişiselleştirilmiş beslenme planı",
        "7/24 WhatsApp desteği",
        "Haftalık form kontrolü",
        "Video form analizi",
        "Aylık vücut analizi raporu",
      ],
      unavailable: [],
      color: "#ca0d1c",
      btnClass: "pricing-btn premium-btn",
    },
    {
      name: "Elite",
      badge: null,
      price: "4.000₺",
      period: "/ay",
      desc: "Tam kapsamlı birebir VIP danışmanlık.",
      features: [
        "Tüm Premium özellikleri",
        "Günlük etkileşim ve takip",
        "Video form analizi (sınırsız)",
        "Özel takviye rehberi",
        "Haftalık video görüşme",
        "Öncelikli destek hattı",
      ],
      unavailable: [],
      color: "var(--accent-magenta)",
      btnClass: "pricing-btn elite-btn",
    }
  ];

  return (
    <section className="pricing-section" id="paketler" ref={sectionRef}>
      <div className="container">
        <div className="pricing-header">
          <span className="pricing-badge">Fiyatlandırma</span>
          <h2 className="pricing-title">Sana Uygun Planı Seç</h2>
          <p className="pricing-subtitle">
            Her seviye için tasarlanmış paketlerle hemen başla.
            İstediğin zaman paketini yükselt veya değiştir.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, i) => {
            const cardContent = (
              <div key={i} className={`pricing-card ${plan.badge ? 'featured-card' : ''}`} style={{ '--plan-color': plan.color }}>
                {plan.badge && (
                  <div className="pricing-popular-badge">{plan.badge}</div>
                )}
                <div className="pricing-card-inner">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-desc">{plan.desc}</p>

                  <div className="plan-price-row">
                    <span className="plan-price">{plan.price}</span>
                    <span className="plan-period">{plan.period}</span>
                  </div>

                  <button className={plan.btnClass}>
                    Hemen Başla
                  </button>

                  <div className="plan-features">
                    {plan.features.map((f, j) => (
                      <div key={j} className="plan-feature">
                        <span className="feature-check">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                    {plan.unavailable.map((f, j) => (
                      <div key={`u-${j}`} className="plan-feature unavailable">
                        <span className="feature-x">✕</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );

            if (plan.badge) {
              return (
                <ElectricBorder
                  key={i}
                  color="#f50a0a"
                  speed={0.50}
                  chaos={0.12}
                  thickness={4}
                  style={{ borderRadius: 20 }}
                  className="premium-card-electric"
                >
                  {cardContent}
                </ElectricBorder>
              );
            }

            return cardContent;
          })}
        </div>

        <div className="pricing-guarantee">
          <span className="guarantee-icon">🛡️</span>
          <p>İlk 7 gün içinde memnun kalmazsan, ödediğin tutarın tamamını iade ediyorum. Hiçbir risk yok.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
