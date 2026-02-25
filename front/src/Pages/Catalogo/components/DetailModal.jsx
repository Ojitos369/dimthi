const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const DetailModal = ({ ls }) => {
    const { style, selectedModeloId, modeloActual, closeDetail } = ls;
    
    if (!selectedModeloId || !modeloActual) return null;

    return (
        <div className={style.detailOverlay} onClick={closeDetail}>
            <div className={style.detailCard} onClick={e => e.stopPropagation()}>
                <div className={style.detailHeader}>
                    <div className={style.detailTitle}>{modeloActual.nombre}</div>
                    <button className={style.closeBtn} onClick={closeDetail}>✕</button>
                </div>
                <div className={style.detailBody}>
                    {modeloActual.descripcion && (
                        <div className={style.detailDesc}>
                            {modeloActual.descripcion}
                        </div>
                    )}
                    <div className={style.detailRow}>
                        <span className={style.detailLabel}>Fecha de creación:</span>
                        <span className={style.detailValue}>{formatDate(modeloActual.created_at)}</span>
                    </div>
                    <div className={style.detailRow}>
                        <span className={style.detailLabel}>Archivos:</span>
                        <span className={style.detailValue}>
                            {modeloActual.archivos?.length || 0}
                        </span>
                    </div>
                    {modeloActual.archivos?.length > 0 && (
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                Archivos adjuntos
                            </div>
                            {modeloActual.archivos.map((a, i) => (
                                <div key={a.id || i} className={style.detailRow} style={{ marginBottom: '0.25rem' }}>
                                    <span className={style.detailLabel}>📎 {a.archivo_url || `Archivo ${i + 1}`}</span>
                                    <span className={style.detailValue}>{formatDate(a.created_at)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
