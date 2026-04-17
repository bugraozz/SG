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
        
        // Hepsine aynı eğimi veriyoruz (düz değil ama birbirine paralel, düzenli bir görünüm)
        const rot = -4; 
        
        gsap.fromTo(strip.querySelector('.strip-content'), 
          { x: `${direction * 25}vw` },
          {
            x: `${direction * -25}vw`,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            }
          }
        );

        // Akıcı paralaks efekti - açıları bozmadan, hepsi birlikte hafifçe eğilir.
        gsap.fromTo(strip,
          { scale: 1.05, rotation: rot },
          {
            scale: 1,
            rotation: rot - 1, // Beraber çok hafif bir esneme yapar, düzeni bozmaz
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            }
          }
        );
      });

      // Scale and rotate in the section background
      gsap.fromTo(sectionRef.current, 
        { scale: 0.9, opacity: 0, rotationX: 15 },
        { scale: 1, opacity: 1, rotationX: 0, duration: 1.5, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const strips = [
    { 
      text: "ANTRENMAN PROGRAMI", 
      icon: (
        <svg className="inline-block w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6.53 17.47l-1.41-1.41M17.47 6.53l1.41 1.41M6 14l-2.12-2.12a1.002 1.002 0 010-1.41l1.41-1.41M18 10l2.12 2.12a1.002 1.002 0 010 1.41l-1.41 1.41M13.41 12l2.83-2.83c.78-.78.78-2.05 0-2.83l-1.41-1.41c-.78-.78-2.05-.78-2.83 0L9.17 7.76M10.59 12l-2.83 2.83c-.78.78-.78 2.05 0 2.83l1.41 1.41c.78.78 2.05.78 2.83 0l2.83-2.83M12 12l-6 6M12 12l6-6"/>
        </svg>
      ), 
      color: "#E8E4D9", 
      textColor: "#2C3E1F" 
    },
    { 
      text: "BESLENME PLANI", 
      icon: (
        <svg className="inline-block w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/>
        </svg>
      ), 
      color: "#4A5D23", 
      textColor: "#E8E4D9" 
    },
    { 
      text: "FORM TAKİBİ", 
      icon: (
        <svg className="inline-block w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ), 
      color: "rgba(107, 142, 35, 0.16)", 
      textColor: "#C4A35A" 
    },
  ];

  return (
    <section className="skewed-section" ref={sectionRef}>
      <div className="skewed-container">
        {strips.map((strip, i) => {
          // Bütün bantlar standart ve düzgün duracak şekilde aynı derecede eğik (-4deg)
          const uniformRot = -4; 
          return (
            <div 
              key={i} 
              className="skew-strip"
              style={{ 
                background: strip.color,
                transform: `rotate(${uniformRot}deg)`,
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
          );
        })}
      </div>
    </section>
  );
};

export default SkewedBanner;
