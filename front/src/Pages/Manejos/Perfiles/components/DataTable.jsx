export const DataTable = ({ ls }) => {
    const { style, perfiles, openEdit, handleDelete } = ls;

    return (
        <div className={style.dataTable}>
            <div className={style.tableHeader} style={{gridTemplateColumns: '3fr 2fr 2fr 2fr 1fr 1fr 1fr 1fr'}}>
                <span>Nombre</span><span>Impresora</span><span>Filamento</span><span>Resina</span><span>Luz</span><span>M.O.</span><span>Margen</span><span></span>
            </div>
            {perfiles.length === 0 && <div className={style.emptyState}>No hay perfiles.</div>}
            {perfiles.map(p => (
                <div key={p.id} className={style.tableRow} style={{gridTemplateColumns: '3fr 2fr 2fr 2fr 1fr 1fr 1fr 1fr'}}>
                    <span className={style.truncate}>{p.nombre}</span>
                    <span className={style.truncate}>{p.maquina_nombre || '—'}</span>
                    <span className={style.truncate}>{p.filamento_nombre || '—'}</span>
                    <span className={style.truncate}>{p.resina_nombre || '—'}</span>
                    <span>${parseFloat(p.luz_kw||0).toFixed(2)}</span>
                    <span>{p.mano_obra} min</span>
                    <span>{p.margen_utilidad}%</span>
                    <div className={style.tableActions}>
                        <button className={style.btnEdit} onClick={() => openEdit(p)}>✏️</button>
                        <button className={style.btnDelete} onClick={() => handleDelete(p.id)}>🗑️</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
