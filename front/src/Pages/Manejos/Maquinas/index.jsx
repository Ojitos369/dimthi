import { localStates, localEffects } from './localStates';

export const ManejoMaquinas = () => {
    const {
        style, maquinas, showForm, editId,
        nombre, setNombre, tipo, setTipo, marca, setMarca,
        powerKw, setPowerKw, depHr, setDepHr, consHr, setConsHr,
        lcdHr, setLcdHr, fepHr, setFepHr, ipaPerPrint, setIpaPerPrint,
        openNew, openEdit, cancel, handleSave, handleDelete,
    } = localStates();
    localEffects();

    const isFdm = tipo === 'fdm';

    return (
        <div className={style.manejoPage}>
            <div className={style.pageHeader}>
                <div className={style.pageTitle}>🖨️ Manejo de Impresoras</div>
                <button className={style.btnNew} onClick={openNew}>＋ Nueva Impresora</button>
            </div>

            {showForm && (
                <div className={style.formCard}>
                    <div className={style.formTitle}>{editId ? 'Editar Impresora' : 'Nueva Impresora'}</div>
                    <div className={style.formGroup}>
                        <div className={style.formRow}>
                            <div><div className={style.formLabel}>Nombre</div><input className={style.formInput} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ender 3 V3 KE..." /></div>
                            <div><div className={style.formLabel}>Marca</div><input className={style.formInput} value={marca} onChange={e => setMarca(e.target.value)} placeholder="Creality, Anycubic..." /></div>
                        </div>
                        <div className={style.formRow}>
                            <div>
                                <div className={style.formLabel}>Tipo</div>
                                <select className={style.formSelect} value={tipo} onChange={e => setTipo(e.target.value)}>
                                    <option value="fdm">FDM (Filamento)</option>
                                    <option value="sla">SLA (Resina)</option>
                                </select>
                            </div>
                            <div><div className={style.formLabel}>Potencia (kW)</div><input type="number" step="0.001" className={style.formInput} value={powerKw} onChange={e => setPowerKw(parseFloat(e.target.value)||0)} /></div>
                        </div>
                        <div className={style.formRow}>
                            <div><div className={style.formLabel}>Depreciación ($/hr)</div><input type="number" step="0.01" className={style.formInput} value={depHr} onChange={e => setDepHr(parseFloat(e.target.value)||0)} /></div>
                            {isFdm ? (
                                <div><div className={style.formLabel}>Consumibles ($/hr)</div><input type="number" step="0.01" className={style.formInput} value={consHr} onChange={e => setConsHr(parseFloat(e.target.value)||0)} /></div>
                            ) : (
                                <>
                                    <div><div className={style.formLabel}>LCD ($/hr)</div><input type="number" step="0.01" className={style.formInput} value={lcdHr} onChange={e => setLcdHr(parseFloat(e.target.value)||0)} /></div>
                                </>
                            )}
                        </div>
                        {!isFdm && (
                            <div className={style.formRow}>
                                <div><div className={style.formLabel}>FEP ($/hr)</div><input type="number" step="0.01" className={style.formInput} value={fepHr} onChange={e => setFepHr(parseFloat(e.target.value)||0)} /></div>
                                <div><div className={style.formLabel}>IPA ($/impresión)</div><input type="number" step="0.01" className={style.formInput} value={ipaPerPrint} onChange={e => setIpaPerPrint(parseFloat(e.target.value)||0)} /></div>
                            </div>
                        )}
                        <div className={style.formActions}>
                            <button className={style.btnCancel} onClick={cancel}>Cancelar</button>
                            <button className={style.btnSave} onClick={handleSave}>{editId ? 'Actualizar' : 'Guardar'}</button>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
};
