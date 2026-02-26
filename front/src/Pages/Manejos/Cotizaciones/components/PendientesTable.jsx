import React from 'react';
import Swal from 'sweetalert2';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const PendientesTable = ({ ls }) => {
    const { style, pendientes, resolvePendiente } = ls;

    const handleResolve = (id) => {
        Swal.fire({
            title: '¿Marcar como resuelta?',
            text: 'Haz esto después de haber creado la cotización real en la calculadora.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#198754',
            cancelButtonColor: '#666',
            confirmButtonText: 'Sí, marcar resuelta',
            cancelButtonText: 'Cancelar',
            background: '#1a1a1a',
            color: '#e0e0e0',
        }).then((result) => {
            if (result.isConfirmed) {
                resolvePendiente({ id: id, estado: 'resuelta' });
            }
        });
    }

    return (
        <div className={style.dataTable} style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Solicitudes Pendientes de Cotizar</h3>
            <div className={style.tableRow} style={{gridTemplateColumns: 'minmax(100px, 1fr) 2fr 2fr 180px', background: '#333'}}>
                <span style={{fontWeight:'bold'}}>Cliente / Ref</span>
                <span style={{fontWeight:'bold'}}>Modelos Requeridos</span>
                <span style={{fontWeight:'bold'}}>Fecha de Solicitud</span>
                <span style={{fontWeight:'bold', textAlign:'right'}}>Acciones</span>
            </div>
            {pendientes.length === 0 && <div className={style.emptyState}>No hay solicitudes pendientes en este momento.</div>}
            
            {pendientes.map(p => {
                const arrModelos = p.modelos_data || [];
                return (
                    <div key={p.id} className={style.tableRow} style={{gridTemplateColumns: 'minmax(100px, 1fr) 2fr 2fr 180px', alignItems: 'center'}}>
                        <span className={style.truncate} title={p.nombre}>
                            <b>{p.nombre}</b>
                            <div style={{fontSize:'0.8em',color:'#666'}}>{p.id.substring(0,8)}</div>
                        </span>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {arrModelos.map((m, idx) => (
                                <div key={idx} style={{ fontSize: '0.9rem', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ background: '#444', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{m.cantidad}x</span> 
                                    <span style={{flex: 1}}>{m.nombre_modelo}</span>
                                </div>
                            ))}
                            {(p.archivos_adjuntos?.length > 0 || arrModelos.some(m => m.archivos?.length > 0)) && (
                                <div style={{ fontSize: '0.8rem', color: '#60a5fa', marginTop: '4px' }}>
                                    📎 Contiene archivos adjuntos
                                </div>
                            )}
                        </div>
                        
                        <span className={style.truncate}>{formatDate(p.created_at)}</span>
                        
                        <div className={style.tableActions} style={{justifyContent: 'flex-end', gap: '8px'}}>
                            <button 
                                onClick={() => ls.openDetailPendiente(p.id)}
                                style={{
                                    background: '#333',
                                    color: 'white',
                                    border: '1px solid #555',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                                title="Ver detalles y archivos"
                            >
                                ℹ️ Detalles
                            </button>
                            <button 
                                onClick={() => handleResolve(p.id)}
                                style={{
                                    background: '#198754',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✓ Resolver
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
