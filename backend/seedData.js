const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');

const db = new Database('./orders.db');

// Önceki paketleri temizle
db.exec('DELETE FROM packages');

const defaultPackages = [
  // ================= TEKLİ =================
  { 
    category: 'tekli', 
    name: 'Antrenman Planlaması', 
    badge: null, 
    price: '350₺', 
    period: 'tek sefer', 
    desc: 'Kişiye ve hedefe özel antrenman planlaması iletilir.', 
    features: JSON.stringify(['Antrenman Planlaması']), 
    unavailable: JSON.stringify(['Beslenme Planlaması', 'Supplement Planlaması']), 
    color: 'var(--camo-mid)', 
    btnClass: 'pricing-btn', 
    order_index: 0 
  },
  { 
    category: 'tekli', 
    name: 'Beslenme Planlaması', 
    badge: null, 
    price: '350₺', 
    period: 'tek sefer', 
    desc: 'Kişiye ve hedefe özel beslenme planlaması iletilir.', 
    features: JSON.stringify(['Beslenme Planlaması']), 
    unavailable: JSON.stringify(['Antrenman Planlaması', 'Supplement Planlaması']), 
    color: 'var(--camo-olive)', 
    btnClass: 'pricing-btn', 
    order_index: 1 
  },
  { 
    category: 'tekli', 
    name: 'Supplement Planlaması', 
    badge: null, 
    price: '200₺', 
    period: 'tek sefer', 
    desc: 'Kişiye ve hedefe özel supplement planlaması iletilir.', 
    features: JSON.stringify(['Supplement Planlaması']), 
    unavailable: JSON.stringify(['Antrenman Planlaması', 'Beslenme Planlaması']), 
    color: 'var(--camo-dark)', 
    btnClass: 'pricing-btn', 
    order_index: 2 
  },

  // ================= ÇOKLU =================
  { 
    category: 'coklu', 
    name: 'Basit Seviye', 
    badge: null, 
    price: '600₺', 
    period: 'tek sefer', 
    desc: 'Kişiye ve hedefe özel iki planlama iletilir.', 
    features: JSON.stringify(['Antrenman Planlaması', 'Beslenme Planlaması']), 
    unavailable: JSON.stringify(['Supplement Planlaması', 'Isınma ve Soğuma', 'Uyku Protokolleri']), 
    color: 'var(--camo-mid)', 
    btnClass: 'pricing-btn', 
    order_index: 0 
  },
  { 
    category: 'coklu', 
    name: 'Orta Seviye', 
    badge: 'En Çok Tercih Edilen', 
    price: '750₺', 
    period: 'tek sefer', 
    desc: 'Kişiye ve hedefe özel 3 ayrı planlama iletilir.', 
    features: JSON.stringify(['Antrenman Planlaması', 'Beslenme Planlaması', 'Supplement Planlaması']), 
    unavailable: JSON.stringify(['Isınma ve Soğuma', 'Uyku Protokolleri']), 
    color: '#ca0d1c', 
    btnClass: 'pricing-btn premium-btn', 
    order_index: 1 
  },
  { 
    category: 'coklu', 
    name: 'İleri Seviye', 
    badge: null, 
    price: '1.000₺', 
    period: 'tek sefer', 
    desc: 'Detaylı protokoller ve video anlatımlı içerik.', 
    features: JSON.stringify([
      'Antrenman Planlaması',
      'Beslenme Planlaması',
      'Supplement Planlamaları',
      'Videolu Isınma ve Soğuma Protokolü',
      'Antrenman, Beslenme ve Uyku Protokolleri'
    ]), 
    unavailable: JSON.stringify([]), 
    color: 'var(--camo-sand)', 
    btnClass: 'pricing-btn elite-btn', 
    order_index: 2 
  },

  // ================= ONLINE =================
  { 
    category: 'online', 
    name: '1 Aylık', 
    badge: null, 
    price: '2.000₺', 
    period: '/ 1 ay', 
    desc: 'Birebir takipli çevrimiçi koçluk.', 
    features: JSON.stringify([
      'Antrenman, Beslenme, Supplement Planı',
      'Isınma ve Soğuma Protokolleri',
      'Antrenman, Beslenme, Uyku Protokolleri',
      'Haftalık Form / Ölçü Takibi & Revize',
      'Hergün (08:00-18:00) WhatsApp'
    ]), 
    unavailable: JSON.stringify([]), 
    color: 'var(--camo-dark)', 
    btnClass: 'pricing-btn', 
    order_index: 0 
  },
  { 
    category: 'online', 
    name: '2 Aylık', 
    badge: null, 
    price: '3.250₺', 
    period: '/ 2 ay', 
    desc: 'İstikrarlı gelişim arayanlar için indirimli koçluk.', 
    features: JSON.stringify([
      'Antrenman, Beslenme, Supplement Planı',
      'Isınma ve Soğuma Protokolleri',
      'Antrenman, Beslenme, Uyku Protokolleri',
      'Haftalık Form / Ölçü Takibi & Revize',
      'Hergün (08:00-18:00) WhatsApp'
    ]), 
    unavailable: JSON.stringify([]), 
    color: 'var(--camo-olive)', 
    btnClass: 'pricing-btn elite-btn', 
    order_index: 1 
  },
  { 
    category: 'online', 
    name: '3 Aylık', 
    badge: 'En İyi Fiyat Kombosu', 
    price: '4.000₺', 
    period: '/ 3 ay', 
    desc: 'Gözle görülür büyük değişimler için hızlı geri dönüş.', 
    features: JSON.stringify([
      'Antrenman, Beslenme, Supplement Planı',
      'Isınma ve Soğuma Protokolleri',
      'Antrenman, Beslenme, Uyku Protokolleri',
      'Haftalık Form / Ölçü Takibi & Revize',
      'Hergün (08:00-18:00) WhatsApp'
    ]), 
    unavailable: JSON.stringify([]), 
    color: '#ca0d1c', 
    btnClass: 'pricing-btn premium-btn', 
    order_index: 2 
  },
  { 
    category: 'online', 
    name: '5 Aylık', 
    badge: null, 
    price: '5.500₺', 
    period: '/ 5 ay', 
    desc: 'Kökten dönüşüm, bambaşka bir yaşam tarzı.', 
    features: JSON.stringify([
      'Antrenman, Beslenme, Supplement Planı',
      'Isınma ve Soğuma Protokolleri',
      'Antrenman, Beslenme, Uyku Protokolleri',
      'Haftalık Form / Ölçü Takibi & Revize',
      'Hergün (08:00-18:00) WhatsApp'
    ]), 
    unavailable: JSON.stringify([]), 
    color: 'var(--camo-sand)', 
    btnClass: 'pricing-btn elite-btn', 
    order_index: 3 
  }
];

const insertPkg = db.prepare('INSERT INTO packages (id, category, name, badge, price, period, description, features, unavailable, color, btnClass, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

const insertMany = db.transaction((packages) => {
  for (const p of packages) {
    insertPkg.run(uuidv4(), p.category, p.name, p.badge, p.price, p.period, p.desc, p.features, p.unavailable, p.color, p.btnClass, p.order_index);
  }
});

insertMany(defaultPackages);

console.log("Paketler başarıyla güncellendi!");
