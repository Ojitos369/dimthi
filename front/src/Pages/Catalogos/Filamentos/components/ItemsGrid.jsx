export const ItemsGrid = ({ ls }) => {
    const { style, items, setSelectedId } = ls;
    return (
        <div className={style.itemsGrid}>
            {items.length === 0 && <div className={style.emptyState}><div className={style.emptyIcon}>🔩</div>No hay filamentos registrados.</div>}
            {items.map(f => (
                <div key={f.id} className={style.itemCard} onClick={() => setSelectedId(f.id)}>
                    <div className={style.itemHeader}>
                        <div className={style.colorSwatch} style={{ backgroundColor: f.color || '#888' }} />
                        {f.marca && <span className={style.itemBadge}>{f.marca}</span>}
                    </div>
                    <div className={style.itemBody}>
                        <div className={style.itemName}>{f.nombre}</div>
                        <div className={style.itemMeta}>
                            <span className={style.metaItem}>⚖ {f.peso_kg}kg</span>
                        </div>
                        <div className={style.priceTag}>${parseFloat(f.precio_kg || 0).toFixed(2)}/kg</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
