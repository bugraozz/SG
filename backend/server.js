require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// 1. Veritabanı (SQLite) Güvenli Bağlantısı Kurulumu
const db = new Database('./orders.db');
db.pragma('journal_mode = WAL');

// Tabloları Başlat
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    platform_order_id TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    email TEXT,
    city TEXT,
    plan_name TEXT,
    price REAL,
    status TEXT DEFAULT 'bekliyor',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transformations (
    id TEXT PRIMARY KEY,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY,
    category TEXT,
    name TEXT,
    badge TEXT,
    price TEXT,
    period TEXT,
    description TEXT,
    features TEXT,
    unavailable TEXT,
    color TEXT,
    btnClass TEXT,
    order_index INTEGER DEFAULT 0,
    background_image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Eski veritabanlari icin packages tablosuna eksik kolon eklenir.
const packageColumns = db.prepare('PRAGMA table_info(packages)').all().map(col => col.name);
if (!packageColumns.includes('background_image_url')) {
  db.prepare('ALTER TABLE packages ADD COLUMN background_image_url TEXT').run();
}
if (!packageColumns.includes('shopier_id')) {
  db.prepare('ALTER TABLE packages ADD COLUMN shopier_id TEXT').run();
}
if (!packageColumns.includes('stock')) {
  db.prepare('ALTER TABLE packages ADD COLUMN stock INTEGER DEFAULT 999').run();
}

// Başlangıç için varsayılan paketler yoksa DB'ye tohumlama (seed) yap.
const packageCount = db.prepare('SELECT COUNT(*) as count FROM packages').get();
if (packageCount.count === 0) {
  const defaultPackages = [
    { category: 'tekli', name: 'Antrenman', badge: '', price: '350₺', period: 'tek sefer', desc: 'Kişiye ve hedefe özel antrenman planlaması iletilir.', features: JSON.stringify(['Kişiye Özel Antrenman Planlaması']), unavailable: JSON.stringify(['Beslenme Planlaması', 'Supplement Planlaması']), color: 'var(--camo-mid)', btnClass: 'pricing-btn', order_index: 1 },
    { category: 'coklu', name: 'Orta Seviye', badge: 'En Çok Tercih Edilen', price: '750₺', period: 'tek sefer', desc: 'İhtiyacın olan üçlü paket avantajı.', features: JSON.stringify(['Antrenman Planlaması', 'Beslenme Planlaması', 'Supplement Planlaması']), unavailable: JSON.stringify(['Isınma ve Soğuma', 'Uyku Protokolleri']), color: '#ca0d1c', btnClass: 'pricing-btn premium-btn', order_index: 2 },
    { category: 'online', name: '1 Aylık', badge: '', price: '2.000₺', period: '/ay', desc: 'Birebir takipli çevrimiçi koçluk.', features: JSON.stringify(['Antrenman, Beslenme, Supplement Planı', 'Isınma ve Soğuma Protokolleri', 'Antrenman, Beslenme, Uyku Protokolleri']), unavailable: JSON.stringify([]), color: 'var(--camo-dark)', btnClass: 'pricing-btn', order_index: 3 },
  ];
  const insertPkg = db.prepare('INSERT INTO packages (id, category, name, badge, price, period, description, features, unavailable, color, btnClass, order_index, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  defaultPackages.forEach(p => {
    insertPkg.run(uuidv4(), p.category, p.name, p.badge, p.price, p.period, p.desc, p.features, p.unavailable, p.color, p.btnClass, p.order_index, 999);
  });
}

// Varsayılan ayarları ekle
const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get();
if (settingsCount.count === 0) {
  const defaultSettings = [
    { key: 'social_instagram', value: '' },
    { key: 'social_youtube', value: '' },
    { key: 'social_tiktok', value: '' },
    { key: 'social_twitter', value: '' },
  ];
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  defaultSettings.forEach(s => insertSetting.run(s.key, s.value));
}

