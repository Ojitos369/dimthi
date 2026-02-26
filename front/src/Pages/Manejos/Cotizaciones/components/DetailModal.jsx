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

export const DetailModal = ({ ls }) => {
    const { style, cotizaciones, detailId, closeDetail } = ls;
    const item = cotizaciones.find(c => c.id === detailId);
    
    if (!item) return null;

    let snap = null;
    try {
        if (item.snapshot_data) {
            snap = JSON.parse(item.snapshot_data);
        }
    } catch(e) {}

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={closeDetail}>
            <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '1.5rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #333' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Detalles de Cotización</h2>
                    <button onClick={closeDetail} style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>ID:</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff', wordBreak: 'break-all' }}>{item.id}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Nombre / Título:</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>{item.nombre || 'Sin Título'}</div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px' }}>Modelos Ligados y Archivos:</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {item.modelos?.length > 0 ? item.modelos.map((m, idx) => (
                                <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '6px', border: '1px solid #333' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500, marginBottom: '6px' }}>{m.nombre}</div>
                                    {m.archivos?.length > 0 ? (
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {m.archivos.map((a, i) => (
                                                <a key={i} href={getImageUrl(a.archivo_url)} target="_blank" rel="noreferrer" style={{ display: 'block', width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #444' }}>
                                                    <img src={getImageUrl(a.archivo_url)} alt="mod" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerHTML='<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#222;font-size:0.75rem;color:#888;">Archivo</div>' }} />
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Sin archivos</div>
                                    )}
                                </div>
                            )) : <div style={{ fontSize: '0.9rem', color: '#fff' }}>Ninguno</div>}
                        </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Comentarios:</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff', fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '4px', borderLeft: '2px solid #7c3aed' }}>{item.comentarios || 'Sin comentarios'}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Fecha de Creación:</div>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>{formatDate(item.created_at)}</div>
                    </div>
                </div>

                {snap ? (
                    <div style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '4px', border: '1px solid #222' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#4ade80', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>Snapshot de Variables</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                            <div><span style={{color:'#888'}}>Material Type:</span> <strong style={{color:'#fff'}}>{snap.materiaL_type}</strong></div>
                            <div><span style={{color:'#888'}}>Material Cost:</span> <strong style={{color:'#fff'}}>${parseFloat(snap.material_cost||0).toFixed(2)}/kg</strong></div>
                            
                            <div><span style={{color:'#888'}}>Time:</span> <strong style={{color:'#fff'}}>{snap.time_h}h {snap.time_m}m</strong></div>
                            <div><span style={{color:'#888'}}>Weight/Volume:</span> <strong style={{color:'#fff'}}>{snap.materiaL_type === 'filamento' ? `${snap.weight_g}g` : `${snap.volume_ml}ml`}</strong></div>
                            
                            <div><span style={{color:'#888'}}>Labor Time:</span> <strong style={{color:'#fff'}}>{snap.labor_m} min</strong></div>
                            <div><span style={{color:'#888'}}>Margin Target:</span> <strong style={{color:'#fff'}}>{parseFloat(snap.margin_p||0).toFixed(2)}%</strong></div>
                        </div>

                        <h3 style={{ margin: '1rem 0 0.5rem 0', fontSize: '0.95rem', color: '#fff' }}>Desglose de Costos (Snapshot)</h3>
                        <div style={{ background: '#000', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace', color: '#aaa', lineHeight: '1.5' }}>
                            <div style={{display:'flex', justifyContent:'space-between'}}><span>Material:</span> <span>${parseFloat(snap.results?.mat||0).toFixed(2)}</span></div>
                            <div style={{display:'flex', justifyContent:'space-between'}}><span>Electricidad:</span> <span>${parseFloat(snap.results?.energy||0).toFixed(2)}</span></div>
                            <div style={{display:'flex', justifyContent:'space-between'}}><span>Desgaste:</span> <span>${parseFloat(snap.results?.mach||0).toFixed(2)}</span></div>
                            <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #333', paddingBottom:'4px', marginBottom:'4px'}}><span>Mano de Obra:</span> <span>${parseFloat(snap.results?.labor||0).toFixed(2)}</span></div>
                            <div style={{display:'flex', justifyContent:'space-between', color:'#fff'}}><span>Costo Total:</span> <span>${parseFloat(item.costo_total||0).toFixed(2)}</span></div>
                            <div style={{display:'flex', justifyContent:'space-between', color:'#4ade80'}}><span>Utilidad Proyectada:</span> <span>+${parseFloat(snap.results?.profit||0).toFixed(2)}</span></div>
                            <div style={{display:'flex', justifyContent:'space-between', color:'#fff', fontWeight:'bold', marginTop:'4px', paddingTop:'4px', borderTop:'1px dashed #444'}}><span>Precio Sugerido:</span> <span>${parseFloat(snap.results?.price||0).toFixed(2)}</span></div>
                            <div style={{display:'flex', justifyContent:'space-between', color:'#4ade80', fontWeight:'bold', marginTop:'8px', paddingTop:'8px', borderTop:'2px solid #333'}}><span>Precio Final:</span> <span>${parseFloat(item.precio_final||0).toFixed(2)}</span></div>
                            <div style={{display:'flex', justifyContent:'space-between', color:'#4ade80', fontWeight:'bold'}}><span>Ganancia Total:</span> <span>+${parseFloat((item.precio_final||0) - (item.costo_total||0)).toFixed(2)}</span></div>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '1rem', backgroundColor: '#331a1a', color: '#ef4444', borderRadius: '4px', fontSize: '0.9rem', textAlign: 'center' }}>
                        No hay datos de Snapshot (Fotografía métrica) almacenados para esta cotización antigua.
                    </div>
                )}
            </div>
        </div>
    );
};
