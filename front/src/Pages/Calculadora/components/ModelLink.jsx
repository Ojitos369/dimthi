import { localStates } from '../localStates';

export const ModelLink = () => {
    const {
        style, modelos, selectedModelos, setSelectedModelos,
        showNewModelo, setShowNewModelo, newModeloName, setNewModeloName,
        handleCreateModelo
    } = localStates();

    const handleSelectModelo = (e) => {
        const val = e.target.value;
        if (val && !selectedModelos.includes(val)) {
            setSelectedModelos([...selectedModelos, val]);
        }
        e.target.value = "";
    };

    const handleRemoveModelo = (id) => {
        setSelectedModelos(selectedModelos.filter(m => m !== id));
    };

    return (
        <div className={style.card}>
            <div className={style.cardTitle}>🧊 Ligar Modelos</div>
            
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem'}}>
                {selectedModelos.map(id => {
                    const obj = modelos.find(m => m.id === id);
                    if (!obj) return null;
                    return (
                        <div key={id} style={{background: '#333', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            {obj.nombre}
                            <button onClick={() => handleRemoveModelo(id)} style={{background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 0}}>✕</button>
                        </div>
                    )
                })}
            </div>

            <select className={style.selectField} defaultValue="" onChange={handleSelectModelo}>
                <option value="" disabled>＋ Agregar modelo...</option>
                {modelos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>

            {!showNewModelo ? (
                <button className={style.btnLink} onClick={() => setShowNewModelo(true)} style={{marginTop: '0.5rem'}}>＋ Crear nuevo modelo</button>
            ) : (
                <div className={style.newModeloRow} style={{marginTop: '0.5rem'}}>
                    <input type="text" placeholder="Nombre del modelo..." value={newModeloName} onChange={e => setNewModeloName(e.target.value)} className={style.saveNewInput} />
                    <button className={style.btnSaveNew} onClick={handleCreateModelo}>Crear</button>
                    <button className={style.btnCancelSmall} onClick={() => { setShowNewModelo(false); setNewModeloName(''); }}>✕</button>
                </div>
            )}
        </div>
    );
};