const msuDefaults = [
  {
    category: 'msu',
    name: '1 Ay',
    badge: '',
    price: '1000₺',
    period: '/paket',
    desc: 'MSÜ spor mülakatı parkuruna odaklı temel hazırlık programı.',
    features: JSON.stringify([
      'Parkur teknikleri ve süre yönetimi',
      'Kuvvet ve dayanıklılık antrenmanları',
      'Haftalık ilerleme takibi'
    ]),
    unavailable: JSON.stringify([]),
    color: '#b8862f',
    btnClass: 'pricing-btn',
    order_index: 1,
    background_image_url: null
  },
  {
    category: 'msu',
    name: '2 Ay',
    badge: '',
    price: '2000₺',
    period: '/paket',
    desc: 'MSÜ parkur performansını istikrarlı şekilde yükselten orta seviye plan.',
    features: JSON.stringify([
      'Parkur süre geliştirme protokolleri',
      'Tempolu kondisyon ve hız çalışmaları',
      'Düzenli performans analizi'
    ]),
    unavailable: JSON.stringify([]),
    color: '#c6963d',
    btnClass: 'pricing-btn',
    order_index: 2,
    background_image_url: null
  },
  {
    category: 'msu',
    name: '3 Ay',
    badge: 'MSÜ Özel Paket',
    price: '3000₺',
    period: '/paket',
    desc: 'Sınav gününe yönelik tam kapsamlı MSÜ spor mülakatı hazırlık paketi.',
    features: JSON.stringify([
      'Kişisel parkur stratejisi',
      'Hız, çeviklik ve dayanıklılık döngüsü',
      'Deneme simülasyonları ve geri bildirim'
    ]),
    unavailable: JSON.stringify([]),
    color: '#d0a040',
    btnClass: 'pricing-btn premium-btn',
    order_index: 3,
    background_image_url: null
  }
];

