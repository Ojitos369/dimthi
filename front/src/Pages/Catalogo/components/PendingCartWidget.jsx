import React from 'react';

export const PendingCartWidget = ({ ls }) => {
    const { pendingCart, removeFromPendingCart, openRequestQuoteModal, style } = ls;

    if (pendingCart.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 1000,
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
                🛒 Cotización ({pendingCart.length})
            </h3>
            
            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pendingCart.map(m => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2a2a2a', padding: '8px', borderRadius: '6px' }}>
                        <span style={{ color: '#ccc', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                            {m.nombre}
                        </span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); removeFromPendingCart(m.id); }}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Remover"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <button 
                onClick={openRequestQuoteModal}
                style={{
                    background: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '4px'
                }}
            >
                Mandar Cotización Conjunta
            </button>
        </div>
    );
};
