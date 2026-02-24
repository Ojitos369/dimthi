import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../Hooks/useStates';
import style from './styles/index.module.scss';

export const localStates = () => {
    const { s, f } = useStates();

    const modelos = useMemo(() => s.calculadora?.modelos || [], [s.calculadora?.modelos]);
    const [searchTerm, setSearchTerm] = createState(['catalogo', 'searchTerm'], '');
    const [selectedModeloId, setSelectedModeloId] = createState(['catalogo', 'selectedModeloId'], null);
    const modeloActual = useMemo(() => s.calculadora?.modeloActual || null, [s.calculadora?.modeloActual]);

    const filteredModelos = useMemo(() => {
        if (!searchTerm.trim()) return modelos;
        const term = searchTerm.trim().toLowerCase();
        return modelos.filter(m =>
            m.nombre?.toLowerCase().includes(term) ||
            m.descripcion?.toLowerCase().includes(term)
        );
    }, [modelos, searchTerm]);

    const selectModelo = useCallback((id) => {
        setSelectedModeloId(id);
        f.calculadora.getModelo(id);
    }, [f.calculadora]);

    const closeDetail = useCallback(() => {
        setSelectedModeloId(null);
        f.u1('calculadora', 'modeloActual', null);
    }, [f]);

    return {
        style,
        modelos: filteredModelos,
        searchTerm, setSearchTerm,
        selectedModeloId, modeloActual,
        selectModelo, closeDetail,
    };
};

export const localEffects = () => {
    const { f } = useStates();

    useEffect(() => {
        f.u1('page', 'actual', 'catalogo');
        f.u1('page', 'actualMenu', 'catalogo');
        f.u1('page', 'title', 'Catálogo de Modelos');
        f.calculadora.getModelos();
    }, []);
};
