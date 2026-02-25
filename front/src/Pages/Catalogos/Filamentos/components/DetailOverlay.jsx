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
                    <div className={style.detailPrice}>${parseFloat(selected.precio_kg || 0).toFixed(2)} / kg</div>
                    <div className={style.detailRow}><span className={style.detailLabel}>Color:</span><span className={style.detailValue}>{selected.color || '—'}</span></div>
                    <div className={style.detailRow}><span className={style.detailLabel}>Marca:</span><span className={style.detailValue}>{selected.marca || '—'}</span></div>
                    <div className={style.detailRow}><span className={style.detailLabel}>Peso:</span><span className={style.detailValue}>{selected.peso_kg} kg</span></div>
                </div>
            </div>
        </div>
    );
};
