import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/manejo.module.scss';

export const localStates = () => {
    const { s, f } = useStates();
    const cotizaciones = useMemo(() => s.calculadora?.cotizaciones || [], [s.calculadora?.cotizaciones]);

    const [showForm, setShowForm] = createState(['mjCotizaciones', 'showForm'], false);
    const [editId, setEditId] = createState(['mjCotizaciones', 'editId'], null);
    const [detailId, setDetailId] = createState(['mjCotizaciones', 'detailId'], null);
    const [nombre, setNombre] = createState(['mjCotizaciones', 'nombre'], '');
    const [comentarios, setComentarios] = createState(['mjCotizaciones', 'comentarios'], '');
    const [precioFinal, setPrecioFinal] = createState(['mjCotizaciones', 'precioFinal'], 0);

    const openEdit = useCallback((item) => { 
        setEditId(item.id); 
        setNombre(item.nombre || ''); 
        setComentarios(item.comentarios || ''); 
        setPrecioFinal(parseFloat(item.precio_final || item.precio_venta || 0)); 
        setShowForm(true); 
    }, []);

    const cancel = useCallback(() => { setShowForm(false); setEditId(null); }, []);
    
    const openDetail = useCallback((id) => { setDetailId(id); }, []);
    const closeDetail = useCallback(() => { setDetailId(null); }, []);

    const handleSave = useCallback(() => {
        // Obtenemos todos los datos actuales de la cotización para no sobreescribir con null
        const current = cotizaciones.find(c => c.id === editId);
        if(!current) return;
        
        const data = { 
            id: current.id,
            perfil_costo_id: current.perfil_costo_id,
            costo_total: current.costo_total,
            consto_material: current.consto_material,
            consto_luz: current.consto_luz,
            consto_desgaste: current.consto_desgaste,
            consto_mano_obra: current.consto_mano_obra,
            consto_gastos_generales: current.consto_gastos_generales,
            consto_margen_utilidad: current.consto_margen_utilidad,
            // Modificables:
            nombre: nombre,
            comentarios: comentarios,
            precio_final: precioFinal,
            modelos: current.modelos ? current.modelos.map(m => m.id) : []
        };
        
        f.calculadora.saveCotizacion(data, () => cancel());
    }, [nombre, comentarios, precioFinal, editId, cotizaciones, f.calculadora, cancel]);

    const handleDelete = useCallback((id) => {
        if (window.confirm("¿Seguro que deseas eliminar esta cotización? Esto afectará al historial de compras ligadas.")) {
            f.calculadora.deleteCotizacion(id);
        }
    }, [f.calculadora]);

    return { 
        style, cotizaciones, handleDelete,
        showForm, editId, nombre, setNombre, comentarios, setComentarios, precioFinal, setPrecioFinal,
        openEdit, cancel, handleSave,
        detailId, openDetail, closeDetail
    };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'mj_cotizaciones');
        f.u1('page', 'actualMenu', 'manejos');
        f.u1('page', 'title', 'Manejo de Cotizaciones');
        f.calculadora.getCotizaciones();
    }, []);
};
