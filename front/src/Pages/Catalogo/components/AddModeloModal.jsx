import React, { useState, useEffect } from 'react';

export const AddModeloModal = ({ ls }) => {
    const { style, showAddModal, setShowAddModal, addModeloHandler, addModeloMsg, extractInfoHandler } = ls;
    const [nombre, setNombre] = useState('');
    const [link, setLink] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [archivos, setArchivos] = useState([]);
    const [imagenesExtraidas, setImagenesExtraidas] = useState([]);
    
    // Reset form when modal opens
    useEffect(() => {
        if (showAddModal) {
            setNombre('');
            setLink('');
            setDescripcion('');
            setArchivos([]);
            setImagenesExtraidas([]);
        }
    }, [showAddModal]);

    if (!showAddModal) return null;

    const handleSave = () => {
        addModeloHandler({ nombre, link, archivos, descripcion, imagenesExtraidas });
    };

    const handleFileChange = (e) => {
        setArchivos(Array.from(e.target.files));
    };

    const handleExtract = () => {
        if (!link) return;
        extractInfoHandler(link, (res) => {
            if (res.nombre) setNombre(res.nombre);
            if (res.descripcion) setDescripcion(res.descripcion);
            if (res.imagenes) setImagenesExtraidas(res.imagenes);
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddModal(false)}>
            <div style={{ background: '#1e1b4b', padding: '0', borderRadius: '12px', width: '90%', maxWidth: '450px', color: 'white', overflow: 'hidden', border: '1px solid #312e81', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '20px', borderBottom: '1px solid #312e81', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Añadir Nuevo Modelo</h3>
                    <button style={{ background: 'transparent', border: 'none', color: '#a5b4fc', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowAddModal(false)}>×</button>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '70vh', overflowY: 'auto' }}>
                    {addModeloMsg && (
                        <div style={{ padding: '10px', background: addModeloMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : (addModeloMsg.type === 'info' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)'), color: addModeloMsg.type === 'error' ? '#fca5a5' : (addModeloMsg.type === 'info' ? '#93c5fd' : '#86efac'), borderRadius: '4px', border: `1px solid ${addModeloMsg.type === 'error' ? '#ef4444' : (addModeloMsg.type === 'info' ? '#3b82f6' : '#22c55e')}` }}>
                            {addModeloMsg.text}
                        </div>
                    )}
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#a5b4fc', fontSize: '0.9rem' }}>Enlace de Origen (Opcional)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input 
                                type="text" 
                                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #4f46e5', background: '#312e81', color: 'white', boxSizing: 'border-box' }}
                                value={link} 
                                onChange={e => setLink(e.target.value)} 
                                placeholder="https://makerworld.com/..."
                            />
                            <button 
                                onClick={handleExtract}
                                style={{ padding: '0 12px', background: '#4f46e5', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}
                                disabled={!link}
                                title="Extraer información del link"
                            >
                                Extraer
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#a5b4fc', fontSize: '0.9rem' }}>Nombre del Modelo</label>
                        <input 
                            type="text" 
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #4f46e5', background: '#312e81', color: 'white', boxSizing: 'border-box' }}
                            value={nombre} 
                            onChange={e => setNombre(e.target.value)} 
                            placeholder="Ej. Figura de Dragón"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#a5b4fc', fontSize: '0.9rem' }}>Descripción (Opcional)</label>
                        <textarea 
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #4f46e5', background: '#312e81', color: 'white', boxSizing: 'border-box', minHeight: '60px', resize: 'vertical' }}
                            value={descripcion} 
                            onChange={e => setDescripcion(e.target.value)} 
                            placeholder="Breve descripción..."
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#a5b4fc', fontSize: '0.9rem' }}>Archivos locales</label>
                        <input 
                            type="file" 
                            multiple
                            accept="image/*,.stl,.obj"
                            style={{ width: '100%', color: '#a5b4fc', fontSize: '0.9rem' }}
                            onChange={handleFileChange}
                        />
                    </div>

                    {imagenesExtraidas.length > 0 && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#86efac', fontSize: '0.9rem' }}>Imágenes para extraer ({imagenesExtraidas.length})</label>
                            <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '5px' }}>
                                {imagenesExtraidas.map((img, i) => (
                                    <img key={i} src={img} alt="ext" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #4f46e5' }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ padding: '20px', borderTop: '1px solid #312e81', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: 'rgba(0,0,0,0.2)' }}>
                    <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #4f46e5', background: 'transparent', color: '#a5b4fc', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setShowAddModal(false)}>Cancelar</button>
                    <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#4f46e5', color: 'white', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }} onClick={handleSave}>Añadir</button>
                </div>
            </div>
        </div>
    );
};
