export const PageHeader = ({ ls }) => {
    const { style, searchTerm, setSearchTerm } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>
                🧊 Catálogo <span className={style.accent}>3D</span>
            </div>
            <div className={style.searchBar} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <span className={style.searchIcon}>🔍</span>
                    <input type="text" placeholder="Buscar modelos..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button 
                    onClick={() => ls.setShowAddModal(true)}
                    style={{
                        background: '#4f46e5', color: 'white', border: 'none', padding: '8px 16px',
                        borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                    <span>+</span> Añadir Modelo
                </button>
            </div>
        </div>
    );
};
