import { localStates, localEffects } from './localStates';

export const CatResinas = () => {
    const { style, items, searchTerm, setSearchTerm, selectedId, setSelectedId, selected } = localStates();
    localEffects();

    return (
        <div className={style.catalogPage}>
            <div className={style.pageHeader}>
                <div className={style.pageTitle}>🧪 Resinas <span className={style.accent}>disponibles</span></div>
                <div className={style.searchBar}>
                    <span className={style.searchIcon}>🔍</span>
                    <input type="text" placeholder="Buscar resina..." value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)} />
                </div>
            </div>
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
            {selected && (
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
            )}
        </div>
    );
};
