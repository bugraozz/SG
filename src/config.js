// Vite'da "import.meta.env.DEV" lokal geliştirmede true olur
// "import.meta.env.PROD" ise Vercel/Railway gibi yerlerde build edildiğinde true olur
export const API_URL = import.meta.env.DEV 
  ? "http://localhost:5000" 
  : "https://compassionate-flexibility-production-b8b0.up.railway.app";
