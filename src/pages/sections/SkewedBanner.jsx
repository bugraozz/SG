import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SkewedBanner.css';

gsap.registerPlugin(ScrollTrigger);

const SkewedBanner = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-driven horizontal movement of strips
      const strips = gsap.utils.toArray('.skew-strip');
      
      strips.forEach((strip, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        gsap.fromTo(strip.querySelector('.strip-content'), 
          { x: direction * 200 },
          {
            x: direction * -200,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            }
          }
        );
      });

      // Scale in the section
      gsap.fromTo(sectionRef.current, 
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const strips = [
    { text: "ANTRENMAN PROGRAMI", icon: "💪", color: "#EDF1F5", textColor: "#0145F2" },
    { text: "BESLENME PLANI", icon: "🥗", color: "#0145F2", textColor: "#EDF1F5" },
    { text: "FORM TAKİBİ", icon: "📊", color: "rgba(1, 69, 242, 0.16)", textColor: "#0145F2" },
  ];

  return (
    <section className="skewed-section" ref={sectionRef}>
      <div className="skewed-container">
        {strips.map((strip, i) => (
          <div 
            key={i} 
            className="skew-strip"
            style={{ 
              background: strip.color,
              transform: `rotate(${-3 + i * 2}deg)`,
            }}
          >
            <div className="strip-content">
              {Array(6).fill(null).map((_, j) => (
                <span key={j} className="strip-item" style={{ color: strip.textColor }}>
                  <span className="strip-icon">{strip.icon}</span>
                  <span className="strip-text">{strip.text}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkewedBanner;
