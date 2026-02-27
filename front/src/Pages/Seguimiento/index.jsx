import { localStates, localEffects } from './localStates';
import style from './styles/index.module.scss';

export default function Seguimiento() {
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
                    </div>

                    {resultado.comentarios && (
                        <div className={style.comentariosBox}>
                            <strong>Comentarios:</strong>
                            <p>{resultado.comentarios}</p>
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
                                                src={m.archivos[0].archivo_url.startsWith('http') 
                                                    ? m.archivos[0].archivo_url 
                                                    : `http://localhost:8369/media/${m.archivos[0].archivo_url}`} 
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
