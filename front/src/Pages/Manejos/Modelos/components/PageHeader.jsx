export const PageHeader = ({ ls }) => {
    const { style, openNew, handleAddByLinkPrompt } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>🧩 Manejo de Modelos</div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button className={style.btnNew} style={{backgroundColor: '#1E40AF', opacity: 0.9}} onClick={handleAddByLinkPrompt}>🔗 Agregar por Link</button>
                <button className={style.btnNew} onClick={openNew}>＋ Nuevo Modelo</button>
            </div>
        </div>
    );
};
