export const ItemsGrid = ({ ls }) => {
    const { style, items, setSelectedId } = ls;
    return (
        <div className={style.itemsGrid}>
            {items.length === 0 && <div className={style.emptyState}><div className={style.emptyIcon}>🧪</div>No hay resinas registradas.</div>}
            {items.map(r => (
                <div key={r.id} className={style.itemCard} onClick={() => setSelectedId(r.id)}>
                    <div className={style.itemHeader}>
                        <div className={style.colorSwatch} style={{ backgroundColor: r.color || '#888' }} />
                        {r.marca && <span className={style.itemBadge}>{r.marca}</span>}
                    </div>
                    <div className={style.itemBody}>
                        <div className={style.itemName}>{r.nombre}</div>
                        <div className={style.itemMeta}>
                            <span className={style.metaItem}>⚖ {r.peso_kg}kg</span>
                        </div>
                        <div className={style.priceTag}>${parseFloat(r.precio_kg || 0).toFixed(2)}/kg</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
