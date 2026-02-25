import { localStates } from '../localStates';

export const DetailedCosts = () => {
    const {
        style, isFilamento, materialType,
        maquinas, selectedMaquinaId, setSelectedMaquinaId, markDirty,
        showNewMaquina, setShowNewMaquina, newMaqNombre, setNewMaqNombre, handleCreateMaquina,
        filamentos, selectedFilamentoId, handleSelectFilamento,
        showNewFilamento, setShowNewFilamento, newFilNombre, setNewFilNombre, newFilColor, setNewFilColor, newFilPrecio, setNewFilPrecio, handleCreateFilamento,
        resinas, selectedResinaId, handleSelectResina,
        showNewResina, setShowNewResina, newResNombre, setNewResNombre, newResColor, setNewResColor, newResPrecio, setNewResPrecio, handleCreateResina,
        filamentCost, setFilamentCost, resinCost, setResinCost, ipaCost, setIpaCost,
        energyTariff, setEnergyTariff, laborMinutes, setLaborMinutes,
        marginPercent, setMarginPercent, logged
    } = localStates();

    return (
        <div className={style.card}>
            <div className={style.cardTitle}>⚡ Costos Detallados</div>
            <div className={style.fieldGroup}>
                {/* Impresora selector */}
                <div>
                    <div className={style.fieldLabel}>Impresora</div>
                    <div className={style.selectorWithAdd}>
                        <select className={style.selectField} value={selectedMaquinaId} onChange={e => { setSelectedMaquinaId(e.target.value); markDirty(); }}>
                            <option value="">— Impresora por defecto —</option>
                            {maquinas.filter(m => m.tipo === (materialType === 'filamento' ? 'fdm' : 'sla')).map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        </select>
                        {logged && <button className={style.btnAddInline} onClick={() => setShowNewMaquina(!showNewMaquina)}>＋</button>}
                    </div>
                    {logged && showNewMaquina && (
                        <div className={style.inlineCreateRow}>
                            <input type="text" placeholder="Nombre de impresora nueva..." value={newMaqNombre} onChange={e => setNewMaqNombre(e.target.value)} className={style.saveNewInput} style={{flex: 1}} />
                            <button className={style.btnSaveNew} onClick={handleCreateMaquina}>Crear</button>
                        </div>
                    )}
                </div>
                
                {/* Material selector + add new */}
                {isFilamento ? (
                    <div>
                        <div className={style.fieldLabel}>Filamento</div>
                        <div className={style.selectorWithAdd}>
                            <select className={style.selectField} value={selectedFilamentoId} onChange={e => handleSelectFilamento(e.target.value)}>
                                <option value="">— Manual —</option>
                                {filamentos.map(f => <option key={f.id} value={f.id}>{f.nombre} - ${parseFloat(f.precio_kg||0).toFixed(0)}/kg</option>)}
                            </select>
                            {logged && <button className={style.btnAddInline} onClick={() => setShowNewFilamento(!showNewFilamento)}>＋</button>}
                        </div>
                        {logged && showNewFilamento && (
                            <div className={style.inlineCreateRow}>
                                <input type="text" placeholder="Nombre..." value={newFilNombre} onChange={e => setNewFilNombre(e.target.value)} className={style.saveNewInput} />
                                <input type="color" value={newFilColor} onChange={e => setNewFilColor(e.target.value)} style={{width: '32px', height: '32px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer', flexShrink: 0}} />
                                <div className={style.inputWrapper} style={{maxWidth: '100px'}}>
                                    <span className={style.inputPrefix}>$</span>
                                    <input type="number" value={newFilPrecio} onChange={e => setNewFilPrecio(parseFloat(e.target.value)||0)} />
                                </div>
                                <button className={style.btnSaveNew} onClick={handleCreateFilamento}>Crear</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className={style.fieldLabel}>Resina</div>
                        <div className={style.selectorWithAdd}>
                            <select className={style.selectField} value={selectedResinaId} onChange={e => handleSelectResina(e.target.value)}>
                                <option value="">— Manual —</option>
                                {resinas.map(r => <option key={r.id} value={r.id}>{r.nombre} - ${parseFloat(r.precio_kg||0).toFixed(0)}/kg</option>)}
                            </select>
                            {logged && <button className={style.btnAddInline} onClick={() => setShowNewResina(!showNewResina)}>＋</button>}
                        </div>
                        {logged && showNewResina && (
                            <div className={style.inlineCreateRow}>
                                <input type="text" placeholder="Nombre..." value={newResNombre} onChange={e => setNewResNombre(e.target.value)} className={style.saveNewInput} />
                                <input type="color" value={newResColor} onChange={e => setNewResColor(e.target.value)} style={{width: '32px', height: '32px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer', flexShrink: 0}} />
                                <div className={style.inputWrapper} style={{maxWidth: '100px'}}>
                                    <span className={style.inputPrefix}>$</span>
                                    <input type="number" value={newResPrecio} onChange={e => setNewResPrecio(parseFloat(e.target.value)||0)} />
                                </div>
                                <button className={style.btnSaveNew} onClick={handleCreateResina}>Crear</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Precio manual material */}
                {isFilamento ? (
                    <div className={style.costRow}>
                        <span className={style.costLabel}>Precio Filamento ($/kg)</span>
                        <div className={style.costInput}>
                            <span className={style.currencySign}>$</span>
                            <input type="number" value={filamentCost} onChange={e => { setFilamentCost(parseFloat(e.target.value)||0); setIsFilamento(''); markDirty(); }} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={style.costRow}>
                            <span className={style.costLabel}>Precio Resina ($/kg)</span>
                            <div className={style.costInput}>
                                <span className={style.currencySign}>$</span>
                                <input type="number" value={resinCost} onChange={e => { setResinCost(parseFloat(e.target.value)||0); setIsResina(''); markDirty(); }} />
                            </div>
                        </div>
                        <div className={style.costRow}>
                            <span className={style.costLabel}>Alcohol IPA (1L)</span>
                            <div className={style.costInput}>
                                <span className={style.currencySign}>$</span>
                                <input type="number" value={ipaCost} onChange={e => { setIpaCost(parseFloat(e.target.value)||0); markDirty(); }} />
                            </div>
                        </div>
                    </>
                )}
                <div>
                    <div className={style.fieldLabel}>Rango de Consumo (CFE)</div>
                    <select className={style.selectField} value={energyTariff} onChange={e => { setEnergyTariff(parseFloat(e.target.value)); markDirty(); }}>
                        <option value={1.2}>Residencial Básico (~$1.20/kWh)</option>
                        <option value={3.85}>Tarifa DAC / Alto (~$3.85/kWh)</option>
                        <option value={4.5}>Comercial PDBT (~$4.50/kWh)</option>
                    </select>
                </div>
                <div>
                    <div className={style.fieldLabel}>Mano de Obra (Post-proceso)</div>
                    <div className={style.inputWrapper}><input type="number" min="0" value={laborMinutes} onChange={e => { setLaborMinutes(parseFloat(e.target.value)||0); markDirty(); }} /><span className={style.inputSuffix}>min</span></div>
                </div>
                <div className={style.marginInput}>
                    <div className={style.marginLabel}>Margen de Utilidad (%)</div>
                    <input type="number" value={marginPercent} onChange={e => { setMarginPercent(parseFloat(e.target.value)||0); markDirty(); }} />
                </div>
            </div>
        </div>
    );
};
