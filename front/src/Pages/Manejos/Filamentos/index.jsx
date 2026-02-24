import { localStates, localEffects } from './localStates';

export const ManejoFilamentos = () => {
    const { style, filamentos, showForm, editId, nombre, setNombre, color, setColor, marca, setMarca, pesoKg, setPesoKg, precioKg, setPrecioKg, openNew, openEdit, cancel, handleSave, handleDelete } = localStates();
    localEffects();

    return (
        <div className={style.manejoPage}>
            <div className={style.pageHeader}>
                <div className={style.pageTitle}>🔩 Manejo de Filamentos</div>
                <button className={style.btnNew} onClick={openNew}>＋ Nuevo Filamento</button>
            </div>
            {showForm && (
                <div className={style.formCard}>
                    <div className={style.formTitle}>{editId ? 'Editar Filamento' : 'Nuevo Filamento'}</div>
                    <div className={style.formGroup}>
                        <div className={style.formRow}>
                            <div><div className={style.formLabel}>Nombre</div><input className={style.formInput} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="PLA, ABS, PETG..." /></div>
                            <div><div className={style.formLabel}>Marca</div><input className={style.formInput} value={marca} onChange={e => setMarca(e.target.value)} placeholder="Esun, Hatchbox..." /></div>
                        </div>
                        <div className={style.formRow}>
                            <div><div className={style.formLabel}>Color</div><input className={style.formInput} value={color} onChange={e => setColor(e.target.value)} placeholder="Rojo, Negro..." /></div>
                            <div><div className={style.formLabel}>Peso (kg)</div><input type="number" className={style.formInput} value={pesoKg} onChange={e => setPesoKg(parseFloat(e.target.value)||0)} /></div>
                        </div>
                        <div><div className={style.formLabel}>Precio por kg ($)</div><input type="number" className={style.formInput} value={precioKg} onChange={e => setPrecioKg(parseFloat(e.target.value)||0)} /></div>
                        <div className={style.formActions}>
                            <button className={style.btnCancel} onClick={cancel}>Cancelar</button>
                            <button className={style.btnSave} onClick={handleSave}>{editId ? 'Actualizar' : 'Guardar'}</button>
                        </div>
                    </div>
                </div>
            )}
            <div className={style.dataTable}>
                <div className={style.tableHeader} style={{gridTemplateColumns: '3fr 2fr 2fr 2fr 2fr 1fr'}}>
                    <span>Nombre</span><span>Marca</span><span>Color</span><span>Peso</span><span>Precio/kg</span><span></span>
                </div>
                {filamentos.length === 0 && <div className={style.emptyState}>No hay filamentos.</div>}
                {filamentos.map(f => (
                    <div key={f.id} className={style.tableRow} style={{gridTemplateColumns: '3fr 2fr 2fr 2fr 2fr 1fr'}}>
                        <span className={style.truncate}>{f.nombre}</span>
                        <span className={style.truncate}>{f.marca || '—'}</span>
                        <span>{f.color || '—'}</span>
                        <span>{f.peso_kg} kg</span>
                        <span>${parseFloat(f.precio_kg||0).toFixed(2)}</span>
                        <div className={style.tableActions}>
                            <button className={style.btnEdit} onClick={() => openEdit(f)}>✏️</button>
                            <button className={style.btnDelete} onClick={() => handleDelete(f.id)}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
