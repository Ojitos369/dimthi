export const PageHeader = ({ ls }) => {
    const { style, openNew } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>🔩 Manejo de Filamentos</div>
            <button className={style.btnNew} onClick={openNew}>＋ Nuevo Filamento</button>
        </div>
    );
};
