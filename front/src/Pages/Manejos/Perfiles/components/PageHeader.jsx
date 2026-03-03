export const PageHeader = ({ ls }) => {
    const { style, openNew, searchTerm, setSearchTerm } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>📋 Manejo de Perfiles de Costos</div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Buscar perfil..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #333', background: '#222', color: 'white', minWidth: '200px' }}
                />
                <button className={style.btnNew} onClick={openNew}>＋ Nuevo Perfil</button>
            </div>
        </div>
    );
};
