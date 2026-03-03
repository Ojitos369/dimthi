import React, { useState } from 'react';

export const AddCommentModal = ({ ls }) => {
    const { style, showCommentModal, closeCommentModal, addCommentToPedido, commentPedidoId } = ls;
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!showCommentModal) return null;

    const [files, setFiles] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() && files.length === 0) return;

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
                            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Mensaje para el Cliente:</label>
                            <textarea 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Escribe tu mensaje o actualización..."
                                rows={5}
                                style={{ width: '100%', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', padding: '10px', fontSize: '0.9rem', resize: 'vertical' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Adjuntos (opcional):</label>
                            <input 
                                type="file" 
                                multiple
                                onChange={(e) => setFiles(Array.from(e.target.files))}
                                style={{ color: '#ccc', width: '100%' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                            <button 
                                type="button" 
                                onClick={handleClose}
                                style={{ background: '#444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={submitting || (!commentText.trim() && files.length === 0)}
                                style={{ 
                                    background: '#10b981', 
                                    color: '#000', 
                                    border: 'none', 
                                    padding: '8px 16px', 
                                    borderRadius: '4px', 
                                    cursor: submitting || (!commentText.trim() && files.length === 0) ? 'not-allowed' : 'pointer',
                                    fontWeight: 'bold',
                                    opacity: submitting || (!commentText.trim() && files.length === 0) ? 0.6 : 1
                                }}
                            >
                                {submitting ? 'Enviando...' : 'Añadir Mensaje'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
