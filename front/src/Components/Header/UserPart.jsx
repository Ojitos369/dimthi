import { localStates } from "./localStates";

export const UserPart = () => {
    const { openUserMenu, style, IconMenu, showIconMenu, logged, login, closeSession, username } = localStates();
    return (
        <div className={`${style.userPart}`} style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            {!logged ? (
                <button onClick={login} style={{background: 'var(--my-primary)', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '0.9rem', border: 'none', cursor: 'pointer', zIndex: 10}}>
                    Iniciar Sesión
                </button>
            ) : (
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span style={{fontSize: '0.9rem', color: '#ccc'}}>{username}</span>
                    <button onClick={closeSession} style={{background: 'transparent', color: '#ff4d4f', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid #ff4d4f', cursor: 'pointer', zIndex: 10}}>
                        Cerrar Sesión
                    </button>
                </div>
            )}
            {showIconMenu && <IconMenu className="manita" onClick={openUserMenu} />}
        </div>
    )
}