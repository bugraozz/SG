import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import './Home.css';
// TODO: Vücut geliştirici görselini ekle
// import bodyBuilderImage from '../assets/bodybuilder.png'; 

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Animation
      const tl = gsap.timeline();
      
      tl.from(".discount-badge", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: 0.2
      })
      .from(".hero-title-line", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power4.out"
      }, "-=0.4")
      .from(".hero-desc", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4")
      .from(".hero-actions", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4")
      .from(".hero-image", {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=1");

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="home-wrapper">
      <section className="hero-section" ref={heroRef}>
        <div className="container hero-container">
          
          <div className="hero-content" ref={textRef}>
            <div className="discount-badge">
              <div className="discount-tag">%10 İndirim</div>
              <div className="discount-text">
                <span className="tiny-text">Proteinocean'da</span>
                <span className="code-text">ALAF10</span>
              </div>
              <ChevronRight size={18} className="discount-icon" />
            </div>

            <h1 className="hero-title">
              <div className="hero-title-line">HEDEF DEĞİL</div>
              <div className="hero-title-line highlight">SİSTEM</div>
            </h1>

            <p className="hero-desc">
              Türkiye'nin önde gelen <strong className="white-text">online fitness koçluk</strong> platformu. Kişiselleştirilmiş antrenman ve beslenme programlarıyla <strong className="white-text">vücut geliştirme</strong> hedeflerine ulaş. Bilimsel veriler, disiplinli takip ve birebir koçluk desteğiyle potansiyelini açığa çıkar.
            </p>

            <div className="hero-actions">
              <button className="primary-btn hero-btn">HEMEN BAŞLA</button>
            </div>
          </div>

          <div className="hero-visual" ref={imageRef}>
            {/* Using a placeholder div with the red aura style until image is linked */}
            <div className="hero-image placeholder-image"></div>
          </div>

        </div>
        
        <div className="scroll-indicator">
          <span>AŞAĞI KAYDIR</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
