import { useMemo } from 'react';
import { localStates, localEffects } from './localStates';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Calculadora = () => {
    const ls = localStates();
    localEffects();

    const {
        themeColors, style, results, perfiles, filamentos, resinas, modelos, maquinas,
        timeHours, timeMinutes, energyTariff, fdmWeightG, resinVolMl, laborMinutes,
        filamentCost, resinCost, ipaCost, marginPercent,
        activeProfileId, profileDirty, newProfileName,
        materialType, showDetail,
        selectedFilamentoId, selectedResinaId,
        selectedModeloId, newModeloName, showNewModelo,
        selectedMaquinaId, setSelectedMaquinaId, selectedMaquina, maquinaName,
        showNewFilamento, setShowNewFilamento, newFilNombre, setNewFilNombre, newFilColor, setNewFilColor, newFilPrecio, setNewFilPrecio,
        showNewResina, setShowNewResina, newResNombre, setNewResNombre, newResColor, setNewResColor, newResPrecio, setNewResPrecio,
        showNewMaquina, setShowNewMaquina, newMaqNombre, setNewMaqNombre,
        setTimeHours, setTimeMinutes, setEnergyTariff,
        setFdmWeightG, setResinVolMl, setLaborMinutes,
        setFilamentCost, setResinCost, setIpaCost,
        setMarginPercent, setActiveProfileId, setNewProfileName,
        setSelectedModeloId, setNewModeloName, setShowNewModelo,
        toggleMaterialType, toggleDetail, markDirty,
        handleSelectFilamento, handleSelectResina,
        selectProfile, handleSaveAsNew, handleEditCurrent, handleDeletePerfil,
        handleCreateModelo, handleCreateFilamento, handleCreateResina, handleCreateMaquina,
        handleSaveCotizacion,
    } = ls;

    const isFilamento = materialType === 'filamento';
    const current = isFilamento ? results.fdm : results.resin;
    const fmt = v => (v || 0).toFixed(2);
    const activePerfil = useMemo(() => perfiles.find(p => p.id === activeProfileId), [perfiles, activeProfileId]);

    const chartConfig = useMemo(() => {
        const d = isFilamento ? results.chartData.fdm : results.chartData.resin;
        return {
            data: {
                labels: ['Material', 'Energía', 'Máquina', 'Labor', 'Utilidad'],
                datasets: [{ label: isFilamento ? 'FDM' : 'Resina', data: d, backgroundColor: ['#7c3aed', '#ffc107', '#6c757d', '#f06292', '#198754'], borderRadius: 4 }],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { tooltip: { callbacks: { label: ctx => '$' + ctx.raw.toFixed(2) } }, legend: { display: false } },
                scales: { x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }, y: { ticks: { color: '#aaa' }, grid: { color: '#333' } } },
            },
        };
    }, [results, isFilamento]);

    return (
        <div className={style.calculadoraPage}>
            {/* NAV */}
            <div className={style.navHeader}>
                <div className={style.navTitle}>⚡ 3D Cost Architect <span className={style.navAccent}>| Dimthi</span></div>
                <div className={style.navControls}>
                    <div className={style.togglePill}>
                        <button className={`${style.toggleBtn} ${isFilamento ? style.toggleActive : ''}`} onClick={() => !isFilamento && toggleMaterialType()}>Filamento</button>
                        <button className={`${style.toggleBtn} ${!isFilamento ? style.toggleActive : ''}`} onClick={() => isFilamento && toggleMaterialType()}>Resina</button>
                    </div>
                    <label className={style.switchLabel}>
                        <span className={style.switchText}>Detalle</span>
                        <div className={`${style.switchTrack} ${showDetail ? style.switchOn : ''}`} onClick={toggleDetail}><div className={style.switchThumb} /></div>
                    </label>
                </div>
            </div>

            <div className={style.mainGrid}>
                {/* ====== CONTROLES ====== */}
                <div className={style.controlsPanel}>

                    {/* PERFIL (siempre visible, solo nombre + color) */}
                    <div className={style.card}>
                        <div className={style.cardTitle}>📋 Perfil</div>
                        <div className={style.profileSelectorRow}>
                            <select className={style.selectField}
                                value={activeProfileId || ''}
                                onChange={e => {
                                    const id = e.target.value;
                                    if (!id) { setActiveProfileId(null); return; }
                                    const p = perfiles.find(x => x.id === id);
                                    if (p) selectProfile(p);
                                }}>
                                <option value="">— Sin perfil —</option>
                                {perfiles.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                            {activePerfil && <div className={style.profileDot} />}
                        </div>

                        {/* Save/Edit perfil (siempre disponible cuando hay perfil activo) */}
                        {activeProfileId && profileDirty && (
                            <div className={style.profileActions}>
                                <span className={style.dirtyBadge}>⚠ Valores modificados</span>
                                <div className={style.profileBtnRow}>
                                    <button className={style.btnEditProfile} onClick={handleEditCurrent}>Actualizar perfil</button>
                                    <div className={style.saveNewRow}>
                                        <input type="text" placeholder="Nombre nuevo perfil..." value={newProfileName}
                                            onChange={e => setNewProfileName(e.target.value)} className={style.saveNewInput} />
                                        <button className={style.btnSaveNew} onClick={handleSaveAsNew}>Guardar nuevo</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!activeProfileId && (
                            <div className={style.saveNewRow} style={{marginTop: '0.5rem'}}>
                                <input type="text" placeholder="Nombre del perfil..." value={newProfileName}
                                    onChange={e => setNewProfileName(e.target.value)} className={style.saveNewInput} />
                                <button className={style.btnSaveNew} onClick={handleSaveAsNew}>Guardar perfil</button>
                            </div>
                        )}
                    </div>

                    {/* BÁSICO: Tiempo + Peso */}
                    <div className={style.card}>
                        <div className={style.cardTitle}>{isFilamento ? '🔩 Filamento (FDM)' : '🧪 Resina (SLA)'}</div>
                        <div className={style.fieldGroup}>
                            <div>
                                <div className={style.fieldLabel}>Duración</div>
                                <div className={style.inputRow}>
                                    <div className={style.inputWrapper}>
                                        <input type="number" min="0" value={timeHours} onChange={e => { setTimeHours(parseFloat(e.target.value)||0); markDirty(); }} />
                                        <span className={style.inputSuffix}>hrs</span>
                                    </div>
                                    <div className={style.inputWrapper}>
                                        <input type="number" min="0" max="59" value={timeMinutes} onChange={e => { let v = parseFloat(e.target.value)||0; if(v>59)v=59; setTimeMinutes(v); markDirty(); }} />
                                        <span className={style.inputSuffix}>min</span>
                                    </div>
                                </div>
                            </div>

                            {/* Peso/Volumen */}
                            {isFilamento ? (
                                <div>
                                    <div className={style.fieldLabel}>Peso (g)</div>
                                    <div className={style.inputWrapper}><input type="number" value={fdmWeightG} onChange={e => { setFdmWeightG(parseFloat(e.target.value)||0); markDirty(); }} /><span className={style.inputSuffix}>g</span></div>
                                </div>
                            ) : (
                                <div>
                                    <div className={style.fieldLabel}>Volumen (ml)</div>
                                    <div className={style.inputWrapper}><input type="number" value={resinVolMl} onChange={e => { setResinVolMl(parseFloat(e.target.value)||0); markDirty(); }} /><span className={style.inputSuffix}>ml</span></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DETALLADO */}
                    {showDetail && (
                        <>
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
                                            <button className={style.btnAddInline} onClick={() => setShowNewMaquina(!showNewMaquina)}>＋</button>
                                        </div>
                                        {showNewMaquina && (
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
                                                <button className={style.btnAddInline} onClick={() => setShowNewFilamento(!showNewFilamento)}>＋</button>
                                            </div>
                                            {showNewFilamento && (
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
                                                <button className={style.btnAddInline} onClick={() => setShowNewResina(!showNewResina)}>＋</button>
                                            </div>
                                            {showNewResina && (
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
                                                <input type="number" value={filamentCost} onChange={e => { setFilamentCost(parseFloat(e.target.value)||0); setSelectedFilamentoId(''); markDirty(); }} />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={style.costRow}>
                                                <span className={style.costLabel}>Precio Resina ($/kg)</span>
                                                <div className={style.costInput}>
                                                    <span className={style.currencySign}>$</span>
                                                    <input type="number" value={resinCost} onChange={e => { setResinCost(parseFloat(e.target.value)||0); setSelectedResinaId(''); markDirty(); }} />
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

                            {/* Ligar Modelo */}
                            <div className={style.card}>
                                <div className={style.cardTitle}>🧊 Ligar Modelo</div>
                                <select className={style.selectField} value={selectedModeloId} onChange={e => setSelectedModeloId(e.target.value)}>
                                    <option value="">— Sin modelo —</option>
                                    {modelos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                </select>
                                {!showNewModelo ? (
                                    <button className={style.btnLink} onClick={() => setShowNewModelo(true)} style={{marginTop: '0.5rem'}}>＋ Crear nuevo modelo</button>
                                ) : (
                                    <div className={style.newModeloRow}>
                                        <input type="text" placeholder="Nombre del modelo..." value={newModeloName} onChange={e => setNewModeloName(e.target.value)} className={style.saveNewInput} />
                                        <button className={style.btnSaveNew} onClick={handleCreateModelo}>Crear</button>
                                        <button className={style.btnCancelSmall} onClick={() => { setShowNewModelo(false); setNewModeloName(''); }}>✕</button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* ====== RESULTADOS ====== */}
                <div className={style.resultsPanel}>
                    <div className={`${style.resultCard} ${isFilamento ? style.resultBorderFdm : style.resultBorderSla}`}>
                        <div className={`${style.resultHeader} ${isFilamento ? style.fdm : style.sla}`}>
                            {isFilamento ? `FDM: ${maquinaName || 'Ender 3 V3 KE'}` : `SLA: ${maquinaName || 'Photon Mono 4K'}`}
                        </div>
                        <div className={style.resultBody}>
                            <div className={style.resultLabel}>Precio de Venta Sugerido</div>
                            <div className={style.resultPrice}>${fmt(current.price)}</div>
                            {showDetail && <div className={style.resultProfit}>Utilidad: ${fmt(current.profit)}</div>}
                            {showDetail && (
                                <div className={style.resultBreakdown}>
                                    <div className={style.breakdownRow}><span className={style.breakdownLabel}>{isFilamento?'Material:':'Resina+IPA:'}</span><span className={style.breakdownValue}>${fmt(current.mat)}</span></div>
                                    <div className={style.breakdownRow}><span className={style.breakdownLabel}>Energía:</span><span className={style.breakdownValue}>${fmt(current.energy)}</span></div>
                                    <div className={style.breakdownRow}><span className={style.breakdownLabel}>Desgaste:</span><span className={style.breakdownValue}>${fmt(current.mach)}</span></div>
                                    <div className={style.breakdownRow}><span className={style.breakdownLabel}>Mano de Obra:</span><span className={style.breakdownValue}>${fmt(results.labor)}</span></div>
                                </div>
                            )}
                            {/* Botón guardar cotización */}
                            <button className={style.btnSaveCotizacion} onClick={handleSaveCotizacion}>
                                💾 Guardar Cotización
                            </button>
                        </div>
                    </div>
                    {showDetail && (
                        <div className={style.chartCard}>
                            <div className={style.chartTitle}>Desglose de Costos</div>
                            <div className={style.chartContainer}><Bar data={chartConfig.data} options={chartConfig.options} /></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
