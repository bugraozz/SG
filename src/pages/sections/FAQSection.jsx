import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FAQSection.css';

gsap.registerPlugin(ScrollTrigger);

const FAQSection = () => {
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".faq-header > *",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none", once: true }
        }
      );

      gsap.fromTo(".faq-item",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.1,
          scrollTrigger: { trigger: ".faq-list", start: "top 80%", toggleActions: "play none none none", once: true }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "Online eğitim sistemi nasıl işler?",
      a: "Online eğitim paketi aldığınızda size bir form gönderilir ve dolduracağınız formdaki bilgiler ışığında size ve hedefinize özel planlamalar hazırlanır, 24 saat içerisinde iletilir. Haftalık olarak kontrol formu gönderilir; form kontrolü ve ölçü takibi yapılır, veriler kayıt altına alınır. Haftalık kontrol formu ve kaydedilen ilerleme ışığında gerekli görüldüğünde planlamalarda revizeler yapılır ve tekrar iletilir. İletilen planlamalarla ilgili anlaşılmayan noktalar, zaruri planlama dışı durumlar ve merak edilen noktalarla alakalı belirtilen saatler içerisinde WhatsApp'tan iletişime geçilebilir. Paket bitimine kadar süreç bu şekilde işler."
    },
    {
      q: "Daha önce hiç spor yapmadım, katılabilir miyim?",
      a: "Kesinlikle! Programlar tamamen senin seviyene göre hazırlanıyor. Sıfırdan başlayan yüzlerce öğrencimiz var. Form videoları üzerinden teknik kontrolü de yapıyoruz, yani doğru hareketleri öğrenmen garanti."
    },
    {
      q: "Sonuçlar ne zaman görülür?",
      a: "Genellikle ilk 2-3 hafta içinde enerji seviyesinde ve performansta fark hissedersin. Fiziksel değişimler ise 4-8 hafta arasında belirginleşir. Tabii bu, programa bağlılığına bağlı."
    },
    {
      q: "Beslenme planı vegan/vejetaryen uyumlu olabilir mi?",
      a: "Evet! Her türlü diyet tercihine uygun plan hazırlıyorum. Alerji, intolerans ve kişisel tercihler de dahil olmak üzere her detay hesaba katılıyor."
    },
  ];

  return (
    <section className="faq-section" id="sss" ref={sectionRef}>
      <div className="container">
        <div className="faq-header">
          <span className="faq-badge">Sıkça Sorulan Sorular</span>
          <h2 className="faq-title">Merak Ettiklerin</h2>
          <p className="faq-subtitle">Eğer burada cevabını bulamıyorsan, bana direkt WhatsApp'tan yazabilirsin.</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openIndex === i ? 'open' : ''}`}
              onClick={() => toggleFAQ(i)}
            >
              <div className="faq-question">
                <span className="faq-q-text">{faq.q}</span>
                <span className="faq-toggle">{openIndex === i ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
