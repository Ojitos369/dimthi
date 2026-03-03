import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../Hooks/useStates';
import Swal from 'sweetalert2';
import style from './styles/index.module.scss';

export const localStates = () => {
    const { s, f } = useStates();

    const modelos = useMemo(() => s.calculadora?.modelos || [], [s.calculadora?.modelos]);
    const logged = useMemo(() => s.auth?.logged, [s.auth?.logged]);
    
    const [searchTerm, setSearchTerm] = createState(['catalogo', 'searchTerm'], '');
    const [page, setPage] = createState(['catalogo', 'page'], 1);
    const pagination = useMemo(() => s.calculadora?.modelosPagination || null, [s.calculadora?.modelosPagination]);
    
    const [selectedModeloId, setSelectedModeloId] = createState(['catalogo', 'selectedModeloId'], null);
    const modeloActual = useMemo(() => s.calculadora?.modeloActual || null, [s.calculadora?.modeloActual]);
    
    // Add Modelo Modal
    const [showAddModal, setShowAddModal] = createState(['catalogo', 'showAddModal'], false);
    const [addModeloMsg, setAddModeloMsg] = createState(['catalogo', 'addModeloMsg'], null);
    
    // Cart for pending quotes
    const [pendingCart, setPendingCart] = createState(['catalogo', 'pendingCart'], []);

    // Cart for pending orders
    const [pendingOrderCart, setPendingOrderCart] = createState(['catalogo', 'pendingOrderCart'], []);

    // Request Quote Modal
    const [showRequestQuoteModal, setShowRequestQuoteModal] = createState(['catalogo', 'showRequestQuoteModal'], false);
    const [requestQuoteMsg, setRequestQuoteMsg] = createState(['catalogo', 'requestQuoteMsg'], null);

    const setSearchTermAndResetPage = useCallback((term) => {
        setSearchTerm(term);
        setPage(1);
    }, [setSearchTerm, setPage]);

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
        let newCart;
        if(pendingCart.find(m => m.id === modelo.id)) {
            newCart = pendingCart;
        } else {
            newCart = [...pendingCart, { ...modelo, cantidad: 1 }];
        }
        setPendingCart(newCart);
        // Abrir directamente el formulario de cotización
        setShowRequestQuoteModal(true);
    }, [pendingCart, setPendingCart, setShowRequestQuoteModal]);

    const removeFromPendingCart = useCallback((id) => {
        setPendingCart(pendingCart.filter(m => m.id !== id));
    }, [pendingCart, setPendingCart]);

    const updatePendingCartQuantity = useCallback((id, cantidad) => {
        setPendingCart(pendingCart.map(m => m.id === id ? { ...m, cantidad: Math.max(1, cantidad) } : m));
    }, [pendingCart, setPendingCart]);

    const addToPendingOrderCart = useCallback((cotizacion, event) => {
        if(event) event.stopPropagation();
        let newCart;
        if(pendingOrderCart.find(c => c.id === cotizacion.id)) {
            newCart = pendingOrderCart;
        } else {
            // Include model info for UI purposes
            const modelName = modeloActual ? modeloActual.nombre : '';
            newCart = [...pendingOrderCart, { ...cotizacion, modelo_nombre: modelName, cantidad: 1, notas: '' }];
        }
        setPendingOrderCart(newCart);
    }, [pendingOrderCart, setPendingOrderCart, modeloActual]);

    const removeFromPendingOrderCart = useCallback((id) => {
        setPendingOrderCart(pendingOrderCart.filter(c => c.id !== id));
    }, [pendingOrderCart, setPendingOrderCart]);

    const updatePendingOrderQuantity = useCallback((id, cantidad) => {
        setPendingOrderCart(pendingOrderCart.map(c => c.id === id ? { ...c, cantidad: Math.max(1, cantidad) } : c));
    }, [pendingOrderCart, setPendingOrderCart]);

    const updatePendingOrderNotes = useCallback((id, notas) => {
        setPendingOrderCart(pendingOrderCart.map(c => c.id === id ? { ...c, notas } : c));
    }, [pendingOrderCart, setPendingOrderCart]);

    const openRequestQuoteModal = useCallback(() => {
        if (pendingCart.length === 0) return;
        setShowRequestQuoteModal(true);
    }, [pendingCart, setShowRequestQuoteModal]);

    const submitPendingQuotes = useCallback(async (quoteData) => {
        if(pendingCart.length === 0) return;
        
        const data = {
            nombre: quoteData.nombre || 'Asignación Web',
            comentarios: quoteData.comentarios || '',
            material: quoteData.material || 'a revision',
            modelos_ids: pendingCart.map(m => ({ id: m.id, cantidad: m.cantidad || 1 }))
        };
        
        return new Promise((resolve) => {
            f.calculadora.savePendiente(data, async (res) => {
                // Subir archivos adjuntos si hay
                const archivos = quoteData.archivos || [];
                if (archivos.length > 0 && res.id) {
                    for (const file of archivos) {
                        await new Promise(r => {
                            f.calculadora.saveArchivoPendiente({ cotizacion_pdte_id: res.id, file }, r);
                        });
                    }
                }
                
                if (res.codigo) {
                    Swal.fire({
                        title: 'Cotización Solicitada',
                        html: `Tus modelos han sido enviados a cotizar.<br/><br/>Tu Código de Seguimiento es:<br/><b>${res.codigo}</b><br/><br/><i>Por favor guarda este código; lo necesitarás para consultar el estatus.</i>`,
                        icon: 'success'
                    });
                } else {
                    f.general?.notificacion?.({ title: 'Solicitud Enviada', message: 'Tus modelos han sido enviados para cotizar', mode: 'success' });
                }
                setPendingCart([]);
                setShowRequestQuoteModal(false);
                // Refresh data
                f.calculadora.getModelos({ catalogo: !logged, page, limit: 20 });
                resolve();
            });
        });
    }, [pendingCart, f.calculadora, f.general, setPendingCart, setShowRequestQuoteModal]);

    const submitPendingOrder = useCallback(async (clienteNombre, contacto) => {
        if(pendingOrderCart.length === 0) return;

        const items = pendingOrderCart.map(c => ({
            cotizacion_id: c.id,
            cantidad: c.cantidad || 1,
            notas: c.notas || ''
        }));

        const data = {
            cliente_nombre: clienteNombre,
            contacto: contacto,
            cotizaciones: items
        };

        return new Promise((resolve) => {
            f.pedidos.generarPedido(data, (res) => {
                if (res.codigo) {
                    Swal.fire({
                        title: 'Pedido Generado',
                        html: `Tu pedido ha sido procesado exitosamente.<br/><br/>Tu Código de Seguimiento es:<br/><b>${res.codigo}</b><br/><br/><i>Guarda este código para rastrear el progreso de tu orden.</i>`,
                        icon: 'success'
                    });
                } else {
                    f.general?.notificacion?.({ title: 'Pedido Creado', message: 'Tu pedido se generó correctamente', mode: 'success' });
                }
                setPendingOrderCart([]);
                resolve();
            });
        });
    }, [pendingOrderCart, f.pedidos, f.general, setPendingOrderCart]);

    const extractInfoHandler = useCallback((url, callback) => {
        if (!url) return;
        setAddModeloMsg({ text: 'Extrayendo información...', type: 'info' });
        f.calculadora.extractMakerworld(url, (res) => {
            if (res.nombre) {
                setAddModeloMsg({ text: 'Información extraída correctamente.', type: 'success' });
                if (callback) callback(res);
            } else {
                setAddModeloMsg({ text: 'No se pudo extraer información de este link.', type: 'error' });
            }
        });
    }, [f.calculadora, setAddModeloMsg]);

    const addModeloHandler = useCallback(async ({ nombre, link, archivos = [], descripcion = '', imagenesExtraidas = [] }) => {
        setAddModeloMsg(null);
        if (!nombre.trim()) {
            setAddModeloMsg({ text: 'El nombre es requerido', type: 'error' });
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const proceedToSave = () => {
                f.calculadora.saveModelo({ nombre, link, descripcion }, async (res) => {
                    if (res.id) {
                        // Si hay archivos locales, subirlos
                        if (archivos.length > 0) {
                            setAddModeloMsg({ text: 'Guardando modelo y subiendo archivos...', type: 'info' });
                            for (const file of archivos) {
                                await new Promise(r => {
                                    f.calculadora.saveModeloArchivo({ modelo_id: res.id, file }, r);
                                });
                            }
                        }

                        // Si hay imágenes extraídas por URL, solo guardamos la referencia al link
                        if (imagenesExtraidas.length > 0) {
                            setAddModeloMsg({ text: 'Guardando enlaces de imágenes extraídas...', type: 'info' });
                            for (const imgUrl of imagenesExtraidas) {
                                await new Promise(r => {
                                    f.calculadora.saveModeloArchivoLink(res.id, imgUrl, r);
                                });
                            }
                        }

                        if (link) {
                            Swal.fire({
                                title: 'Modelo Agregado',
                                text: 'Modelo agregado al catálogo como público y pendiente de cotizar.',
                                icon: 'success'
                            });
                        } else {
                            Swal.fire({
                                title: 'Modelo Privado Creado',
                                html: `El modelo se ha guardado correctamente.<br/><br/>Código de Seguimiento Privado:<br/><b>${res.codigo}</b><br/><br/><i>Guarda este código para buscar tu modelo en el catálogo.</i>`,
                                icon: 'success'
                            });
                        }
                        
                        f.calculadora.getModelos({ catalogo: !logged, page, limit: 20 });
                        setShowAddModal(false);
                        setAddModeloMsg(null);
                        resolve();
                    } else {
                        resolve();
                    }
                });
            };

            if (link && link.trim() !== '') {
                f.calculadora.checkModelLinkExists(link, (res) => {
                    if (res.exists) {
                        setAddModeloMsg({ text: `Este link ya existe en el modelo: ${res.nombre}`, type: 'error' });
                        resolve();
                    } else {
                        proceedToSave();
                    }
                });
            } else {
                proceedToSave();
            }
        });
    }, [f.calculadora, setAddModeloMsg, setShowAddModal]);

    return {
        style, logged,
        modelos: modelos,
        pagination, setPage,
        searchTerm, setSearchTerm: setSearchTermAndResetPage,
        selectedModeloId, modeloActual,
        selectModelo, closeDetail,
        pendingCart, addToPendingCart, removeFromPendingCart, updatePendingCartQuantity, 
        pendingOrderCart, addToPendingOrderCart, removeFromPendingOrderCart, updatePendingOrderQuantity, updatePendingOrderNotes, setPendingOrderCart, submitPendingOrder,
        submitPendingQuotes, openRequestQuoteModal,
        showAddModal, setShowAddModal, addModeloHandler, addModeloMsg, extractInfoHandler,
        showRequestQuoteModal, setShowRequestQuoteModal, requestQuoteMsg
    };
};

export const localEffects = () => {
    const { s, f } = useStates();

    useEffect(() => {
        f.u1('page', 'actual', 'catalogo');
        f.u1('page', 'actualMenu', 'catalogo');
        f.u1('page', 'title', 'Catálogo de Modelos');
        f.calculadora.getModelos({ catalogo: !s.auth?.logged });
    }, [s.auth?.logged]);

    // Efecto de búsqueda y paginación
    useEffect(() => {
        const searchTerm = (s.catalogo?.searchTerm || '').trim();
        const page = s.catalogo?.page || 1;
        const limit = 20;

        const timeoutId = setTimeout(() => {
            if (f.calculadora) {
                if (searchTerm.toUpperCase().startsWith('MOD-') || searchTerm.toUpperCase().startsWith('COT-')) {
                    f.calculadora.getModelos({ catalogo: !s.auth?.logged, codigo: searchTerm.toUpperCase(), page, limit });
                } else {
                    f.calculadora.getModelos({ catalogo: !s.auth?.logged, nombre: searchTerm, page, limit });
                }
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [s.catalogo?.searchTerm, s.catalogo?.page, s.auth?.logged]);
};
