import { useMemo, useEffect, useState } from 'react';
import { useStates } from '../../../Hooks/useStates';

export const localStates = () => {
    const { s, f } = useStates();
    const compras = useMemo(() => s.calculadora?.compras || [], [s.calculadora?.compras]);
    const cotizaciones = useMemo(() => s.calculadora?.cotizaciones || [], [s.calculadora?.cotizaciones]);

    const [filterUser, setFilterUser] = useState('');
    const [filterDateStart, setFilterDateStart] = useState('');
    const [filterDateEnd, setFilterDateEnd] = useState('');

    const processedSales = useMemo(() => {
        let filtered = compras.map(c => {
            const unitPrice = parseFloat(c.cotizacion_precio_final || 0);
            const unitCost = parseFloat(c.cotizacion_costo_total || 0);
            const cantidad = parseInt(c.cantidad || 1);
            return {
                ...c,
                total_sale: unitPrice * cantidad,
                total_cost: unitCost * cantidad,
                total_profit: (unitPrice - unitCost) * cantidad
            };
        });

        if (filterUser) {
            filtered = filtered.filter(s => s.usuario?.toLowerCase().includes(filterUser.toLowerCase()));
        }
        if (filterDateStart) {
            filtered = filtered.filter(s => new Date(s.created_at) >= new Date(filterDateStart));
        }
        if (filterDateEnd) {
            const end = new Date(filterDateEnd);
            end.setHours(23, 59, 59);
            filtered = filtered.filter(s => new Date(s.created_at) <= end);
        }

        return filtered;
    }, [compras, filterUser, filterDateStart, filterDateEnd]);

    const metrics = useMemo(() => {
        const totalSales = processedSales.reduce((acc, curr) => acc + curr.total_sale, 0);
        const totalCosts = processedSales.reduce((acc, curr) => acc + curr.total_cost, 0);
        const totalProfit = processedSales.reduce((acc, curr) => acc + curr.total_profit, 0);
        const totalUnits = processedSales.reduce((acc, curr) => acc + curr.cantidad, 0);
        
        return { totalSales, totalCosts, totalProfit, totalUnits };
    }, [processedSales]);

    const uniqueUsers = useMemo(() => {
        const users = compras.map(c => c.usuario).filter(Boolean);
        return [...new Set(users)];
    }, [compras]);

    return {
        processedSales, metrics, uniqueUsers,
        filterUser, setFilterUser,
        filterDateStart, setFilterDateStart,
        filterDateEnd, setFilterDateEnd
    };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'db_ventas');
        f.u1('page', 'actualMenu', 'dashboards');
        f.u1('page', 'title', 'Dashboard de Ventas y Utilidades');
        f.calculadora.getCompras();
        f.calculadora.getCotizaciones();
    }, []);
};
