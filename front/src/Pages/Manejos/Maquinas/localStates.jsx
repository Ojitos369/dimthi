import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../../Hooks/useStates';
import style from '../shared/styles/manejo.module.scss';

export const localStates = () => {
    const { s, f } = useStates();
    const maquinas = useMemo(() => s.calculadora?.maquinas || [], [s.calculadora?.maquinas]);
    const [showForm, setShowForm] = createState(['mjMaquinas', 'showForm'], false);
    const [editId, setEditId] = createState(['mjMaquinas', 'editId'], null);
    const [nombre, setNombre] = createState(['mjMaquinas', 'nombre'], '');
    const [tipo, setTipo] = createState(['mjMaquinas', 'tipo'], 'fdm');
    const [marca, setMarca] = createState(['mjMaquinas', 'marca'], '');
    const [powerKw, setPowerKw] = createState(['mjMaquinas', 'powerKw'], 0);
    const [depHr, setDepHr] = createState(['mjMaquinas', 'depHr'], 0);
    const [consHr, setConsHr] = createState(['mjMaquinas', 'consHr'], 0);
    const [lcdHr, setLcdHr] = createState(['mjMaquinas', 'lcdHr'], 0);
    const [fepHr, setFepHr] = createState(['mjMaquinas', 'fepHr'], 0);
    const [ipaPerPrint, setIpaPerPrint] = createState(['mjMaquinas', 'ipaPerPrint'], 0);

    const openNew = useCallback(() => {
        setEditId(null); setNombre(''); setTipo('fdm'); setMarca('');
        setPowerKw(0); setDepHr(0); setConsHr(0); setLcdHr(0); setFepHr(0); setIpaPerPrint(0);
        setShowForm(true);
    }, []);

    const openEdit = useCallback((item) => {
        setEditId(item.id); setNombre(item.nombre||''); setTipo(item.tipo||'fdm'); setMarca(item.marca||'');
        setPowerKw(parseFloat(item.power_kw)||0); setDepHr(parseFloat(item.dep_hr)||0);
        setConsHr(parseFloat(item.cons_hr)||0); setLcdHr(parseFloat(item.lcd_hr)||0);
        setFepHr(parseFloat(item.fep_hr)||0); setIpaPerPrint(parseFloat(item.ipa_per_print)||0);
        setShowForm(true);
    }, []);

    const cancel = useCallback(() => { setShowForm(false); setEditId(null); }, []);

    const handleSave = useCallback(() => {
        if (!nombre.trim()) return;
        const data = { nombre, tipo, marca, power_kw: powerKw, dep_hr: depHr, cons_hr: consHr, lcd_hr: lcdHr, fep_hr: fepHr, ipa_per_print: ipaPerPrint };
        if (editId) data.id = editId;
        f.calculadora.saveMaquina(data, () => cancel());
    }, [nombre, tipo, marca, powerKw, depHr, consHr, lcdHr, fepHr, ipaPerPrint, editId, f.calculadora, cancel]);

    const handleDelete = useCallback((id) => f.calculadora.deleteMaquina(id), [f.calculadora]);

    return {
        style, maquinas, showForm, editId,
        nombre, setNombre, tipo, setTipo, marca, setMarca,
        powerKw, setPowerKw, depHr, setDepHr, consHr, setConsHr,
        lcdHr, setLcdHr, fepHr, setFepHr, ipaPerPrint, setIpaPerPrint,
        openNew, openEdit, cancel, handleSave, handleDelete,
    };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'mj_maquinas');
        f.u1('page', 'actualMenu', 'manejos');
        f.u1('page', 'title', 'Manejo de Impresoras');
        f.calculadora.getMaquinas();
    }, []);
};
