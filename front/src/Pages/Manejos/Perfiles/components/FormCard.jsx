export const FormCard = ({ ls }) => {
    const {
        style, perfiles, filamentos, resinas, maquinas,
        editId, nombre, setNombre,
        filamentoId, setFilamentoId, resinaId, setResinaId,
        maquinaId, setMaquinaId,
        luzKw, setLuzKw, manoObra, setManoObra, margenUtilidad, setMargenUtilidad,
        cancel, handleSave,
    } = ls;

    return (
        <div className={style.formCard}>
            <div className={style.formTitle}>{editId ? 'Editar Perfil' : 'Nuevo Perfil'}</div>
            <div className={style.formGroup}>
                <div className={style.formRow}>
                    <div><div className={style.formLabel}>Nombre del Perfil</div><input className={style.formInput} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="PLA Esun Rojo – Alto Margen..." /></div>
                    <div>
                        <div className={style.formLabel}>Impresora vinculada</div>
                        <select className={style.formSelect} value={maquinaId} onChange={e => setMaquinaId(e.target.value)}>
                            <option value="">— Sin impresora —</option>
                            {maquinas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        </select>
                    </div>
                </div>
                <div className={style.formRow}>
                    <div>
                        <div className={style.formLabel}>Filamento vinculado</div>
                        <select className={style.formSelect} value={filamentoId} onChange={e => setFilamentoId(e.target.value)}>
                            <option value="">— Sin filamento —</option>
                            {filamentos.map(f => <option key={f.id} value={f.id}>{f.nombre} ({f.marca || 'S/M'})</option>)}
                        </select>
                    </div>
                    <div>
                        <div className={style.formLabel}>Resina vinculada</div>
                        <select className={style.formSelect} value={resinaId} onChange={e => setResinaId(e.target.value)}>
                            <option value="">— Sin resina —</option>
                            {resinas.map(r => <option key={r.id} value={r.id}>{r.nombre} ({r.marca || 'S/M'})</option>)}
                        </select>
                    </div>
                </div>
                <div className={style.formRow}>
                    <div><div className={style.formLabel}>Tarifa Eléctrica ($/kWh)</div><input type="number" className={style.formInput} value={luzKw} onChange={e => setLuzKw(parseFloat(e.target.value)||0)} /></div>
                    <div><div className={style.formLabel}>Mano de Obra (min)</div><input type="number" className={style.formInput} value={manoObra} onChange={e => setManoObra(parseFloat(e.target.value)||0)} /></div>
                </div>
                <div><div className={style.formLabel}>Margen de Utilidad (%)</div><input type="number" className={style.formInput} value={margenUtilidad} onChange={e => setMargenUtilidad(parseFloat(e.target.value)||0)} /></div>
                <div className={style.formActions}>
                    <button className={style.btnCancel} onClick={cancel}>Cancelar</button>
                    <button className={style.btnSave} onClick={handleSave}>{editId ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </div>
        </div>
    );
};
