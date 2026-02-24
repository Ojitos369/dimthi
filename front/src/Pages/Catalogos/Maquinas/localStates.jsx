import { useMemo, useEffect } from 'react';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/catalog.module.scss';

export const localStates = () => {
    const { s } = useStates();
    const maquinas = useMemo(() => s.calculadora?.maquinas || [], [s.calculadora?.maquinas]);
    const [searchTerm, setSearchTerm] = createState(['catMaquinas', 'search'], '');
    const [selectedId, setSelectedId] = createState(['catMaquinas', 'selectedId'], null);

    const filtered = useMemo(() => {
        if (!searchTerm.trim()) return maquinas;
        const t = searchTerm.trim().toLowerCase();
        return maquinas.filter(m => m.nombre?.toLowerCase().includes(t) || m.marca?.toLowerCase().includes(t));
    }, [maquinas, searchTerm]);

    const selected = useMemo(() => maquinas.find(m => m.id === selectedId) || null, [maquinas, selectedId]);

    return { style, items: filtered, searchTerm, setSearchTerm, selectedId, setSelectedId, selected };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'cat_maquinas');
        f.u1('page', 'actualMenu', 'catalogos');
        f.u1('page', 'title', 'Catálogo de Impresoras');
        f.calculadora.getMaquinas();
    }, []);
};
