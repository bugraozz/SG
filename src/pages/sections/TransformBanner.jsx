import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TransformBanner.css';

gsap.registerPlugin(ScrollTrigger);

const TransformBanner = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating emoji animations
      gsap.utils.toArray('.floating-emoji').forEach((el, i) => {
        gsap.to(el, {
          y: `random(-30, 30)`,
          x: `random(-20, 20)`,
          rotation: `random(-15, 15)`,
          duration: `random(2, 4)`,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.3
        });
      });

      // Title animation
      gsap.fromTo(".transform-title-line", 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".transform-subtitle", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: { trigger: ".transform-subtitle", start: "top 85%", toggleActions: "play none none none", once: true }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="transform-section" id="donusum" ref={sectionRef}>
      <div className="container">
        <div className="transform-content">
          <div className="floating-emojis">
            <span className="floating-emoji emoji-1">💪</span>
            <span className="floating-emoji emoji-2">⚡</span>
            <span className="floating-emoji emoji-3">🔥</span>
            <span className="floating-emoji emoji-4">🏆</span>
            <span className="floating-emoji emoji-5">💯</span>
            <span className="floating-emoji emoji-6">🎯</span>
          </div>

          <h2 className="transform-title">
            <div className="transform-title-line">Seni Güçlü,</div>
            <div className="transform-title-line">Disiplinli <span className="emoji-inline">⚡</span> ve</div>
            <div className="transform-title-line">Durdurulamaz <span className="emoji-inline">🔥</span> Yapan</div>
            <div className="transform-title-line">Sistem</div>
          </h2>

          <p className="transform-subtitle">
            En iyi koçlar sadece program yazmaz — sende bir zihniyet değişimi yaratır.
            Serhat Gündar sistemi de bunun için var. Diploman değil, disiplinin konuşur.
            Sadece kod, merak ve pratik.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TransformBanner;
