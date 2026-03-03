import React from 'react';

export const PaginationControls = ({ pagination, setPage }) => {
    if (!pagination || pagination.total_pages <= 1) return null;
    
    const { page, total_pages, total } = pagination;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '20px 0', color: '#ccc' }}>
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                    background: page <= 1 ? '#333' : '#4f46e5',
                    color: page <= 1 ? '#666' : 'white',
                    border: 'none', padding: '8px 16px', borderRadius: '4px',
                    cursor: page <= 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                }}
            >
                Anterior
            </button>
            
            <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Página <b>{page}</b> de <b>{total_pages}</b></span>
                <span style={{ color: '#666' }}>|</span>
                <span style={{ color: '#888' }}>{total} registros</span>
            </div>
            
            <button 
                onClick={() => setPage(p => Math.min(total_pages, p + 1))}
                disabled={page >= total_pages}
                style={{
                    background: page >= total_pages ? '#333' : '#4f46e5',
                    color: page >= total_pages ? '#666' : 'white',
                    border: 'none', padding: '8px 16px', borderRadius: '4px',
                    cursor: page >= total_pages ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                }}
            >
                Siguiente
            </button>
        </div>
    );
};
