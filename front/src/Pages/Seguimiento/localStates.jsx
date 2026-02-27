import { useStates, createState } from '../../Hooks/useStates';
import { useCallback, useEffect } from 'react';

export const localStates = () => {
    const { s, f } = useStates();

    const [codigo, setCodigo] = createState(['seguimiento', 'codigo'], '');
    const [resultado, setResultado] = createState(['seguimiento', 'resultado'], null);
    const [loading, setLoading] = createState(['seguimiento', 'loading'], false);
    const [errorMsg, setErrorMsg] = createState(['seguimiento', 'errorMsg'], null);

    const handleSearch = useCallback((e) => {
        if (e) e.preventDefault();
        if (!codigo.trim()) return;

        setLoading(true);
        setErrorMsg(null);
        setResultado(null);

        f.calculadora.getPendienteByCodigo(codigo.trim(), 
            (res) => {
                setLoading(false);
                setResultado(res);
            },
            (err) => {
                setLoading(false);
                setErrorMsg('No se encontró ninguna cotización con ese código.');
                f.general.notificacion({ title: 'Error', message: 'No se encontró la cotización', mode: 'error' });
            }
        );
    }, [codigo, f.calculadora, f.general]);

    return {
        codigo, setCodigo,
        resultado, setResultado,
        loading, errorMsg,
        handleSearch
    };
};

export const localEffects = () => {
    const { f } = useStates();
    
    useEffect(() => {
        if (!f) return;
        f.u1('page', 'actual', 'seguimiento');
        f.u1('page', 'actualMenu', 'seguimiento');
        f.u1('page', 'title', 'Seguimiento de Cotización');
    }, []); // Empty dependency array to run only once on mount
};
