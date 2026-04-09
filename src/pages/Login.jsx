import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: backend entegrasyonu
    console.log('Login attempt:', formData);
  };

  return (
    <div className="auth-page">
      {/* Back Button */}
      <button className="auth-back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        Ana Sayfa
      </button>

      <div className="auth-wrapper">
        {/* ─── Left: Decorative Panel ─── */}
        <div className="auth-decorative">
          <div className="auth-decorative-orb orb-1" />
          <div className="auth-decorative-orb orb-2" />

          <div className="auth-brand">
            <div className="auth-brand-logo">SG<span>.</span></div>
            <h2 className="auth-brand-tagline">
              Hedefine Giden <br />
              Yolda İlk Adım.
            </h2>
            <p className="auth-brand-desc">
              Kişiselleştirilmiş antrenman ve beslenme programlarıyla 
              dönüşümüne bugün başla.
            </p>
          </div>
        </div>

        {/* ─── Right: Login Form ─── */}
        <div className="auth-form-panel">
          <div className="auth-form-header">
            <h1 className="auth-form-title">
              Giriş <span className="highlight">Yap</span>
            </h1>
            <p className="auth-form-subtitle">
              Hesabına giriş yaparak kaldığın yerden devam et.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="auth-input-group">
              <label htmlFor="login-email">E-Posta</label>
              <div className="auth-input-wrapper">
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="ornek@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                <Mail className="auth-input-icon" style={{ pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <label htmlFor="login-password">Şifre</label>
              <div className="auth-input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <Lock className="auth-input-icon" style={{ pointerEvents: 'none' }} />
                <button
                  type="button"
                  className="auth-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label="Şifre göster/gizle"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="auth-form-meta">
              <label className="auth-remember">
                <input type="checkbox" />
                Beni hatırla
              </label>
              <button type="button" className="auth-forgot">
                Şifremi Unuttum
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className="auth-submit-btn">
              GİRİŞ YAP
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">veya</span>
              <div className="auth-divider-line" />
            </div>

            {/* Social */}
            <div className="auth-social-row">
              <button type="button" className="auth-social-btn">
                <svg className="auth-social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" className="auth-social-btn">
                <svg className="auth-social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
                GitHub
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            Hesabın yok mu?{' '}
            <Link to="/register" className="auth-footer-link">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
