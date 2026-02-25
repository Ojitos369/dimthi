export const ItemsGrid = ({ ls }) => {
    const { style, items, setSelectedId } = ls;
    return (
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
    );
};
