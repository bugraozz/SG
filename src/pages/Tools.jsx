import React, { useContext, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { ScrollContext } from './MainBoard';
import './Panels.css';

gsap.registerPlugin(ScrollTrigger);

const Tools = () => {
  const scrollTween = useContext(ScrollContext);
  const sectionRef = useRef(null);

  const toolsList = [
    { title: "Makro Hesaplayıcı", desc: "Günlük kalori ve makro ihtiyacını hedefine göre anında hesapla.", icon: "📊" },
    { title: "1RM Hesaplayıcı", desc: "Maksimum kaldırış ağırlığını formüllerle güvenle tahmin et.", icon: "💪" },
    { title: "Yağ Oranı Testi", desc: "Vücut ölçülerini girerek tahmini yağ oranını öğren.", icon: "⚖️" },
    { title: "Su İhtiyacı", desc: "Fiziksel aktivite ve kilona göre ne kadar su içmen gerektiğini bul.", icon: "💧" }
  ];

  useLayoutEffect(() => {
    if (!scrollTween || !sectionRef.current) return;

    let ctx = gsap.context(() => {
      const titles = new SplitType('.panel-title', { types: 'lines, words' });
      gsap.set(titles.lines, { overflow: 'hidden' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          containerAnimation: scrollTween,
          start: "left 70%",
          toggleActions: "play none none reverse"
        }
      });

      tl.from(titles.words, { y: '100%', duration: 1.2, ease: "expo.out", stagger: 0.05 })
        .from(".panel-line", { scaleX: 0, opacity: 0, duration: 1.2, ease: "expo.out", transformOrigin: "left" }, "-=0.8")
        .from(".tool-card", {
          scale: 0.9,
          opacity: 0,
          y: 60,
          stagger: 0.15,
          duration: 1.4,
          ease: "expo.out"
        }, "-=1");

    }, sectionRef);

    return () => ctx.revert();
  }, [scrollTween]);

  return (
    <section className="panel-section tools-panel" id="araclar" ref={sectionRef}>
      <div className="container panel-container">
        <div className="panel-header">
          <h2 className="panel-title">FİTNESS <span className="highlight">ARAÇLARI</span></h2>
          <div className="panel-line"></div>
        </div>

        <div className="tools-grid">
          {toolsList.map((tool, idx) => (
            <div key={idx} className="tool-card">
              <div className="tool-icon">{tool.icon}</div>
              <h3 className="tool-title">{tool.title}</h3>
              <p className="tool-desc">{tool.desc}</p>
              <button className="tool-btn">Kullan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
