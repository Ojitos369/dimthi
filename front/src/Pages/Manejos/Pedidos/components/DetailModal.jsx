import React from 'react';

export const DetailModal = ({ ls }) => {
    const { pedidoActual, closeDetail, style, openCommentModal, addCommentToPedido } = ls;

    if (!pedidoActual) return null;

    const getStatusStyle = (status) => {
        let bg = '#333';
        switch(status?.toLowerCase()) {
            case 'creado': bg = '#3b82f6'; break;
            case 'en producción':
            case 'en produccion': bg = '#f59e0b'; break;
            case 'completado': bg = '#10b981'; break;
            case 'entregado': bg = '#8b5cf6'; break;
            case 'cancelado': bg = '#ef4444'; break;
            default: bg = '#6b7280';
        }
        return { backgroundColor: bg, color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' };
    };

    return (
        <div className={style.modalOverlay} onClick={closeDetail}>
            <div className={style.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className={style.modalHeader}>
                    <h3>Kardex de Pedido <span style={{color:'#4ade80'}}>{pedidoActual.codigo}</span></h3>
                    <button onClick={closeDetail} className={style.btnClose}>✕</button>
                </div>

                <div className={style.modalBody}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px', background: '#222', padding: '15px', borderRadius: '8px' }}>
                        <div>
                            <span style={{color: '#888', display: 'block', fontSize: '0.85rem'}}>Cliente:</span>
                            <strong>{pedidoActual.cliente_nombre}</strong>
                            {pedidoActual.contacto && (
                                <div style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '4px' }}>
                                    <i className="fas fa-address-book" style={{marginRight: '5px'}}></i> 
                                    {pedidoActual.contacto}
                                </div>
                            )}
                        </div>
                        <div>
                            <span style={{color: '#888', display: 'block', fontSize: '0.85rem'}}>Estado:</span>
                            <span style={getStatusStyle(pedidoActual.estado)}>{(pedidoActual.estado || 'creado').toUpperCase()}</span>
                        </div>
                        <div>
                            <span style={{color: '#888', display: 'block', fontSize: '0.85rem'}}>Fecha Creación:</span>
                            <span>{new Date(pedidoActual.created_at).toLocaleString()}</span>
                        </div>
                        <div>
                            <span style={{color: '#888', display: 'block', fontSize: '0.85rem'}}>Total Artículos:</span>
                            <span>{pedidoActual.items?.reduce((acc, curr) => acc + (curr.cantidad || 1), 0) || 0}</span>
                        </div>
                    </div>

                    <h4 style={{borderBottom: '1px solid #333', paddingBottom: '8px'}}>Artículos en Pedido</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {pedidoActual.items?.map((item, idx) => (
                            <div key={idx} style={{ background: '#1a1a1a', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #7c3aed' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong style={{ color: '#fff' }}>{item.cotizacion?.nombre}</strong>
                                    <span style={{ background: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>x{item.cantidad}</span>
                                </div>
                                {(item.cotizacion?.modelos?.length > 0 || item.cotizacion?.modelos_relacionados?.length > 0) && (
                                    <ul style={{ fontSize: '0.85rem', color: '#aaa', paddingLeft: '20px', listStyleType: 'square', marginTop: '8px', marginBottom: '4px' }}>
                                        {(item.cotizacion?.modelos || item.cotizacion?.modelos_relacionados).map(m => (
                                            <li key={m.id}>
                                                <b>{(m.cantidad || 1) * item.cantidad}x</b> {m.nombre}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {item.notas && (
                                    <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '8px', fontStyle: 'italic', background: '#222', padding: '4px 8px', borderRadius: '4px' }}>
                                        " {item.notas} "
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '8px', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0 }}>Historial de Conversación</h4>
                        <button 
                            onClick={() => openCommentModal(pedidoActual.id)}
                            style={{ background: '#10b981', color: '#111', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                        >
                            + Añadir Mensaje
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {pedidoActual.comentarios?.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No hay comentarios ni actualizaciones.</div>
                        ) : (
                            pedidoActual.comentarios?.map(com => (
                                <div key={com.id} style={{
                                    alignSelf: com.is_admin ? 'flex-end' : 'flex-start',
                                    background: com.is_status_update ? '#374151' : (com.is_admin ? '#064e3b' : '#1f2937'),
                                    maxWidth: '85%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: com.is_status_update ? '1px dashed #fbbf24' : 'none',
                                    position: 'relative'
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                                        <span style={{ fontWeight: 'bold', color: com.is_admin ? '#34d399' : '#9ca3af' }}>{com.is_admin ? 'TÚ (ADMIN)' : 'CLIENTE'}</span>
                                        <span>{new Date(com.created_at).toLocaleString()}</span>
                                    </div>
                                    
                                    {com.is_status_update && (
                                        <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '4px', fontSize: '0.85rem' }}>
                                            Actualizó estado a: {com.new_status?.toUpperCase()}
                                        </div>
                                    )}
                                    
                                    {com.comentario && (
                                        <div style={{ color: '#f3f4f6', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                                            {com.comentario}
                                        </div>
                                    )}

                                    {com.archivos && com.archivos.length > 0 && (
                                        <div style={{ marginTop: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {com.archivos.map(arch => (
                                                <a key={arch.id} href={arch.archivo_url.startsWith('http') ? arch.archivo_url : `http://localhost:8369/media/${arch.archivo_url}`} target="_blank" rel="noreferrer">
                                                    <img 
                                                        src={arch.archivo_url.startsWith('http') ? arch.archivo_url : `http://localhost:8369/media/${arch.archivo_url}`}
                                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #555' }}
                                                        alt="attachment"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
