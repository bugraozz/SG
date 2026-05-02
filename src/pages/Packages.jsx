import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import './Panels.css';
import { API_URL } from '../config';

gsap.registerPlugin(ScrollTrigger);

const Packages = () => {
  const sectionRef = useRef(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/packages`);
        const data = await res.json();
        if (data.success) {
          setPackages(data.flatData || []);
        }
      } catch (err) {
        console.error("Paketler yüklenirken hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useLayoutEffect(() => {
    if (loading) return;
    
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
  }, [loading, packages]);

  const handleCheckout = (pkg) => {
    // Burada satın alma sayfasına veya modalına yönlendirebiliriz
    // Şimdilik ödeme elementinin href değerini tetikleyebiliriz
    window.location.hash = '#contact'; // ya da #odeme
  };

  return (
    <section className="panel-section packages-panel" id="paketler" ref={sectionRef}>
      <div className="container panel-container">
        <div className="panel-header">
          <h2 className="panel-title">KOÇLUK <span className="highlight">PAKETLERİ</span></h2>
          <div className="panel-line"></div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Yükleniyor...</div>
        ) : (
          <div className="packages-grid">
            {packages.map((pkg) => {
              const isPremium = pkg.btnClass && pkg.btnClass.includes('premium-btn');
              return (
                <div key={pkg.id} className={`package-card ${isPremium ? 'premium-card' : ''}`}>
                  {pkg.badge && <div className="popular-badge">{pkg.badge}</div>}
                  <h3 className="pkg-title">{pkg.name}</h3>
                  <p className="pkg-desc">{pkg.description}</p>
                  <div className="pkg-price">{pkg.price} <span className="period">{pkg.period}</span></div>
                  <ul className="pkg-features">
                    {pkg.features && pkg.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                    {pkg.unavailable && pkg.unavailable.map((unav, idx) => (
                      <li key={`unav-${idx}`} className="unavailable">{unav}</li>
                    ))}
                  </ul>
                  <button className={`pkg-btn ${isPremium ? 'active-btn' : ''}`} onClick={() => handleCheckout(pkg)}>
                    Seç
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Packages;
