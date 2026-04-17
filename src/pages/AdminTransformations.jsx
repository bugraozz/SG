import React, { useState, useEffect } from 'react';
import './AdminTransformations.css';
import { API_URL } from '../config';

const AdminTransformations = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setMessage('');
      } else {
        setMessage('Giriş Başarısız: ' + data.error);
      }
    } catch (err) {
      setMessage('Bağlantı hatası.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    setImages([]);
    setMessage('');
  };

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/transformations`);
      const data = await res.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchImages();
      fetchPackages();
    }
  }, [token]);

  const [activeTab, setActiveTab] = useState('transformations'); // 'transformations' veya 'packages'
  const [packages, setPackages] = useState([]);
  const [pkgForm, setPkgForm] = useState({ category: 'online', name: '', badge: '', price: '', period: '', description: '', features: '', unavailable: '', color: 'var(--camo-mid)', btnClass: 'pricing-btn', order_index: 0 });
  const [editingPkg, setEditingPkg] = useState(false);

  const fetchPackages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/packages`);
      const data = await res.json();
      if (data.success) {
        setPackages(data.flatData || []);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handlePkgSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Parse comma separated strings into arrays
    const payload = {
      ...pkgForm,
      features: pkgForm.features.split(',').map(s=>s.trim()).filter(Boolean),
      unavailable: pkgForm.unavailable.split(',').map(s=>s.trim()).filter(Boolean),
    };

    const url = editingPkg ? `${API_URL}/api/admin/packages/${pkgForm.id}` : `${API_URL}/api/admin/packages`;
    const method = editingPkg ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(data.success) {
        setMessage(editingPkg ? "Paket başarıyla güncellendi!" : "Paket başarıyla eklendi!");
        fetchPackages();
        handleCancelPkg();
      } else {
        if(res.status === 401 || res.status === 403) handleLogout();
        setMessage("Hata: " + data.error);
      }
    } catch(err) {
      setMessage("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPkg = (pkg) => {
    setEditingPkg(true);
    setPkgForm({
      ...pkg,
      features: (pkg.features || []).join(', '),
      unavailable: (pkg.unavailable || []).join(', ')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePkg = async (id) => {
    if(!window.confirm("Bu paketi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/packages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if(data.success) {
        fetchPackages();
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleCancelPkg = () => {
    setEditingPkg(false);
    setPkgForm({ category: 'online', name: '', badge: '', price: '', period: '', description: '', features: '', unavailable: '', color: 'var(--camo-mid)', btnClass: 'pricing-btn', order_index: 0 });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('images', file);

    try {
      const res = await fetch(`${API_URL}/api/admin/transformations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMessage('Görsel başarıyla yüklendi.');
        setFile(null);
        fetchImages();
      } else {
        if (res.status === 401 || res.status === 403) handleLogout();
        setMessage('Yükleme başarısız: ' + data.error);
      }
    } catch (err) {
      setMessage('Yükleme sırasında hata oluştu.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu görseli silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/transformations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        fetchImages();
      } else {
        if (res.status === 401 || res.status === 403) handleLogout();
        alert("Silme başarısız: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Silme sırasında hata oluştu.");
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-black px-4">
        <form onSubmit={handleLogin} className="w-full max-w-md relative group flex flex-col gap-4">
          <div className="relative">
            {/* Arkadaki parlama efekti (sadece odaklanınca veya hover'da belirginleşebilir) */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-lg blur opacity-25 group-hover:opacity-50 group-focus-within:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-[#0a0a0a] rounded-lg border border-red-900/30 p-1.5 flex items-stretch shadow-2xl">
              {/* Sol kısımdaki ikon veya badge */}
              <div className="pl-4 pr-3 py-3 flex items-center justify-center border-r border-red-900/30">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span className="ml-2 text-sm font-semibold tracking-wider text-red-500 uppercase">Admin</span>
              </div>

              <input 
                type="password" 
                placeholder="Yönetici şifrenizi girin..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none focus:ring-0 placeholder-gray-600 min-w-0"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-lg font-bold tracking-wider text-base uppercase transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Giriş Yap'}
          </button>
          
          {message && <p className="absolute -bottom-8 left-0 right-0 text-center text-sm text-red-500 font-medium">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-tf-container" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Admin Paneli</h2>
        <button onClick={handleLogout} className="admin-tf-delete" style={{ width: 'auto', padding: '10px 20px' }}>Çıkış Yap</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('transformations')} className="admin-tf-btn" style={{ background: activeTab === 'transformations' ? 'var(--camo-sand)' : 'transparent', color: activeTab === 'transformations' ? 'black' : 'white', border: '1px solid var(--camo-sand)' }}>
          Dönüşümler
        </button>
        <button onClick={() => setActiveTab('packages')} className="admin-tf-btn" style={{ background: activeTab === 'packages' ? 'var(--camo-sand)' : 'transparent', color: activeTab === 'packages' ? 'black' : 'white', border: '1px solid var(--camo-sand)' }}>
          Paket Yönetimi
        </button>
      </div>
      
      {message && <p className="admin-tf-msg">{message}</p>}

      {activeTab === 'transformations' && (
        <div className="tab-content fade-in">
          <form onSubmit={handleUpload} className="admin-tf-form" style={{ marginTop: '20px' }}>
            <input type="file" accept="image/*" onChange={handleFileChange} required />
            <button type="submit" disabled={loading || !file} className="admin-tf-btn">
              {loading ? 'Yükleniyor...' : 'Görsel Ekle'}
            </button>
          </form>
          
          <div className="admin-tf-gallery">
            {images.map(img => (
              <div key={img.id} className="admin-tf-card">
                <img 
                  src={`${API_URL}${img.image_url}`} 
                  alt="Transformation" 
                  onError={(e) => { e.target.src = img.image_url; }} 
                />
                <button onClick={() => handleDelete(img.id)} className="admin-tf-delete">
                  Görseli Sil
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'packages' && (
        <div className="tab-content fade-in">
          <form onSubmit={handlePkgSubmit} className="admin-tf-form" style={{ background: '#111', padding: '20px', borderRadius: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ color: 'var(--camo-sand)', marginBottom: '10px' }}>
                {editingPkg ? "Paketi Düzenle" : "Yeni Paket Ekle"}
              </h3>
            </div>
            
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Kategori</label>
              <select value={pkgForm.category} onChange={e=>setPkgForm({...pkgForm, category: e.target.value})} style={{width: '100%', padding: '10px', background: '#222', color: 'white', border: '1px solid #333', borderRadius: '5px'}}>
                <option value="tekli">Tekli Gelişim</option>
                <option value="coklu">Çoklu Gelişim</option>
                <option value="online">Online Koçluk</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Paket İsmi (Örn: 3 Aylık)</label>
              <input type="text" value={pkgForm.name} onChange={e=>setPkgForm({...pkgForm, name: e.target.value})} required style={{width: '100%', padding: '10px', background: '#222', color: 'white', border: '1px solid #333', borderRadius: '5px'}} />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Rozet (Örn: En İyi Fiyat)</label>
              <input type="text" value={pkgForm.badge} onChange={e=>setPkgForm({...pkgForm, badge: e.target.value})} style={{width: '100%', padding: '10px', background: '#222', color: 'white', border: '1px solid #333', borderRadius: '5px'}}/>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Sıralama / Düzen</label>
              <input type="number" value={pkgForm.order_index} onChange={e=>setPkgForm({...pkgForm, order_index: parseInt(e.target.value) || 0})} style={{width: '100%', padding: '10px', background: '#222', color: 'white', border: '1px solid #333', borderRadius: '5px'}}/>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Fiyat (Örn: 2.000₺)</label>
              <input type="text" value={pkgForm.price} onChange={e=>setPkgForm({...pkgForm, price: e.target.value})} required style={{width: '100%', padding: '10px', background: '#222', color: 'white', border: '1px solid #333', borderRadius: '5px'}} />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Periyot (Örn: /ay)</label>
              <input type="text" value={pkgForm.period} onChange={e=>setPkgForm({...pkgForm, period: e.target.value})} required style={{width: '100%', padding: '10px', background: '#222', color: 'white', border: '1px solid #333', borderRadius: '5px'}} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Kısa Açıklama</label>
              <input type="text" value={pkgForm.description} onChange={e=>setPkgForm({...pkgForm, description: e.target.value})} required style={{width: '100%', padding: '10px', background: '#222', color: 'white', border: '1px solid #333', borderRadius: '5px'}} />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Özellikler (Virgülle ayırın, Örn: Antrenman, Beslenme, İletişim)</label>
              <textarea value={pkgForm.features} onChange={e=>setPkgForm({...pkgForm, features: e.target.value})} rows="2" style={{width: '100%', padding: '10px', background: '#222', color: 'white', border: '1px solid #333', borderRadius: '5px'}}></textarea>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem'}}>Eksik Özellikler - Üzeri Çizili Gözükecekler (Virgülle ayırın)</label>
              <textarea value={pkgForm.unavailable} onChange={e=>setPkgForm({...pkgForm, unavailable: e.target.value})} rows="2" style={{width: '100%', padding: '10px', background: '#222', color: 'white', border: '1px solid #333', borderRadius: '5px'}}></textarea>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" disabled={loading} className="admin-tf-btn" style={{ flex: 1, padding: '15px' }}>
                {loading ? 'İşleniyor...' : (editingPkg ? 'Güncelle' : 'Kaydet')}
              </button>
              {editingPkg && (
                <button type="button" onClick={handleCancelPkg} style={{ flex: 0.5, padding: '15px', background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px' }}>
                  İptal (Yeni Ekle)
                </button>
              )}
            </div>
          </form>

          {/* Paket Listesi Tablosu */}
          <div style={{ marginTop: '40px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                  <th style={{ padding: '12px' }}>Kategori</th>
                  <th style={{ padding: '12px' }}>Sıra</th>
                  <th style={{ padding: '12px' }}>İsim</th>
                  <th style={{ padding: '12px' }}>Rozet</th>
                  <th style={{ padding: '12px' }}>Fiyat</th>
                  <th style={{ padding: '12px' }}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px', textTransform: 'capitalize' }}>{pkg.category}</td>
                    <td style={{ padding: '12px' }}>{pkg.order_index}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{pkg.name}</td>
                    <td style={{ padding: '12px' }}>{pkg.badge && <span style={{ background: '#ca0d1c', padding: '3px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>{pkg.badge}</span>}</td>
                    <td style={{ padding: '12px' }}>{pkg.price} {pkg.period}</td>
                    <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEditPkg(pkg)} style={{ background: 'var(--camo-olive)', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Düzenle</button>
                      <button onClick={() => handleDeletePkg(pkg.id)} style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {packages.length === 0 && <p style={{ textAlign: 'center', margin: '20px', color: '#666' }}>Henüz paket eklenmemiş.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransformations;