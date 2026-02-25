import { useMemo, useEffect } from 'react';
import { useStates } from '../../../Hooks/useStates';

export const localStates = () => {
    const { s, f } = useStates();
    const filamentos = useMemo(() => s.calculadora?.filamentos || [], [s.calculadora?.filamentos]);
    const resinas = useMemo(() => s.calculadora?.resinas || [], [s.calculadora?.resinas]);
    const compras = useMemo(() => s.calculadora?.compras || [], [s.calculadora?.compras]);

    const inventoryStats = useMemo(() => {
        const totalFilamentValue = filamentos.reduce((acc, curr) => acc + (parseFloat(curr.precio_kg || 0) * parseFloat(curr.peso_kg || 1)), 0);
        const totalResinValue = resinas.reduce((acc, curr) => acc + (parseFloat(curr.precio_kg || 0) * parseFloat(curr.peso_kg || 1)), 0);
        
        // Calcular consumo aproximado desde las compras
        let totalWeightConsumed = 0;
        let totalVolumeConsumed = 0;

        compras.forEach(c => {
            const qty = parseInt(c.cantidad || 1);
            if (c.peso_g) totalWeightConsumed += (parseFloat(c.peso_g) * qty);
            if (c.volumen_ml) totalVolumeConsumed += (parseFloat(c.volumen_ml) * qty);
        });

        return {
            totalFilamentValue,
            totalResinValue,
            totalInventoryValue: totalFilamentValue + totalResinValue,
            filamentCount: filamentos.length,
            resinCount: resinas.length,
            totalWeightConsumed: totalWeightConsumed / 1000, // kg
            totalVolumeConsumed: totalVolumeConsumed / 1000, // L
        };
    }, [filamentos, resinas, compras]);

    return { inventoryStats, filamentos, resinas };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'db_inventario');
        f.u1('page', 'actualMenu', 'dashboards');
        f.u1('page', 'title', 'Inventario y Stock');
        f.calculadora.getFilamentos();
        f.calculadora.getResinas();
        f.calculadora.getCompras();
    }, []);
};
