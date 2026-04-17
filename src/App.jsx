import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainBoard from './pages/MainBoard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminTransformations from './pages/AdminTransformations';

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
        </Routes>
      </main>
    </div>
  )
}

export default App;
