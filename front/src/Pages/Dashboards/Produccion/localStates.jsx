import { useMemo, useEffect } from 'react';
import { useStates } from '../../../Hooks/useStates';

export const localStates = () => {
    const { s, f } = useStates();
    const compras = useMemo(() => s.calculadora?.compras || [], [s.calculadora?.compras]);
    const maquinas = useMemo(() => s.calculadora?.maquinas || [], [s.calculadora?.maquinas]);

    const stats = useMemo(() => {
        let totalPrintingHours = 0;
        let machineUsage = {};

        compras.forEach(c => {
            const h = parseFloat(c.tiempo_horas || 0);
            const m = parseFloat(c.tiempo_minutos || 0);
            const qty = parseInt(c.cantidad || 1);
            const totalH = (h + (m / 60)) * qty;
            totalPrintingHours += totalH;
        });

        const fdmCount = maquinas.filter(m => m.tipo === 'fdm').length;
        const slaCount = maquinas.filter(m => m.tipo === 'sla').length;

        return {
            totalPrintingHours,
            fdmCount,
            slaCount,
            totalMachines: maquinas.length
        };
    }, [compras, maquinas]);

    return { stats, maquinas };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'db_produccion');
        f.u1('page', 'actualMenu', 'dashboards');
        f.u1('page', 'title', 'Eficiencia de Producción');
        f.calculadora.getCompras();
        f.calculadora.getMaquinas();
    }, []);
};
