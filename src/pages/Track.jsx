import React, { useState } from 'react';
import { Search, Loader2, Calendar, DollarSign, AlertCircle, Wrench, Shield } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'received', label: 'Recibido', desc: 'El dispositivo ha ingresado a nuestras instalaciones.' },
  { key: 'diagnosing', label: 'Diagnosticando', desc: 'Nuestros técnicos están revisando el equipo para identificar la falla.' },
  { key: 'repairing', label: 'En Reparación', desc: 'Se está realizando el trabajo técnico y cambio de componentes.' },
  { key: 'ready', label: 'Listo para Entrega', desc: 'El equipo ha sido probado con éxito y espera ser recogido.' },
  { key: 'delivered', label: 'Entregado', desc: 'El equipo ha sido devuelto al cliente de conformidad.' }
];

export default function Track() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`/api/repairs/track/${trackingId.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No pudimos encontrar una orden con ese código.');
      }

      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Determine visual classes for timeline steps
  const getStepClass = (stepKey, currentStatus) => {
    const statusOrder = ['received', 'diagnosing', 'repairing', 'ready', 'delivered'];
    const currentIdx = statusOrder.indexOf(currentStatus);
    const stepIdx = statusOrder.indexOf(stepKey);

    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="section-container" style={{ maxWidth: '800px' }}>
      <div className="section-header">
        <h2 className="section-title">Seguimiento de Reparación</h2>
        <p className="section-desc">
          Introduce el código único de 8 caracteres (ej. NR-A1B2C3) que te fue asignado al registrar tu equipo para ver su estado actual.
        </p>
      </div>

      <div className="tracker-container">
        <form onSubmit={handleSearch} className="tracker-search-box">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Código de Rastreo (Ej: NR-7FD9B3)" 
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            style={{ textTransform: 'uppercase' }}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }} disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Buscar
          </button>
        </form>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', borderRadius: '12px', padding: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="form-panel" style={{ maxWidth: '100%', textAlign: 'left' }}>
            {/* Order Header Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <span className="status-badge received" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                  Orden: {order.trackingId}
                </span>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
                  {order.deviceModel}
                </h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Categoría: {order.deviceType}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`status-badge ${order.status}`}>
                  {STATUS_STEPS.find(s => s.key === order.status)?.label || order.status}
                </span>
                <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                  <Calendar size={14} />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Price and Notes Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <DollarSign size={14} /> Costo de Reparación
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: order.cost > 0 ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                  {order.cost > 0 ? `$${order.cost.toLocaleString()}` : 'En Diagnóstico / Sin costo'}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <Shield size={14} /> Notas de Servicio
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                  {order.notes || 'Ninguna nota agregada por el técnico.'}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '1.25rem' }}>
              Historial de Estado
            </h4>
            
            <div className="timeline">
              {STATUS_STEPS.map((step) => {
                const stepClass = getStepClass(step.key, order.status);
                return (
                  <div key={step.key} className={`timeline-step ${stepClass}`}>
                    <div className="timeline-node"></div>
                    <div className="timeline-content">
                      <h5 className="timeline-title">
                        {step.label}
                      </h5>
                      <p className="timeline-desc">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
