import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/manejo.module.scss';

export const localStates = () => {
    const { s, f } = useStates();
    const filamentos = useMemo(() => s.calculadora?.filamentos || [], [s.calculadora?.filamentos]);
    const [showForm, setShowForm] = createState(['mjFilamentos', 'showForm'], false);
    const [editId, setEditId] = createState(['mjFilamentos', 'editId'], null);
    const [nombre, setNombre] = createState(['mjFilamentos', 'nombre'], '');
    const [color, setColor] = createState(['mjFilamentos', 'color'], '');
    const [marca, setMarca] = createState(['mjFilamentos', 'marca'], '');
    const [pesoKg, setPesoKg] = createState(['mjFilamentos', 'pesoKg'], 1);
    const [precioKg, setPrecioKg] = createState(['mjFilamentos', 'precioKg'], 0);
    const [linkCompra, setLinkCompra] = createState(['mjFilamentos', 'linkCompra'], '');

    const openNew = useCallback(() => { setEditId(null); setNombre(''); setColor(''); setMarca(''); setPesoKg(1); setPrecioKg(0); setLinkCompra(''); setShowForm(true); }, []);
    const openEdit = useCallback((item) => { setEditId(item.id); setNombre(item.nombre||''); setColor(item.color||''); setMarca(item.marca||''); setPesoKg(parseFloat(item.peso_kg)||1); setPrecioKg(parseFloat(item.precio_kg)||0); setLinkCompra(item.link_compra||''); setShowForm(true); }, []);
    const cancel = useCallback(() => { setShowForm(false); setEditId(null); }, []);

    const handleSave = useCallback(() => {
        if (!nombre.trim()) return;
        const data = { nombre, color, marca, peso_kg: pesoKg, precio_kg: precioKg, link_compra: linkCompra };
        if (editId) data.id = editId;
        f.calculadora.saveFilamento(data, () => cancel());
    }, [nombre, color, marca, pesoKg, precioKg, linkCompra, editId, f.calculadora, cancel]);

    const handleDelete = useCallback((id) => f.calculadora.deleteFilamento(id), [f.calculadora]);

    return { style, filamentos, showForm, editId, nombre, setNombre, color, setColor, marca, setMarca, pesoKg, setPesoKg, precioKg, setPrecioKg, linkCompra, setLinkCompra, openNew, openEdit, cancel, handleSave, handleDelete };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'mj_filamentos');
        f.u1('page', 'actualMenu', 'manejos');
        f.u1('page', 'title', 'Manejo de Filamentos');
        f.calculadora.getFilamentos();
    }, []);
};
