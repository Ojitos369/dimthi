import React, { useState } from 'react';

export const AddCommentModal = ({ ls }) => {
    const { style, showCommentModal, closeCommentModal, addCommentToPedido, commentPedidoId } = ls;
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [files, setFiles] = useState([]);

    if (!showCommentModal) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() && files.length === 0) return;

        console.log('Enviando comentario con archivos:', files);
        console.log('Archivos como FormData:');
        files.forEach((f, i) => console.log(`  ${i}: ${f.name}, size: ${f.size}`));
        
        setSubmitting(true);
        await addCommentToPedido(commentPedidoId, commentText, files);
        setSubmitting(false);
        setCommentText('');
        setFiles([]);
    };

    const handleClose = () => {
        setCommentText('');
        setFiles([]);
        closeCommentModal();
    };

    return (
        <div className={style.modalOverlay} onClick={handleClose}>
            <div className={style.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
                <div className={style.modalHeader}>
                    <h3>Añadir Mensaje a Kardex</h3>
                    <button onClick={handleClose} className={style.btnClose}>✕</button>
                </div>
                
                <div className={style.modalBody}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '0.9rem' }}>Mensaje para el Cliente:</label>
                            <textarea 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Escribe tu mensaje o actualización..."
                                rows={5}
                                style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px', padding: '12px', fontSize: '0.9rem', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s' }}
                                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                                onBlur={(e) => e.target.style.borderColor = '#444'}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', cursor: 'pointer', fontSize: '0.9rem', padding: '10px 14px', background: '#222', borderRadius: '8px', border: '1px dashed #555', transition: 'border-color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#555'}
                            >
                                <i className="fas fa-paperclip" style={{ color: '#10b981' }}></i>
                                {files.length > 0 ? `${files.length} archivo(s) seleccionado(s)` : 'Adjuntar archivos (opcional)'}
                                <input 
                                    type="file" 
                                    multiple
                                    onChange={(e) => setFiles(Array.from(e.target.files))}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {files.length > 0 && (
                                <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {files.map((f, i) => (
                                        <span key={i} style={{ fontSize: '0.75rem', background: '#1a3a2a', color: '#4ade80', padding: '3px 8px', borderRadius: '4px' }}>
                                            {f.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '5px' }}>
                            <button 
                                type="button" 
                                onClick={handleClose}
                                style={{ background: '#333', color: '#ccc', border: '1px solid #555', padding: '9px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#333'}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={submitting || (!commentText.trim() && files.length === 0)}
                                style={{ 
                                    background: submitting || (!commentText.trim() && files.length === 0) ? '#555' : '#10b981', 
                                    color: submitting || (!commentText.trim() && files.length === 0) ? '#999' : '#000', 
                                    border: 'none', 
                                    padding: '9px 18px', 
                                    borderRadius: '6px', 
                                    cursor: submitting || (!commentText.trim() && files.length === 0) ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    transition: 'background 0.2s'
                                }}
                            >
                                {submitting ? 'Enviando...' : '✉ Enviar Mensaje'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
