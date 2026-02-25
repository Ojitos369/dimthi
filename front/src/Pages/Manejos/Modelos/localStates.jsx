import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/manejo.module.scss';

export const localStates = () => {
    const { s, f } = useStates();
    const modelos = useMemo(() => s.calculadora?.modelos || [], [s.calculadora?.modelos]);
    // selectedModelo could be fetched if we want to show its files. Since GetModelos returns num_archivos, we'll fetch full det on edit
    
    const [showForm, setShowForm] = createState(['mjModelos', 'showForm'], false);
    const [editId, setEditId] = createState(['mjModelos', 'editId'], null);
    const [nombre, setNombre] = createState(['mjModelos', 'nombre'], '');
    const [descripcion, setDescripcion] = createState(['mjModelos', 'descripcion'], '');
    const [link, setLink] = createState(['mjModelos', 'link'], '');
    
    const [archivos, setArchivos] = createState(['mjModelos', 'archivos'], []);
    const [isExtracting, setIsExtracting] = createState(['mjModelos', 'isExtracting'], false);

    const openNew = useCallback(() => { 
        setEditId(null); setNombre(''); setDescripcion(''); setLink(''); setArchivos([]); setShowForm(true); 
    }, []);

    const openEdit = useCallback((item) => { 
        setEditId(item.id); 
        f.calculadora.getModelo(item.id, (fullData) => {
            setNombre(fullData.nombre || ''); 
            setDescripcion(fullData.descripcion || ''); 
            setLink(fullData.link || ''); 
            setArchivos(fullData.archivos || []);
            setShowForm(true); 
        });
    }, [f.calculadora]);

    const cancel = useCallback(() => { setShowForm(false); setEditId(null); }, []);

    const handleSave = useCallback(() => {
        if (!nombre.trim()) return;
        const data = { nombre, descripcion, link };
        if (editId) data.id = editId;
        f.calculadora.saveModelo(data, () => cancel());
    }, [nombre, descripcion, link, editId, f.calculadora, cancel]);

    const handleDelete = useCallback((id) => f.calculadora.deleteModelo(id), [f.calculadora]);

    const handleExtractMakerworld = useCallback(() => {
        if (!link || !link.includes('makerworld')) {
            f.general.notificacion({ title: 'Atención', message: 'El link no parece ser de Makerworld', mode: 'warning' });
            return;
        }
        setIsExtracting(true);
        f.general.notificacion({ title: 'Extrayendo', message: 'Extrayendo datos de Makerworld...', mode: 'info' });
        
        f.calculadora.extractMakerworld(link, (data) => {
            if (data.nombre) setNombre(data.nombre);
            if (data.descripcion) setDescripcion(data.descripcion);
            
            if (data.imagenes && data.imagenes.length > 0 && editId) {
                let promises = data.imagenes.map(url => {
                    return new Promise((resolve) => {
                        f.calculadora.saveModeloArchivoLink(editId, url, () => resolve());
                    });
                });
                Promise.all(promises).then(() => {
                    f.calculadora.getModelo(editId, (fullData) => {
                        setArchivos(fullData.archivos || []);
                        setIsExtracting(false);
                        f.general.notificacion({ title: 'Éxito', message: 'Modelo e imágenes extraídos', mode: 'success' });
                    });
                });
            } else {
                setIsExtracting(false);
                if (!editId && data.imagenes && data.imagenes.length > 0) {
                    f.general.notificacion({ title: 'Éxito', message: 'Datos extraídos. Guarda para usar Makerworld Imágenes', mode: 'success' });
                } else {
                    f.general.notificacion({ title: 'Éxito', message: 'Datos extraídos sin imágenes nuevas', mode: 'success' });
                }
            }
        });
    }, [link, editId, f.calculadora, f.general, setNombre, setDescripcion]);
    
    const handleFileUpload = useCallback((file) => {
        if (!editId) {
            f.general.notificacion({ title: 'Atención', message: 'Primero guarda el modelo antes de subir archivos.', mode: 'warning' });
            return;
        }
        if(!file) return;
        
        const formData = new FormData();
        formData.append('modelo_id', editId);
        formData.append('file', file);
        
        f.calculadora.saveModeloArchivo(formData, (res) => {
            // refresh
            f.calculadora.getModelo(editId, (fullData) => {
                setArchivos(fullData.archivos || []);
            });
        });
    }, [editId, f.calculadora, f.general]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        handleFileUpload(file);
    }, [handleFileUpload]);

    const handleDeleteArchivo = useCallback((archivo_id) => {
        if (!editId) return;
        f.calculadora.deleteModeloArchivo(archivo_id, (res) => {
            f.calculadora.getModelo(editId, (fullData) => {
                setArchivos(fullData.archivos || []);
            });
        });
    }, [editId, f.calculadora]);

    return { 
        style, modelos, showForm, editId, nombre, setNombre, 
        descripcion, setDescripcion, link, setLink, archivos,
        isExtracting,
        openNew, openEdit, cancel, handleSave, handleDelete,
        handleFileChange, handleFileUpload, handleDeleteArchivo,
        handleExtractMakerworld
    };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'mj_modelos');
        f.u1('page', 'actualMenu', 'manejos');
        f.u1('page', 'title', 'Manejo de Modelos');
        f.calculadora.getModelos();
    }, []);
};
