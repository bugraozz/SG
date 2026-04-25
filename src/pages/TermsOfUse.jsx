import React, { useEffect } from 'react';
import FooterSection from './sections/FooterSection';

const TermsOfUse = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-black text-[#E5E4D8]">
      <div className="container max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-[#d4b46a] uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>Kullanım Koşulları</h1>
        
        <div className="space-y-6 text-[#9EA88B] leading-relaxed">
          <p>
            Son güncellenme tarihi: {new Date().toLocaleDateString('tr-TR')}
          </p>
          
          <h2 className="text-2xl font-bold text-[#E5E4D8] mt-8 mb-4">1. Hizmet Kapsamı</h2>
          <p>
            Serhat Gündar Coaching, bireylere fiziksel durumlarına ve hedeflerine uygun antrenman ve beslenme programları sunan bir online platformdur. Platformda yer alan tüm içerikler, bilgilendirme ve yönlendirme amaçlıdır; tıbbi tedavi veya doktor tavsiyesi yerine geçmez.
          </p>
          
          <h2 className="text-2xl font-bold text-[#E5E4D8] mt-8 mb-4">2. Üyelik ve Kullanıcı Sorumlulukları</h2>
          <p>
            Programa kayıt olurken verdiğiniz bilgilerin doğruluğundan siz sorumlusunuzdur. Sağlık sorunlarınız veya engelleriniz varsa, programa başlamadan önce mutlaka bir doktora danışmanız gerekmektedir. Kullanıcının eksik veya yanlış bilgi vermesinden doğacak sorunlardan Serhat Gündar Coaching sorumlu tutulamaz.
          </p>

          <h2 className="text-2xl font-bold text-[#E5E4D8] mt-8 mb-4">3. Fikri Mülkiyet Hakları</h2>
          <p>
            Size sunulan antrenman programları, beslenme planları, videolar, görseller ve diğer tüm dokümanlar Serhat Gündar Coaching'in fikri mülkiyetindedir. Bu içerikler sadece kişisel kullanımınız içindir; kopyalanamaz, çoğaltılamaz veya üçüncü şahıslarla paylaşılamaz.
          </p>

          <h2 className="text-2xl font-bold text-[#E5E4D8] mt-8 mb-4">4. İptal ve İade Koşulları</h2>
          <p>
            Satın alınan paketler dijital hizmet ve kişiye özel programlama kategorisine girdiği için, program hazırlanıp tarafınıza iletildikten sonra iade yapılamamaktadır. Ancak, hizmetten makul ve haklı bir nedenden dolayı memnun kalmamanız durumunda iletişime geçerek durumu değerlendirmemizi talep edebilirsiniz.
          </p>

          <h2 className="text-2xl font-bold text-[#E5E4D8] mt-8 mb-4">5. Koşulların Değiştirilmesi</h2>
          <p>
            Serhat Gündar Coaching, bu kullanım koşullarını önceden haber vermeksizin değiştirme hakkını saklı tutar. Değişiklikler sitede yayınlandığı andan itibaren geçerlilik kazanır.
          </p>
        </div>
      </div>
      <div className="mt-20">
        <FooterSection />
      </div>
    </div>
  );
};

export default TermsOfUse;
