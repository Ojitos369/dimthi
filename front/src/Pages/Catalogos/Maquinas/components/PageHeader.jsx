export const PageHeader = ({ ls }) => {
    const { style, searchTerm, setSearchTerm } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>🖨️ Impresoras <span className={style.accent}>disponibles</span></div>
            <div className={style.searchBar}>
                <span className={style.searchIcon}>🔍</span>
                <input type="text" placeholder="Buscar impresora..." value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)} />
            </div>
        </div>
    );
};
