export const PageHeader = ({ ls }) => {
    const { style, openNew } = ls;
    return (
        <div className={style.pageHeader}>
            <div className={style.pageTitle}>🛒 Registro de Compras</div>
            <button className={style.btnNew} onClick={openNew}>＋ Nueva Compra</button>
        </div>
    );
};
