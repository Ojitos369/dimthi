import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/manejo.module.scss';

export const localStates = () => {
    const { s, f } = useStates();
    const resinas = useMemo(() => s.calculadora?.resinas || [], [s.calculadora?.resinas]);
    const [showForm, setShowForm] = createState(['mjResinas', 'showForm'], false);
    const [editId, setEditId] = createState(['mjResinas', 'editId'], null);
    const [nombre, setNombre] = createState(['mjResinas', 'nombre'], '');
    const [color, setColor] = createState(['mjResinas', 'color'], '');
    const [marca, setMarca] = createState(['mjResinas', 'marca'], '');
    const [pesoKg, setPesoKg] = createState(['mjResinas', 'pesoKg'], 1);
    const [precioKg, setPrecioKg] = createState(['mjResinas', 'precioKg'], 0);
    const [linkCompra, setLinkCompra] = createState(['mjResinas', 'linkCompra'], '');

    const openNew = useCallback(() => { setEditId(null); setNombre(''); setColor(''); setMarca(''); setPesoKg(1); setPrecioKg(0); setLinkCompra(''); setShowForm(true); }, []);
    const openEdit = useCallback((item) => { setEditId(item.id); setNombre(item.nombre||''); setColor(item.color||''); setMarca(item.marca||''); setPesoKg(parseFloat(item.peso_kg)||1); setPrecioKg(parseFloat(item.precio_kg)||0); setLinkCompra(item.link_compra||''); setShowForm(true); }, []);
    const cancel = useCallback(() => { setShowForm(false); setEditId(null); }, []);

    const handleSave = useCallback(() => {
        if (!nombre.trim()) return;
        const data = { nombre, color, marca, peso_kg: pesoKg, precio_kg: precioKg, link_compra: linkCompra };
        if (editId) data.id = editId;
        f.calculadora.saveResina(data, () => cancel());
    }, [nombre, color, marca, pesoKg, precioKg, linkCompra, editId, f.calculadora, cancel]);

    const handleDelete = useCallback((id) => f.calculadora.deleteResina(id), [f.calculadora]);

    return { style, resinas, showForm, editId, nombre, setNombre, color, setColor, marca, setMarca, pesoKg, setPesoKg, precioKg, setPrecioKg, linkCompra, setLinkCompra, openNew, openEdit, cancel, handleSave, handleDelete };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'mj_resinas');
        f.u1('page', 'actualMenu', 'manejos');
        f.u1('page', 'title', 'Manejo de Resinas');
        f.calculadora.getResinas();
    }, []);
};
