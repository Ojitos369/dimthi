import { localStates, localEffects } from './localStates';

export const ManejoPerfiles = () => {
    const {
        style, perfiles, filamentos, resinas,
        showForm, editId, nombre, setNombre,
        filamentoId, setFilamentoId, resinaId, setResinaId,
        luzKw, setLuzKw, manoObra, setManoObra, margenUtilidad, setMargenUtilidad,
        openNew, openEdit, cancel, handleSave, handleDelete,
    } = localStates();
    localEffects();

    return (
        <div className={style.manejoPage}>
            <div className={style.pageHeader}>
                <div className={style.pageTitle}>📋 Manejo de Perfiles de Costos</div>
                <button className={style.btnNew} onClick={openNew}>＋ Nuevo Perfil</button>
            </div>

            {showForm && (
                <div className={style.formCard}>
                    <div className={style.formTitle}>{editId ? 'Editar Perfil' : 'Nuevo Perfil'}</div>
                    <div className={style.formGroup}>
                        <div><div className={style.formLabel}>Nombre del Perfil</div><input className={style.formInput} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="PLA Esun Rojo – Alto Margen..." /></div>
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
            )}

            <div className={style.dataTable}>
                <div className={style.tableHeader} style={{gridTemplateColumns: '3fr 2fr 2fr 2fr 2fr 2fr 1fr'}}>
                    <span>Nombre</span><span>Filamento</span><span>Resina</span><span>Luz</span><span>M.O.</span><span>Margen</span><span></span>
                </div>
                {perfiles.length === 0 && <div className={style.emptyState}>No hay perfiles.</div>}
                {perfiles.map(p => (
                    <div key={p.id} className={style.tableRow} style={{gridTemplateColumns: '3fr 2fr 2fr 2fr 2fr 2fr 1fr'}}>
                        <span className={style.truncate}>{p.nombre}</span>
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
        </div>
    );
};
