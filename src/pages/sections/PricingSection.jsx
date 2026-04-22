import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CheckoutModal from './CheckoutModal';
import './PricingSection.css';
import { API_URL } from '../../config';

gsap.registerPlugin(ScrollTrigger);

const PricingSection = () => {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState('online');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allPlans, setAllPlans] = useState({ tekli: [], coklu: [], online: [], msu: [] });
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    // Fetch packages from backend
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/packages`);
        const json = await res.json();
        if (json.success) {
          // backend'den gelen format { tekli: [...], coklu: [...], online: [...] } şeklinde
          setAllPlans({ tekli: [], coklu: [], online: [], msu: [], ...(json.data || {}) });
        }
      } catch (err) {
        console.error("Paketler yüklenemedi", err);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".pricing-header > *", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Update card animations whenever tab changes
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".pricing-card", 
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out", stagger: 0.15 }
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
  }, [activeTab, allPlans]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const resolvePackageImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) return `${API_URL}${url}`;
    return url;
  };

  const currentPlans = allPlans[activeTab] || [];

  return (
    <section className="pricing-section" id="paketler" ref={sectionRef}>
      <div className="container">
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedPlan={selectedPlan} 
      />
        <div className="pricing-header">
          <span className="pricing-badge">Fiyatlandırma</span>
          <h2 className="pricing-title">Sana Uygun Planı Seç</h2>
          <p className="pricing-subtitle">
            Her seviye için tasarlanmış paketlerle hemen başla.
            İstediğin zaman paketini yükselt veya değiştir.
          </p>
        </div>

        <div className="pricing-tabs">
          <button 
            className={`pricing-tab-btn ${activeTab === 'msu' ? 'active' : ''}`}
            onClick={() => setActiveTab('msu')}
          >
            MSÜ Spor Mülakatı
          </button>
          <button 
            className={`pricing-tab-btn ${activeTab === 'online' ? 'active' : ''}`}
            onClick={() => setActiveTab('online')}
          >
            Online Koçluk
          </button>
          <button 
            className={`pricing-tab-btn ${activeTab === 'coklu' ? 'active' : ''}`}
            onClick={() => setActiveTab('coklu')}
          >
            Çoklu Gelişim
          </button>
          <button 
            className={`pricing-tab-btn ${activeTab === 'tekli' ? 'active' : ''}`}
            onClick={() => setActiveTab('tekli')}
          >
            Tekli Gelişim
          </button>
        </div>

        <div className={`pricing-grid ${activeTab === 'online' ? 'grid-4' : ''}`}>
          {currentPlans.map((plan, i) => {
            const backgroundImageUrl = resolvePackageImageUrl(plan.background_image_url);
            const cardStyle = {
              '--plan-color': plan.color,
              ...(backgroundImageUrl
                ? {
                    backgroundImage: `linear-gradient(160deg, rgba(8, 12, 4, 0.68), rgba(8, 12, 4, 0.82)), url(${backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : {})
            };

            const cardContent = (
              <div key={i} className={`pricing-card ${plan.badge ? 'featured-card' : ''} ${backgroundImageUrl ? 'has-custom-bg' : ''}`} style={cardStyle}>
                {plan.badge && (
                  <div className="pricing-popular-badge">{plan.badge}</div>
                )}
                <div className="pricing-card-inner">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-desc">{plan.description}</p>

                  <div className="plan-price-row">
                    <span className="plan-price">{plan.price}</span>
                    <span className="plan-period">{plan.period}</span>
                  </div>

                  <button className={plan.btnClass} onClick={() => handlePlanSelect(plan)}>
                    HEMEN BAŞLA
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
              return cardContent;
            }

            return cardContent;
          })}
        </div>

        <div className="pricing-guarantee">
          <span className="guarantee-icon">🛡️</span>
          <p>Tüm planlamalar hedeflerine en hızlı şekilde ulaşman için bilimsel altyapıyla hazırlanmıştır.</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
