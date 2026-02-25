import { localStates } from '../localStates';

export const NavHeader = () => {
    const { style, isFilamento, toggleMaterialType, showDetail, toggleDetail, logged } = localStates();
    return (
        <div className={style.navHeader}>
            <div className={style.navTitle}>⚡ 3D Cost Architect <span className={style.navAccent}>| Dimthi</span></div>
            <div className={style.navControls}>
                <div className={style.togglePill}>
                    <button className={`${style.toggleBtn} ${isFilamento ? style.toggleActive : ''}`} onClick={() => !isFilamento && toggleMaterialType()}>Filamento</button>
                    <button className={`${style.toggleBtn} ${!isFilamento ? style.toggleActive : ''}`} onClick={() => isFilamento && toggleMaterialType()}>Resina</button>
                </div>
                {logged && (
                    <label className={style.switchLabel}>
                        <span className={style.switchText}>Detalle</span>
                        <div className={`${style.switchTrack} ${showDetail ? style.switchOn : ''}`} onClick={toggleDetail}><div className={style.switchThumb} /></div>
                    </label>
                )}
            </div>
        </div>
    );
};
