const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const ModelosTable = ({ ls }) => {
    const { style, modelos, openEditForm, handleDelete } = ls;

    return (
        <div className={style.modelosTable}>
            <div className={style.tableHeader}>
                <span>Nombre</span>
                <span>Descripción</span>
                <span>Fecha</span>
                <span></span>
            </div>
            {modelos.length === 0 && (
                <div className={style.emptyState}>
                    No hay modelos registrados.
                </div>
            )}
            {modelos.map(m => (
                <div key={m.id} className={style.tableRow}>
                    <span className={style.truncate}>{m.nombre}</span>
                    <span className={style.truncate}>{m.descripcion || '—'}</span>
                    <span>{formatDate(m.created_at)}</span>
                    <div className={style.tableActions}>
                        <button className={style.btnEdit}
                            onClick={e => { e.stopPropagation(); openEditForm(m); }}>
                            ✏️
                        </button>
                        <button className={style.btnDelete}
                            onClick={e => { e.stopPropagation(); handleDelete(m.id); }}>
                            🗑️
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
