const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const DataTable = ({ ls }) => {
    const { style, cotizaciones, handleDelete, openEdit, openDetail } = ls;

    return (
        <div className={style.dataTable}>
            <div className={style.tableHeader} style={{gridTemplateColumns: 'minmax(100px, 1fr) 2fr 3fr 1fr 1fr 100px'}}>
                <span>Cotización</span><span>Modelos y Material</span><span>Comentario</span><span>Costo Mat.</span><span>Precio Venta</span><span></span>
            </div>
            {cotizaciones.length === 0 && <div className={style.emptyState}>No hay cotizaciones registradas.</div>}
            {cotizaciones.map(c => (
                <div key={c.id} className={style.tableRow} style={{gridTemplateColumns: 'minmax(100px, 1fr) 2fr 3fr 1fr 1fr 100px'}}>
                    <span className={style.truncate} title={c.id}><b>{c.nombre || c.id.substring(0,8)}</b><div style={{fontSize:'0.8em',color:'#666'}}>{c.nombre ? c.id.substring(0,8) : ''}</div></span>
                    <span className={style.truncate} title={c.modelos?.map(m=>m.nombre).join(', ')}>
                        {c.modelos?.map(m=>m.nombre).join(', ') || 'Sin Modelo'} / {c.tipo_material}
                    </span>
                    <span className={style.truncate} title={c.comentarios}>{c.comentarios || '—'}</span>
                    <span className={style.truncate}>${parseFloat(c.consto_material||0).toFixed(2)}</span>
                    <span className={style.truncate}><b>${parseFloat(c.precio_final||c.costo_total||0).toFixed(2)}</b></span>
                    <div className={style.tableActions}>
                        <button className={style.btnEdit} onClick={() => openDetail(c.id)} title="Ver Detalles">ℹ️</button>
                        <button className={style.btnEdit} onClick={() => openEdit(c)} title="Editar">✏️</button>
                        <button className={style.btnDelete} onClick={() => handleDelete(c.id)}>🗑️</button>
                    </div>
                </div>
            ))}
        </div>
    );
};
