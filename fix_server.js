const fs = require('fs');

let content = fs.readFileSync('backend/server.js', 'utf8');

// Fix 1: Hardcoded Secrets
content = content.replace(
  "const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Serhat123!';",
  "const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;\nif(!ADMIN_PASSWORD) { console.error('CRITICAL: ADMIN_PASSWORD is not set in .env'); process.exit(1); }"
);
content = content.replace(
  "const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123!';",
  "const JWT_SECRET = process.env.JWT_SECRET;\nif(!JWT_SECRET) { console.error('CRITICAL: JWT_SECRET is not set in .env'); process.exit(1); }"
);

// Fix 2: CORS open policy
content = content.replace(
  "app.use(cors()); // Sadece izin verilen sitelerden (Frontend) istek kabul eder",
  "app.use(cors({ origin: ['http://localhost:5173', 'https://sizin-domaininiz.com'] })); // TODO: Canlý domaini ekle"
);

// Fix 3: Multer mimetype validation
content = content.replace(
  "const upload = multer({\r\n  storage: storage,\r\n  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit\r\n});",
  "const upload = multer({\n  storage: storage,\n  limits: { fileSize: 10 * 1024 * 1024 },\n  fileFilter: (req, file, cb) => {\n    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];\n    if (allowedMimeTypes.includes(file.mimetype)) {\n      cb(null, true);\n    } else {\n      cb(new Error('Sadece gorsel yuklenebilir! (jpeg, jpg, png, webp)'), false);\n    }\n  }\n});"
);
content = content.replace(
  "const upload = multer({\n  storage: storage,\n  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit\n});",
  "const upload = multer({\n  storage: storage,\n  limits: { fileSize: 10 * 1024 * 1024 },\n  fileFilter: (req, file, cb) => {\n    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];\n    if (allowedMimeTypes.includes(file.mimetype)) {\n      cb(null, true);\n    } else {\n      cb(new Error('Sadece gorsel yuklenebilir! (jpeg, jpg, png, webp)'), false);\n    }\n  }\n});"
);

// Fix 4: Fix my broken IDOR patch
const badDestructRegex = /const \{ firstName.*?const amount = parseFloat\(amountStr\);/s;
const correctDestruct = \const { firstName, lastName, phone, email, city, planId } = value;

  // 1. GUVENLIK YAMASI: Veritabanýndan fiyati kontrol et!
  const stmt = db.prepare('SELECT * FROM packages WHERE id = ?');
  const packageData = stmt.get(planId);
  if (!packageData) {
    return res.status(404).json({ success: false, error: 'Paket bulunamadi veya geçersiz.' });
  }

  const planName = packageData.name;
  const platformOrderId = 'SO-' + uuidv4().substring(0, 8).toUpperCase();
  const amountStr = packageData.price.replace('?', '').replace('.', '').replace(',', '.').trim();
  const amount = parseFloat(amountStr);
\;

content = content.replace(badDestructRegex, correctDestruct);

fs.writeFileSync('backend/server.js', content, 'utf8');
console.log('Fixed server.js vulnerabilities!');
