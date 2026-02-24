import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../Hooks/useStates';
import style from './styles/index.module.scss';

export const localStates = () => {
    const { s, f } = useStates();

    const modelos = useMemo(() => s.calculadora?.modelos || [], [s.calculadora?.modelos]);
    const [showForm, setShowForm] = createState(['modelos', 'showForm'], false);
    const [editId, setEditId] = createState(['modelos', 'editId'], null);
    const [formNombre, setFormNombre] = createState(['modelos', 'formNombre'], '');
    const [formDescripcion, setFormDescripcion] = createState(['modelos', 'formDescripcion'], '');

    const openNewForm = useCallback(() => {
        setEditId(null);
        setFormNombre('');
        setFormDescripcion('');
        setShowForm(true);
    }, []);

    const openEditForm = useCallback((modelo) => {
        setEditId(modelo.id);
        setFormNombre(modelo.nombre || '');
        setFormDescripcion(modelo.descripcion || '');
        setShowForm(true);
    }, []);

    const cancelForm = useCallback(() => {
        setShowForm(false);
        setEditId(null);
        setFormNombre('');
        setFormDescripcion('');
    }, []);

    const handleSave = useCallback(() => {
        if (!formNombre.trim()) return;
        const data = {
            nombre: formNombre,
            descripcion: formDescripcion,
        };
        if (editId) data.id = editId;

        f.calculadora.saveModelo(data, () => {
            cancelForm();
        });
    }, [formNombre, formDescripcion, editId, f.calculadora, cancelForm]);

    const handleDelete = useCallback((id) => {
        f.calculadora.deleteModelo(id);
    }, [f.calculadora]);

    return {
        style, modelos,
        showForm, editId,
        formNombre, setFormNombre,
        formDescripcion, setFormDescripcion,
        openNewForm, openEditForm, cancelForm,
        handleSave, handleDelete,
    };
};

export const localEffects = () => {
    const { f } = useStates();

    useEffect(() => {
        f.u1('page', 'actual', 'modelos');
        f.u1('page', 'actualMenu', 'modelos');
        f.u1('page', 'title', 'Gestión de Modelos');
        f.calculadora.getModelos();
    }, []);
};
