import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../Hooks/useStates';
import style from './styles/index.module.scss';

export const localStates = () => {
    const { s, f } = useStates();

    const modelos = useMemo(() => s.calculadora?.modelos || [], [s.calculadora?.modelos]);
    const logged = useMemo(() => s.auth?.logged, [s.auth?.logged]);
    
    const [searchTerm, setSearchTerm] = createState(['catalogo', 'searchTerm'], '');
    const [selectedModeloId, setSelectedModeloId] = createState(['catalogo', 'selectedModeloId'], null);
    const modeloActual = useMemo(() => s.calculadora?.modeloActual || null, [s.calculadora?.modeloActual]);
    
    // Add Modelo Modal
    const [showAddModal, setShowAddModal] = createState(['catalogo', 'showAddModal'], false);
    const [addModeloMsg, setAddModeloMsg] = createState(['catalogo', 'addModeloMsg'], null);
    
    // Cart for pending quotes
    const [pendingCart, setPendingCart] = createState(['catalogo', 'pendingCart'], []);

    const filteredModelos = useMemo(() => {
        // En backend ya se filtró por código si se escribió
        // Si no, acá seguimos filtrando por nombre/desc normal a los publicos.
        if (!searchTerm.trim()) return modelos;
        const term = searchTerm.trim().toLowerCase();
        return modelos.filter(m =>
            m.nombre?.toLowerCase().includes(term) ||
            m.descripcion?.toLowerCase().includes(term) ||
            m.id?.toLowerCase().includes(term)
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

    const addToPendingCart = useCallback((modelo, event) => {
        if(event) event.stopPropagation();
        setPendingCart(prev => {
            if(prev.find(m => m.id === modelo.id)) return prev;
            return [...prev, modelo];
        });
        f.general?.notificacion?.({ title: 'Agregado', message: 'Modelo agregado a la lista de cotización', mode: 'info' });
    }, [setPendingCart, f.general]);

    const removeFromPendingCart = useCallback((id) => {
        setPendingCart(prev => prev.filter(m => m.id !== id));
    }, [setPendingCart]);

    const submitPendingQuotes = useCallback(() => {
        if(pendingCart.length === 0) return;
        
        const data = {
            nombre: 'Asignación Web',
            comentarios: '',
            modelos_ids: pendingCart.map(m => ({ id: m.id, cantidad: 1 }))
        };
        
        f.calculadora.savePendiente(data, () => {
            f.general?.notificacion?.({ title: 'Solicitud Enviada', message: 'Tus modelos han sido enviados para cotizar', mode: 'success' });
            setPendingCart([]);
        });
    }, [pendingCart, f.calculadora, f.general, setPendingCart]);

    const addModeloHandler = useCallback(async ({ nombre, link }) => {
        setAddModeloMsg(null);
        if (!nombre.trim()) {
            setAddModeloMsg({ text: 'El nombre es requerido', type: 'error' });
            return;
        }

        const proceedToSave = () => {
            f.calculadora.saveModelo({ nombre, link }, (res) => {
                if (res.id) {
                    if (link) {
                        setAddModeloMsg({ text: 'Modelo agregado al catálogo como público y pendiente de cotizar.', type: 'success' });
                    } else {
                        setAddModeloMsg({ text: `Modelo agregado. Su código privado es: ${res.id.split('-')[0]}`, type: 'success' });
                    }
                    setTimeout(() => {
                        setShowAddModal(false);
                        setAddModeloMsg(null);
                        f.calculadora.getModelos();
                    }, 4000);
                }
            });
        };

        if (link && link.trim() !== '') {
            f.calculadora.checkModelLinkExists(link, (res) => {
                if (res.exists) {
                    setAddModeloMsg({ text: `Este link ya existe en el modelo: ${res.nombre}`, type: 'error' });
                } else {
                    proceedToSave();
                }
            });
        } else {
            proceedToSave();
        }

    }, [f.calculadora, setAddModeloMsg, setShowAddModal]);

    return {
        style, logged,
        modelos: filteredModelos,
        searchTerm, setSearchTerm,
        selectedModeloId, modeloActual,
        selectModelo, closeDetail,
        pendingCart, addToPendingCart, removeFromPendingCart, submitPendingQuotes,
        showAddModal, setShowAddModal, addModeloHandler, addModeloMsg
    };
};

export const localEffects = () => {
    const { s, f } = useStates();

    useEffect(() => {
        f.u1('page', 'actual', 'catalogo');
        f.u1('page', 'actualMenu', 'catalogo');
        f.u1('page', 'title', 'Catálogo de Modelos');
        f.calculadora.getModelos({ catalogo: true });
    }, []);

    // Efecto de búsqueda
    useEffect(() => {
        const searchTerm = s.catalogo?.searchTerm || '';
        const timeoutId = setTimeout(() => {
            if (f.calculadora) {
                f.calculadora.getModelos({ catalogo: true, codigo: searchTerm.trim() });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [s.catalogo?.searchTerm]);
};
