import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Transformations.css';
import { API_URL } from '../../config';

gsap.registerPlugin(ScrollTrigger);

const Transformations = () => {
  const sectionRef = useRef(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchTransformations = () => {
      fetch(`${API_URL}/api/transformations`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data.length > 0) {
            setImages(data.data);
          }
          setLoaded(true);
        })
        .catch(err => {
          console.log("DB bağlanamadı.", err);
          setLoaded(true);
        });
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchTransformations();
        observer.disconnect();
      }
    }, { rootMargin: '300px' });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".tf-header > *",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.1,     
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );
      
      gsap.fromTo(".tf-slider-container, .tf-empty-state",
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loaded]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Resim URL'si kontrolü (Eğer backendden geliyorsa localhost:5000 eklenir, dış linkse direkt)
  const getImageUrl = (url) => {
    if (url && url.startsWith('/uploads/')) return `${API_URL}${url}`;
    return url;
  };

  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[currentIndex] : null;

  return (
    <section className="transformations-section" id="donusum" ref={sectionRef}>
      <div className="container">
        
        <div className="tf-header">
          <span className="tf-badge">GERÇEK SONUÇLAR</span>
          <h2 className="tf-title">DÖNÜŞÜMLER</h2>
          <p className="tf-subtitle">Danışanlarımın elde ettiği gerçek sonuçlar. Sıra sende.</p>
        </div>

        {hasImages ? (
          <>
            <div className="tf-slider-container">
              
              <button className="tf-nav-btn prev-btn" onClick={handlePrev}>
                <ChevronLeft />
              </button>

              <div className="tf-main-view">
                <div className="tf-image-wrapper">
                  <img loading="lazy" src={getImageUrl(currentImage.image_url)} alt="Transformation Before After" className="tf-main-image" />
                  <div className="tf-counter">
                    <span className="tf-current">{currentIndex + 1}</span> / {images.length}
                  </div>
                </div>
              </div>

              <button className="tf-nav-btn next-btn" onClick={handleNext}>
                <ChevronRight />
              </button>
            </div>

            <div className="tf-thumbnails-track">
              {images.map((img, idx) => (
                 <div 
                   key={img.id} 
                   className={`tf-thumbnail ${idx === currentIndex ? 'active' : ''}`}
                   onClick={() => setCurrentIndex(idx)}
                 >
                   <img loading="lazy" src={getImageUrl(img.image_url)} alt="thumb" />
                 </div>
              ))}
            </div>
          </>
        ) : loaded ? (
          <div className="tf-empty-state">
            <div className="tf-empty-icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="56" height="44" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx="22" cy="28" r="6" stroke="currentColor" strokeWidth="2" />
                <path d="M4 42L20 30L32 40L44 26L60 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30 18H34M32 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M46 20H50M48 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="tf-empty-title">Dönüşümler Yakında Eklenecek</h3>
            <p className="tf-empty-text">
              Gerçek danışan dönüşüm fotoğrafları çok yakında burada olacak.<br />
              Takipte kal, ilham verici sonuçlar yolda!
            </p>
            <div className="tf-empty-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        ) : null}

      </div>
    </section>
  );
};

export default Transformations;