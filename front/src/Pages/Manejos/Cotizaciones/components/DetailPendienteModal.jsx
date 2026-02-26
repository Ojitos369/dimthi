import React from 'react';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `http://localhost:8369/media/${url}`;
};

export const DetailPendienteModal = ({ ls }) => {
    const { pendientes, detailPendienteId, closeDetailPendiente } = ls;
    const item = pendientes.find(c => c.id === detailPendienteId);
    
    if (!item) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={closeDetailPendiente}>
            <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '1.5rem', width: '90%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>Detalles de Solicitud Pendiente</h2>
                    <button onClick={closeDetailPendiente} style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>ID Referencia:</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff', wordBreak: 'break-all' }}>{item.id}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Nombre del Cliente:</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{item.nombre || 'Desconocido'}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Fecha de Solicitud:</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>{formatDate(item.created_at)}</div>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>Comentarios o Especificaciones Generales:</div>
                    <div style={{ fontSize: '0.9rem', color: '#fff', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        {item.comentarios || 'El cliente no dejó comentarios generales.'}
                    </div>
                </div>

                <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#4ade80', marginBottom: '1rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>Modelos Solicitados ({item.modelos_data?.length || 0})</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {item.modelos_data?.map((m, idx) => (
                            <div key={idx} style={{ background: '#222', padding: '12px', borderRadius: '8px', border: '1px solid #444', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
                                
                                {/* Imágenes del modelo */}
                                <div>
                                    {m.archivos?.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <a href={getImageUrl(m.archivos[0].archivo_url)} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', aspectRatio: '1/1', borderRadius: '4px', overflow: 'hidden', border: '1px solid #666' }}>
                                                <img src={getImageUrl(m.archivos[0].archivo_url)} alt={m.nombre_modelo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML='<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#111;font-size:0.75rem;color:#666;">Sin Preview</div>' }} />
                                            </a>
                                            {m.archivos.length > 1 && (
                                                <div style={{ fontSize: '0.75rem', color: '#888', textAlign: 'center' }}>+ {m.archivos.length - 1} imágenes</div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ width: '100%', aspectRatio: '1/1', background: '#111', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #444', color: '#666', fontSize: '0.8rem' }}>Sin imágenes</div>
                                    )}
                                </div>

                                {/* Detalles del modelo */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>{m.nombre_modelo}</h4>
                                        <div style={{ background: '#7c3aed', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {m.cantidad} unidades
                                        </div>
                                    </div>
                                    
                                    {m.link_modelo && (
                                        <div style={{ marginBottom: '8px', fontSize: '0.85rem' }}>
                                            <a href={m.link_modelo} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'none' }}>🔗 Enlace Original (MakerWorld, etc)</a>
                                        </div>
                                    )}

                                    <div style={{ fontSize: '0.85rem', color: '#aaa', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>
                                        {m.descripcion_modelo || <span style={{ fontStyle: 'italic', color: '#666' }}>Sin descripción detallada.</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {item.archivos_adjuntos?.length > 0 && (
                    <div style={{ marginTop: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Archivos Generales Adjuntos</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: '#222', padding: '12px', borderRadius: '8px', border: '1px solid #444' }}>
                            {item.archivos_adjuntos.map((a, idx) => {
                                const fileName = a.archivo_url.split('/').pop() || 'Archivo';
                                return (
                                    <a key={idx} href={getImageUrl(a.archivo_url)} target="_blank" rel="noreferrer" 
                                        style={{ background: '#333', color: '#60a5fa', fontSize: '0.85rem', textDecoration: 'none', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        📎 {fileName.length > 25 ? fileName.substring(0, 25) + '...' : fileName}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
