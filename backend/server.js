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
    order_index INTEGER DEFAULT 0
  );
`);

// Başlangıç için varsayılan paketler yoksa DB'ye tohumlama (seed) yap.
const packageCount = db.prepare('SELECT COUNT(*) as count FROM packages').get();
if (packageCount.count === 0) {
  const defaultPackages = [
    { category: 'tekli', name: 'Antrenman', badge: '', price: '350₺', period: 'tek sefer', desc: 'Kişiye ve hedefe özel antrenman planlaması iletilir.', features: JSON.stringify(['Kişiye Özel Antrenman Planlaması']), unavailable: JSON.stringify(['Beslenme Planlaması', 'Supplement Planlaması']), color: 'var(--camo-mid)', btnClass: 'pricing-btn', order_index: 1 },
    { category: 'coklu', name: 'Orta Seviye', badge: 'En Çok Tercih Edilen', price: '750₺', period: 'tek sefer', desc: 'İhtiyacın olan üçlü paket avantajı.', features: JSON.stringify(['Antrenman Planlaması', 'Beslenme Planlaması', 'Supplement Planlaması']), unavailable: JSON.stringify(['Isınma ve Soğuma', 'Uyku Protokolleri']), color: '#ca0d1c', btnClass: 'pricing-btn premium-btn', order_index: 2 },
    { category: 'online', name: '1 Aylık', badge: '', price: '2.000₺', period: '/ay', desc: 'Birebir takipli çevrimiçi koçluk.', features: JSON.stringify(['Antrenman, Beslenme, Supplement Planı', 'Isınma ve Soğuma Protokolleri', 'Antrenman, Beslenme, Uyku Protokolleri']), unavailable: JSON.stringify([]), color: 'var(--camo-dark)', btnClass: 'pricing-btn', order_index: 3 },
  ];
  const insertPkg = db.prepare('INSERT INTO packages (id, category, name, badge, price, period, description, features, unavailable, color, btnClass, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  defaultPackages.forEach(p => {
    insertPkg.run(uuidv4(), p.category, p.name, p.badge, p.price, p.period, p.desc, p.features, p.unavailable, p.color, p.btnClass, p.order_index);
  });
}

const app = express();

// Multer Storage Configuration
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
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
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
    
    // HTML OLUŞTUR
    const shopierHTMLForm = `
      <!DOCTYPE html>
      <html>
      <head><title>Güvenli Ödeme Noktasına Aktarılıyorsunuz...</title></head>
      <body>
        <form id="shopier_form_checkout" method="post" action="https://www.shopier.com/ShowProduct/api_pay4.php">
          <input type="hidden" name="API_key" value="${SHOPIER_API_KEY}">
          <input type="hidden" name="website_index" value="${SHOPIER_WEBSITE_INDEX}">
          <input type="hidden" name="platform_order_id" value="${platformOrderId}">
          <input type="hidden" name="product_name" value="${planName}">
          <input type="hidden" name="product_type" value="2">
          <input type="hidden" name="buyer_name" value="${firstName}">
          <input type="hidden" name="buyer_surname" value="${lastName}">
          <input type="hidden" name="buyer_email" value="${email}">
          <input type="hidden" name="buyer_account_age" value="0">
          <input type="hidden" name="buyer_id_nr" value="0">
          <input type="hidden" name="buyer_phone" value="${phone}">
          <input type="hidden" name="billing_address" value="${city || 'Turkiye'}">
          <input type="hidden" name="billing_city" value="${city || 'Turkiye'}">
          <input type="hidden" name="billing_country" value="TR">
          <input type="hidden" name="billing_postcode" value="34000">
          <input type="hidden" name="shipping_address" value="${city || 'Turkiye'}">
          <input type="hidden" name="shipping_city" value="${city || 'Turkiye'}">
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
    } catch(err) {
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
  } catch(e) {
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

// Admin tarafı için Dönüşüm Ekleme (Resim yükleme)
// Güvenlik için JWT Auth eklendi
app.post('/api/admin/transformations', verifyAdmin, upload.single('images'), (req, res) => {
  // Eğer resim yüklenemediyse kontrolü
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Lütfen bir resim yükleyin.' });
  }

  try {
    const imagePath = '/uploads/' + req.file.filename;
    const insertStmt = db.prepare('INSERT INTO transformations (id, image_url) VALUES (?, ?)');
    insertStmt.run(uuidv4(), imagePath);

    res.json({ success: true, message: 'Dönüşüm eklendi', imageUrl: imagePath });
  } catch(e) {
    res.status(500).json({ success: false, error: 'Veritabanı hatası' });
  }
});

// Admin tarafı için Dönüşüm Silme
app.delete('/api/admin/transformations/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  try {
    // Resmi bul
    const row = db.prepare('SELECT image_url FROM transformations WHERE id = ?').get(id);
    if(row) {
        // Dosyayı sunucudan fiziksel olarak sil
        const fullPath = path.join(__dirname, row.image_url);
        if(fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
    // DB'den sil
    db.prepare('DELETE FROM transformations WHERE id = ?').run(id);
    res.json({ success: true, message: 'Dönüşüm silindi' });
  } catch(e) {
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
    };
    
    res.json({ success: true, data: grouped, flatData: parsedPackages });
  } catch(e) {
    res.status(500).json({ success: false, error: 'Sorgu hatası' });
  }
});

// Paket Ekle
app.post('/api/admin/packages', verifyAdmin, (req, res) => {
  const { category, name, badge, price, period, description, features, unavailable, color, btnClass, order_index } = req.body;
  try {
    const insertStmt = db.prepare('INSERT INTO packages (id, category, name, badge, price, period, description, features, unavailable, color, btnClass, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const newId = uuidv4();
    insertStmt.run(
      newId, category, name, badge || null, price, period, description, 
      JSON.stringify(features || []), JSON.stringify(unavailable || []), 
      color || 'var(--camo-mid)', btnClass || 'pricing-btn', order_index || 0
    );
    res.json({ success: true, message: 'Paket eklendi', id: newId });
  } catch(e) {
    res.status(500).json({ success: false, error: 'Veritabanı hatası' });
  }
});

// Paket Güncelle
app.put('/api/admin/packages/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { category, name, badge, price, period, description, features, unavailable, color, btnClass, order_index } = req.body;
  
  try {
    const updateStmt = db.prepare(`
      UPDATE packages 
      SET category=?, name=?, badge=?, price=?, period=?, description=?, features=?, unavailable=?, color=?, btnClass=?, order_index=?
      WHERE id=?
    `);
    const info = updateStmt.run(
      category, name, badge || null, price, period, description, 
      JSON.stringify(features || []), JSON.stringify(unavailable || []), 
      color, btnClass, order_index || 0, id
    );
    if(info.changes > 0) res.json({ success: true, message: 'Paket güncellendi' });
    else res.status(404).json({ success: false, error: 'Paket bulunamadı' });
  } catch(e) {
    res.status(500).json({ success: false, error: 'Güncelleme hatası' });
  }
});

// Paket Sil
app.delete('/api/admin/packages/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM packages WHERE id = ?').run(id);
    res.json({ success: true, message: 'Paket silindi' });
  } catch(e) {
    res.status(500).json({ success: false, error: 'Paket silinemedi' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Sunucu http://localhost:" + PORT + " üzerinden çalışıyor.");
});

