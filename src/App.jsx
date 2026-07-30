import React, { useState } from 'react';
import Home from './pages/Home';
import Track from './pages/Track';
import Admin from './pages/Admin';
import { Wrench, Search, LayoutDashboard, Home as HomeIcon } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}>
          <Wrench size={22} className="nav-logo-icon" />
          <span>NaniRepair</span>
        </a>
        <div className="nav-links">
          <button 
            onClick={() => handleNavigate('home')} 
            className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
          >
            <HomeIcon size={16} />
            <span>Inicio</span>
          </button>
          <button 
            onClick={() => handleNavigate('track')} 
            className={`nav-btn ${currentView === 'track' ? 'active' : ''}`}
          >
            <Search size={16} />
            <span>Rastrear Orden</span>
          </button>
          <button 
            onClick={() => handleNavigate('admin')} 
            className={`nav-btn ${currentView === 'admin' ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Administrar</span>
          </button>
        </div>
      </nav>

      {/* Main Views Container */}
      <main className="main-content">
        {currentView === 'home' && <Home onNavigate={handleNavigate} />}
        {currentView === 'track' && <Track />}
        {currentView === 'admin' && <Admin />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <a href="#" className="footer-logo" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}>
            NaniRepair
          </a>
          <p style={{ margin: '0.25rem 0' }}>
            Servicio técnico integral de consolas, controles, pantallas, celulares y computadoras.
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}>Inicio</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleNavigate('track'); }}>Rastrear</a>
            <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); handleNavigate('admin'); }}>Panel Admin</a>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.5rem' }}>
            © {new Date().getFullYear()} NaniRepair. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
