import React, { useState } from 'react';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const DetailModal = ({ ls }) => {
    const { style, selectedModeloId, modeloActual, closeDetail, logged, addToPendingCart, pendingCart } = ls;
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // React automatically drops states when component unmounts, but since 
    // it's conditionally rendered it's safer to reset on new model
    React.useEffect(() => {
        setCurrentIndex(0);
    }, [modeloActual?.id]);

    const sortedCotizaciones = React.useMemo(() => {
        if (!modeloActual?.cotizaciones) return [];
        return [...modeloActual.cotizaciones].sort((a, b) => {
            const priceA = parseFloat(a.precio_final || a.costo_total || 0);
            const priceB = parseFloat(b.precio_final || b.costo_total || 0);
            return priceA - priceB;
        });
    }, [modeloActual?.cotizaciones]);
    
    if (!selectedModeloId || !modeloActual) return null;

    const archivos = modeloActual.archivos || [];
    const hasMedia = archivos.length > 0;

    const nextMedia = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % archivos.length);
    };

    const prevMedia = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + archivos.length) % archivos.length);
    };

    const isVideo = (url) => {
        if (!url) return false;
        const ext = url.split('.').pop().toLowerCase();
        return ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
    };

    const resolveMediaUrl = (url) => {
        if (!url) return '';
        // The media router is included at /media in back/urls.py
        return url.startsWith('http') ? url : `http://localhost:8369/media/${url}`;
    };

    const decodeHtml = (html) => {
        if (!html) return '';
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    return (
        <div className={style.detailOverlay} onClick={closeDetail}>
            <div className={style.detailCard} onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
                <div className={style.detailHeader}>
                    <div className={style.detailTitle}>{modeloActual.nombre}</div>
                    <button className={style.closeBtn} onClick={closeDetail}>✕</button>
                </div>
                <div className={style.detailBody}>
                    {hasMedia && (
                        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#111', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isVideo(archivos[currentIndex].archivo_url) ? (
                                <video src={resolveMediaUrl(archivos[currentIndex].archivo_url)} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            ) : (
                                <img src={resolveMediaUrl(archivos[currentIndex].archivo_url)} alt="media" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            )}
                            
                            {archivos.length > 1 && (
                                <>
                                    <button onClick={prevMedia} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❮</button>
                                    <button onClick={nextMedia} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❯</button>
                                    <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                                        {currentIndex + 1} / {archivos.length}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                
                    {modeloActual.descripcion && (
                        <div className={style.detailDesc} dangerouslySetInnerHTML={{ __html: decodeHtml(modeloActual.descripcion) }}></div>
                    )}
                    
                    {modeloActual.link && (
                        <div className={style.detailRow} style={{ marginTop: '0.5rem' }}>
                            <span className={style.detailLabel}>Link:</span>
                            <span className={style.detailValue}>
                                <a href={modeloActual.link} target="_blank" rel="noreferrer" style={{color: '#4ade80'}}>{modeloActual.link}</a>
                            </span>
                        </div>
                    )}
                    
                    <div className={style.detailRow} style={{ marginTop: '0.5rem' }}>
                        <span className={style.detailLabel}>Fecha de creación:</span>
                        <span className={style.detailValue}>{formatDate(modeloActual.created_at)}</span>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {modeloActual.precio_minimo > 0 ? (
                            <div style={{ fontSize: '1.2rem', color: '#4ade80', fontWeight: 'bold' }}>
                                Precio desde: ${parseFloat(modeloActual.precio_minimo).toFixed(2)}
                            </div>
                        ) : (
                            <button 
                                onClick={(e) => addToPendingCart(modeloActual, e)}
                                style={{ 
                                    background: pendingCart.find(x => x.id === modeloActual.id) ? '#4ade80' : '#7c3aed', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '10px 20px', 
                                    borderRadius: '6px', 
                                    cursor: pendingCart.find(x => x.id === modeloActual.id) ? 'default' : 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '1rem'
                                }}
                                disabled={!!pendingCart.find(x => x.id === modeloActual.id)}
                            >
                                {pendingCart.find(x => x.id === modeloActual.id) ? '✔ En cotización' : 'Solicitar Cotización'}
                            </button>
                        )}
                    </div>

                    {sortedCotizaciones.length > 0 && (
                        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                            <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '1.1rem' }}>Cotizaciones ({sortedCotizaciones.length})</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {sortedCotizaciones.map(c => {
                                    let snap = null;
                                    try { if (c.snapshot_data) snap = JSON.parse(c.snapshot_data); } catch(e) {}
                                    
                                    return (
                                        <div key={c.id} style={{ background: '#222', padding: '0.75rem', borderRadius: '4px', border: '1px solid #333' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ color: '#fff', fontWeight: 'bold' }}>{c.nombre || c.id.substring(0,8)}</span>
                                                <span style={{ color: '#4ade80', fontWeight: 'bold' }}>${parseFloat(c.precio_final||c.costo_total||0).toFixed(2)}</span>
                                            </div>
                                            
                                            {c.comentarios && (
                                                <div style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '8px', fontStyle: 'italic' }}>
                                                    "{c.comentarios}"
                                                </div>
                                            )}
                                            
                                            {snap ? (
                                                <div style={{ fontSize: '0.8rem', color: '#aaa', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px', borderTop: '1px dashed #444', paddingTop: '4px' }}>
                                                    <div><span style={{color: '#777'}}>Mat:</span> {snap.materiaL_type}</div>
                                                    <div><span style={{color: '#777'}}>Tiempo:</span> {snap.time_h}h {snap.time_m}m</div>
                                                    {logged && (
                                                        <>
                                                            <div><span style={{color: '#777'}}>Costo Real:</span> ${parseFloat((snap.results?.price||0)-(snap.results?.profit||0)).toFixed(2)}</div>
                                                            <div><span style={{color: '#777'}}>Utilidad:</span> ${parseFloat(snap.results?.profit||0).toFixed(2)}</div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
