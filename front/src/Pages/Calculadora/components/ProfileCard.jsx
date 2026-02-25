import { localStates } from '../localStates';
import { useMemo } from 'react';

export const ProfileCard = () => {
    const {
        style, perfiles, activeProfileId, selectProfile, setActiveProfileId,
        profileDirty, handleEditCurrent, newProfileName, setNewProfileName, handleSaveAsNew, logged
    } = localStates();
    
    const activePerfil = useMemo(() => perfiles.find(p => p.id === activeProfileId), [perfiles, activeProfileId]);

    return (
        <div className={style.card}>
            <div className={style.cardTitle}>📋 Perfil</div>
            <div className={style.profileSelectorRow}>
                <select className={style.selectField}
                    value={activeProfileId || ''}
                    onChange={e => {
                        const id = e.target.value;
                        if (!id) { setActiveProfileId(null); return; }
                        const p = perfiles.find(x => x.id === id);
                        if (p) selectProfile(p);
                    }}>
                    <option value="">— Sin perfil —</option>
                    {perfiles.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
                {activePerfil && <div className={style.profileDot} />}
            </div>

            {logged && activeProfileId && profileDirty && (
                <div className={style.profileActions}>
                    <span className={style.dirtyBadge}>⚠ Valores modificados</span>
                    <div className={style.profileBtnRow}>
                        <button className={style.btnEditProfile} onClick={handleEditCurrent}>Actualizar perfil</button>
                        <div className={style.saveNewRow}>
                            <input type="text" placeholder="Nombre nuevo perfil..." value={newProfileName}
                                onChange={e => setNewProfileName(e.target.value)} className={style.saveNewInput} />
                            <button className={style.btnSaveNew} onClick={handleSaveAsNew}>Guardar nuevo</button>
                        </div>
                    </div>
                </div>
            )}
            {logged && !activeProfileId && (
                <div className={style.saveNewRow} style={{marginTop: '0.5rem'}}>
                    <input type="text" placeholder="Nombre del perfil..." value={newProfileName}
                        onChange={e => setNewProfileName(e.target.value)} className={style.saveNewInput} />
                    <button className={style.btnSaveNew} onClick={handleSaveAsNew}>Guardar perfil</button>
                </div>
            )}
        </div>
    );
};
