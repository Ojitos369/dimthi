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
        setPendingCart(prev => {
            if(prev.find(m => m.id === modelo.id)) return prev;
            return [...prev, modelo];
        });
        f.general?.notificacion?.({ title: 'Agregado', message: 'Modelo agregado a la lista de cotización', mode: 'info' });
    }, [setPendingCart, f.general]);

    const removeFromPendingCart = useCallback((id) => {
        setPendingCart(prev => prev.filter(m => m.id !== id));
    }, [setPendingCart]);

    const updatePendingCartQuantity = useCallback((id, cantidad) => {
        setPendingCart(prev => prev.map(m => m.id === id ? { ...m, cantidad: Math.max(1, cantidad) } : m));
    }, [setPendingCart]);

    const openRequestQuoteModal = useCallback(() => {
        if (pendingCart.length === 0) return;
        // Inicializar cantidad si no existe
        setPendingCart(prev => prev.map(m => ({ ...m, cantidad: m.cantidad || 1 })));
        setShowRequestQuoteModal(true);
    }, [pendingCart, setShowRequestQuoteModal, setPendingCart]);

    const submitPendingQuotes = useCallback((quoteData) => {
        if(pendingCart.length === 0) return;
        
        const data = {
            nombre: quoteData.nombre || 'Asignación Web',
            comentarios: quoteData.comentarios || '',
            modelos_ids: pendingCart.map(m => ({ id: m.id, cantidad: m.cantidad || 1 }))
        };
        
        f.calculadora.savePendiente(data, () => {
            f.general?.notificacion?.({ title: 'Solicitud Enviada', message: 'Tus modelos han sido enviados para cotizar', mode: 'success' });
            setPendingCart([]);
            setShowRequestQuoteModal(false);
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
            return;
        }

        const proceedToSave = () => {
            f.calculadora.saveModelo({ nombre, link, descripcion }, async (res) => {
                if (res.id) {
                    // Si hay archivos locales, subirlos
                    if (archivos.length > 0) {
                        setAddModeloMsg({ text: 'Guardando modelo y subiendo archivos...', type: 'info' });
                        for (const file of archivos) {
                            await new Promise(resolve => {
                                f.calculadora.saveModeloArchivo({ modelo_id: res.id, file }, resolve);
                            });
                        }
                    }

                    // Si hay imágenes extraídas por URL, descargarlas en el servidor
                    if (imagenesExtraidas.length > 0) {
                        setAddModeloMsg({ text: 'Descargando imágenes extraídas...', type: 'info' });
                        for (const imgUrl of imagenesExtraidas) {
                            await new Promise(resolve => {
                                f.calculadora.downloadModeloArchivoFromUrl(res.id, imgUrl, resolve);
                            });
                        }
                    }

                    if (link) {
                        setAddModeloMsg({ text: 'Modelo agregado al catálogo como público y pendiente de cotizar.', type: 'success' });
                    } else {
                        setAddModeloMsg({ text: `Modelo agregado. Su código privado es: ${res.id.split('-')[0]}`, type: 'success' });
                    }
                    setTimeout(() => {
                        setShowAddModal(false);
                        setAddModeloMsg(null);
                        f.calculadora.getModelos({ catalogo: true });
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
