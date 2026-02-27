import React, { useState } from 'react';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ModelCard = ({ m, style, selectModelo, addToPendingCart, pendingCart }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const archivos = m.archivos || [];
    const hasArchivos = archivos.length > 0;

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % archivos.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + archivos.length) % archivos.length);
    };

    const getImageUrl = (url) => {
        if (url.startsWith('http')) return url;
        // The media router is included at /media in back/urls.py
        return `http://localhost:8369/media/${url}`;
    };

    return (
        <div className={style.modelCard} onClick={() => selectModelo(m.id)}>
            <div className={style.modelThumbnail} style={{ position: 'relative', overflow: 'hidden' }}>
                {hasArchivos ? (
                    <>
                        <img 
                            src={getImageUrl(archivos[currentIndex].archivo_url)} 
                            alt={m.nombre} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {archivos.length > 1 && (
                            <>
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '0 5px', pointerEvents: 'none'
                                }}>
                                    <button 
                                        onClick={prevImage}
                                        style={{
                                            pointerEvents: 'auto', background: 'rgba(0,0,0,0.5)', color: '#fff',
                                            border: 'none', borderRadius: '50%', width: '30px', height: '30px',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        ‹
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        style={{
                                            pointerEvents: 'auto', background: 'rgba(0,0,0,0.5)', color: '#fff',
                                            border: 'none', borderRadius: '50%', width: '30px', height: '30px',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >
                                        ›
                                    </button>
                                </div>
                                <div style={{
                                    position: 'absolute', bottom: '8px', left: 0, width: '100%',
                                    display: 'flex', justifyContent: 'center', gap: '4px'
                                }}>
                                    {archivos.map((_, idx) => (
                                        <div key={idx} style={{
                                            width: '6px', height: '6px', borderRadius: '50%',
                                            background: idx === currentIndex ? '#7c3aed' : 'rgba(255,255,255,0.5)'
                                        }} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    "🧊"
                )}
            </div>
            <div className={style.modelBody}>
                <div className={style.modelName}>{m.nombre}</div>
                <div className={style.modelDesc} dangerouslySetInnerHTML={{ __html: m.descripcion || 'Sin descripción' }}></div>
                <div className={style.modelMeta}>
                    <span>{formatDate(m.created_at)}</span>
                    <span className={style.modelBadge}>
                        {m.num_archivos || 0} archivo{m.num_archivos !== 1 ? 's' : ''}
                    </span>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    {m.precio_minimo > 0 ? (
                        <div style={{ color: '#4ade80', fontWeight: 'bold' }}>Regular: ${parseFloat(m.precio_minimo).toFixed(2)}</div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <button 
                                onClick={(e) => addToPendingCart(m, e)}
                                style={{ 
                                    background: pendingCart.find(x => x.id === m.id) ? '#4ade80' : '#7c3aed', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '6px 12px', 
                                    borderRadius: '4px', 
                                    cursor: pendingCart.find(x => x.id === m.id) ? 'default' : 'pointer',
                                    fontSize: '0.85rem',
                                    flex: 1
                                }}
                                disabled={!!pendingCart.find(x => x.id === m.id)}
                            >
                                {pendingCart.find(x => x.id === m.id) ? '✔ En cotización' : 'Solicitar Cotización'}
                            </button>
                            {m.cotizaciones_pendientes > 0 && (
                                <span style={{ 
                                    background: '#f59e0b', 
                                    color: 'white', 
                                    padding: '2px 6px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }} title={`${m.cotizaciones_pendientes} cotizaciones pendientes para este modelo`}>
                                    ⏱ {m.cotizaciones_pendientes}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ModelosGrid = ({ ls }) => {
    const { style, modelos, selectModelo, addToPendingCart, pendingCart } = ls;
    return (
        <div className={style.modelosGrid}>
            {modelos.length === 0 && (
                <div className={style.emptyState}>
                    <div className={style.emptyIcon}>📦</div>
                    No hay modelos guardados aún.
                </div>
            )}
            {modelos.map(m => (
                <ModelCard key={m.id} m={m} style={style} selectModelo={selectModelo} addToPendingCart={addToPendingCart} pendingCart={pendingCart} />
            ))}
        </div>
    );
};
