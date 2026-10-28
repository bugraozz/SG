import React from 'react';
import './BrandMarquee.css';

const BrandMarquee = () => {
  const logos = [
    { src: "/images/proteinocean-logo.svg", alt: "Protein Ocean", href: "https://proteinocean.com/", width: 150, height: 62 },
    { src: "/images/buffwear-logo.png", alt: "Buffwear", href: "https://www.buffwear.com.tr/", width: 240, height: 28, wide: true }
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
                className={`sponsor-logo${logo.wide ? ' sponsor-logo--wide' : ''}`}
                loading="lazy"
                width={logo.width}
                height={logo.height}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandMarquee;
