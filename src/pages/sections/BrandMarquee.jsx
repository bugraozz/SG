import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './BrandMarquee.css';

const BrandMarquee = () => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const marqueeInner = document.querySelector('.marquee-track');
      if (!marqueeInner) return;

      // Read scrollWidth before modifying DOM to avoid forced synchronous layout
      const originalWidth = marqueeInner.scrollWidth;

      // Clone for seamless loop
      const clone = marqueeInner.innerHTML;
      marqueeInner.innerHTML += clone;

      gsap.to(marqueeInner, {
        x: -originalWidth,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  const logos = [
    { src: "/images/drsupplement-logo-small.webp", alt: "DR Supplement", href: "https://drsupplement.com.tr/" },
    { src: "/images/ironathletics-logo-small.webp", alt: "Iron Athletics Club", href: "https://ironathleticsclub.com/" }
  ];

  // Repeat logos a few times so the track is wide enough to loop properly
  const repeatedLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="marquee-section" ref={marqueeRef}>

      <div className="marquee-container">
        <div className="marquee-track">
          {repeatedLogos.map((logo, i) => (
            <a
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
              className="marquee-item"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="sponsor-logo"
                loading="lazy"
                width="150"
                height="50"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandMarquee;