const findMsuPackageStmt = db.prepare('SELECT id FROM packages WHERE category = ? AND name = ? LIMIT 1');
const insertMsuPackageStmt = db.prepare(`
  INSERT INTO packages (id, category, name, badge, price, period, description, features, unavailable, color, btnClass, order_index, background_image_url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

msuDefaults.forEach((pkg) => {
  const exists = findMsuPackageStmt.get(pkg.category, pkg.name);
  if (!exists) {
    insertMsuPackageStmt.run(
      uuidv4(),
      pkg.category,
      pkg.name,
      pkg.badge,
      pkg.price,
      pkg.period,
      pkg.desc,
      pkg.features,
      pkg.unavailable,
      pkg.color,
      pkg.btnClass,
      pkg.order_index,
      pkg.background_image_url
    );
  }
});

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Sadece görsel (JPEG, PNG, WEBP, vb.) formatları yüklenebilir!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// 2. Güvenlik Katmanları (Middlewares)
app.use(helmet({ crossOriginResourcePolicy: false })); // Görselleri görebilmemiz için policy kapatılır
app.use(cors()); // Sadece izin verilen sitelerden (Frontend) istek kabul eder
app.use(express.json({ limit: '10kb' })); // JSON payload sınırlandırması
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. DDoS ve Spam Koruması (Rate Limiting)
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika içinde
  max: 20,
  message: { success: false, error: 'Sistem limitlerine takıldınız.' }
});

const SHOPIER_API_KEY = process.env.SHOPIER_API_KEY || 'API_KEY';
const SHOPIER_API_SECRET = process.env.SHOPIER_API_SECRET || 'API_SECRET';
const SHOPIER_WEBSITE_INDEX = process.env.SHOPIER_WEBSITE_INDEX || '1';
const RETURN_URL = process.env.RETURN_URL || 'http://localhost:5173/payment-success';
// Kullanıcının mevcut PAT (Personal Access Token) anahtarını Bearer olarak kullanacağız
const SHOPIER_APP_TOKEN = process.env.SHOPIER_APP_TOKEN || process.env.SHOPIER_API_KEY;

// Admin Paneli Güvenliği
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Serhat123!';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123!';

// 4. Veri Doğrulama Şeması (Joi Validasyonu)
const checkoutSchema = Joi.object({
  firstName: Joi.string().pattern(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\\s]+$/).max(50).required(),
  lastName: Joi.string().pattern(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\\s]+$/).max(50).required(),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
  email: Joi.string().email().required(),
  city: Joi.string().max(50).allow(''), // Opsiyonel
  planId: Joi.string().max(100).required()
});

// --- SATIN ALMA İSTEĞİ ---
app.post('/api/checkout', checkoutLimiter, (req, res) => {
  const { error, value } = checkoutSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, error: 'Girdiğiniz form bilgilerinde hatalı karakter bulundu.' });
  }

  const { firstName, lastName, phone, email, city, planId } = value;
  // 1. GUVENLIK YAMASI: Veritabanindan fiyati kontrol et
  const stmt = db.prepare('SELECT * FROM packages WHERE id = ?');
  const packageData = stmt.get(planId);
  if (!packageData) return res.status(404).json({ success: false, error: 'Paket bulunamadi.' });
  const planName = packageData.name;
  const platformOrderId = 'SO-' + uuidv4().substring(0, 8).toUpperCase();
  const amountStr = packageData.price.replace('₺', '').replace('.', '').replace(',', '.').trim();
  const amount = parseFloat(amountStr);

  try {
    const insertStmt = db.prepare(`
      INSERT INTO orders (id, platform_order_id, first_name, last_name, phone, email, city, plan_name, price, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertStmt.run(uuidv4(), platformOrderId, firstName, lastName, phone, email, city, planName, amount, 'bekliyor');

    const random_nr = Math.floor(Math.random() * 1000000).toString();
    const currency = '0'; // TL
    const hashData = random_nr + platformOrderId + amount.toString() + currency;

    // HMAC-SHA256 (Şifreleme)
    const hmac = crypto.createHmac('sha256', SHOPIER_API_SECRET);
    hmac.update(hashData);
    const signature = hmac.digest('base64');

    // HTML OLUŞTUR (XSS Koruması ile)
    const escapeHtml = (text) => {
      return (text || '').toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const shopierHTMLForm = `
      <!DOCTYPE html>
      <html>
      <head><title>Güvenli Ödeme Noktasına Aktarılıyorsunuz...</title></head>
      <body>
        <form id="shopier_form_checkout" method="post" action="https://www.shopier.com/ShowProduct/api_pay4.php">
          <input type="hidden" name="API_key" value="${escapeHtml(SHOPIER_API_KEY)}">
          <input type="hidden" name="website_index" value="${escapeHtml(SHOPIER_WEBSITE_INDEX)}">
          <input type="hidden" name="platform_order_id" value="${escapeHtml(platformOrderId)}">
          <input type="hidden" name="product_name" value="${escapeHtml(planName)}">
          <input type="hidden" name="product_type" value="2">
          <input type="hidden" name="buyer_name" value="${escapeHtml(firstName)}">
          <input type="hidden" name="buyer_surname" value="${escapeHtml(lastName)}">
          <input type="hidden" name="buyer_email" value="${escapeHtml(email)}">
          <input type="hidden" name="buyer_account_age" value="0">
          <input type="hidden" name="buyer_id_nr" value="0">
          <input type="hidden" name="buyer_phone" value="${escapeHtml(phone)}">
          <input type="hidden" name="billing_address" value="${escapeHtml(city || 'Turkiye')}">
          <input type="hidden" name="billing_city" value="${escapeHtml(city || 'Turkiye')}">
          <input type="hidden" name="billing_country" value="TR">
          <input type="hidden" name="billing_postcode" value="34000">
          <input type="hidden" name="shipping_address" value="${escapeHtml(city || 'Turkiye')}">
          <input type="hidden" name="shipping_city" value="${escapeHtml(city || 'Turkiye')}">
          <input type="hidden" name="shipping_country" value="TR">
          <input type="hidden" name="shipping_postcode" value="34000">
          <input type="hidden" name="total_order_value" value="${amount}">
          <input type="hidden" name="currency" value="${currency}">
          <input type="hidden" name="return_url" value="${RETURN_URL}">
          <input type="hidden" name="cancel_url" value="${RETURN_URL}">
          <input type="hidden" name="signature" value="${signature}">
          <input type="hidden" name="is_in_frame" value="0">
          <input type="hidden" name="current_language" value="1">
          <input type="hidden" name="modul_version" value="1.0.4">
          <input type="hidden" name="random_nr" value="${random_nr}">
        </form>
        <script>document.getElementById('shopier_form_checkout').submit();</script>
      </body>
      </html>
    `;

    res.json({ success: true, html: shopierHTMLForm });
  } catch (error) {
    console.error("Satın Alım Hatası:", error);
    res.status(500).json({ success: false, error: 'İşleminiz şu anda gerçekleştirilemiyor.' });
  }
});

