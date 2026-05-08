// Vite'da "import.meta.env.DEV" lokal geliştirmede true olur
// "import.meta.env.PROD" ise canlı ortamda build edildiğinde true olur
export const API_URL = import.meta.env.DEV 
  ? "http://localhost:5000" 
  : "https://api.serhatgundarcoaching.com";
