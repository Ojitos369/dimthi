import React from 'react';
import { localStates, localEffects } from './localStates';

const MetricCard = ({ title, value, unit, color }) => (
    <div style={{ backgroundColor: '#1e1e1e', padding: '1.25rem', borderRadius: '8px', border: '1px solid #333', flex: '1', minWidth: '220px' }}>
        <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{title}</div>
        <div style={{ color: color || '#fff', fontSize: '1.4rem', fontWeight: 'bold' }}>
            {typeof value === 'number' && (unit === '$') ? `$ ${value.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : `${value} ${unit || ''}`}
        </div>
    </div>
);

export const InventoryDashboard = () => {
    const { inventoryStats, filamentos, resinas } = localStates();
    localEffects();

    return (
        <div style={{ padding: '2rem', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.75rem' }}>📦 Inventario y Valor de Stock</h1>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                <MetricCard title="Valor Total Inventario" value={inventoryStats.totalInventoryValue} unit="$" color="#4ade80" />
                <MetricCard title="Consumo Histórico Filamento" value={inventoryStats.totalWeightConsumed.toFixed(2)} unit="kg" color="#facc15" />
                <MetricCard title="Consumo Histórico Resina" value={inventoryStats.totalVolumeConsumed.toFixed(2)} unit="L" color="#f472b6" />
                <MetricCard title="Materiales Registrados" value={inventoryStats.filamentCount + inventoryStats.resinCount} unit="items" color="#60a5fa" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #333', backgroundColor: '#252525', fontWeight: 'bold' }}>Filamentos</div>
                    <div style={{ padding: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {filamentos.map(f => (
                            <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #222' }}>
                                <span>{f.nombre} <span style={{fontSize: '0.7em', color: '#666'}}>{f.marca}</span></span>
                                <span style={{color: '#4ade80'}}>${parseFloat(f.precio_kg || 0).toFixed(2)}/kg</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px solid #333' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #333', backgroundColor: '#252525', fontWeight: 'bold' }}>Resinas</div>
                    <div style={{ padding: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {resinas.map(r => (
                            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #222' }}>
                                <span>{r.nombre} <span style={{fontSize: '0.7em', color: '#666'}}>{r.marca}</span></span>
                                <span style={{color: '#f472b6'}}>${parseFloat(r.precio_kg || 0).toFixed(2)}/L</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
