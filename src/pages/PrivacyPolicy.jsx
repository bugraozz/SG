import React, { useEffect } from 'react';
import FooterSection from './sections/FooterSection';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-black text-[#E5E4D8]">
      <div className="container max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-[#d4b46a] uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>Gizlilik Politikası</h1>
        
        <div className="space-y-6 text-[#9EA88B] leading-relaxed">
          <p>
            Son güncellenme tarihi: {new Date().toLocaleDateString('tr-TR')}
          </p>
          
          <h2 className="text-2xl font-bold text-[#E5E4D8] mt-8 mb-4">1. Toplanan Bilgiler</h2>
          <p>
            Serhat Gündar Coaching olarak, hizmetlerimizden faydalanmanız için gereken bazı kişisel bilgilerinizi (ad, soyad, iletişim bilgileri, fiziksel ölçümler ve beslenme alışkanlıkları) talep edebiliriz. Bu bilgiler, size özel antrenman ve beslenme programları oluşturabilmek amacıyla toplanmaktadır.
          </p>
          
          <h2 className="text-2xl font-bold text-[#E5E4D8] mt-8 mb-4">2. Bilgilerin Kullanımı</h2>
          <p>
            Toplanan kişisel bilgileriniz, tamamen hizmet sağlama amacıyla kullanılmaktadır. Bilgileriniz, yasal zorunluluklar haricinde hiçbir üçüncü şahıs veya kurumla paylaşılmaz. İletişim bilgileriniz, size hizmetle ilgili duyurular yapmak veya programınızla ilgili bilgilendirmeler sağlamak için kullanılabilir.
          </p>

          <h2 className="text-2xl font-bold text-[#E5E4D8] mt-8 mb-4">3. Veri Güvenliği</h2>
          <p>
            Sistemlerimizde toplanan verilerin güvenliğini sağlamak için endüstri standartlarında güvenlik önlemleri uygulanmaktadır. Ancak internet üzerinden yapılan veri aktarımlarının %100 güvenli olduğu garanti edilemez.
          </p>

          <h2 className="text-2xl font-bold text-[#E5E4D8] mt-8 mb-4">4. Çerezler (Cookies)</h2>
          <p>
            Web sitemizin kullanımını analiz etmek ve deneyiminizi geliştirmek amacıyla çerezler kullanabiliriz. Tarayıcı ayarlarınızdan çerezleri reddedebilirsiniz, ancak bu durumda sitenin bazı özellikleri düzgün çalışmayabilir.
          </p>

          <h2 className="text-2xl font-bold text-[#E5E4D8] mt-8 mb-4">5. İletişim</h2>
          <p>
            Gizlilik politikamızla ilgili herhangi bir sorunuz varsa, sitemizdeki iletişim yollarını kullanarak bizimle irtibata geçebilirsiniz.
          </p>
        </div>
      </div>
      <div className="mt-20">
        <FooterSection />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
