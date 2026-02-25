export const FormCard = ({ ls }) => {
    const {
        style, editId, nombre, setNombre,
        color, setColor, marca, setMarca,
        pesoKg, setPesoKg, precioKg, setPrecioKg,
        linkCompra, setLinkCompra,
        cancel, handleSave
    } = ls;

    return (
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
                </div>
                <div className={style.formRow}>
                    <div><div className={style.formLabel}>Peso (kg)</div><input type="number" className={style.formInput} value={pesoKg} onChange={e => setPesoKg(parseFloat(e.target.value)||0)} /></div>
                    <div><div className={style.formLabel}>Precio por kg ($)</div><input type="number" className={style.formInput} value={precioKg} onChange={e => setPrecioKg(parseFloat(e.target.value)||0)} /></div>
                </div>
                <div><div className={style.formLabel}>Link Compra</div><input className={style.formInput} value={linkCompra} onChange={e => setLinkCompra(e.target.value)} placeholder="https://mercadolibre.com.mx/..." /></div>
                <div className={style.formActions}>
                    <button className={style.btnCancel} onClick={cancel}>Cancelar</button>
                    <button className={style.btnSave} onClick={handleSave}>{editId ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </div>
        </div>
    );
};
