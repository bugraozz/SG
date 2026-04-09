import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import './Panels.css';
import { Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Academy = () => {
  const sectionRef = useRef(null);

  const videos = [
    { title: "Kusursuz Squat Tekniği", duration: "12:45" },
    { title: "Deadlift'te Beli Korumak", duration: "08:30" },
    { title: "Bench Press Güçlendirme", duration: "15:20" },
    { title: "Barbell Row Biomekaniği", duration: "10:15" },
  ];

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const titles = new SplitType('.panel-title', { types: 'lines, words' });
      gsap.set(titles.lines, { overflow: 'hidden' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%", 
          toggleActions: "play none none reverse"
        }
      });

      tl.from(titles.words, { y: '100%', duration: 1.2, ease: "expo.out", stagger: 0.05 })
        .from(".panel-line", { scaleX: 0, opacity: 0, duration: 1.2, ease: "expo.out", transformOrigin: "left" }, "-=0.8")
        .from(".academy-card", {
          opacity: 0,
          scale: 0.9,
          y: 50,
          stagger: 0.15,
          duration: 1.4,
          ease: "expo.out"
        }, "-=1");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="panel-section academy-panel" id="egzersiz" ref={sectionRef}>
      <div className="container panel-container">
        <div className="panel-header">
          <h2 className="panel-title">EGZERSİZ <span className="highlight">AKADEMİSİ</span></h2>
          <div className="panel-line"></div>
        </div>

        <div className="academy-grid">
          {videos.map((vid, idx) => (
            <div key={idx} className="academy-card">
              <div className="academy-thumb">
                <Play className="play-icon" size={40} />
                <span className="duration-tag">{vid.duration}</span>
              </div>
              <h3 className="academy-vid-title">{vid.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Academy;
