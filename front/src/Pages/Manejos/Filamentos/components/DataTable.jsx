export const DataTable = ({ ls }) => {
    const { style, filamentos, openEdit, handleDelete } = ls;

    return (
        <div className={style.dataTable}>
            <div className={style.tableHeader} style={{gridTemplateColumns: '3fr 2fr 2fr 2fr 2fr 1fr'}}>
                <span>Nombre</span><span>Marca</span><span>Color</span><span>Peso</span><span>Precio/kg</span><span></span>
            </div>
            {filamentos.length === 0 && <div className={style.emptyState}>No hay filamentos.</div>}
            {filamentos.map(f => (
                <div key={f.id} className={style.tableRow} style={{gridTemplateColumns: '3fr 2fr 2fr 2fr 2fr 1fr'}}>
                    <span className={style.truncate}>{f.nombre}</span>
                    <span className={style.truncate}>{f.marca || '—'}</span>
                    <span style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                        {(f.color ? f.color.split(',') : []).map((c, i) => (
                            <span key={i} style={{display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', background: c.trim().startsWith('#') ? c.trim() : '#444'}}></span>
                        ))}
                    </span>
                    <span>{f.peso_kg} kg</span>
                    <span>${parseFloat(f.precio_kg||0).toFixed(2)}</span>
                    <div className={style.tableActions}>
                        <button className={style.btnEdit} onClick={() => openEdit(f)}>✏️</button>
                        <button className={style.btnDelete} onClick={() => handleDelete(f.id)}>🗑️</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
