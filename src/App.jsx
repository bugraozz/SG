import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainBoard from './pages/MainBoard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminTransformations from './pages/AdminTransformations';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<MainBoard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminTransformations />} />
          <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
          <Route path="/kullanim-kosullari" element={<TermsOfUse />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
