import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/manejo.module.scss';

export const localStates = () => {
    const { s, f } = useStates();
    const [searchTerm, setSearchTerm] = createState(['mjCompras', 'searchTerm'], '');

    const compras = useMemo(() => {
        const list = s.calculadora?.compras || [];
        if (!searchTerm.trim()) return list;
        const term = searchTerm.trim().toLowerCase();
        return list.filter(item => 
            item.nombre?.toLowerCase().includes(term) ||
            item.usuario?.toLowerCase().includes(term) ||
            item.cotizacion_nombre?.toLowerCase().includes(term)
        );
    }, [s.calculadora?.compras, searchTerm]);

    const cotizaciones = useMemo(() => s.calculadora?.cotizaciones || [], [s.calculadora?.cotizaciones]);

    const [showForm, setShowForm] = createState(['mjCompras', 'showForm'], false);
    const [editId, setEditId] = createState(['mjCompras', 'editId'], null);
    
    // Form fields
    const [cotizacionId, setCotizacionId] = createState(['mjCompras', 'cotizacionId'], '');
    const [cantidad, setCantidad] = createState(['mjCompras', 'cantidad'], 1);
    const [usuario, setUsuario] = createState(['mjCompras', 'usuario'], '');
    const [comentario, setComentario] = createState(['mjCompras', 'comentario'], '');
    const [nombreCompra, setNombreCompra] = createState(['mjCompras', 'nombreCompra'], '');

    const openNew = useCallback(() => { 
        setEditId(null); 
        setCotizacionId(''); 
        setCantidad(1); 
        setUsuario(''); 
        setComentario(''); 
        setNombreCompra(''); 
        setShowForm(true); 
    }, []);

    const openEdit = useCallback((item) => { 
        setEditId(item.id); 
        setCotizacionId(item.cotizacion_id || ''); 
        setCantidad(parseInt(item.cantidad) || 1); 
        setUsuario(item.usuario || ''); 
        setComentario(item.comentario || ''); 
        setNombreCompra(item.nombre || ''); 
        setShowForm(true); 
    }, []);

    const cancel = useCallback(() => { setShowForm(false); setEditId(null); }, []);

    const handleSave = useCallback(() => {
        if (!cotizacionId) return;
        const data = { 
            cotizacion_id: cotizacionId, 
            cantidad: cantidad, 
            usuario, 
            comentario,
            nombre: nombreCompra
        };
        if (editId) data.id = editId;
        f.calculadora.saveCompra(data, () => cancel());
    }, [cotizacionId, cantidad, usuario, comentario, editId, f.calculadora, cancel]);

    const handleDelete = useCallback((id) => f.calculadora.deleteCompra(id), [f.calculadora]);

    return { 
        style, searchTerm, setSearchTerm, compras, cotizaciones, showForm, editId, 
        cotizacionId, setCotizacionId, cantidad, setCantidad, 
        usuario, setUsuario, comentario, setComentario, nombreCompra, setNombreCompra,
        openNew, openEdit, cancel, handleSave, handleDelete 
    };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'mj_compras');
        f.u1('page', 'actualMenu', 'manejos');
        f.u1('page', 'title', 'Manejo de Compras');
        f.calculadora.getCompras();
        f.calculadora.getCotizaciones(); // Need to load them to link
    }, []);
};
