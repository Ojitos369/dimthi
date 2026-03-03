import { useStates, createState } from '../../../Hooks/useStates';
import { useEffect, useCallback } from 'react';

export const localStates = () => {
    const { s, f } = useStates();

    const [codigo, setCodigo] = createState(['seg_modelos', 'codigo'], '');
    const [resultado, setResultado] = createState(['seg_modelos', 'resultado'], null);
    const [loading, setLoading] = createState(['seg_modelos', 'loading'], false);
    const [errorMsg, setErrorMsg] = createState(['seg_modelos', 'errorMsg'], '');

    const handleSearch = useCallback((e) => {
        if (e) e.preventDefault();
        
        const searchCode = (codigo || '').trim().toUpperCase();
        
        if (!searchCode) {
            setErrorMsg('Ingresa un código de modelo válido');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setResultado(null);

        // Utilizamos el endpoint de buscar modelos incluyendo por código (que ya modificamos antes para que acepte código)
        // Recordar que codigo en searchModelos filtra por código específico.
        f.calculadora.searchModelos({ codigo: searchCode, limite: 1 }, (res) => {
            setLoading(false);
            if (res && res.length > 0) {
                setResultado(res[0]); // Seleccionamos el modelo devuelto
                if (window.location.hash.indexOf(searchCode) === -1) {
                    window.history.replaceState(null, '', `#/seguimiento/modelos/${searchCode}`);
                }
            } else {
                setErrorMsg('No se encontró ningún modelo con ese código.');
                if (window.location.hash.split('/').pop() !== 'modelos') {
                    window.history.replaceState(null, '', '#/seguimiento/modelos');
                }
            }
        });
    }, [codigo, f.calculadora]);

    return {
        style: s.app?.style,
        codigo, setCodigo,
        resultado, setResultado,
        loading, errorMsg, setErrorMsg,
        handleSearch
    };
};

export const localEffects = () => {
    const { s, f } = useStates();
    
    useEffect(() => {
        f.u1('page', 'actual', 'seguimiento_modelos');
        f.u1('page', 'actualMenu', '');
        f.u1('page', 'title', 'Seguimiento de Modelos');
    }, []);

    // Autosearch si venimos con un código en la URL
    useEffect(() => {
        const pathParts = window.location.hash.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart && lastPart.toUpperCase().startsWith('MOD-') && !s.seg_modelos?.codigo) {
            f.u1('seg_modelos', 'codigo', lastPart.toUpperCase());
            // Retry automatically
            setTimeout(() => {
                const searchBtn = document.getElementById('search-modelo-btn');
                if (searchBtn) searchBtn.click();
            }, 100);
        }
    }, [f, s.seg_modelos?.codigo]);
};
