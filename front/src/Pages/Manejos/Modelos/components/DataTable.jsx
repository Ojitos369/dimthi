export const DataTable = ({ ls }) => {
    const { style, modelos, openEdit, handleDelete } = ls;

    return (
        <div className={style.dataTable}>
            <div className={style.tableHeader} style={{gridTemplateColumns: '4fr 3fr 3fr 1fr 1fr'}}>
                <span>Nombre</span><span>Descripción</span><span>Link</span><span>Archivos</span><span></span>
            </div>
            {modelos.length === 0 && <div className={style.emptyState}>No hay modelos.</div>}
            {modelos.map(m => (
                <div key={m.id} className={style.tableRow} style={{gridTemplateColumns: '4fr 3fr 3fr 1fr 1fr'}}>
                    <span className={style.truncate}>{m.nombre}</span>
                    <span className={style.truncate}>{m.descripcion || '—'}</span>
                    <span className={style.truncate}>
                        {m.link ? <a href={m.link} target="_blank" rel="noreferrer" style={{color: '#4ade80'}}>{m.link}</a> : '—'}
                    </span>
                    <span>{m.num_archivos || 0}</span>
                    <div className={style.tableActions}>
                        <button className={style.btnEdit} onClick={() => openEdit(m)}>✏️</button>
                        <button className={style.btnDelete} onClick={() => handleDelete(m.id)}>🗑️</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
