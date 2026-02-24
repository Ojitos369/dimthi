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
                            <div>
                                <div className={style.formLabel}>Colores (Hex)</div>
                                <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap'}}>
                                    {(color ? color.split(',') : ['#7c3aed']).map((c, i, arr) => (
                                        <input 
                                            key={i} 
                                            type="color" 
                                            value={c.trim().startsWith('#') ? c.trim() : '#7c3aed'} 
                                            onChange={e => {
                                                const newArr = [...arr];
                                                newArr[i] = e.target.value;
                                                setColor(newArr.join(','));
                                            }}
                                            title="Cambiar color. Para borrar, haz doble click."
                                            onDoubleClick={() => {
                                                if(arr.length > 1) {
                                                    const newArr = arr.filter((_, idx) => idx !== i);
                                                    setColor(newArr.join(','));
                                                }
                                            }}
                                            style={{width: '32px', height: '32px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                                        />
                                    ))}
                                    <button 
                                        onClick={() => setColor(color ? color + ',#ffffff' : '#7c3aed,#ffffff')}
                                        style={{background: 'transparent', border: '1px dotted #888', color: '#ccc', borderRadius: '4px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                                    >＋</button>
                                </div>
                            </div>
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
        </div>
    );
};
