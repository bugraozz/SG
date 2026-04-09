import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".test-header > *", 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".testimonial-card", 
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: ".testimonials-grid", start: "top 80%", toggleActions: "play none none none", once: true }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const testimonials = [
    {
      name: "Ahmet K.",
      role: "3 Aylık Öğrenci",
      text: "Serhat hocayla çalışmaya başladığımdan beri 12 kilo verdim. Program tamamen bana özeldi ve hiç aç kalmadım. Hayatımda ilk kez bir sisteme bağlı kalabildim.",
      result: "-12 kg",
      avatar: "AK"
    },
    {
      name: "Elif Ş.",
      role: "6 Aylık Öğrenci",
      text: "Daha önce 5 farklı koçla çalıştım, hiçbiri Serhat hoca kadar detaylı değildi. Her hafta form videolarıma geri bildirim veriyor. Squat tekniğim inanılmaz gelişti.",
      result: "+15 kg kas",
      avatar: "EŞ"
    },
    {
      name: "Murat T.",
      role: "1 Yıllık Öğrenci",
      text: "Sadece fiziksel değil, mental olarak da değiştim. Disiplin, düzen ve özgüven kazandım. WhatsApp desteği gerçekten 7/24, gece 2'de bile yanıt alıyorum.",
      result: "Tam Dönüşüm",
      avatar: "MT"
    },
    {
      name: "Zeynep D.",
      role: "4 Aylık Öğrenci",
      text: "Doğum sonrası 20 kilo almıştım ve hiçbir şey işe yaramıyordu. Serhat hoca sadece 4 ayda beni eski formuma kavuşturdu. Beslenme planı hayat kurtarıcı.",
      result: "-18 kg",
      avatar: "ZD"
    },
  ];

  return (
    <section className="testimonials-section" ref={sectionRef}>
      <div className="container">
        <div className="test-header">
          <span className="test-badge">Başarı Hikayeleri</span>
          <h2 className="test-title">Gerçek İnsanlar,<br/>Gerçek Sonuçlar</h2>
          <p className="test-subtitle">500+ başarılı dönüşüm hikayesinden bazıları</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="tcard-header">
                <div className="tcard-avatar">{t.avatar}</div>
                <div>
                  <h4 className="tcard-name">{t.name}</h4>
                  <span className="tcard-role">{t.role}</span>
                </div>
                <span className="tcard-result">{t.result}</span>
              </div>
              <p className="tcard-text">{t.text}</p>
              <div className="tcard-stars">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
