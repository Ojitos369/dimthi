export const PageHeader = ({ ls }) => {
    const { style, openNewForm } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>📐 Gestión de Modelos</div>
            <button className={style.btnNew} onClick={openNewForm}>
                ＋ Nuevo Modelo
            </button>
        </div>
    );
};
