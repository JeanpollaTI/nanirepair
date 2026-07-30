import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Loader2, 
  Edit, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  DollarSign,
  X 
} from 'lucide-react';

export default function Admin() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [modalData, setModalData] = useState({
    status: 'received',
    cost: 0,
    notes: ''
  });

  const fetchRepairs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/repairs');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudieron cargar las reparaciones.');
      }
      setRepairs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleOpenModal = (repair) => {
    setSelectedRepair(repair);
    setModalData({
      status: repair.status,
      cost: repair.cost || 0,
      notes: repair.notes || ''
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRepair(null);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({
      ...prev,
      [name]: name === 'cost' ? parseFloat(value) || 0 : value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRepair) return;
    setUpdateLoading(true);

    try {
      const response = await fetch(`/api/repairs/${selectedRepair._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modalData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el registro.');
      }

      // Update the local list without refetching
      setRepairs(prev => prev.map(item => item._id === selectedRepair._id ? data : item));
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Filter repairs by search term
  const filteredRepairs = repairs.filter(repair => {
    const term = searchTerm.toLowerCase();
    return (
      repair.trackingId.toLowerCase().includes(term) ||
      repair.customerName.toLowerCase().includes(term) ||
      repair.deviceModel.toLowerCase().includes(term) ||
      repair.deviceType.toLowerCase().includes(term)
    );
  });

  // Calculate Statistics
  const totalOrders = repairs.length;
  const inDiagnosis = repairs.filter(r => r.status === 'diagnosing').length;
  const inRepair = repairs.filter(r => r.status === 'repairing').length;
  const readyOrders = repairs.filter(r => r.status === 'ready').length;
  const totalCostEstimate = repairs.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">Panel de Control (Administración)</h2>
        <p className="section-desc">
          Gestiona todas las solicitudes de reparación de dispositivos, actualiza estados y define costos.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4rem 0' }}>
          <Loader2 size={36} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite', color: 'var(--accent-cyan)' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Cargando registros de base de datos...</p>
        </div>
      ) : error ? (
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: 'var(--accent-rose)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={fetchRepairs} style={{ marginTop: '1rem' }}>
            Reintentar Cargar
          </button>
        </div>
      ) : (
        <>
          {/* Stats Bar */}
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-title">Total Órdenes</div>
              <div className="stat-value">{totalOrders}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title" style={{ color: '#a78bfa' }}>En Diagnóstico</div>
              <div className="stat-value" style={{ color: '#a78bfa' }}>{inDiagnosis}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title" style={{ color: '#fbbf24' }}>En Reparación</div>
              <div className="stat-value" style={{ color: '#fbbf24' }}>{inRepair}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title" style={{ color: '#34d399' }}>Listas para Entrega</div>
              <div className="stat-value" style={{ color: '#34d399' }}>{readyOrders}</div>
            </div>
            <div className="stat-card accent-stat">
              <div className="stat-title" style={{ color: 'var(--accent-cyan)' }}>Caja Estimada</div>
              <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
                ${totalCostEstimate.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem', border: '1px solid var(--border-glass)', borderRadius: '10px', marginBottom: '1.5rem', maxWidth: '400px' }}>
            <Search size={18} style={{ color: 'var(--text-muted)', margin: 'auto 0.5rem' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Buscar por cliente, código o modelo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: '0.25rem' }}
            />
          </div>

          {/* Table */}
          <div className="table-container">
            {filteredRepairs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No se encontraron órdenes de reparación registradas.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Dispositivo</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Costo</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRepairs.map((repair) => (
                    <tr key={repair._id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>
                        {repair.trackingId}
                      </td>
                      <td>
                        <div className="customer-info">
                          <span>{repair.customerName}</span>
                          <span className="customer-email">{repair.customerPhone}</span>
                        </div>
                      </td>
                      <td>{repair.deviceModel}</td>
                      <td>{repair.deviceType}</td>
                      <td>
                        <span className={`status-badge ${repair.status}`}>
                          {repair.status === 'received' && 'Recibido'}
                          {repair.status === 'diagnosing' && 'Diagnóstico'}
                          {repair.status === 'repairing' && 'Reparando'}
                          {repair.status === 'ready' && 'Listo'}
                          {repair.status === 'delivered' && 'Entregado'}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600' }}>
                        {repair.cost > 0 ? `$${repair.cost.toLocaleString()}` : '-'}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(repair.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button 
                          className="action-btn"
                          onClick={() => handleOpenModal(repair)}
                        >
                          <Edit size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          Actualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Edit Modal Overlay */}
      {modalOpen && selectedRepair && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Actualizar Reparación</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateSubmit}>
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Código de Orden: {selectedRepair.trackingId}</div>
                <div style={{ fontWeight: 'bold' }}>{selectedRepair.deviceModel}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Falla: {selectedRepair.issueDescription}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estado de Reparación</label>
                <select 
                  name="status" 
                  className="form-input form-select"
                  value={modalData.status}
                  onChange={handleModalChange}
                >
                  <option value="received">Recibido (Ingresado)</option>
                  <option value="diagnosing">En Diagnóstico (Evaluación)</option>
                  <option value="repairing">En Reparación (Trabajo Técnico)</option>
                  <option value="ready">Listo para Entrega (Completado)</option>
                  <option value="delivered">Entregado al Cliente (Terminado)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Costo de Reparación ($ MXN / USD)</label>
                <input 
                  type="number" 
                  name="cost" 
                  className="form-input" 
                  value={modalData.cost}
                  onChange={handleModalChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notas de Servicio / Estado Técnico</label>
                <textarea 
                  name="notes" 
                  className="form-input form-textarea" 
                  placeholder="Ej: Se reemplazaron componentes en fuente. O esperando refacciones."
                  value={modalData.notes}
                  onChange={handleModalChange}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={updateLoading}>
                  {updateLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
