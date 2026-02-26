import { SearchableSelect } from '../../../../Components/SearchableSelect';

export const FormCard = ({ ls }) => {
    const {
        style, editId,
        cotizacionId, setCotizacionId,
        cantidad, setCantidad,
        usuario, setUsuario,
        comentario, setComentario,
        nombreCompra, setNombreCompra,
        cotizaciones,
        cancel, handleSave
    } = ls;

    // Helper to format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={style.formCard}>
            <div className={style.formTitle}>{editId ? 'Editar Compra' : 'Nueva Compra'}</div>
            <div className={style.formGroup}>
                <div>
                    <div className={style.formLabel}>Cotización Base</div>
                    <SearchableSelect 
                        value={cotizacionId}
                        onChange={setCotizacionId}
                        placeholder="Selecciona una cotización..."
                        options={cotizaciones.map(c => {
                            let label = `ID: ${c.id.substring(0, 8)}... - ${(c.tipo_material || '').toUpperCase()} - \$${parseFloat(c.precio_final || c.costo_total).toFixed(2)}`;
                            if (c.modelos && c.modelos.length > 0) {
                                label += ` | ${c.modelos.map(m => m.nombre).join(', ')}`;
                            } else {
                                label += ` | Sin modelos`;
                            }
                            label += ` | ${formatDate(c.created_at)}`;
                            return { label, value: c.id };
                        })}
                    />
                </div>

                <div className={style.formRow} style={{marginTop: '0.5rem'}}>
                    <div>
                        <div className={style.formLabel}>Cantidad</div>
                        <input type="number" min="1" className={style.formInput} value={cantidad} onChange={e => setCantidad(parseInt(e.target.value)||1)} />
                    </div>
                    <div>
                        <div className={style.formLabel}>Usuario / Cliente (Opcional)</div>
                        <input className={style.formInput} value={usuario} onChange={e => setUsuario(e.target.value)} placeholder="Ej. Juan Pérez" />
                    </div>
                </div>

                <div className={style.formRow} style={{marginTop: '0.5rem'}}>
                    <div>
                        <div className={style.formLabel}>Nombre (Opcional)</div>
                        <input className={style.formInput} value={nombreCompra} onChange={e => setNombreCompra(e.target.value)} placeholder="Ej. Llaveros Batman 12pzas" />
                    </div>
                </div>

                <div style={{marginTop: '0.5rem'}}>
                    <div className={style.formLabel}>Comentario (Opcional)</div>
                    <textarea className={style.formInput} value={comentario} onChange={e => setComentario(e.target.value)} placeholder="Instrucciones especiales, dudas..."></textarea>
                </div>

                <div className={style.formActions}>
                    <button className={style.btnCancel} onClick={cancel}>Cancelar</button>
                    <button className={style.btnSave} onClick={handleSave} disabled={!cotizacionId}>
                        {editId ? 'Actualizar' : 'Guardar Compra'}
                    </button>
                </div>
            </div>
        </div>
    );
};
