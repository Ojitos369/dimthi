import { localStates, localEffects } from './localStates';
import { mediaUrl } from '../../../constants/api';
import style from './styles/index.module.scss';

export const Seg_Cotizaciones = () => {
    localEffects();
    const {
        codigo, setCodigo,
        resultado, setResultado,
        loading, errorMsg,
        handleSearch
    } = localStates();

    return (
        <div className={style.seguimientoContainer}>
            <div className={style.heroSection}>
                <h1>Seguimiento de Cotización</h1>
                <p>Ingresa tu código de seguimiento (ej. COT-XXXXXXX) para ver el estado de tu pre-cotización.</p>
                
                <form onSubmit={handleSearch} className={style.searchForm}>
                    <div className={style.inputGroup}>
                        <label>Código de Seguimiento</label>
                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="COT-..."
                            required
                            className="my-input"
                        />
                    </div>
                    <button type="submit" disabled={loading} className={style.searchBtn}>
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
                        <h2>Detalles de la Solicitud</h2>
                        <span className={`${style.badge} ${resultado.estado === 'resuelta' ? style.resuelta : style.pendiente}`}>
                            {resultado.estado.toUpperCase()}
                        </span>
                    </div>

                    <div className={style.infoGrid}>
                        <div className={style.infoItem}>
                            <strong>Código:</strong>
                            <span>{resultado.codigo}</span>
                        </div>
                        <div className={style.infoItem}>
                            <strong>Nombre/Referencia:</strong>
                            <span>{resultado.nombre}</span>
                        </div>
                        <div className={style.infoItem}>
                            <strong>Fecha:</strong>
                            <span>{new Date(resultado.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className={style.infoItem}>
                            <strong>Material Solicitado:</strong>
                            <span style={{textTransform: 'capitalize'}}>{resultado.material_sugerido || 'A revisión'}</span>
                        </div>
                    </div>

                    {resultado.comentarios && (
                        <div className={style.comentariosBox}>
                            <strong>Comentarios de Solicitud:</strong>
                            <p>{resultado.comentarios}</p>
                        </div>
                    )}

                    {resultado.cotizacion_data && (
                        <div className={style.comentariosBox} style={{ marginTop: '1.5rem', borderLeftColor: '#fbbf24' }}>
                            <h3 style={{ margin: '0 0 1rem 0', color: '#fbbf24' }}>Detalles de la Cotización Final</h3>
                            
                            <div className={style.infoGrid}>
                                {(() => {
                                    const cot = resultado.cotizacion_data;
                                    let snap = {};
                                    try { snap = JSON.parse(cot.snapshot_data || '{}'); } catch(e){}
                                    
                                    return (
                                        <>
                                            <div className={style.infoItem}>
                                                <strong>Precio Final:</strong>
                                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>${parseFloat(cot.precio_final || snap.results?.price || 0).toFixed(2)}</span>
                                            </div>
                                            <div className={style.infoItem}>
                                                <strong>Tiempo Estimado:</strong>
                                                <span>{snap.time_h || 0} hrs {snap.time_m || 0} min</span>
                                            </div>
                                            <div className={style.infoItem}>
                                                <strong>Material:</strong>
                                                <span style={{textTransform: 'capitalize'}}>{snap.materiaL_type || 'Desconocido'}</span>
                                            </div>
                                            <div className={style.infoItem}>
                                                <strong>{snap.materiaL_type === 'resina' ? 'Volumen:' : 'Peso:'}</strong>
                                                <span>{snap.materiaL_type === 'resina' ? ((snap.volume_ml || 0) + ' ml') : ((snap.weight_g || 0) + ' g')}</span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            {resultado.cotizacion_data.comentarios && (
                                <div style={{marginTop: '1rem'}}>
                                    <strong>Notas de Cotización:</strong>
                                    <p>{resultado.cotizacion_data.comentarios}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={style.modelosSection}>
                        <h3>Modelos Solicitados</h3>
                        <div className={style.modelosList}>
                            {resultado.modelos_data?.map((m, idx) => (
                                <div key={idx} className={style.modeloItem}>
                                    <div className={style.modeloImg}>
                                        {m.archivos && m.archivos.length > 0 ? (
                                            <img 
                                                src={mediaUrl(m.archivos[0].archivo_url)} 
                                                alt={m.nombre_modelo} 
                                            />
                                        ) : (
                                            <div className={style.placeholder}><i className="fas fa-cube"></i></div>
                                        )}
                                    </div>
                                    <div className={style.modeloInfo}>
                                        <h4>{m.nombre_modelo}</h4>
                                        <p>Cantidad: <b>{m.cantidad}</b></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
