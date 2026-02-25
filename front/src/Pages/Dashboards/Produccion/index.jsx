import React from 'react';
import { localStates, localEffects } from './localStates';

const MetricCard = ({ title, value, unit, color }) => (
    <div style={{ backgroundColor: '#1e1e1e', padding: '1.25rem', borderRadius: '8px', border: '1px solid #333', flex: '1', minWidth: '200px' }}>
        <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{title}</div>
        <div style={{ color: color || '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {value} <span style={{fontSize: '0.8rem', fontWeight: 'normal'}}>{unit}</span>
        </div>
    </div>
);

export const ProductionDashboard = () => {
    const { stats, maquinas } = localStates();
    localEffects();

    return (
        <div style={{ padding: '2rem', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.75rem' }}>🏭 Eficiencia de Producción</h1>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                <MetricCard title="Tiempo Total Impresión" value={stats.totalPrintingHours.toFixed(1)} unit="Hrs" color="#60a5fa" />
                <MetricCard title="Total de Máquinas" value={stats.totalMachines} unit="unid" color="#4ade80" />
                <MetricCard title="Máquinas FDM" value={stats.fdmCount} unit="unid" color="#facc15" />
                <MetricCard title="Máquinas SLA (Resina)" value={stats.slaCount} unit="unid" color="#f472b6" />
            </div>

            <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #333', backgroundColor: '#252525', fontWeight: 'bold' }}>
                    Estado de Maquinaria
                </div>
                <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {maquinas.map(m => (
                            <div key={m.id} style={{ padding: '1rem', backgroundColor: '#111', borderRadius: '6px', border: '1px solid #222' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>{m.nombre}</div>
                                <div style={{ fontSize: '0.8rem', color: '#888', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    <span>Tipo: <b style={{color: '#fff'}}>{m.tipo.toUpperCase()}</b></span>
                                    <span>Marca: <b style={{color: '#fff'}}>{m.marca || '—'}</b></span>
                                    <span>Power: <b style={{color: '#fff'}}>{m.power_kw} kW</b></span>
                                    <span>Costo/Hr: <b style={{color: '#fff'}}>${m.dep_hr}</b></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
