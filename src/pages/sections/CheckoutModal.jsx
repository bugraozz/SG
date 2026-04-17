import React, { useState } from 'react';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, selectedPlan }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. MÜŞTERİ VERİSİNİ KENDİ GÜVENLİ SUNUCUMUZA GÖNDER!
      // (React, gizli Shopier şifrelerini bilmez. Bilmesi gereken yer Backend (server.js).
      alert("Bilgileriniz işleniyor, Güvenli Shopier Ödeme Noktasına aktarılıyorsunuz...");
      
      /*
      // BU KOD, NODE.JS BACKENDİNİZ AKTİF OLDUĞUNDA ÇALIŞACAK ŞEKİLDE TASARLANDI:
      const response = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,     // Ad, Soyad, Email vs.
          planId: selectedPlan?.id // GÜVENLİK: Artık planIsmi ve fiyati değil, sadece ID gönderiliyor!
        })
      });
      
      const data = await response.json();
      if(data.success && data.html) {
          // Backend'in ürettiği Shopier Formunu yakalayıp ekrana çiziyoruz.
          // Form kendi kendine Shopier.com sayfasına gizli imza ile post olacak.
          document.write(data.html); 
      }
      */

      // -- ŞU AN TEST AMAÇLI BASİT (STATİK) YÖNLENDİRME (BACKEND YOKSA BUNU KULLAN) --
      if (selectedPlan?.shopierLink) {
        window.location.href = selectedPlan.shopierLink;
      } else {
        alert("E-Ticaret altyapısına henüz bağlanmadık. Sadece iletişim amaçlı kod var.");
      }

    } catch(err) {
      console.error("Yönlendirme Hatası:", err);
      alert("Sunucumuza bağlanırken bir hata oluştu.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <h2>SİPARİŞİNİ <span className="highlight-text">TAMAMLA</span></h2>
        </div>

        <div className="modal-content-grid">
          
          <div className="modal-left">
            <h3 className="section-title">SİPARİŞ BİLGİLERİ</h3>
            <form onSubmit={handleSubmit} id="checkout-form">
              <div className="form-row">
                <div className="input-group">
                  <label>AD SOYAD *</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    placeholder="Adınız Soyadınız" 
                    required 
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>TELEFON *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="05xxxxxxxxx" 
                    required 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>E-POSTA *</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="ornek@mail.com" 
                  required 
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label>ŞEHİR (OPSİYONEL)</label>
                <input 
                  type="text" 
                  name="city" 
                  placeholder="Örn: İstanbul" 
                  onChange={handleChange}
                />
              </div>

              <div className="terms-checkbox">
                <input type="checkbox" required id="terms" />
                <label htmlFor="terms">
                  Kişiye özel koçluk hizmeti kapsamında cayma hakkımın bulunmadığını kabul ediyorum.
                </label>
              </div>
            </form>
          </div>

          <div className="modal-right">
            <h3 className="section-title">SİPARİŞ ÖZETİ</h3>
            <div className="order-summary-box">
              <div className="summary-item">
                <span>Paket Adı</span>
                <strong>{selectedPlan?.name} Değişimi</strong>
              </div>
              <div className="summary-item total">
                <span>Toplam</span>
                <strong className="total-price">{selectedPlan?.price}</strong>
              </div>
            </div>

            <button type="submit" form="checkout-form" className="shopier-pay-btn">
              💳 SHOPIER İLE ÖDE
            </button>
            <p className="secured-text">🔒 256-bit Şifreli | Shopier Güvencesi</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;