// --- SHOPIER WEBHOOK ---
app.post('/api/shopier/callback', (req, res) => {
  const data = req.body;
  if (data.status === 'success') {
    try {
      const expectedHashStr = data.random_nr + data.platform_order_id + data.total_order_value + data.currency;
      const expectedSignature = crypto.createHmac('sha256', SHOPIER_API_SECRET).update(expectedHashStr).digest('base64');

      if (data.signature !== expectedSignature) {
        return res.status(403).send('Invalid Signature');
      }

      db.prepare("UPDATE orders SET status = ? WHERE platform_order_id = ?").run('ödendi', data.platform_order_id);
      res.status(200).send('OK');
    } catch (err) {
      res.status(500).send('Servis Hatası');
    }
  } else {
    res.status(200).send('OK');
  }
});

// ==========================================
// DÖNÜŞÜMLER (TRANSFORMATIONS) BÖLÜMÜ (API)
// ==========================================

// Dönüşümleri Listeleme (Frontend slider için)
app.get('/api/transformations', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, image_url, created_at FROM transformations ORDER BY created_at DESC');
    const result = stmt.all();
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Sorgu hatası' });
  }
});

// Brute Force (Deneme-Yanılma) Saldırılarına Karşı Koruma (Rate Limiting)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // Her IP için 15 dakikada en fazla 5 deneme
  message: { success: false, error: 'Çok fazla hatalı deneme yaptınız. Lütfen 15 dakika sonra tekrar deneyin.' }
});

// Admin Giriş İşlemi (Token Verir)
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Hatalı şifre.' });
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ success: true, token });
});

// JWT Doğrulama Middleware'i
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ success: false, error: 'Yetkisiz erişim (Token Yok).' });

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Oturum süresi dolmuş veya geçersiz.' });
  }
};

const resolveUploadFilePath = (relativePath) => {
  if (!relativePath || typeof relativePath !== 'string') return null;
  return path.join(__dirname, relativePath.replace(/^\/+/, ''));
};

const deleteUploadedFile = (relativePath) => {
  const fullPath = resolveUploadFilePath(relativePath);
  if (fullPath && fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

const parseArrayField = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== 'string') return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch (e) {
    // JSON degilse virgul ayrimli metin gibi ele alinir.
  }

  return trimmed.split(',').map((item) => item.trim()).filter(Boolean);
};

// Admin tarafı için Dönüşüm Ekleme (Resim yükleme)
// Güvenlik için JWT Auth eklendi
app.post('/api/admin/transformations', verifyAdmin, upload.single('images'), (req, res) => {
  // Eğer resim yüklenemediyse kontrolü
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Lütfen geçerli bir resim yükleyin.' });
  }

  try {
    const imagePath = '/uploads/' + req.file.filename;
    const insertStmt = db.prepare('INSERT INTO transformations (id, image_url) VALUES (?, ?)');
    insertStmt.run(uuidv4(), imagePath);

    res.json({ success: true, message: 'Dönüşüm eklendi', imageUrl: imagePath });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Veritabanı hatası' });
  }
});

// Admin tarafı için Dönüşüm Silme
app.delete('/api/admin/transformations/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  try {
    // Resmi bul
    const row = db.prepare('SELECT image_url FROM transformations WHERE id = ?').get(id);
    if (row) {
      // Dosyayi sunucudan fiziksel olarak sil
      deleteUploadedFile(row.image_url);
    }
    // DB'den sil
    db.prepare('DELETE FROM transformations WHERE id = ?').run(id);
    res.json({ success: true, message: 'Dönüşüm silindi' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Silinemedi' });
  }
});

// ==========================================
// PAKETLER (PACKAGES) BÖLÜMÜ (API)
// ==========================================

// Paketleri Getir (Public)
app.get('/api/packages', (req, res) => {
  try {
    const packages = db.prepare('SELECT * FROM packages ORDER BY order_index ASC').all();
    // Parse JSON array strings safely
    const parsedPackages = packages.map(p => ({
      ...p,
      features: p.features ? JSON.parse(p.features) : [],
      unavailable: p.unavailable ? JSON.parse(p.unavailable) : []
    }));

    // Kategorilerine (tekli, coklu, online) göre grupla
    const grouped = {
      tekli: parsedPackages.filter(p => p.category === 'tekli'),
      coklu: parsedPackages.filter(p => p.category === 'coklu'),
      online: parsedPackages.filter(p => p.category === 'online'),
      msu: parsedPackages.filter(p => p.category === 'msu'),
    };

    res.json({ success: true, data: grouped, flatData: parsedPackages });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Sorgu hatası' });
  }
});

