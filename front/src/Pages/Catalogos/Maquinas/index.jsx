import { localStates, localEffects } from './localStates';

export const CatMaquinas = () => {
    const { style, items, searchTerm, setSearchTerm, selectedId, setSelectedId, selected } = localStates();
    localEffects();

    return (
        <div className={style.catalogPage}>
            <div className={style.pageHeader}>
                <div className={style.pageTitle}>🖨️ Impresoras <span className={style.accent}>disponibles</span></div>
                <div className={style.searchBar}>
                    <span className={style.searchIcon}>🔍</span>
                    <input type="text" placeholder="Buscar impresora..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className={style.itemsGrid}>
                {items.length === 0 && <div className={style.emptyState}><div className={style.emptyIcon}>🖨️</div>No hay impresoras registradas.</div>}
                {items.map(m => (
                    <div key={m.id} className={style.itemCard} onClick={() => setSelectedId(m.id)}>
                        <div className={style.itemHeader}>
                            <span className={style.itemBadge}>{m.tipo?.toUpperCase()}</span>
                            {m.marca && <span className={style.itemBadge}>{m.marca}</span>}
                        </div>
                        <div className={style.itemBody}>
                            <div className={style.itemName}>{m.nombre}</div>
                            <div className={style.itemMeta}>
                                <span className={style.metaItem}>⚡ {parseFloat(m.power_kw||0).toFixed(3)} kW</span>
                                <span className={style.metaItem}>🔧 ${parseFloat(m.dep_hr||0).toFixed(2)}/hr</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selected && (
                <div className={style.detailOverlay} onClick={() => setSelectedId(null)}>
                    <div className={style.detailCard} onClick={e => e.stopPropagation()}>
                        <div className={style.detailHeader}>
                            <div className={style.detailTitle}>{selected.nombre}</div>
                            <button className={style.closeBtn} onClick={() => setSelectedId(null)}>✕</button>
                        </div>
                        <div className={style.detailBody}>
                            <div className={style.detailRow}><span className={style.detailLabel}>Tipo:</span><span className={style.detailValue}>{selected.tipo?.toUpperCase()}</span></div>
                            <div className={style.detailRow}><span className={style.detailLabel}>Marca:</span><span className={style.detailValue}>{selected.marca || '—'}</span></div>
                            <div className={style.detailRow}><span className={style.detailLabel}>Potencia:</span><span className={style.detailValue}>{parseFloat(selected.power_kw||0).toFixed(3)} kW</span></div>
                            <div className={style.detailRow}><span className={style.detailLabel}>Depr. Impresora:</span><span className={style.detailValue}>${parseFloat(selected.dep_hr||0).toFixed(2)}/hr</span></div>
                            {selected.tipo === 'fdm' && (
                                <div className={style.detailRow}><span className={style.detailLabel}>Consumibles/hr:</span><span className={style.detailValue}>${parseFloat(selected.cons_hr||0).toFixed(2)}</span></div>
                            )}
                            {selected.tipo === 'sla' && (
                                <>
                                    <div className={style.detailRow}><span className={style.detailLabel}>LCD/hr:</span><span className={style.detailValue}>${parseFloat(selected.lcd_hr||0).toFixed(2)}</span></div>
                                    <div className={style.detailRow}><span className={style.detailLabel}>FEP/hr:</span><span className={style.detailValue}>${parseFloat(selected.fep_hr||0).toFixed(2)}</span></div>
                                    <div className={style.detailRow}><span className={style.detailLabel}>IPA/impresión:</span><span className={style.detailValue}>${parseFloat(selected.ipa_per_print||0).toFixed(2)}</span></div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
