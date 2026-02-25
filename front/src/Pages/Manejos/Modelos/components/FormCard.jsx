import React from 'react';

export const FormCard = ({ ls }) => {
    const {
        style, editId, nombre, setNombre,
        descripcion, setDescripcion, link, setLink,
        archivos, cancel, handleSave, handleFileChange, handleFileUpload, handleDeleteArchivo,
        isExtracting, handleExtractMakerworld
    } = ls;

    const resolveMediaUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `/api/media/${url}`;
    };

    const [isDragging, setIsDragging] = React.useState(false);

    const onDragOver = e => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = e => { e.preventDefault(); setIsDragging(false); };
    const onDrop = e => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };
    const onPaste = e => {
        if (e.clipboardData.files && e.clipboardData.files.length > 0) {
            handleFileUpload(e.clipboardData.files[0]);
        }
    };

    return (
        <div className={style.formCard}>
            <div className={style.formTitle}>{editId ? 'Editar Modelo' : 'Nuevo Modelo'}</div>
            <div className={style.formGroup}>
                <div className={style.formRow}>
                    <div style={{flex: 1}}><div className={style.formLabel}>Nombre del Modelo</div><input className={style.formInput} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Busto de Batman" /></div>
                    <div style={{flex: 1}}>
                        <div className={style.formLabel}>Link (Opcional)</div>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            <input className={style.formInput} value={link} onChange={e => setLink(e.target.value)} placeholder="https://makerworld.com/..." />
                            {(link.includes('makerworld.com') || link.includes('makerworld')) && (
                                <button type="button" onClick={handleExtractMakerworld} disabled={isExtracting} style={{background: '#3b82f6', color: 'white', border: 'none', padding: '0 1rem', borderRadius: '4px', cursor: isExtracting ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap'}}>
                                    {isExtracting ? 'Extrayendo...' : 'Extraer MW'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <div className={style.formLabel}>Descripción</div>
                    <div 
                        className={style.formInput} 
                        style={{minHeight: '100px', backgroundColor: '#1a1a1a'}}
                        contentEditable={true}
                        dangerouslySetInnerHTML={{ __html: descripcion }}
                        onBlur={e => setDescripcion(e.target.innerHTML)}
                        placeholder="Detalles del modelo, instrucciones de impresión..."
                    ></div>
                </div>
                
                {editId && (
                    <div 
                        style={{marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem', border: isDragging ? '2px dashed #3b82f6' : '1px solid transparent', transition: 'border 0.2s', padding: '1rem'}}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onPaste={onPaste}
                        tabIndex={0}
                    >
                        <div className={style.formLabel}>Archivos Multimedia (Arrastra, Pega o Selecciona)</div>
                        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem'}}>
                            {archivos.map(a => (
                                <div key={a.id} style={{position: 'relative', width: '100px', height: '100px', backgroundColor: '#222', borderRadius: '8px', overflow: 'hidden'}}>
                                    <img src={resolveMediaUrl(a.archivo_url)} alt="media" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                    <button 
                                        onClick={() => handleDeleteArchivo(a.id)}
                                        style={{position: 'absolute', top: 0, right: 0, background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', cursor: 'pointer', padding: '2px 6px', borderBottomLeftRadius: '8px'}}
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                        <input type="file" onChange={handleFileChange} accept="image/*,video/*,.gif" style={{color: '#aaa', fontSize: '0.9rem'}} />
                    </div>
                )}
                
                {!editId && (
                    <div style={{marginTop: '1rem', color: '#888', fontSize: '0.85rem'}}>
                        * Guarda el modelo primero para poder subir imágenes y videos.
                    </div>
                )}

                <div className={style.formActions}>
                    <button className={style.btnCancel} onClick={cancel}>Cancelar</button>
                    <button className={style.btnSave} onClick={handleSave}>{editId ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </div>
        </div>
    );
};
