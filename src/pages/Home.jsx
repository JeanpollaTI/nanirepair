import React, { useState } from 'react';
import { 
  Gamepad, 
  Tv, 
  Laptop, 
  Cpu, 
  Smartphone, 
  Tablet, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

const DEVICE_CATEGORIES = [
  {
    id: 'Console',
    name: 'Consolas de Videojuegos',
    icon: Gamepad,
    desc: 'Reparación de PS5, Xbox Series X/S, Nintendo Switch y consolas retro. Limpieza, cambio de puerto HDMI, lector de discos y sobrecalentamiento.',
    tags: ['HDMI', 'Lector', 'Mantenimiento', 'Reballing']
  },
  {
    id: 'Controller',
    name: 'Controles / Mandos',
    icon: Gamepad,
    desc: 'Solución a drift en palancas (sticks), botones atascados, problemas de batería y conectividad bluetooth en DualSense, Xbox controller y mandos PRO.',
    tags: ['Drift', 'Botones', 'Batería', 'Joysticks']
  },
  {
    id: 'Monitor',
    name: 'Monitores',
    icon: Tv,
    desc: 'Reparación de pantallas de PC y gaming monitors. Cambio de puertos DisplayPort/HDMI, fuentes de poder quemadas y reparación de circuitos.',
    tags: ['Puertos', 'Fuentes', 'Pantalla', 'Leds']
  },
  {
    id: 'Laptop',
    name: 'Laptops / Notebooks',
    icon: Laptop,
    desc: 'Mantenimiento preventivo, cambio de teclado, reparación de bisagras, reemplazo de pantalla rota y actualizaciones de memoria RAM y SSD.',
    tags: ['Bisagras', 'SSD/RAM', 'Pantallas', 'Teclados']
  },
  {
    id: 'PC',
    name: 'PC Gamer y de Escritorio',
    icon: Cpu,
    desc: 'Diagnóstico de fallas en tarjeta madre, fuentes de poder, mantenimiento térmico de GPU/CPU y ensamblaje personalizado para alto rendimiento.',
    tags: ['GPU', 'Limpieza Térmica', 'Motherboard', 'Fuente']
  },
  {
    id: 'Phone',
    name: 'Celulares / Smartphones',
    icon: Smartphone,
    desc: 'Cambio de pantallas OLED/LCD, baterías infladas, puertos de carga tipo C / Lightning dañados y recuperación de equipos mojados.',
    tags: ['Pantalla Rota', 'Batería', 'Pin de Carga', 'Humedad']
  },
  {
    id: 'Tablet',
    name: 'Tabletas',
    icon: Tablet,
    desc: 'Reemplazo de cristales táctiles rotos, reparación de iPad y tabletas Android, cambios de batería y diagnóstico de carga lenta.',
    tags: ['Táctil', 'Batería', 'iPad', 'Software']
  }
];

export default function Home({ onNavigate }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deviceType: 'Console',
    deviceModel: '',
    issueDescription: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessData(null);

    try {
      const response = await fetch('/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal al enviar la solicitud.');
      }

      setSuccessData(data);
      // Reset form fields except name/contact to make it easier to add more
      setFormData(prev => ({
        ...prev,
        deviceModel: '',
        issueDescription: ''
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="hero-badge">
          <Wrench size={14} className="nav-logo-icon" />
          Servicio Técnico Especializado
        </div>
        <h1 className="hero-title">
          Revive tus Dispositivos con <span>NaniRepair</span>
        </h1>
        <p className="hero-subtitle">
          Especialistas en la reparación de consolas de videojuegos, mandos, computadoras, laptops y celulares. Diagnósticos rápidos y reparaciones garantizadas.
        </p>
        <div className="hero-actions">
          <a href="#solicitar" className="btn btn-primary">
            Solicitar Reparación <ArrowRight size={18} />
          </a>
          <button onClick={() => onNavigate('track')} className="btn btn-secondary">
            Rastrear mi Orden
          </button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-desc">
            Trabajamos con repuestos de alta calidad y herramientas de precisión para reparar lo que otros dan por perdido.
          </p>
        </div>
        
        <div className="services-grid">
          {DEVICE_CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="service-card">
                <div className="service-icon-wrapper">
                  <IconComponent size={24} />
                </div>
                <h3 className="service-card-title">{category.name}</h3>
                <p className="service-card-desc">{category.desc}</p>
                <div className="service-tags">
                  {category.tags.map((tag, idx) => (
                    <span key={idx} className="service-tag">{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Request Repair Form */}
      <section id="solicitar" className="section-container" style={{ scrollMarginTop: '100px' }}>
        <div className="section-header">
          <h2 className="section-title">Solicita una Reparación</h2>
          <p className="section-desc">
            Registra tu equipo en nuestra base de datos. Recibirás un código de rastreo único para seguir el progreso del diagnóstico y reparación de tu dispositivo.
          </p>
        </div>

        <div className="form-panel">
          {successData && (
            <div className="success-banner">
              <CheckCircle2 size={36} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
              <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-heading)' }}>¡Solicitud Registrada con Éxito!</h3>
              <p>Tu orden ha sido creada. Utiliza el siguiente código para ver el avance:</p>
              <div className="tracking-code-display">
                {successData.trackingId}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Guarda este código para consultar el estado en la pestaña <strong>Rastrear Orden</strong>.
              </p>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre del Cliente</label>
              <input 
                type="text" 
                name="customerName" 
                className="form-input" 
                placeholder="Ej. Jean Pollo"
                value={formData.customerName}
                onChange={handleChange}
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="customerEmail" 
                  className="form-input" 
                  placeholder="ejemplo@correo.com"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Número de Teléfono</label>
                <input 
                  type="tel" 
                  name="customerPhone" 
                  className="form-input" 
                  placeholder="Ej. +52 5512345678"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Tipo de Dispositivo</label>
                <select 
                  name="deviceType" 
                  className="form-input form-select"
                  value={formData.deviceType}
                  onChange={handleChange}
                >
                  <option value="Console">Consola de Videojuegos</option>
                  <option value="Controller">Control / Mando</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Laptop">Laptop</option>
                  <option value="PC">PC Gamer / Escritorio</option>
                  <option value="Phone">Celular / Smartphone</option>
                  <option value="Tablet">Tableta</option>
                  <option value="Other">Otro dispositivo</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Modelo del Dispositivo</label>
                <input 
                  type="text" 
                  name="deviceModel" 
                  className="form-input" 
                  placeholder="Ej. PS5 Slim, Xbox Series controller, iPhone 14"
                  value={formData.deviceModel}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descripción del Fallo / Problema</label>
              <textarea 
                name="issueDescription" 
                className="form-input form-textarea" 
                placeholder="Cuéntanos a detalle qué le ocurre a tu equipo (Ej. Se calienta mucho y se apaga a los 10 minutos, drift en palanca izquierda...)"
                value={formData.issueDescription}
                onChange={handleChange}
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Registrando equipo...
                </>
              ) : (
                'Registrar Reparación'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
