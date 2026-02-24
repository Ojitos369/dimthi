import { localStates, localEffects } from './localStates';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const Catalogo = () => {
    const {
        style,
        modelos,
        searchTerm, setSearchTerm,
        selectedModeloId, modeloActual,
        selectModelo, closeDetail,
    } = localStates();
    localEffects();

    return (
        <div className={style.catalogoPage}>
            {/* Header */}
            <div className={style.pageHeader}>
                <div className={style.pageTitle}>
                    🧊 Catálogo <span className={style.accent}>3D</span>
                </div>
                <div className={style.searchBar}>
                    <span className={style.searchIcon}>🔍</span>
                    <input type="text" placeholder="Buscar modelos..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)} />
                </div>
            </div>

            {/* Grid de Modelos */}
            <div className={style.modelosGrid}>
                {modelos.length === 0 && (
                    <div className={style.emptyState}>
                        <div className={style.emptyIcon}>📦</div>
                        No hay modelos guardados aún.
                    </div>
                )}
                {modelos.map(m => (
                    <div key={m.id} className={style.modelCard}
                        onClick={() => selectModelo(m.id)}>
                        <div className={style.modelThumbnail}>🧊</div>
                        <div className={style.modelBody}>
                            <div className={style.modelName}>{m.nombre}</div>
                            <div className={style.modelDesc}>
                                {m.descripcion || 'Sin descripción'}
                            </div>
                            <div className={style.modelMeta}>
                                <span>{formatDate(m.created_at)}</span>
                                <span className={style.modelBadge}>
                                    {m.num_archivos || 0} archivo{m.num_archivos !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedModeloId && modeloActual && (
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
            )}
        </div>
    );
};
