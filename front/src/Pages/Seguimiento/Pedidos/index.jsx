import { localStates, localEffects } from './localStates';
import style from '../Cotizaciones/styles/index.module.scss'; // Reuse styling

export const Seg_Pedidos = () => {
    localEffects();
    const {
        codigo, setCodigo,
        resultado, setResultado,
        loading, errorMsg,
        handleSearch,
        newComment, setNewComment,
        commentFiles, setCommentFiles,
        isSubmittingComment, handleAddComment
    } = localStates();

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'creado': return '#3b82f6'; // blue
            case 'en producción': return '#f59e0b'; // amber
            case 'en produccion': return '#f59e0b'; // amber
            case 'completado': return '#10b981'; // emerald
            case 'entregado': return '#8b5cf6'; // violet
            case 'cancelado': return '#ef4444'; // red
            default: return '#6b7280'; // gray
        }
    };

    return (
        <div className={style.seguimientoContainer}>
            <div className={style.heroSection}>
                <h1>Rastreo de Pedidos</h1>
                <p>Ingresa tu código de seguimiento (ej. PED-XXXXXXX) para ver el progreso de tu orden y enviar mensajes.</p>
                
                <form onSubmit={handleSearch} className={style.searchForm}>
                    <div className={style.inputGroup}>
                        <label>Código de Pedido</label>
                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="PED-..."
                            required
                            className="my-input"
                        />
                    </div>
                    <button type="submit" id="search-pedido-btn" disabled={loading} className={style.searchBtn}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>
            </div>

            {errorMsg && (
                <div className={style.errorMsg}>
                    <i className="fas fa-exclamation-circle"></i> {errorMsg}
                </div>
            )}

            {resultado && (
                <div className={style.resultadoCard}>
                    <div className={style.header}>
                        <h2>Detalles del Pedido</h2>
                        <span className={style.badge} style={{ backgroundColor: getStatusColor(resultado.estado), color: 'white', fontWeight: 'bold' }}>
                            {(resultado.estado || 'creado').toUpperCase()}
                        </span>
                    </div>

                    <div className={style.infoGrid}>
                        <div className={style.infoItem}>
                            <strong>Código:</strong>
                            <span>{resultado.codigo}</span>
                        </div>
                        <div className={style.infoItem}>
                            <strong>A Nombre De:</strong>
                            <span>{resultado.cliente_nombre}</span>
                        </div>
                        <div className={style.infoItem}>
                            <strong>Contacto:</strong>
                            <span>{resultado.contacto || 'No proporcionado'}</span>
                        </div>
                        <div className={style.infoItem}>
                            <strong>Fecha Creación:</strong>
                            <span>{new Date(resultado.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className={style.modelosSection} style={{ marginTop: '20px' }}>
                        <h3>Modelos/Artículos</h3>
                        <div className={style.modelosList} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {resultado.items?.map((item, idx) => (
                                <div key={idx} style={{ background: '#222', borderRadius: '8px', padding: '15px', border: '1px solid #333' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, color: '#10b981' }}>{item.cotizacion?.nombre || 'Cotización'}</h4>
                                        <span style={{ color: '#aaa' }}>x{item.cantidad}</span>
                                    </div>
                                    
                                    {(item.cotizacion?.modelos?.length > 0 || item.cotizacion?.modelos_relacionados?.length > 0) && (
                                        <ul style={{ fontSize: '0.85rem', color: '#aaa', paddingLeft: '20px', listStyleType: 'square', marginBottom: '8px', marginTop: '8px' }}>
                                            {(item.cotizacion?.modelos || item.cotizacion?.modelos_relacionados).map(m => (
                                                <li key={m.id}>
                                                    <b>{(m.cantidad || 1) * item.cantidad}x</b> {m.nombre}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    
                                    {(() => {
                                        let snap = {};
                                        try { snap = JSON.parse(item.cotizacion?.snapshot_data || '{}'); } catch(e){}
                                        
                                        if (Object.keys(snap).length === 0) return null;

                                        return (
                                            <div style={{ background: '#1a1a1a', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', color: '#ccc', marginTop: '10px' }}>
                                                <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '8px' }}>Resumen de Cotización:</strong>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                                                    <div><span style={{color: '#888'}}>Monto Un.:</span> <b style={{color: '#10b981'}}>${parseFloat(item.cotizacion.precio_final || snap.results?.price || 0).toFixed(2)}</b></div>
                                                    <div><span style={{color: '#888'}}>Monto Total:</span> <b style={{color: '#10b981'}}>${(parseFloat(item.cotizacion.precio_final || snap.results?.price || 0) * item.cantidad).toFixed(2)}</b></div>
                                                    <div><span style={{color: '#888'}}>Tiempo Un.:</span> <b>{snap.time_h || 0}h {snap.time_m || 0}m</b></div>
                                                    <div><span style={{color: '#888'}}>Total Tiempo:</span> <b>{Math.floor(((snap.time_h || 0) * 60 + (snap.time_m || 0)) * item.cantidad / 60)}h {(((snap.time_h || 0) * 60 + (snap.time_m || 0)) * item.cantidad) % 60}m</b></div>
                                                    <div><span style={{color: '#888'}}>Material:</span> <b style={{textTransform: 'capitalize'}}>{snap.materiaL_type || 'Desconocido'}</b></div>
                                                    <div><span style={{color: '#888'}}>{snap.materiaL_type === 'resina' ? 'Volumen Un.:' : 'Peso Un.:'}</span> <b>{snap.materiaL_type === 'resina' ? ((snap.volume_ml || 0) + ' ml') : ((snap.weight_g || 0) + ' g')}</b></div>
                                                </div>
                                                {item.cotizacion.comentarios && (
                                                    <div style={{ marginTop: '8px', fontStyle: 'italic', fontSize: '0.85rem', borderTop: '1px solid #333', paddingTop: '8px' }}>
                                                        <span style={{color: '#888'}}>Notas de cotización: </span>
                                                        {item.cotizacion.comentarios}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                    
                                    {item.notas && (
                                        <div style={{ background: '#1a1a1a', padding: '8px', borderRadius: '4px', fontSize: '0.9rem', color: '#ccc', fontStyle: 'italic' }}>
                                            Notas: "{item.notas}"
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="kardex-section" style={{ marginTop: '30px' }}>
                        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' }}>Historial y Mensajes (Kardex)</h3>
                        
                        <div style={{ 
                            background: '#111', 
                            borderRadius: '8px', 
                            padding: '15px', 
                            maxHeight: '400px', 
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            marginBottom: '15px'
                        }}>
                            {resultado.comentarios?.length === 0 ? (
                                <p style={{ color: '#666', textAlign: 'center' }}>No hay historial aún.</p>
                            ) : (
                                resultado.comentarios?.map(com => (
                                    <div key={com.id} style={{
                                        alignSelf: com.is_admin ? 'flex-start' : 'flex-end',
                                        background: com.is_status_update ? '#374151' : (com.is_admin ? '#1f2937' : '#064e3b'),
                                        maxWidth: '80%',
                                        padding: '12px 15px',
                                        borderRadius: '8px',
                                        border: com.is_status_update ? '1px dashed #fbbf24' : 'none'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{com.is_admin ? '🔹 ADMIN' : '👤 TÚ'}</span>
                                            <span>{new Date(com.created_at).toLocaleString()}</span>
                                        </div>
                                        
                                        {com.is_status_update && (
                                            <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>
                                                Estado actualizado a: {com.new_status?.toUpperCase()}
                                            </div>
                                        )}
                                        
                                        {com.comentario && (
                                            <div style={{ color: '#f3f4f6', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                                                {com.comentario}
                                            </div>
                                        )}

                                        {com.archivos && com.archivos.length > 0 && (
                                            <div style={{ marginTop: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                {com.archivos.map(arch => {
                                                    const url = arch.archivo_url.startsWith('http') ? arch.archivo_url : `http://localhost:8368/media/${arch.archivo_url}`;
                                                    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(arch.archivo_url);
                                                    return (
                                                        <a key={arch.id} href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-block' }}>
                                                            {isImage ? (
                                                                <img 
                                                                    src={url}
                                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #555' }}
                                                                    alt="adjunto"
                                                                />
                                                            ) : (
                                                                <div style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333', borderRadius: '4px', border: '1px solid #555', fontSize: '0.7rem', color: '#ccc', textAlign: 'center', padding: '4px' }}>
                                                                    <i className="fas fa-file" style={{ fontSize: '1.2rem' }}></i>
                                                                </div>
                                                            )}
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <input 
                                    type="text" 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Escribe un mensaje o consulta..."
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#222', color: 'white' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <label style={{ fontSize: '0.85rem', color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <i className="fas fa-paperclip"></i> Adjuntar archivos
                                        <input 
                                            type="file" 
                                            multiple 
                                            onChange={(e) => setCommentFiles(Array.from(e.target.files))}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    {commentFiles?.length > 0 && (
                                        <span style={{ fontSize: '0.8rem', color: '#10b981' }}>{commentFiles.length} archivo(s)</span>
                                    )}
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmittingComment || (!newComment.trim() && commentFiles.length === 0)}
                                style={{ 
                                    padding: '10px 20px', 
                                    background: '#10b981', 
                                    color: '#000', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    fontWeight: 'bold',
                                    height: 'fit-content',
                                    cursor: isSubmittingComment || (!newComment.trim() && commentFiles.length === 0) ? 'not-allowed' : 'pointer',
                                    opacity: isSubmittingComment || (!newComment.trim() && commentFiles.length === 0) ? 0.6 : 1
                                }}
                            >
                                Enviar
                            </button>
                        </form>
                    </div>

                </div>
            )}
        </div>
    );
};
