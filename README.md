# SG — Serhat Gündar Fitness Platform

Premium, dark-themed online fitness koçluk platformu. Gelişmiş GSAP animasyonları, scroll-triggered efektler ve modern UI bileşenleriyle profesyonel bir kullanıcı deneyimi sunar.

![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)
![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?logo=greensock&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)

---

## 🚀 Kurulum

### Gereksinimler

- [Node.js](https://nodejs.org/) (v18 veya üzeri önerilir)
- [Git](https://git-scm.com/)

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/bugraozz/SG.git
cd SG

# 2. Bağımlılıkları yükle
npm install

# 3. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:5173` adresinde açılacaktır.

---

## 📦 Kullanılabilir Komutlar

| Komut              | Açıklama                                  |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Geliştirme sunucusunu başlatır (HMR aktif)|
| `npm run build`    | Production build oluşturur (`dist/`)      |
| `npm run preview`  | Build çıktısını yerel sunucuda önizler    |

---

## 🗂️ Proje Yapısı

```
SG/
├── public/                  # Statik dosyalar (görseller vb.)
├── src/
│   ├── components/          # Tekrar kullanılabilir bileşenler
│   │   ├── Navbar.jsx       # Sabit navigasyon barı
│   │   ├── IndirimButton.jsx# İndirim kodu butonu
│   │   ├── ElectricBorder.tsx
│   │   └── FloatingWidgets.jsx
│   ├── pages/
│   │   ├── MainBoard.jsx    # Ana sayfa — tüm section'ları birleştirir
│   │   ├── Login.jsx        # Giriş sayfası
│   │   ├── Register.jsx     # Kayıt sayfası
│   │   ├── Auth.css         # Login & Register ortak stilleri
│   │   └── sections/        # Ana sayfa bölümleri
│   │       ├── HeroSection       # Hero banner + CTA
│   │       ├── HeroCardsSection  # Özellik kartları
│   │       ├── FeatureCards      # Hizmet kartları
│   │       ├── BrandMarquee      # Marka kaydırma bandı
│   │       ├── WhySection        # Neden biz?
│   │       ├── TextReveal        # Scroll text masking animasyonu
│   │       ├── TransformBanner   # Dönüşüm banner
│   │       ├── SkewedBanner      # Eğik banner
│   │       ├── WhatYouGet        # Ne kazanırsın?
│   │       ├── Testimonials      # Müşteri yorumları
│   │       ├── PricingSection    # Fiyatlandırma kartları
│   │       ├── FAQSection        # Sıkça sorulan sorular
│   │       └── FooterSection     # Alt bilgi
│   ├── lib/                 # Yardımcı fonksiyonlar
│   ├── App.jsx              # Router yapılandırması
│   ├── main.jsx             # Uygulama giriş noktası
│   └── index.css            # Global stiller & design tokens
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🛠️ Teknoloji Stack

| Teknoloji         | Kullanım Amacı                           |
| ----------------- | ---------------------------------------- |
| **React 18**      | UI bileşen framework'ü                  |
| **Vite 5**        | Hızlı geliştirme ve build aracı         |
| **GSAP 3**        | Animasyonlar, ScrollTrigger, SplitType   |
| **Tailwind CSS**  | Yardımcı CSS sınıfları                   |
| **React Router**  | Sayfa yönlendirme (SPA)                  |
| **Lucide React**  | İkon kütüphanesi                         |

---

## 📄 Sayfalar

### Ana Sayfa (`/`)
Tüm bölümleri içeren landing page. GSAP ScrollTrigger ile sinematik scroll animasyonları.

### Giriş (`/login`)
Premium giriş formu — iki sütunlu layout, sosyal medya ile giriş, şifre göster/gizle.

### Kayıt (`/register`)
Kayıt formu — ad/soyad, e-posta, telefon, şifre gücü göstergesi, sosyal medya ile kayıt.

---

## 🎨 Tasarım Sistemi

- **Renk Paleti:** Koyu lacivert arka plan (`#04060d`) + elektrik mavi aksanlar (`#0145F2`)
- **Fontlar:** Inter (gövde) + Oswald (logolar)
- **Efektler:** Glassmorphism, radial gradient'ler, backdrop-filter blur
- **Animasyonlar:** GSAP timeline'lar, ScrollTrigger, text masking, staggered girişler

---

## 📝 Lisans

Bu proje özel kullanım içindir.
