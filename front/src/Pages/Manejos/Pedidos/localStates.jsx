import { useMemo, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../../Manejos/shared/styles/manejo.module.scss'; // Reuse common manejos styles

export const localStates = () => {
    const { s, f } = useStates();
    
    const [searchTerm, setSearchTerm] = createState(['mjPedidos', 'searchTerm'], '');
    const [page, setPage] = createState(['mjPedidos', 'page'], 1);
    const pagination = useMemo(() => s.pedidos?.listaPagination || null, [s.pedidos?.listaPagination]);
    
    const pedidos = useMemo(() => {
        const list = s.pedidos?.lista || [];
        if (!searchTerm.trim()) return list;
        const term = searchTerm.trim().toLowerCase();
        return list.filter(item => 
            item.cliente_nombre?.toLowerCase().includes(term) ||
            item.codigo?.toLowerCase().includes(term) ||
            item.estado?.toLowerCase().includes(term)
        );
    }, [s.pedidos?.lista, searchTerm]);

    const setSearchTermAndResetPage = useCallback((term) => {
        setSearchTerm(term);
        setPage(1);
    }, [setSearchTerm, setPage]);

    const [detailId, setDetailId] = createState(['mjPedidos', 'detailId'], null);
    const pedidoActual = useMemo(() => pedidos.find(p => p.id === detailId), [pedidos, detailId]);

    const openDetail = useCallback((id) => { setDetailId(id); }, [setDetailId]);
    const closeDetail = useCallback(() => { setDetailId(null); }, [setDetailId]);

    const [showCommentModal, setShowCommentModal] = createState(['mjPedidos', 'showCommentModal'], false);
    const [commentPedidoId, setCommentPedidoId] = createState(['mjPedidos', 'commentPedidoId'], null);
    
    const openCommentModal = useCallback((id) => {
        setCommentPedidoId(id);
        setShowCommentModal(true);
    }, [setCommentPedidoId, setShowCommentModal]);
    
    const closeCommentModal = useCallback(() => {
        setCommentPedidoId(null);
        setShowCommentModal(false);
    }, [setCommentPedidoId, setShowCommentModal]);

    const updateStatus = useCallback((id, newStatus) => {
        Swal.fire({
            title: `¿Cambiar estado a ${newStatus.toUpperCase()}?`,
            text: 'Se añadirá un registro al Kardex del pedido.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#666',
            confirmButtonText: 'Sí, actualizar',
            background: '#1a1a1a',
            color: '#e0e0e0',
        }).then((result) => {
            if (result.isConfirmed) {
                f.pedidos.updatePedidoStatus({
                    pedido_id: id,
                    new_status: newStatus,
                    comentario: `Estado actualizado a ${newStatus.toUpperCase()}`
                }, () => {
                    f.general.notificacion({ title: 'Actualizado', message: 'Estado del pedido actualizado.', mode: 'success' });
                    f.pedidos.getPedidos({ limit: 50, page: page });
                });
            }
        });
    }, [f.pedidos, f.general, page]);

    const addCommentToPedido = useCallback((pedidoId, commentText, files = []) => {
        const payload = new FormData();
        payload.append('pedido_id', pedidoId);
        payload.append('comentario', commentText);
        payload.append('is_admin', true);
        
        files.forEach(f => payload.append('archivos', f));

        return new Promise((resolve) => {
            f.pedidos.addPedidoComentario(payload, () => {
                f.general.notificacion({ title: 'Enviado', message: 'Comentario agregado al kardex.', mode: 'success' });
                f.pedidos.getPedidos({ limit: 50, page: page });
                closeCommentModal();
                resolve();
            });
        });
    }, [f.pedidos, f.general, closeCommentModal, page]);

    return { 
        style, searchTerm, setSearchTerm: setSearchTermAndResetPage, pedidos, pagination, setPage,
        detailId, pedidoActual, openDetail, closeDetail,
        showCommentModal, commentPedidoId, openCommentModal, closeCommentModal,
        updateStatus, addCommentToPedido
    };
};

export const localEffects = () => {
    const { s, f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'mj_pedidos');
        f.u1('page', 'actualMenu', 'manejos');
        f.u1('page', 'title', 'Manejo de Pedidos');
        
        // Fetch current page of pedidos
        const page = s.mjPedidos?.page || 1;
        f.pedidos.getPedidos({ limit: 50, page: page });
    }, [s.mjPedidos?.page]);
};
