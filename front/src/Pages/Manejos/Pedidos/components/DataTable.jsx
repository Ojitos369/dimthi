import React from 'react';

export const DataTable = ({ ls }) => {
    const { style, pedidos, openDetail, updateStatus } = ls;

    const getStatusStyle = (status) => {
        let bg = '#333';
        switch(status?.toLowerCase()) {
            case 'creado': bg = '#3b82f6'; break;
            case 'en producción':
            case 'en produccion': bg = '#f59e0b'; break;
            case 'completado': bg = '#10b981'; break;
            case 'entregado': bg = '#8b5cf6'; break;
            case 'cancelado': bg = '#ef4444'; break;
            default: bg = '#6b7280';
        }
        return { backgroundColor: bg, color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' };
    };

    return (
        <div className={style.gridContainer}>
            {pedidos.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    No hay pedidos que coincidan con la búsqueda.
                </div>
            ) : (
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>A Nombre De</th>
                            <th>Contacto</th>
                            <th>Artículos</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(p => (
                            <tr key={p.id}>
                                <td><strong style={{color: '#4ade80'}}>{p.codigo}</strong></td>
                                <td>{p.cliente_nombre}</td>
                                <td>{p.contacto || '-'}</td>
                                <td>{p.items?.reduce((acc, curr) => acc + (curr.cantidad || 1), 0) || 0} items</td>
                                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                                <td>
                                    <select 
                                        value={p.estado || 'creado'}
                                        onChange={(e) => updateStatus(p.id, e.target.value)}
                                        style={{...getStatusStyle(p.estado), border: 'none', cursor: 'pointer', outline: 'none'}}
                                    >
                                        <option value="creado">Creado</option>
                                        <option value="en producción">En Producción</option>
                                        <option value="completado">Completado</option>
                                        <option value="entregado">Entregado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </td>
                                <td>
                                    <div className={style.actions}>
                                        <button onClick={() => openDetail(p.id)} className={style.btnIcon} title="Ver Kardex y Detalles">
                                            <i className="fas fa-eye"></i> Kardex
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
