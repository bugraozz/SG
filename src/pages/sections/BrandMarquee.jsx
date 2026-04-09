import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './BrandMarquee.css';

const BrandMarquee = () => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const marqueeInner = document.querySelector('.marquee-track');
      if (!marqueeInner) return;

      // Clone for seamless loop
      const clone = marqueeInner.innerHTML;
      marqueeInner.innerHTML += clone;

      const totalWidth = marqueeInner.scrollWidth / 2;

      gsap.to(marqueeInner, {
        x: -totalWidth,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  const brands = [
    "PROTEINOCEAN", "MYPROTEIN", "OPTIMUM NUTRITION", "BSN",
    "MUSCLETECH", "CELLUCOR", "DYMATIZE", "UNIVERSAL",
    "RULE ONE", "GHOST LIFESTYLE", "RAW NUTRITION", "GORILLA MIND"
  ];

  return (
    <section className="marquee-section" ref={marqueeRef}>
      <div className="marquee-container">
        <div className="marquee-track">
          {brands.map((brand, i) => (
            <div key={i} className="marquee-item">
              <span className="marquee-brand">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandMarquee;
