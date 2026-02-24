import { useMemo, useEffect } from 'react';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/catalog.module.scss';

export const localStates = () => {
    const { s } = useStates();
    const resinas = useMemo(() => s.calculadora?.resinas || [], [s.calculadora?.resinas]);
    const [searchTerm, setSearchTerm] = createState(['catResinas', 'search'], '');
    const [selectedId, setSelectedId] = createState(['catResinas', 'selectedId'], null);

    const filtered = useMemo(() => {
        if (!searchTerm.trim()) return resinas;
        const t = searchTerm.trim().toLowerCase();
        return resinas.filter(r => r.nombre?.toLowerCase().includes(t) || r.marca?.toLowerCase().includes(t));
    }, [resinas, searchTerm]);

    const selected = useMemo(() => resinas.find(r => r.id === selectedId) || null, [resinas, selectedId]);

    return { style, items: filtered, searchTerm, setSearchTerm, selectedId, setSelectedId, selected };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'cat_resinas');
        f.u1('page', 'actualMenu', 'catalogos');
        f.u1('page', 'title', 'Catálogo de Resinas');
        f.calculadora.getResinas();
    }, []);
};
