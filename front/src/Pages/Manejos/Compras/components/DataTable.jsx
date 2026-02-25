const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const DataTable = ({ ls }) => {
    const { style, compras, openEdit, handleDelete } = ls;

    return (
        <div className={style.dataTable}>
            <div className={style.tableHeader} style={{gridTemplateColumns: 'minmax(80px, 1fr) 2fr 1fr 1fr 2fr 2fr 2fr 1fr'}}>
                <span>ID</span><span>Fecha / Nombre</span><span>Cant.</span><span>Unit.</span><span>Total</span><span>Usuario</span><span>Comentario</span><span></span>
            </div>
            {compras.length === 0 && <div className={style.emptyState}>No hay compras registradas.</div>}
            {compras.map(c => {
                const unitPrice = parseFloat(c.cotizacion_precio_final || 0);
                const totalPrice = unitPrice * parseInt(c.cantidad || 1);
                return (
                    <div key={c.id} className={style.tableRow} style={{gridTemplateColumns: 'minmax(80px, 1fr) 2fr 1fr 1fr 2fr 2fr 2fr 1fr'}}>
                        <span className={style.truncate} title={c.id}>{c.id.substring(0, 8)}</span>
                        <span className={style.truncate}><b>{c.nombre || ''}</b><div style={{fontSize:'0.8em',color:'#666'}}>{formatDate(c.created_at)}</div></span>
                        <span className={style.truncate}>{c.cantidad}</span>
                        <span className={style.truncate}>${unitPrice.toFixed(2)}</span>
                        <span className={style.truncate}><b>${totalPrice.toFixed(2)}</b></span>
                        <span className={style.truncate}>{c.usuario || '—'}</span>
                        <span className={style.truncate}>{c.comentario || '—'}</span>
                        <div className={style.tableActions}>
                            <button className={style.btnEdit} onClick={() => openEdit(c)}>✏️</button>
                            <button className={style.btnDelete} onClick={() => handleDelete(c.id)}>🗑️</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
