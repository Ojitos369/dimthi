import React, { useState, useMemo, useRef } from 'react';
import { SearchableSelect } from '../../../Components/SearchableSelect';
import { FileDropZone } from '../../../Components/FileDropZone';

export const RequestQuoteModal = ({ ls }) => {
    const { 
        showRequestQuoteModal, setShowRequestQuoteModal, 
        pendingCart, removeFromPendingCart, updatePendingCartQuantity, addToPendingCart,
        submitPendingQuotes, requestQuoteMsg, modelos: allModelos
    } = ls;
    
    const [nombre, setNombre] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [archivos, setArchivos] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const modelOptions = useMemo(() => {
        return allModelos
            .filter(m => !pendingCart.find(pc => pc.id === m.id))
            .map(m => ({ value: m.id, label: m.nombre }));
    }, [allModelos, pendingCart]);

    if (!showRequestQuoteModal) return null;

    const handleSend = async () => {
        setIsSubmitting(true);
        try {
            await submitPendingQuotes({ nombre, comentarios, archivos });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddModel = (id) => {
        const model = allModelos.find(m => m.id === id);
        if (model) {
            addToPendingCart(model);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => !isSubmitting && setShowRequestQuoteModal(false)}>
            <div style={{ background: '#111', padding: '0', borderRadius: '12px', width: '90%', maxWidth: '500px', color: 'white', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Finalizar Solicitud de Cotización</h3>
                    <button style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => !isSubmitting && setShowRequestQuoteModal(false)}>×</button>
                </div>
                
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
                    {requestQuoteMsg && (
                        <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '4px', border: '1px solid #ef4444' }}>
                            {requestQuoteMsg.text}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ color: '#aaa', fontSize: '0.9rem' }}>Tu Nombre / Empresa</label>
                        <input 
                            type="text" 
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#222', color: 'white', boxSizing: 'border-box' }}
                            value={nombre} 
                            onChange={e => setNombre(e.target.value)} 
                            placeholder="Ej. Juan Pérez / Empresa ACME"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ color: '#aaa', fontSize: '0.9rem' }}>Modelos en la lista ({pendingCart.length})</label>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#1a1a1a', padding: '10px', borderRadius: '6px', border: '1px solid #222' }}>
                            {pendingCart.map(m => (
                                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#ccc', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.nombre}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input 
                                            type="number" 
                                            min="1"
                                            style={{ width: '50px', padding: '4px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: 'white', fontSize: '0.85rem' }}
                                            value={m.cantidad || 1}
                                            onChange={(e) => updatePendingCartQuantity(m.id, parseInt(e.target.value))}
                                            disabled={isSubmitting}
                                        />
                                        <button 
                                            onClick={() => removeFromPendingCart(m.id)}
                                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                            disabled={isSubmitting}
                                        >✕</button>
                                    </div>
                                </div>
                            ))}
                            {pendingCart.length === 0 && (
                                <div style={{ color: '#666', fontSize: '0.85rem', textAlign: 'center', padding: '10px' }}>La lista está vacía</div>
                            )}
                        </div>
                        
                        {!isSubmitting && (
                            <div style={{ marginTop: '5px' }}>
                                <label style={{ color: '#aaa', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Agregar otro modelo:</label>
                                <SearchableSelect 
                                    options={modelOptions} 
                                    value="" 
                                    onChange={handleAddModel} 
                                    placeholder="Buscar modelo..."
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ color: '#aaa', fontSize: '0.9rem' }}>Comentarios adicionales</label>
                        <textarea 
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', background: '#222', color: 'white', minHeight: '80px', boxSizing: 'border-box', resize: 'vertical' }}
                            value={comentarios} 
                            onChange={e => setComentarios(e.target.value)} 
                            placeholder="Especificaciones, colores, urgencia, etc."
                            disabled={isSubmitting}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ color: '#aaa', fontSize: '0.9rem' }}>Archivos adjuntos (opcional)</label>
                        <FileDropZone 
                            files={archivos} 
                            setFiles={setArchivos}
                            accept="image/*,.pdf,.stl,.obj,.3mf"
                            multiple={true}
                        />
                    </div>
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid #333', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#1a1a1a' }}>
                    <button 
                        style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #444', background: 'transparent', color: '#ccc', cursor: 'pointer' }} 
                        onClick={() => setShowRequestQuoteModal(false)}
                        disabled={isSubmitting}
                    >Cancelar</button>
                    <button 
                        style={{ 
                            padding: '10px 20px', borderRadius: '6px', border: 'none', 
                            background: isSubmitting ? '#555' : '#7c3aed', 
                            color: 'white', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }} 
                        onClick={handleSend}
                        disabled={pendingCart.length === 0 || isSubmitting}
                    >
                        {isSubmitting && <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
                        {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                </div>
            </div>
            {isSubmitting && <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>}
        </div>
    );
};
