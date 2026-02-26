export const DataTable = ({ ls }) => {
    const { style, modelos, openEdit, handleDelete } = ls;

    return (
        <div className={style.dataTable}>
            <div className={style.tableHeader} style={{gridTemplateColumns: '3fr 2fr 2fr 1fr 1fr 1fr 1fr'}}>
                <span>Nombre</span><span>Descripción</span><span>Link</span><span>Arch.</span><span>Privacidad</span><span>Validación</span><span></span>
            </div>
            {modelos.length === 0 && <div className={style.emptyState}>No hay modelos.</div>}
            {modelos.map(m => (
                <div key={m.id} className={style.tableRow} style={{gridTemplateColumns: '3fr 2fr 2fr 1fr 1fr 1fr 1fr', alignItems: 'center'}}>
                    <span className={style.truncate}>{m.nombre}</span>
                    <span className={style.truncate}>{m.descripcion || '—'}</span>
                    <span className={style.truncate}>
                        {m.link ? <a href={m.link} target="_blank" rel="noreferrer" style={{color: '#4ade80'}}>{m.link}</a> : '—'}
                    </span>
                    <span>{m.num_archivos || 0}</span>
                    <span>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', background: m.estatus_privacidad === 'publico' ? '#065f46' : '#991b1b', color: 'white' }}>
                            {m.estatus_privacidad === 'publico' ? 'Público' : 'Privado'}
                        </span>
                    </span>
                    <span>
                        <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', background: m.estatus_validacion === 'validado' ? '#065f46' : '#b45309', color: 'white' }}>
                            {m.estatus_validacion === 'validado' ? 'Validado' : 'Pendiente'}
                        </span>
                    </span>
                    <div className={style.tableActions}>
                        <button className={style.btnEdit} onClick={() => openEdit(m)}>✏️</button>
                        <button className={style.btnDelete} onClick={() => handleDelete(m.id)}>🗑️</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
