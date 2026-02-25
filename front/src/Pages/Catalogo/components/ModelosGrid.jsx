const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const ModelosGrid = ({ ls }) => {
    const { style, modelos, selectModelo } = ls;
    return (
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
    );
};
