import React from 'react';
import './BrandMarquee.css';

const BrandMarquee = () => {
  const logos = [
    { src: "/images/drsupplement-logo-small.webp", alt: "DR Supplement", href: "https://drsupplement.com.tr/" },
    { src: "/images/ironathletics-logo-small.webp", alt: "Iron Athletics Club", href: "https://ironathleticsclub.com/" }
  ];

  // Create enough items to fill the screen
  const baseItems = [...logos, ...logos, ...logos, ...logos];
  
  // Duplicate exactly once to create two identical halves for the 50% translation
  const renderItems = [...baseItems, ...baseItems];

  return (
    <section className="marquee-section">
      <div className="marquee-container">
        <div className="marquee-track">
          {renderItems.map((logo, i) => (
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
