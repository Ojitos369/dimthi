import { useMemo, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/manejo.module.scss';

export const localStates = () => {
    const { s, f } = useStates();
    const cotizaciones = useMemo(() => s.calculadora?.cotizaciones || [], [s.calculadora?.cotizaciones]);
    const pendientes = useMemo(() => s.calculadora?.pendientes || [], [s.calculadora?.pendientes]);

    const [activeTab, setActiveTab] = createState(['mjCotizaciones', 'activeTab'], 'pendientes'); // 'historial' or 'pendientes'
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
        setPrecioFinal(parseFloat(item.precio_final || item.costo_total || 0)); 
        setShowForm(true); 
    }, []);

    const cancel = useCallback(() => { setShowForm(false); setEditId(null); }, []);
    
    const openDetail = useCallback((id) => { setDetailId(id); }, []);
    const closeDetail = useCallback(() => { setDetailId(null); }, []);

    const [detailPendienteId, setDetailPendienteId] = createState(['mjCotizaciones', 'detailPendienteId'], null);
    const openDetailPendiente = useCallback((id) => { setDetailPendienteId(id); }, []);
    const closeDetailPendiente = useCallback(() => { setDetailPendienteId(null); }, []);

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
        Swal.fire({
            title: '¿Eliminar cotización?',
            text: 'Esto afectará al historial de compras ligadas.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#666',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1a1a1a',
            color: '#e0e0e0',
        }).then((result) => {
            if (result.isConfirmed) {
                f.calculadora.deleteCotizacion(id);
            }
        });
    }, [f.calculadora]);

    return { 
        style, cotizaciones, pendientes, handleDelete,
        showForm, editId, nombre, setNombre, comentarios, setComentarios, precioFinal, setPrecioFinal,
        openEdit, cancel, handleSave,
        detailId, openDetail, closeDetail,
        detailPendienteId, openDetailPendiente, closeDetailPendiente,
        activeTab, setActiveTab, resolvePendiente: f.calculadora.resolvePendiente
    };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'mj_cotizaciones');
        f.u1('page', 'actualMenu', 'manejos');
        f.u1('page', 'title', 'Manejo de Cotizaciones');
        f.calculadora.getCotizaciones();
        f.calculadora.getPendientes();
    }, []);
};
