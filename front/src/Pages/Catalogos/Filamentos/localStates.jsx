import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/catalog.module.scss';

export const localStates = () => {
    const { s, f } = useStates();
    const filamentos = useMemo(() => s.calculadora?.filamentos || [], [s.calculadora?.filamentos]);
    const [searchTerm, setSearchTerm] = createState(['catFilamentos', 'search'], '');
    const [selectedId, setSelectedId] = createState(['catFilamentos', 'selectedId'], null);

    const filtered = useMemo(() => {
        if (!searchTerm.trim()) return filamentos;
        const t = searchTerm.trim().toLowerCase();
        return filamentos.filter(f => f.nombre?.toLowerCase().includes(t) || f.marca?.toLowerCase().includes(t));
    }, [filamentos, searchTerm]);

    const selected = useMemo(() => filamentos.find(f => f.id === selectedId) || null, [filamentos, selectedId]);

    return { style, items: filtered, searchTerm, setSearchTerm, selectedId, setSelectedId, selected };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'cat_filamentos');
        f.u1('page', 'actualMenu', 'catalogos');
        f.u1('page', 'title', 'Catálogo de Filamentos');
        f.calculadora.getFilamentos();
    }, []);
};
