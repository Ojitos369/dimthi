import { localStates } from '../localStates';

export const ModelLink = () => {
    const {
        style, modelos, selectedModeloId, setSelectedModeloId,
        showNewModelo, setShowNewModelo, newModeloName, setNewModeloName,
        handleCreateModelo
    } = localStates();

    return (
        <div className={style.card}>
            <div className={style.cardTitle}>🧊 Ligar Modelo</div>
            <select className={style.selectField} value={selectedModeloId} onChange={e => setSelectedModeloId(e.target.value)}>
                <option value="">— Sin modelo —</option>
                {modelos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
            {!showNewModelo ? (
                <button className={style.btnLink} onClick={() => setShowNewModelo(true)} style={{marginTop: '0.5rem'}}>＋ Crear nuevo modelo</button>
            ) : (
                <div className={style.newModeloRow}>
                    <input type="text" placeholder="Nombre del modelo..." value={newModeloName} onChange={e => setNewModeloName(e.target.value)} className={style.saveNewInput} />
                    <button className={style.btnSaveNew} onClick={handleCreateModelo}>Crear</button>
                    <button className={style.btnCancelSmall} onClick={() => { setShowNewModelo(false); setNewModeloName(''); }}>✕</button>
                </div>
            )}
        </div>
    );
};
