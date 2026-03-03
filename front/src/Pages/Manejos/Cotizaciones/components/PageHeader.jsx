export const PageHeader = ({ ls }) => {
    const { searchTerm, setSearchTerm, style } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.title}>Catálogo de Cotizaciones</div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Buscar cotización..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #333', background: '#222', color: 'white', minWidth: '200px' }}
                />
            </div>
        </div>
    );
};
