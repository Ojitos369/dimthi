import { localStates, localEffects } from './localStates';
import style from '../Cotizaciones/styles/index.module.scss'; // Reuse styling from Cotizaciones

export const Seg_Modelos = () => {
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
                <h1>Seguimiento de Modelos</h1>
                <p>Ingresa el código de tu modelo (ej. MOD-XXXXXXX) para revisar sus detalles e imágenes.</p>
                
                <form onSubmit={handleSearch} className={style.searchForm}>
                    <div className={style.inputGroup}>
                        <label>Código de Modelo</label>
                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="MOD-..."
                            required
                            className="my-input"
                        />
                    </div>
                    <button type="submit" id="search-modelo-btn" disabled={loading} className={style.searchBtn}>
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
                        <h2>Detalles del Modelo</h2>
                        <span className={style.badge} style={{ backgroundColor: resultado.is_public ? '#3b82f6' : '#6b7280', color: 'white' }}>
                            {resultado.is_public ? 'PÚBLICO' : 'PRIVADO'}
                        </span>
                    </div>

                    <div className={style.infoGrid}>
                        <div className={style.infoItem}>
                            <strong>Código:</strong>
                            <span style={{ color: '#4ade80' }}>{resultado.codigo}</span>
                        </div>
                        <div className={style.infoItem}>
                            <strong>Nombre:</strong>
                            <span>{resultado.nombre}</span>
                        </div>
                        <div className={style.infoItem}>
                            <strong>Fecha de Registro:</strong>
                            <span>{new Date(resultado.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {resultado.descripcion && (
                        <div className={style.comentariosBox} style={{ marginTop: '20px' }}>
                            <strong>Descripción:</strong>
                            <p style={{ marginTop: '8px', color: '#ccc' }}>{resultado.descripcion}</p>
                        </div>
                    )}

                    <div className={style.modelosSection} style={{ marginTop: '30px' }}>
                        <h3>Archivos Asociados</h3>
                        <div className={style.modelosList} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                            {resultado.archivos?.length > 0 ? (
                                resultado.archivos.map((arch, idx) => (
                                    <div key={idx} style={{ background: '#222', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #333' }}>
                                        {arch.archivo_url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                            <img 
                                                src={arch.archivo_url.startsWith('http') ? arch.archivo_url : `http://localhost:8369/media/${arch.archivo_url}`}
                                                alt="Modelo"
                                                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        ) : (
                                            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', borderRadius: '4px', fontSize: '3rem', color: '#555' }}>
                                                <i className="fas fa-file-alt"></i>
                                            </div>
                                        )}
                                        <div style={{ marginTop: '10px' }}>
                                            <a 
                                                href={arch.archivo_url.startsWith('http') ? arch.archivo_url : `http://localhost:8369/media/${arch.archivo_url}`}
                                                target="_blank" 
                                                rel="noreferrer"
                                                style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.85rem' }}
                                            >
                                                Ver / Descargar
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#666', gridColumn: '1 / -1' }}>No hay archivos multimedia vinculados.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
