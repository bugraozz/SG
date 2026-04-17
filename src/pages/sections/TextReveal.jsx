import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TextReveal.css';

gsap.registerPlugin(ScrollTrigger);

const TextReveal = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = textRef.current.querySelectorAll('.reveal-word');
      
      // Pin the section and reveal words as user scrolls
      gsap.fromTo(words, 
        {
          color: "rgba(237,241,245,0)",
          backgroundColor: "rgba(1,69,242,0.18)"
        },
        {
          color: (i, el) => {
            if (el.classList.contains('highlight-red')) return "#E8E4D9";
            if (el.classList.contains('highlight-green')) return "#E8E4D9";
            return "#B8C4A2";
          },
          backgroundColor: (i, el) => {
            if (el.classList.contains('highlight-red')) return "#556B2F";
            if (el.classList.contains('highlight-green')) return "#6B8E23";
            return "transparent";
          },
          stagger: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "center center",
            end: "+=150%", // Increased for slower, smoother readable scrolling
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const paragraph1 = "Şunu bil: harika bir vücut sadece güzel görünmek için değil.";
  const paragraph2Words = [
    { text: "İnsanların", highlight: false },
    { text: "seni", highlight: false },
    { text: "ciddiye", highlight: false },
    { text: "almasını,", highlight: false },
    { text: "kendine", highlight: false },
    { text: "güvenmeni", highlight: false },
    { text: "ve", highlight: false },
    { text: "hayatının", highlight: false },
    { text: "kontrolünü", highlight: false },
    { text: "ele", highlight: false },
    { text: "almak", highlight: false },
    { text: "için", highlight: false },
    { text: "var.", highlight: false },
  ];
  const paragraph3Words = [
    { text: "Sorun", highlight: "red" },
    { text: "ne?", highlight: false },
    { text: "Çoğu", highlight: false },
    { text: "koç", highlight: false },
    { text: "\"neden\"i", highlight: false },
    { text: "atlar", highlight: false },
    { text: "ve", highlight: false },
    { text: "işe", highlight: false },
    { text: "yaramayan", highlight: false },
    { text: "hazır", highlight: false },
    { text: "şablonları", highlight: false },
    { text: "satar.", highlight: false },
    { text: "Sen", highlight: false },
    { text: "de", highlight: false },
    { text: "kopyala-yapıştır", highlight: false },
    { text: "diyetler", highlight: false },
    { text: "deneyip", highlight: false },
    { text: "sonuç", highlight: false },
    { text: "alamazsın.", highlight: false },
  ];
  const paragraph4Words = [
    { text: "Bu", highlight: false },
    { text: "sistem", highlight: false },
    { text: "farklı.", highlight: "green" },
    { text: "Sana", highlight: false },
    { text: "her", highlight: false },
    { text: "egzersizin,", highlight: false },
    { text: "her", highlight: false },
    { text: "besin", highlight: false },
    { text: "maddesinin", highlight: false },
    { text: "arkasındaki", highlight: false },
    { text: "bilimi", highlight: false },
    { text: "öğretiyorum.", highlight: false },
    { text: "\"Neden\"ini", highlight: false },
    { text: "anladığında,", highlight: false },
    { text: "\"nasıl\"ı", highlight: false },
    { text: "zaten", highlight: false },
    { text: "kendin", highlight: false },
    { text: "çözersin.", highlight: false },
  ];

  const renderWord = (wordObj, index) => {
    let className = "reveal-word";
    if (wordObj.highlight === "red") className += " highlight-red";
    if (wordObj.highlight === "green") className += " highlight-green";
    return <span key={index} className={className}>{wordObj.text}</span>;
  };

  return (
    <section className="text-reveal-section" ref={sectionRef}>
      <div className="text-reveal-container" ref={textRef}>
        <p className="reveal-paragraph">
          {paragraph1.split(' ').map((word, i) => (
            <span key={i} className="reveal-word">{word}</span>
          ))}
        </p>
        <p className="reveal-paragraph">
          {paragraph2Words.map((w, i) => renderWord(w, i))}
        </p>
        <p className="reveal-paragraph">
          {paragraph3Words.map((w, i) => renderWord(w, i))}
        </p>
        <p className="reveal-paragraph">
          {paragraph4Words.map((w, i) => renderWord(w, i))}
        </p>
      </div>
    </section>
  );
};

export default TextReveal;
