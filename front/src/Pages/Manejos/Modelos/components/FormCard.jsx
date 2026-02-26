import React from 'react';
import { FileDropZone } from '../../../../Components/FileDropZone';

export const FormCard = ({ ls }) => {
    const {
        style, editId, nombre, setNombre,
        descripcion, setDescripcion, link, setLink,
        archivos, cancel, handleSave, handleFileChange, handleFileUpload, handleDeleteArchivo,
        estatusPrivacidad, setEstatusPrivacidad, estatusValidacion, setEstatusValidacion,
        isExtracting, handleExtractMakerworld
    } = ls;

    const resolveMediaUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `/api/media/${url}`;
    };

    const handleDropFile = (files) => {
        // Upload first file from the drop/paste
        if (files.length > 0 && handleFileUpload) {
            files.forEach(f => handleFileUpload(f));
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
                <div className={style.formRow}>
                    <div style={{flex: 1}}>
                        <div className={style.formLabel}>Privacidad</div>
                        <select className={style.formInput} value={estatusPrivacidad} onChange={e => setEstatusPrivacidad(e.target.value)} style={{ padding: '0.5rem', width: '100%' }}>
                            <option value="publico">Público</option>
                            <option value="privado">Privado</option>
                        </select>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={style.formLabel}>Validación</div>
                        <select className={style.formInput} value={estatusValidacion} onChange={e => setEstatusValidacion(e.target.value)} style={{ padding: '0.5rem', width: '100%' }}>
                            <option value="validado">Validado</option>
                            <option value="pendiente">Pendiente</option>
                        </select>
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
                    <div style={{marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem'}}>
                        <div className={style.formLabel} style={{marginBottom: '0.75rem'}}>Archivos Multimedia</div>
                        
                        {/* Existing files thumbnails */}
                        {archivos.length > 0 && (
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
                        )}
                        
                        {/* Drop zone for new files */}
                        <FileDropZone 
                            files={[]}
                            setFiles={(newFiles) => {
                                if (typeof newFiles === 'function') {
                                    const result = newFiles([]);
                                    result.forEach(f => handleFileUpload(f));
                                } else {
                                    newFiles.forEach(f => handleFileUpload(f));
                                }
                            }}
                            accept="image/*,video/*,.gif"
                            multiple={true}
                        />
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
