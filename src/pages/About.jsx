import React, { useContext, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { ScrollContext } from './MainBoard';
import './Panels.css';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const scrollTween = useContext(ScrollContext);
  const sectionRef = useRef(null);
  
  useLayoutEffect(() => {
    if (!scrollTween || !sectionRef.current) return;

    let ctx = gsap.context(() => {
      // Metinleri böl
      const titles = new SplitType('.panel-title', { types: 'lines, words' });
      const subtitles = new SplitType('.about-subtitle', { types: 'lines, words' });
      const descs = new SplitType('.about-desc', { types: 'lines, words' });
      
      // Maskeleme için satırlara overflow gizleme ver
      gsap.set([...titles.lines, ...subtitles.lines, ...descs.lines], { overflow: 'hidden' });

      // JSMastery Premium Expo Entry
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          containerAnimation: scrollTween,
          start: "left center",
          toggleActions: "play none none reverse"
        }
      });

      tl.from(titles.words, { y: '100%', duration: 1.2, ease: "expo.out", stagger: 0.05 })
        .from(".panel-line", { scaleX: 0, opacity: 0, duration: 1.2, ease: "expo.out", transformOrigin: "left" }, "-=0.8")
        .from(subtitles.words, { y: '100%', duration: 1.2, ease: "expo.out", stagger: 0.05 }, "-=1")
        .from(descs.words, { y: '100%', duration: 1.2, ease: "expo.out", stagger: 0.015 }, "-=1")
        .from(".stat-box", { scale: 0.9, opacity: 0, y: 40, stagger: 0.1, duration: 1.4, ease: "expo.out" }, "-=1")
        .from(".about-image-placeholder", { scale: 1.05, opacity: 0, duration: 2, ease: "power3.out" }, "-=1.5");
        
    }, sectionRef);

    return () => ctx.revert();
  }, [scrollTween]);

  return (
    <section className="panel-section about-panel" id="hakkimda" ref={sectionRef}>
      <div className="container panel-container">
        <div className="panel-header">
          <h2 className="panel-title">BEN KİMİM?</h2>
          <div className="panel-line"></div>
        </div>
        
        <div className="about-content">
          <div className="about-text-box">
            <h3 className="about-subtitle">SERHAT <span className="highlight">GÜNDAR</span></h3>
            <p className="about-desc">
              Yılların verdiği tecrübe ve bilimsel yaklaşımlarla hazırlanmış antrenman programlarıyla, sadece fiziksel değişimi değil aynı zamanda mental bir evrimi hedefliyorum.
            </p>
            <p className="about-desc">
              Öğrencilerime "Hedef Değil Sistem" felsefesini aşılıyorum. Sıradan diyet listeleri yerine hayat boyu sürdürülebilir bir düzen kurmak için buradayım. Kariyerim boyunca yüzlerce kişinin değişimine rehberlik ettim ve şimdi sıra sende.
            </p>
            <div className="stats-container">
              <div className="stat-box">
                <h4 className="stat-num">500+</h4>
                <p className="stat-label">Başarılı Öğrenci</p>
              </div>
              <div className="stat-box">
                <h4 className="stat-num">10 Yıl</h4>
                <p className="stat-label">Deneyim</p>
              </div>
              <div className="stat-box">
                <h4 className="stat-num">%100</h4>
                <p className="stat-label">Bağlılık</p>
              </div>
            </div>
          </div>
          <div className="about-image-box">
            <div className="about-image-placeholder"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
