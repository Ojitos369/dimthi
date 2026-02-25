import React from 'react';
import { localStates, localEffects } from './localStates';

const MetricCard = ({ title, value, color, icon }) => (
    <div style={{ backgroundColor: '#1e1e1e', padding: '1.25rem', borderRadius: '8px', border: '1px solid #333', flex: '1', minWidth: '200px' }}>
        <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {icon} {title}
        </div>
        <div style={{ color: color || '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {typeof value === 'number' ? `$ ${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : value}
        </div>
    </div>
);

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const SalesDashboard = () => {
    const ls = localStates();
    const { processedSales, metrics, uniqueUsers, filterUser, setFilterUser, filterDateStart, setFilterDateStart, filterDateEnd, setFilterDateEnd } = ls;
    localEffects();

    return (
        <div style={{ padding: '2rem', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.75rem' }}>📊 Dashboard de Ventas</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', color: '#888' }}>Usuario</label>
                        <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={{ backgroundColor: '#1e1e1e', color: '#fff', border: '1px solid #333', padding: '0.4rem', borderRadius: '4px' }}>
                            <option value="">Todos los usuarios</option>
                            {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', color: '#888' }}>Desde</label>
                        <input type="date" value={filterDateStart} onChange={e => setFilterDateStart(e.target.value)} style={{ backgroundColor: '#1e1e1e', color: '#fff', border: '1px solid #333', padding: '0.4rem', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', color: '#888' }}>Hasta</label>
                        <input type="date" value={filterDateEnd} onChange={e => setFilterDateEnd(e.target.value)} style={{ backgroundColor: '#1e1e1e', color: '#fff', border: '1px solid #333', padding: '0.4rem', borderRadius: '4px' }} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                <MetricCard title="Ventas Totales" value={metrics.totalSales} color="#4ade80" icon="💰" />
                <MetricCard title="Costo Total" value={metrics.totalCosts} color="#f87171" icon="📉" />
                <MetricCard title="Ganancia Neta" value={metrics.totalProfit} color="#60a5fa" icon="🚀" />
                <MetricCard title="Unidades Vendidas" value={metrics.totalUnits} icon="📦" />
            </div>

            <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #333', backgroundColor: '#252525', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Desglose de Ventas
                </div>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#252525', color: '#888', borderBottom: '1px solid #333' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Fecha</th>
                                <th style={{ padding: '1rem' }}>Concepto</th>
                                <th style={{ padding: '1rem' }}>Usuario</th>
                                <th style={{ padding: '1rem' }}>Cant.</th>
                                <th style={{ padding: '1rem' }}>Costo U.</th>
                                <th style={{ padding: '1rem' }}>Venta U.</th>
                                <th style={{ padding: '1rem' }}>Total Venta</th>
                                <th style={{ padding: '1rem' }}>Ganancia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processedSales.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No hay ventas registradas con los filtros actuales.</td>
                                </tr>
                            ) : (
                                processedSales.map((s, idx) => (
                                    <tr key={s.id} style={{ borderBottom: '1px solid #2a2a2a', backgroundColor: idx % 2 === 0 ? 'transparent' : '#222' }}>
                                        <td style={{ padding: '0.75rem 1rem' }}>{formatDate(s.created_at)}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>{s.nombre || 'Venta sin nombre'}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>{s.usuario || '—'}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>{s.cantidad}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>${parseFloat(s.cotizacion_costo_total || 0).toFixed(2)}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>${parseFloat(s.cotizacion_precio_final || 0).toFixed(2)}</td>
                                        <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>${s.total_sale.toFixed(2)}</td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#4ade80' }}>+${s.total_profit.toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
