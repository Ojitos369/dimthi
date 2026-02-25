export const DetailOverlay = ({ ls }) => {
    const { style, selected, setSelectedId } = ls;
    if (!selected) return null;
    return (
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
    );
};
