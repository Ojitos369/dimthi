import { useStates, createState } from '../../../Hooks/useStates';
import { useEffect, useCallback } from 'react';

export const localStates = () => {
    const { s, f } = useStates();

    const [codigo, setCodigo] = createState(['seg_pedidos', 'codigo'], '');
    const [resultado, setResultado] = createState(['seg_pedidos', 'resultado'], null);
    const [loading, setLoading] = createState(['seg_pedidos', 'loading'], false);
    const [errorMsg, setErrorMsg] = createState(['seg_pedidos', 'errorMsg'], '');
    const [newComment, setNewComment] = createState(['seg_pedidos', 'newComment'], '');
    const [commentFiles, setCommentFiles] = createState(['seg_pedidos', 'commentFiles'], []);
    const [isSubmittingComment, setIsSubmittingComment] = createState(['seg_pedidos', 'isSubmittingComment'], false);

    const handleSearch = useCallback((e) => {
        if (e) e.preventDefault();
        
        const searchCode = (codigo || '').trim().toUpperCase();
        
        if (!searchCode) {
            setErrorMsg('Ingresa un código válido');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setResultado(null);

        f.pedidos.getPedidos({ codigo: searchCode }, (res) => {
            setLoading(false);
            if (res && res.length > 0) {
                setResultado(res[0]); // Obtenemos el primero ya que buscamos por codigo único
                // Optionally update URL to match search params if not already set
                if (window.location.hash.indexOf(searchCode) === -1) {
                    window.history.replaceState(null, '', `#/seguimiento/pedidos/${searchCode}`);
                }
            } else {
                setErrorMsg('No se encontró ningún pedido con ese código.');
                if (window.location.hash.split('/').pop() !== 'pedidos') {
                    window.history.replaceState(null, '', '#/seguimiento/pedidos');
                }
            }
        });
    }, [codigo, f.pedidos]);

    const handleAddComment = useCallback((e) => {
        if (e) e.preventDefault();
        
        if (!newComment.trim() && commentFiles.length === 0) return;
        if (!resultado?.id) return;
        
        setIsSubmittingComment(true);
        
        const payload = new FormData();
        payload.append('pedido_id', resultado.id);
        payload.append('comentario', newComment);
        payload.append('is_admin', false);
        commentFiles.forEach(f => payload.append('archivos', f));
        
        f.pedidos.addPedidoComentario(payload, (res) => {
            setIsSubmittingComment(false);
            if (res.id) {
                setNewComment('');
                setCommentFiles([]);
                handleSearch(); // Recargar para obtener el kardex actualizado
            } else {
                f.general.notificacion({ title: 'Error', message: 'No se pudo enviar el comentario', mode: 'error' });
            }
        });
        
    }, [newComment, resultado, f.pedidos, f.general, handleSearch]);

    return {
        style: s.app?.style,
        codigo, setCodigo,
        resultado, setResultado,
        loading, errorMsg, setErrorMsg,
        handleSearch,
        newComment, setNewComment,
        commentFiles, setCommentFiles,
        isSubmittingComment, handleAddComment
    };
};

export const localEffects = () => {
    const { s, f, ls } = useStates();
    
    useEffect(() => {
        f.u1('page', 'actual', 'seguimiento_pedidos');
        f.u1('page', 'actualMenu', '');
        f.u1('page', 'title', 'Seguimiento de Pedidos');
    }, []);

    // Effect to grab URL code and auto-search
    useEffect(() => {
        const pathParts = window.location.hash.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        // Verifica si la última parte parece un código PED-
        if (lastPart && lastPart.toUpperCase().startsWith('PED-') && !s.seg_pedidos?.codigo) {
            f.u1('seg_pedidos', 'codigo', lastPart.toUpperCase());
            // Small delay to allow state to settle
            setTimeout(() => {
                const searchBtn = document.getElementById('search-pedido-btn');
                if (searchBtn) searchBtn.click();
            }, 100);
        }
    }, [f, s.seg_pedidos?.codigo]);
};
