import React, { useContext, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { ScrollContext } from './MainBoard';
import './Panels.css';

gsap.registerPlugin(ScrollTrigger);

const Articles = () => {
  const scrollTween = useContext(ScrollContext);
  const sectionRef = useRef(null);

  const articlesList = [
    { title: "Kas Gelişiminin Bilimsel Temelleri", date: "12 Mar 2026", type: "Antrenman" },
    { title: "Karbonhidratlar Düşman Mı?", date: "05 Mar 2026", type: "Beslenme" },
    { title: "Uyku ve Hipertrofi Arasındaki Bağ", date: "28 Şub 2026", type: "Recovery" },
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
        .from(".article-row", {
          opacity: 0,
          y: 40,
          scale: 0.98,
          stagger: 0.15,
          duration: 1.4,
          ease: "expo.out"
        }, "-=1");

    }, sectionRef);

    return () => ctx.revert();
  }, [scrollTween]);

  return (
    <section className="panel-section articles-panel" id="yazilar" ref={sectionRef}>
      <div className="container panel-container">
        <div className="panel-header">
          <h2 className="panel-title">BİLGİ <span className="highlight">BANKASI</span></h2>
          <div className="panel-line"></div>
        </div>

        <div className="articles-list">
          {articlesList.map((art, idx) => (
            <div key={idx} className="article-row">
              <div className="article-meta">
                <span className="article-type">{art.type}</span>
                <span className="article-date">{art.date}</span>
              </div>
              <h3 className="article-title">{art.title}</h3>
              <button className="article-read-btn">→</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;
