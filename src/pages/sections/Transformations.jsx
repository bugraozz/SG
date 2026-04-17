import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Transformations.css';

gsap.registerPlugin(ScrollTrigger);

const Transformations = () => {
  const sectionRef = useRef(null);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 1. Backend'den fotoğrafları çek (Şimdilik örnek datalar varsa ona düşecek, yoksa boş)
    fetch('http://localhost:5000/api/transformations')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setImages(data.data);
        } else {
          // Backend boşsa veya kapalıysa örnek "Placeholder" görseller ekle (Test için)
          setImages([
            { id: '1', image_url: 'https://via.placeholder.com/800x600/1a1a1a/cpcp?text=Before+After+1' },
            { id: '2', image_url: 'https://via.placeholder.com/800x600/1a1a1a/cpcp?text=Before+After+2' },
            { id: '3', image_url: 'https://via.placeholder.com/800x600/1a1a1a/cpcp?text=Before+After+3' }
          ]);
        }
      })
      .catch(err => {
        console.log("DB bağlanamadı, test verileri yükleniyor.", err);
        setImages([
          { id: '1', image_url: 'https://via.placeholder.com/800x600/1a1a1a/cpcp?text=Before+After+1' },
          { id: '2', image_url: 'https://via.placeholder.com/800x600/1a1a1a/cpcp?text=Before+After+2' },
          { id: '3', image_url: 'https://via.placeholder.com/800x600/1a1a1a/cpcp?text=Before+After+3' }
        ]);
      });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".tf-header > *",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.1,     
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );
      
      gsap.fromTo(".tf-slider-container",
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  // Resim URL'si kontrolü (Eğer backendden geliyorsa localhost:5000 eklenir, dış linkse direkt)
  const getImageUrl = (url) => {
    if (url && url.startsWith('/uploads/')) return `http://localhost:5000${url}`;
    return url;
  };

  return (
    <section className="transformations-section" id="donusumler" ref={sectionRef}>
      <div className="container">
        
        <div className="tf-header">
          <span className="tf-badge">GERÇEK SONUÇLAR</span>
          <h2 className="tf-title">DÖNÜŞÜMLER</h2>
          <p className="tf-subtitle">Danışanlarımın elde ettiği gerçek sonuçlar. Sıra sende.</p>
        </div>

        <div className="tf-slider-container">
          
          <button className="tf-nav-btn prev-btn" onClick={handlePrev}>
            <ChevronLeft />
          </button>

          <div className="tf-main-view">
            <div className="tf-image-wrapper">
              <img src={getImageUrl(currentImage.image_url)} alt="Transformation Before After" className="tf-main-image" />
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
               <img src={getImageUrl(img.image_url)} alt="thumb" />
             </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Transformations;