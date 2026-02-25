export const PageHeader = ({ ls }) => {
    const { style, searchTerm, setSearchTerm } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>
                🧊 Catálogo <span className={style.accent}>3D</span>
            </div>
            <div className={style.searchBar}>
                <span className={style.searchIcon}>🔍</span>
                <input type="text" placeholder="Buscar modelos..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)} />
            </div>
        </div>
    );
};
