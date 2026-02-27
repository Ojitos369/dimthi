import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../Hooks/useStates';
import Swal from 'sweetalert2';
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

    // Request Quote Modal
    const [showRequestQuoteModal, setShowRequestQuoteModal] = createState(['catalogo', 'showRequestQuoteModal'], false);
    const [requestQuoteMsg, setRequestQuoteMsg] = createState(['catalogo', 'requestQuoteMsg'], null);

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

    const openRequestQuoteModal = useCallback(() => {
        if (pendingCart.length === 0) return;
        setShowRequestQuoteModal(true);
    }, [pendingCart, setShowRequestQuoteModal]);

    const submitPendingQuotes = useCallback(async (quoteData) => {
        if(pendingCart.length === 0) return;
        
        const data = {
            nombre: quoteData.nombre || 'Asignación Web',
            comentarios: quoteData.comentarios || '',
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
                f.calculadora.getModelos({ catalogo: true });
                resolve();
            });
        });
    }, [pendingCart, f.calculadora, f.general, setPendingCart, setShowRequestQuoteModal]);

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
                        
                        f.calculadora.getModelos({ catalogo: true });
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
        modelos: filteredModelos,
        searchTerm, setSearchTerm,
        selectedModeloId, modeloActual,
        selectModelo, closeDetail,
        pendingCart, addToPendingCart, removeFromPendingCart, updatePendingCartQuantity, 
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
