export const PageHeader = ({ ls }) => {
    const { style, openNew } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>🧩 Manejo de Modelos</div>
            <button className={style.btnNew} onClick={openNew}>＋ Nuevo Modelo</button>
        </div>
    );
};