// Paket Ekle
app.post('/api/admin/packages', verifyAdmin, upload.single('backgroundImage'), async (req, res) => {
  const { category, name, badge, price, period, description, features, unavailable, color, btnClass, order_index, stock } = req.body;
  const parsedFeatures = parseArrayField(features);
  const parsedUnavailable = parseArrayField(unavailable);
  const orderIndex = Number.isFinite(Number(order_index)) ? Number(order_index) : 0;
  const parsedStock = Number.isFinite(Number(stock)) ? Number(stock) : 999;
  const backgroundImagePath = req.file ? '/uploads/' + req.file.filename : null;

  let shopierId = null;

  try {
    // Shopier API (Personal Access Token) ile ürünü Shopier mağazasında yarat
    if (SHOPIER_APP_TOKEN && SHOPIER_APP_TOKEN !== 'API_KEY') {
      try {
        const numericPrice = parseFloat(price.replace(/[^0-9,.]/g, '').replace(/\./g, '').replace(',', '.'));
        let publicMediaUrl = "https://dummyimage.com/600x600/111/d4af37.png";
        if (backgroundImagePath) {
          const base = process.env.BASE_URL || 'http://localhost:5000';
          const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
          publicMediaUrl = `${cleanBase}${backgroundImagePath}`;
        }

        const shopierRes = await fetch('https://api.shopier.com/v1/products', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SHOPIER_APP_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: name,
            description: description || name,
            priceData: { price: numericPrice || 1, currency: 'TRY' },
            type: 'digital',
            stockQuantity: parsedStock,
            shippingPayer: 'sellerPays',
            placementScore: 100,
            media: [
              {
                type: "image",
                url: publicMediaUrl,
                placement: 1
              }
            ]
          })
        });
        const shopierData = await shopierRes.json();
        if (shopierData && shopierData.id) {
          shopierId = shopierData.id;
        } else {
          console.error("Shopier Create Warning:", shopierData);
        }
      } catch (err) {
        console.error("Shopier API Error during Create:", err);
      }
    }

    const insertStmt = db.prepare(`
      INSERT INTO packages (id, category, name, badge, price, period, description, features, unavailable, color, btnClass, order_index, background_image_url, shopier_id, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const newId = uuidv4();
    insertStmt.run(
      newId,
      category,
      name,
      badge || null,
      price,
      period,
      description,
      JSON.stringify(parsedFeatures),
      JSON.stringify(parsedUnavailable),
      color || 'var(--camo-mid)',
      btnClass || 'pricing-btn',
      orderIndex,
      backgroundImagePath,
      shopierId,
      parsedStock
    );
    res.json({ success: true, message: 'Paket eklendi', id: newId });
  } catch (e) {
    console.error(e);
    if (backgroundImagePath) {
      deleteUploadedFile(backgroundImagePath);
    }
    res.status(500).json({ success: false, error: 'Veritabanı hatası' });
  }
});

// Paket Güncelle
app.put('/api/admin/packages/:id', verifyAdmin, upload.single('backgroundImage'), async (req, res) => {
  const { id } = req.params;
  const { category, name, badge, price, period, description, features, unavailable, color, btnClass, order_index, removeBackground, stock } = req.body;
  const parsedFeatures = parseArrayField(features);
  const parsedUnavailable = parseArrayField(unavailable);
  const orderIndex = Number.isFinite(Number(order_index)) ? Number(order_index) : 0;
  const parsedStock = Number.isFinite(Number(stock)) ? Number(stock) : 999;

  try {
    const existingPackage = db.prepare('SELECT background_image_url, shopier_id FROM packages WHERE id = ?').get(id);
    if (!existingPackage) {
      if (req.file) {
        deleteUploadedFile('/uploads/' + req.file.filename);
      }
      return res.status(404).json({ success: false, error: 'Paket bulunamadı' });
    }

    const previousBackgroundPath = existingPackage.background_image_url || null;
    let backgroundImagePath = previousBackgroundPath;
    let shouldDeletePreviousBackground = false;

    if (req.file) {
      backgroundImagePath = '/uploads/' + req.file.filename;
      shouldDeletePreviousBackground = Boolean(previousBackgroundPath);
    }

    const shouldRemoveBackground = removeBackground === true || removeBackground === 'true';
    if (shouldRemoveBackground && !req.file) {
      backgroundImagePath = null;
      shouldDeletePreviousBackground = Boolean(previousBackgroundPath);
    }

    // Shopier API (Personal Access Token) ile ürünü güncelle
    if (existingPackage.shopier_id && SHOPIER_APP_TOKEN && SHOPIER_APP_TOKEN !== 'API_KEY') {
      try {
        const numericPrice = parseFloat(price.replace(/[^0-9,.]/g, '').replace(/\./g, '').replace(',', '.'));
        let publicMediaUrl = "https://dummyimage.com/600x600/111/d4af37.png";
        if (backgroundImagePath) {
          const base = process.env.BASE_URL || 'http://localhost:5000';
          const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
          publicMediaUrl = `${cleanBase}${backgroundImagePath}`;
        }

        const shopierRes = await fetch(`https://api.shopier.com/v1/products/${existingPackage.shopier_id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${SHOPIER_APP_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: name,
            description: description || name,
            priceData: { price: numericPrice || 1, currency: 'TRY' },
            type: 'digital',
            stockQuantity: parsedStock,
            shippingPayer: 'sellerPays',
            media: [
              {
                type: "image",
                url: publicMediaUrl,
                placement: 1
              }
            ]
          })
        });
        const shopierData = await shopierRes.json();
        if (!shopierData || !shopierData.id) {
          console.error("Shopier Update Warning:", shopierData);
        }
      } catch (err) {
        console.error("Shopier API Error during Update:", err);
      }
    }

    const updateStmt = db.prepare(`
      UPDATE packages
      SET category=?, name=?, badge=?, price=?, period=?, description=?, features=?, unavailable=?, color=?, btnClass=?, order_index=?, background_image_url=?, stock=?
      WHERE id=?
    `);
    const info = updateStmt.run(
      category,
      name,
      badge || null,
      price,
      period,
      description,
      JSON.stringify(parsedFeatures),
      JSON.stringify(parsedUnavailable),
      color || 'var(--camo-mid)',
      btnClass || 'pricing-btn',
      orderIndex,
      backgroundImagePath,
      parsedStock,
      id
    );

    if (info.changes > 0) {
      if (shouldDeletePreviousBackground && previousBackgroundPath && previousBackgroundPath !== backgroundImagePath) {
        deleteUploadedFile(previousBackgroundPath);
      }
      res.json({ success: true, message: 'Paket güncellendi' });
    } else {
      if (req.file) {
        deleteUploadedFile(backgroundImagePath);
      }
      res.status(404).json({ success: false, error: 'Paket bulunamadı' });
    }
  } catch (e) {
    console.error(e);
    if (req.file) {
      deleteUploadedFile('/uploads/' + req.file.filename);
    }
    res.status(500).json({ success: false, error: 'Güncelleme hatası' });
  }
});

