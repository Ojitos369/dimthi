export const DataTable = ({ ls }) => {
    const { style, maquinas, openEdit, handleDelete } = ls;

    return (
        <div className={style.dataTable}>
            <div className={style.tableHeader} style={{gridTemplateColumns: '3fr 2fr 1fr 2fr 2fr 1fr'}}>
                <span>Nombre</span><span>Marca</span><span>Tipo</span><span>Potencia</span><span>Depr.</span><span></span>
            </div>
            {maquinas.length === 0 && <div className={style.emptyState}>No hay impresoras.</div>}
            {maquinas.map(m => (
                <div key={m.id} className={style.tableRow} style={{gridTemplateColumns: '3fr 2fr 1fr 2fr 2fr 1fr'}}>
                    <span className={style.truncate}>{m.nombre}</span>
                    <span className={style.truncate}>{m.marca || '—'}</span>
                    <span>{m.tipo?.toUpperCase()}</span>
                    <span>{parseFloat(m.power_kw||0).toFixed(3)} kW</span>
                    <span>${parseFloat(m.dep_hr||0).toFixed(2)}/hr</span>
                    <div className={style.tableActions}>
                        <button className={style.btnEdit} onClick={() => openEdit(m)}>✏️</button>
                        <button className={style.btnDelete} onClick={() => handleDelete(m.id)}>🗑️</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
