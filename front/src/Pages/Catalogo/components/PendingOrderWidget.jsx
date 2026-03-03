import React, { useState } from 'react';
import Swal from 'sweetalert2';

export const PendingOrderWidget = ({ ls }) => {
    const { 
        pendingOrderCart, removeFromPendingOrderCart, updatePendingOrderQuantity, updatePendingOrderNotes, setPendingOrderCart,
        style 
    } = ls;
    const [clienteNombre, setClienteNombre] = useState('');
    const [contacto, setContacto] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (pendingOrderCart.length === 0) return null;

    const handleGenerarPedido = async () => {
        if (!clienteNombre.trim()) {
            Swal.fire({
                title: 'Nombre Requerido',
                text: 'Por favor, ingresa el nombre del cliente o empresa para generar el pedido.',
                icon: 'warning'
            });
            return;
        }

        // Calculate totals for the summary
        const totalCotizacionesPrice = pendingOrderCart.reduce((acc, curr) => {
            const price = parseFloat(curr.precio_final || curr.costo_total || 0);
            return acc + (price * (curr.cantidad || 1));
        }, 0);

        let totalModelsCount = 0;

        // Generate HTML summary
        let itemsHtml = '<div style="text-align: left; background: #222; padding: 15px; border-radius: 8px; max-height: 250px; overflow-y: auto; color: #ddd;">';
        
        pendingOrderCart.forEach(item => {
            const quoteQuantity = item.cantidad || 1;
            const price = parseFloat(item.precio_final || item.costo_total || 0).toFixed(2);
            
            itemsHtml += `
            <div style="margin-bottom: 12px; border-bottom: 1px solid #444; padding-bottom: 8px;">
                <div style="font-size: 1.05rem; margin-bottom: 4px;">
                    <b>${quoteQuantity}x</b> ${item.nombre || 'Cotización'} 
                    <span style="color:#10b981; float: right;">$${price} c/u</span>
                </div>`;
            
            // Sublist for related models
            if (item.modelos_relacionados && item.modelos_relacionados.length > 0) {
                itemsHtml += `<ul style="font-size: 0.85rem; color: #aaa; padding-left: 20px; list-style-type: square; margin-bottom: 4px; margin-top: 4px;">`;
                item.modelos_relacionados.forEach(modelo => {
                    const cant = modelo.cantidad || 1;
                    totalModelsCount += cant * quoteQuantity;
                    itemsHtml += `<li><b>${cant * quoteQuantity}x</b> ${modelo.nombre}</li>`;
                });
                itemsHtml += `</ul>`;
            } else {
                // Si no hay relacionados, asumimos que es 1 modelo principal: el del Detalle
                totalModelsCount += quoteQuantity;
                itemsHtml += `<ul style="font-size: 0.85rem; color: #aaa; padding-left: 20px; list-style-type: square; margin-bottom: 4px; margin-top: 4px;">`;
                itemsHtml += `<li><b>${quoteQuantity}x</b> ${item.modelo_nombre || 'Modelo Principal'}</li>`;
                itemsHtml += `</ul>`;
            }

            if (item.comentarios) {
                itemsHtml += `<div style="font-size: 0.85rem; color: #888; font-style: italic; background: #1a1a1a; padding: 4px; border-radius: 4px; margin-bottom: 4px;">Comentarios: ${item.comentarios}</div>`;
            }

            if (item.notas) {
                itemsHtml += `<div style="font-size: 0.85rem; color: #888; font-style: italic; background: #1a1a1a; padding: 4px; border-radius: 4px;">Nota Cliente: ${item.notas}</div>`;
            }

            itemsHtml += `</div>`;
        });
        itemsHtml += '</div>';

        Swal.fire({
            title: 'Resumen del Pedido',
            html: `
                <div style="font-size: 1.05rem; margin-bottom: 15px;">
                    Solicitante: <b style="color: #4ade80;">${clienteNombre}</b><br/>
                    Contacto: <span style="color: #ccc; font-size: 0.9rem;">${contacto || 'No proporcionado'}</span>
                </div>
                <div style="font-size: 0.95rem; margin-bottom: 10px; color: #aaa;">
                    Modelos totales incluidos: <b style="color: #fff;">${totalModelsCount}</b>
                </div>
                ${itemsHtml}
                <div style="font-size: 1.2rem; margin-top: 15px; background: #111; padding: 10px; border-radius: 6px;">
                    Total Estimado: <b style="color: #10b981;">$${totalCotizacionesPrice.toFixed(2)}</b>
                </div>
                <p style="margin-top: 15px; font-size: 0.9rem; color: #aaa;">¿Deseas confirmar y enviar este pedido a producción?</p>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#444',
            confirmButtonText: 'Sí, Generar Pedido',
            cancelButtonText: 'Revisar de Nuevo',
            background: '#1a1a1a',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsSubmitting(true);
                try {
                    ls.submitPendingOrder(clienteNombre, contacto);
                } finally {
                    // setIsSubmitting handles its own state in the upper level, but we reset it safely
                    setTimeout(() => setIsSubmitting(false), 1000);
                }
            }
        });
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px', // Right side is for pending quotes, left is for pending orders
            background: '#1a1a1a',
            border: '1px solid #10b981',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 1000,
            width: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
                <h3 style={{ margin: 0, color: '#10b981', fontSize: '1.1rem' }}>
                    📦 Pedido Activo ({pendingOrderCart.length})
                </h3>
            </div>
            
            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pendingOrderCart.map(c => (
                    <div key={c.id} style={{ display: 'flex', flexDirection: 'column', background: '#222', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                                {c.codigo ? `[${c.codigo}] ` : ''}{c.nombre || 'Cotización'}
                            </span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); removeFromPendingOrderCart(c.id); }}
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                                title="Remover"
                            >
                                ✕
                            </button>
                        </div>
                        <div style={{ color: '#aaa', fontSize: '0.75rem', marginBottom: '8px' }}>
                            {c.modelos_relacionados?.length > 0 ? (
                                <ul style={{ margin: 0, paddingLeft: '15px', color: '#888' }}>
                                    {c.modelos_relacionados.map((mr, i) => (
                                        <li key={i}>{mr.cantidad || 1}x {mr.nombre}</li>
                                    ))}
                                </ul>
                            ) : (
                                <span>{c.modelo_nombre}</span>
                            )}
                            <div style={{ marginTop: '4px', color: '#10b981' }}>Costo: ${parseFloat(c.precio_final || c.costo_total).toFixed(2)}</div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ color: '#888', fontSize: '0.8rem' }}>Cant:</label>
                            <input 
                                type="number" 
                                min="1"
                                value={c.cantidad || 1}
                                onChange={e => updatePendingOrderQuantity(c.id, parseInt(e.target.value))}
                                style={{ width: '50px', background: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '2px 4px', fontSize: '0.85rem' }}
                            />
                        </div>
                        
                        <input 
                            type="text" 
                            placeholder="Notas o specs..."
                            value={c.notas || ''}
                            onChange={e => updatePendingOrderNotes(c.id, e.target.value)}
                            style={{ width: '100%', background: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', padding: '4px 6px', fontSize: '0.8rem', boxSizing: 'border-box' }}
                        />
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                    type="text" 
                    placeholder="Quien Eres?" 
                    value={clienteNombre}
                    onChange={e => setClienteNombre(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: 'white', boxSizing: 'border-box', fontSize: '0.9rem' }}
                />
                
                <input 
                    type="text" 
                    placeholder="Contacto (Correo, teléfono o link)" 
                    value={contacto}
                    onChange={e => setContacto(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #444', background: '#111', color: 'white', boxSizing: 'border-box', fontSize: '0.9rem' }}
                />

                <button 
                    onClick={handleGenerarPedido}
                    disabled={isSubmitting}
                    style={{
                        background: isSubmitting ? '#555' : '#10b981',
                        color: isSubmitting ? '#ccc' : '#111',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isSubmitting ? 'Generando...' : 'Generar Pedido Formal'}
                </button>
            </div>
        </div>
    );
};