// Shopier Tam Senkronizasyon (İçe Aktarma, Silme ve Güncelleme)
app.post('/api/admin/shopier-sync', verifyAdmin, async (req, res) => {
  if (!SHOPIER_APP_TOKEN || SHOPIER_APP_TOKEN === 'API_KEY') {
    return res.status(400).json({ success: false, error: 'Shopier Token yapılandırılmamış.' });
  }

  try {
    const shopierRes = await fetch('https://api.shopier.com/v1/products?limit=100', {
      headers: { 'Authorization': `Bearer ${SHOPIER_APP_TOKEN}` }
    });
    const shopierData = await shopierRes.json();
    
    let shopierProducts = [];
    if (Array.isArray(shopierData)) {
      shopierProducts = shopierData;
    } else if (shopierData && Array.isArray(shopierData.data)) {
      shopierProducts = shopierData.data;
    } else if (shopierData && Array.isArray(shopierData.items)) {
      shopierProducts = shopierData.items;
    } else {
      console.error("Shopier geçersiz yanıt:", shopierData);
      return res.status(500).json({ success: false, error: 'Shopier API geçerli ürün listesi döndürmedi. Token yetkilerini kontrol edin.' });
    }

    const shopierIds = shopierProducts.map(p => String(p.id));

    // 1. Sitenizde olup Shopier'de OLMAYANLARI sil
    const localPackages = db.prepare('SELECT id, shopier_id FROM packages WHERE shopier_id IS NOT NULL').all();
    let deletedCount = 0;
    const deleteStmt = db.prepare('DELETE FROM packages WHERE id = ?');
    
    for (const pkg of localPackages) {
      if (!shopierIds.includes(String(pkg.shopier_id))) {
        deleteStmt.run(pkg.id);
        deletedCount++;
      }
    }

    // 2. Shopier'de olanları Ekle veya GÜNCELLE
    const insertPkg = db.prepare('INSERT INTO packages (id, category, name, price, period, description, features, unavailable, color, btnClass, order_index, shopier_id, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const updatePkg = db.prepare('UPDATE packages SET name = ?, price = ?, description = ?, stock = ? WHERE id = ?');
    let importedCount = 0;
    let updatedCount = 0;

    for (const prod of shopierProducts) {
      const pPriceStr = prod.priceData ? prod.priceData.price : (prod.price ? prod.price.price : "1");
      const pPrice = String(pPriceStr).trim() + "₺";
      const pStock = prod.stockQuantity !== undefined ? prod.stockQuantity : 999;
      const pTitle = prod.title || 'İsimsiz';
      const pDesc = prod.description || '';
      
      // Önce Shopier ID ile kontrol et
      let existing = db.prepare('SELECT id FROM packages WHERE shopier_id = ?').get(String(prod.id));
      
      // Eğer ID ile bulunamadıysa, ismiyle aynı olan ve bağlantısı olmayan paket var mı bak
      if (!existing) {
        existing = db.prepare('SELECT id FROM packages WHERE name = ? AND (shopier_id IS NULL OR shopier_id = "")').get(pTitle);
        if (existing) {
          db.prepare('UPDATE packages SET shopier_id = ?, name = ?, price = ?, description = ?, stock = ? WHERE id = ?').run(String(prod.id), pTitle, pPrice, pDesc, pStock, existing.id);
          updatedCount++; 
          continue;
        }
      }

      if (existing) {
        // Mevcut ürünü GÜNCELLE
        updatePkg.run(pTitle, pPrice, pDesc, pStock, existing.id);
        updatedCount++;
      } else {
        // Yeni ürün olarak EKLE
        insertPkg.run(
          uuidv4(),
          'online', 
          pTitle, 
          pPrice, 
          'tek sefer', 
          pDesc, 
          JSON.stringify([]), 
          JSON.stringify([]), 
          'var(--camo-mid)', 
          'pricing-btn', 
          0,
          String(prod.id),
          pStock
        );
        importedCount++;
      }
    }

    res.json({ success: true, importedCount, deletedCount, updatedCount });
  } catch (err) {
    console.error("Shopier Sync Error:", err);
    res.status(500).json({ success: false, error: 'Senkronizasyon hatası.' });
  }
});

// Paket Sil
app.delete('/api/admin/packages/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const existingPackage = db.prepare('SELECT background_image_url, shopier_id FROM packages WHERE id = ?').get(id);
    if (!existingPackage) {
      return res.status(404).json({ success: false, error: 'Paket bulunamadı' });
    }

    if (existingPackage.background_image_url) {
      deleteUploadedFile(existingPackage.background_image_url);
    }

    // Shopier API (Personal Access Token) ile ürünü Shopier'den de sil
    if (existingPackage.shopier_id && SHOPIER_APP_TOKEN && SHOPIER_APP_TOKEN !== 'API_KEY') {
      try {
        await fetch(`https://api.shopier.com/v1/products/${existingPackage.shopier_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${SHOPIER_APP_TOKEN}`
          }
        });
      } catch (err) {
        console.error("Shopier API Error during Delete:", err);
      }
    }

    db.prepare('DELETE FROM packages WHERE id = ?').run(id);
    res.json({ success: true, message: 'Paket silindi' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Paket silinemedi' });
  }
});

// ==========================================
// AYARLAR (SETTINGS) BÖLÜMÜ (API)
// ==========================================

// Ayarları Getir (Public)
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = {};
    settings.forEach(s => { settingsObj[s.key] = s.value; });
    res.json({ success: true, data: settingsObj });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Sorgu hatası' });
  }
});

// Ayarları Güncelle
app.put('/api/admin/settings', verifyAdmin, (req, res) => {
  const settingsObj = req.body;
  try {
    const updateStmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value');
    db.transaction(() => {
      for (const [key, value] of Object.entries(settingsObj)) {
        updateStmt.run(key, value || '');
      }
    })();
    res.json({ success: true, message: 'Ayarlar güncellendi' });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Güncelleme hatası' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Sunucu http://localhost:" + PORT + " üzerinden çalışıyor.");
});

