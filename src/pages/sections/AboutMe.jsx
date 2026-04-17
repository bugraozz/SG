import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Telescope, Medal, Award } from 'lucide-react';
import './AboutMe.css';

gsap.registerPlugin(ScrollTrigger);

const AboutMe = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for scroll reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
          once: true
        }
      });

      tl.fromTo(".about-header", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
        .fromTo(".about-content-body", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.6")
        .fromTo(".about-mv-box", { scale: 0.9, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, stagger: 0.2, duration: 0.8 }, "-=0.4");
        
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about-section" id="hakkimda" ref={sectionRef}>
      <div className="container">
        
        <div className="about-wrapper">
          <div className="about-left">
            <div className="about-header">
              <span className="about-badge">HAKKIMDA</span>
              <h2 className="about-title">SERHAT GÜNDAR KİMDİR?</h2>
              <div className="about-line"></div>
            </div>
            
            <div className="about-content-body">
              <div className="about-text-block">
                <p>
                  2001 yılında Sivas'ta doğdum. 17 yaşında Kara Harp Okulu'na girdim ve 2024 yılında Topçu Teğmen olarak mezun oldum. Kamuoyunda &quot;Mustafa Kemal'in askerleriyiz&quot; dedikleri için TSK'dan ihraç edilen teğmenlerden biri olarak ihraç edildim.
                </p>
                <p>
                  Daha sonrasında antrenör ve sporculuk alanında kendimi geliştirerek bir kariyer inşa ettim. Şu anda Türkiye Vücut Geliştirme, Fitness ve Bilek Güreşi Federasyonu'na (TVGFBF) kayıtlı <strong>1. Kademe Fitness ve Vücut Geliştirme Antrenörüyüm</strong>. Bugüne kadar 50'den fazla danışan öğrencime hedeflerine ulaşmaları yolunda rehberlik ederek hayallerindeki fiziğe ulaşmalarını sağladım.
                </p>
              </div>

              <div className="about-achievements">
                <div className="achievement-item">
                  <Medal className="achievement-icon" />
                  <div>
                    <h4>Ankara Şampiyonası 2.'liği</h4>
                    <span>TVGFBF -179 Büyük Erkekler Fizik</span>
                  </div>
                </div>
                <div className="achievement-item">
                  <Award className="achievement-icon" />
                  <div>
                    <h4>Balkan Şampiyonası 4.'lüğü</h4>
                    <span>IFBB Men's Physique Open (Milli Sporcu)</span>
                  </div>
                </div>
              </div>

              <p className="about-highlight">
                Şu anda da antrenörlük ve sporcu kariyerimi en üst seviyede geliştirmeye devam etmekteyim.
              </p>
            </div>
          </div>

          <div className="about-right">
            <div className="about-mv-box mission-box">
              <div className="mv-icon-wrapper">
                <Target className="mv-icon lucide" />
              </div>
              <div className="mv-content">
                <h3>MİSYONUM</h3>
                <p>
                  Danışanlarımın hedeflerine en hızlı ve kolay yoldan ulaşmalarını sağlamak adına, kişiye ve hedefe özel hazırladığım ayrıntılı planlamalarla sonuca net bir şekilde ulaşmak.
                </p>
              </div>
            </div>
            
            <div className="about-mv-box vision-box">
              <div className="mv-icon-wrapper">
                <Telescope className="mv-icon lucide" />
              </div>
              <div className="mv-content">
                <h3>VİZYONUM</h3>
                <p>
                  Danışanlarımı sadece hedeflerine ulaştırmakla kalmayıp, bundan sonra süregelen hayatlarında düzenli beslenme ve spor alışkanlığı kazandırmak. Online eğitim sistemime giren herkesin, süre bitiminden sonraki hayatı boyunca kullanabileceği bilgi ve tecrübeyi kazanmalarını sağlamak.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutMe;