import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/manejo.module.scss';

export const localStates = () => {
    const { s, f } = useStates();
    const perfiles = useMemo(() => s.calculadora?.perfiles || [], [s.calculadora?.perfiles]);
    const filamentos = useMemo(() => s.calculadora?.filamentos || [], [s.calculadora?.filamentos]);
    const resinas = useMemo(() => s.calculadora?.resinas || [], [s.calculadora?.resinas]);
    const maquinas = useMemo(() => s.calculadora?.maquinas || [], [s.calculadora?.maquinas]);

    const [showForm, setShowForm] = createState(['mjPerfiles', 'showForm'], false);
    const [editId, setEditId] = createState(['mjPerfiles', 'editId'], null);
    const [nombre, setNombre] = createState(['mjPerfiles', 'nombre'], '');
    const [filamentoId, setFilamentoId] = createState(['mjPerfiles', 'filamentoId'], '');
    const [resinaId, setResinaId] = createState(['mjPerfiles', 'resinaId'], '');
    const [maquinaId, setMaquinaId] = createState(['mjPerfiles', 'maquinaId'], '');
    const [luzKw, setLuzKw] = createState(['mjPerfiles', 'luzKw'], 4.5);
    const [manoObra, setManoObra] = createState(['mjPerfiles', 'manoObra'], 15);
    const [margenUtilidad, setMargenUtilidad] = createState(['mjPerfiles', 'margenUtilidad'], 20);

    const openNew = useCallback(() => {
        setEditId(null); setNombre(''); setFilamentoId(''); setResinaId(''); setMaquinaId('');
        setLuzKw(4.5); setManoObra(15); setMargenUtilidad(20); setShowForm(true);
    }, []);

    const openEdit = useCallback((item) => {
        setEditId(item.id); setNombre(item.nombre||'');
        setFilamentoId(item.filamento_id||''); setResinaId(item.resina_id||''); setMaquinaId(item.maquina_id||'');
        setLuzKw(parseFloat(item.luz_kw)||4.5); setManoObra(parseFloat(item.mano_obra)||15);
        setMargenUtilidad(parseFloat(item.margen_utilidad)||20); setShowForm(true);
    }, []);

    const cancel = useCallback(() => { setShowForm(false); setEditId(null); }, []);

    const handleSave = useCallback(() => {
        if (!nombre.trim()) return;
        const data = {
            nombre,
            filamento_id: filamentoId || null,
            resina_id: resinaId || null,
            maquina_id: maquinaId || null,
            luz_kw: luzKw,
            mano_obra: manoObra,
            margen_utilidad: margenUtilidad,
        };
        if (editId) data.id = editId;
        f.calculadora.savePerfil(data, () => cancel());
    }, [nombre, filamentoId, resinaId, maquinaId, luzKw, manoObra, margenUtilidad, editId, f.calculadora, cancel]);

    const handleDelete = useCallback((id) => f.calculadora.deletePerfil(id), [f.calculadora]);

    return {
        style, perfiles, filamentos, resinas, maquinas,
        showForm, editId, nombre, setNombre,
        filamentoId, setFilamentoId, resinaId, setResinaId,
        maquinaId, setMaquinaId,
        luzKw, setLuzKw, manoObra, setManoObra, margenUtilidad, setMargenUtilidad,
        openNew, openEdit, cancel, handleSave, handleDelete,
    };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'mj_perfiles');
        f.u1('page', 'actualMenu', 'manejos');
        f.u1('page', 'title', 'Manejo de Perfiles');
        f.calculadora.getPerfiles();
        f.calculadora.getFilamentos();
        f.calculadora.getResinas();
        f.calculadora.getMaquinas();
    }, []);
};
