export const PageHeader = ({ ls }) => {
    const { style, openNew } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>🧪 Manejo de Resinas</div>
            <button className={style.btnNew} onClick={openNew}>＋ Nueva Resina</button>
        </div>
    );
};
