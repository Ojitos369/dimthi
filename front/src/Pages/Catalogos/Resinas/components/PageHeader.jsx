export const PageHeader = ({ ls }) => {
    const { style, searchTerm, setSearchTerm } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>🧪 Resinas <span className={style.accent}>disponibles</span></div>
            <div className={style.searchBar}>
                <span className={style.searchIcon}>🔍</span>
                <input type="text" placeholder="Buscar resina..." value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)} />
            </div>
        </div>
    );
};
