import { useMemo, useEffect, useCallback } from 'react';
import { useStates, createState } from '../../Hooks/useStates';
import style from './styles/index.module.scss';

// --- CONSTANTES ---
const constants = {
    labor: { rate_mxn_hr: 80.00 },
    general: { failure_rate: 0.10 },
    fdm: { power_kw: 0.15, dep_hr: 1.20, cons_hr: 0.30 },
    resin: { power_kw: 0.045, dep_hr: 1.00, lcd_hr: 0.40, fep_hr: 1.50, ipa_per_print: 0.02 },
};

export const localStates = () => {
    const { s, f } = useStates();

    const filamentos = useMemo(() => s.calculadora?.filamentos || [], [s.calculadora?.filamentos]);
    const resinas = useMemo(() => s.calculadora?.resinas || [], [s.calculadora?.resinas]);
    const perfiles = useMemo(() => s.calculadora?.perfiles || [], [s.calculadora?.perfiles]);
    const modelos = useMemo(() => s.calculadora?.modelos || [], [s.calculadora?.modelos]);

    // --- createState ---
    const [timeHours, setTimeHours] = createState(['calc', 'timeHours'], 1);
    const [timeMinutes, setTimeMinutes] = createState(['calc', 'timeMinutes'], 10);
    const [energyTariff, setEnergyTariff] = createState(['calc', 'energyTariff'], 4.50);
    const [fdmWeightG, setFdmWeightG] = createState(['calc', 'fdmWeightG'], 20);
    const [resinVolMl, setResinVolMl] = createState(['calc', 'resinVolMl'], 30);
    const [laborMinutes, setLaborMinutes] = createState(['calc', 'laborMinutes'], 15);
    const [filamentCost, setFilamentCost] = createState(['calc', 'filamentCost'], 300);
    const [resinCost, setResinCost] = createState(['calc', 'resinCost'], 500);
    const [ipaCost, setIpaCost] = createState(['calc', 'ipaCost'], 100);
    const [marginPercent, setMarginPercent] = createState(['calc', 'marginPercent'], 20);

    // Perfil
    const [activeProfileId, setActiveProfileId] = createState(['calc', 'activeProfileId'], null);
    const [profileDirty, setProfileDirty] = createState(['calc', 'profileDirty'], false);
    const [newProfileName, setNewProfileName] = createState(['calc', 'newProfileName'], '');

    // Material type & detail
    const [materialType, setMaterialType] = createState(['calc', 'materialType'], 'filamento');
    const [showDetail, setShowDetail] = createState(['calc', 'showDetail'], false);

    // Filamento/resina seleccionado del catálogo
    const [selectedFilamentoId, setSelectedFilamentoId] = createState(['calc', 'selectedFilamentoId'], '');
    const [selectedResinaId, setSelectedResinaId] = createState(['calc', 'selectedResinaId'], '');

    // Modelo para ligar
    const [selectedModeloId, setSelectedModeloId] = createState(['calc', 'selectedModeloId'], '');
    const [newModeloName, setNewModeloName] = createState(['calc', 'newModeloName'], '');
    const [showNewModelo, setShowNewModelo] = createState(['calc', 'showNewModelo'], false);

    const toggleMaterialType = useCallback(() => {
        setMaterialType(materialType === 'filamento' ? 'resina' : 'filamento');
    }, [materialType]);

    const toggleDetail = useCallback(() => {
        setShowDetail(!showDetail);
    }, [showDetail]);

    // Mark profile dirty when values change
    const markDirty = useCallback(() => {
        if (activeProfileId) setProfileDirty(true);
    }, [activeProfileId]);

    // Select a filamento from catalog → update cost
    const handleSelectFilamento = useCallback((id) => {
        setSelectedFilamentoId(id);
        const fil = filamentos.find(f => f.id === id);
        if (fil) {
            setFilamentCost(parseFloat(fil.precio_kg) || 0);
            markDirty();
        }
    }, [filamentos, markDirty]);

    const handleSelectResina = useCallback((id) => {
        setSelectedResinaId(id);
        const res = resinas.find(r => r.id === id);
        if (res) {
            setResinCost(parseFloat(res.precio_kg) || 0);
            markDirty();
        }
    }, [resinas, markDirty]);

    // ---- Cálculos ----
    const results = useMemo(() => {
        const totalHours = timeHours + (timeMinutes / 60);
        const labor = (laborMinutes / 60) * constants.labor.rate_mxn_hr;
        const fdmMat = (fdmWeightG / 1000) * filamentCost;
        const fdmEnergy = totalHours * constants.fdm.power_kw * energyTariff;
        const fdmMach = totalHours * (constants.fdm.dep_hr + constants.fdm.cons_hr);
        const fdmTotalCost = (fdmMat + fdmEnergy + fdmMach + labor) * (1 + constants.general.failure_rate);
        const fdmPrice = fdmTotalCost / (1 - (marginPercent / 100));
        const fdmProfit = fdmPrice - fdmTotalCost;
        const resinMat = ((resinVolMl / 1000) * resinCost) + (constants.resin.ipa_per_print * ipaCost);
        const resinEnergy = totalHours * constants.resin.power_kw * energyTariff;
        const resinMach = totalHours * (constants.resin.dep_hr + constants.resin.lcd_hr + constants.resin.fep_hr);
        const resinTotalCost = (resinMat + resinEnergy + resinMach + labor) * (1 + constants.general.failure_rate);
        const resinPrice = resinTotalCost / (1 - (marginPercent / 100));
        const resinProfit = resinPrice - resinTotalCost;
        return {
            fdm: { price: fdmPrice, profit: fdmProfit, mat: fdmMat, energy: fdmEnergy, mach: fdmMach },
            resin: { price: resinPrice, profit: resinProfit, mat: resinMat, energy: resinEnergy, mach: resinMach },
            labor,
            chartData: { fdm: [fdmMat, fdmEnergy, fdmMach, labor, fdmProfit], resin: [resinMat, resinEnergy, resinMach, labor, resinProfit] },
        };
    }, [timeHours, timeMinutes, energyTariff, fdmWeightG, resinVolMl, laborMinutes, filamentCost, resinCost, ipaCost, marginPercent]);

    // ---- Seleccionar perfil ----
    const selectProfile = useCallback((perfil) => {
        setActiveProfileId(perfil.id);
        setProfileDirty(false);
        if (perfil.filamento_precio_kg) setFilamentCost(parseFloat(perfil.filamento_precio_kg));
        if (perfil.resina_precio_kg) setResinCost(parseFloat(perfil.resina_precio_kg));
        if (perfil.margen_utilidad) setMarginPercent(parseFloat(perfil.margen_utilidad));
        if (perfil.luz_kw) setEnergyTariff(parseFloat(perfil.luz_kw));
        if (perfil.mano_obra) setLaborMinutes(parseFloat(perfil.mano_obra));
        if (perfil.filamento_id) setSelectedFilamentoId(perfil.filamento_id);
        if (perfil.resina_id) setSelectedResinaId(perfil.resina_id);
    }, []);

    // ---- Guardar como nuevo perfil ----
    const handleSaveAsNew = useCallback(() => {
        if (!newProfileName.trim()) return;
        const data = {
            nombre: newProfileName,
            filamento_id: selectedFilamentoId || null,
            resina_id: selectedResinaId || null,
            luz_kw: energyTariff,
            mano_obra: laborMinutes,
            margen_utilidad: marginPercent,
        };
        f.calculadora.savePerfil(data, (res) => {
            setNewProfileName('');
            setProfileDirty(false);
            if (res.id) setActiveProfileId(res.id);
        });
    }, [newProfileName, selectedFilamentoId, selectedResinaId, energyTariff, laborMinutes, marginPercent, f.calculadora]);

    // ---- Editar perfil actual ----
    const handleEditCurrent = useCallback(() => {
        if (!activeProfileId) return;
        const data = {
            id: activeProfileId,
            nombre: perfiles.find(p => p.id === activeProfileId)?.nombre || 'Perfil',
            filamento_id: selectedFilamentoId || null,
            resina_id: selectedResinaId || null,
            luz_kw: energyTariff,
            mano_obra: laborMinutes,
            margen_utilidad: marginPercent,
        };
        f.calculadora.savePerfil(data, () => setProfileDirty(false));
    }, [activeProfileId, perfiles, selectedFilamentoId, selectedResinaId, energyTariff, laborMinutes, marginPercent, f.calculadora]);

    const handleDeletePerfil = useCallback((id) => {
        f.calculadora.deletePerfil(id);
        if (activeProfileId === id) { setActiveProfileId(null); setProfileDirty(false); }
    }, [f.calculadora, activeProfileId]);

    // ---- Crear nuevo modelo ----
    const handleCreateModelo = useCallback(() => {
        if (!newModeloName.trim()) return;
        f.calculadora.saveModelo({ nombre: newModeloName }, (res) => {
            if (res.id) setSelectedModeloId(res.id);
            setNewModeloName('');
            setShowNewModelo(false);
        });
    }, [newModeloName, f.calculadora]);

    // ---- Inline material creation ----
    const [showNewFilamento, setShowNewFilamento] = createState(['calc', 'showNewFilamento'], false);
    const [newFilNombre, setNewFilNombre] = createState(['calc', 'newFilNombre'], '');
    const [newFilPrecio, setNewFilPrecio] = createState(['calc', 'newFilPrecio'], 300);
    const [showNewResina, setShowNewResina] = createState(['calc', 'showNewResina'], false);
    const [newResNombre, setNewResNombre] = createState(['calc', 'newResNombre'], '');
    const [newResPrecio, setNewResPrecio] = createState(['calc', 'newResPrecio'], 500);

    const handleCreateFilamento = useCallback(() => {
        if (!newFilNombre.trim()) return;
        f.calculadora.saveFilamento({ nombre: newFilNombre, precio_kg: newFilPrecio, peso_kg: 1 }, (res) => {
            if (res.id) { handleSelectFilamento(res.id); }
            setNewFilNombre(''); setNewFilPrecio(300); setShowNewFilamento(false);
        });
    }, [newFilNombre, newFilPrecio, f.calculadora, handleSelectFilamento]);

    const handleCreateResina = useCallback(() => {
        if (!newResNombre.trim()) return;
        f.calculadora.saveResina({ nombre: newResNombre, precio_kg: newResPrecio, peso_kg: 1 }, (res) => {
            if (res.id) { handleSelectResina(res.id); }
            setNewResNombre(''); setNewResPrecio(500); setShowNewResina(false);
        });
    }, [newResNombre, newResPrecio, f.calculadora, handleSelectResina]);

    // ---- Guardar cotización ----
    const handleSaveCotizacion = useCallback(() => {
        const isFilamento = materialType === 'filamento';
        const current = isFilamento ? results.fdm : results.resin;
        const data = {
            modelo_id: selectedModeloId || null,
            perfil_id: activeProfileId || null,
            tipo_material: materialType,
            precio_venta: current.price,
            costo_total: current.price - current.profit,
            utilidad: current.profit,
            tiempo_horas: timeHours,
            tiempo_minutos: timeMinutes,
            peso_g: isFilamento ? fdmWeightG : null,
            volumen_ml: !isFilamento ? resinVolMl : null,
        };
        f.calculadora.saveCotizacion(data, () => {
            f.general?.notificacion?.({ mode: 'success', title: 'Cotización', message: 'Cotización guardada correctamente' });
        });
    }, [materialType, results, selectedModeloId, activeProfileId, timeHours, timeMinutes, fdmWeightG, resinVolMl, f]);

    return {
        style, results, perfiles, filamentos, resinas, modelos,
        timeHours, timeMinutes, energyTariff, fdmWeightG, resinVolMl, laborMinutes,
        filamentCost, resinCost, ipaCost, marginPercent,
        activeProfileId, profileDirty, newProfileName,
        materialType, showDetail,
        selectedFilamentoId, selectedResinaId,
        selectedModeloId, newModeloName, showNewModelo,
        // Inline creation
        showNewFilamento, setShowNewFilamento, newFilNombre, setNewFilNombre, newFilPrecio, setNewFilPrecio,
        showNewResina, setShowNewResina, newResNombre, setNewResNombre, newResPrecio, setNewResPrecio,
        // Setters
        setTimeHours, setTimeMinutes, setEnergyTariff,
        setFdmWeightG, setResinVolMl, setLaborMinutes,
        setFilamentCost, setResinCost, setIpaCost,
        setMarginPercent, setActiveProfileId, setNewProfileName,
        setSelectedModeloId, setNewModeloName, setShowNewModelo,
        // Actions
        toggleMaterialType, toggleDetail, markDirty,
        handleSelectFilamento, handleSelectResina,
        selectProfile, handleSaveAsNew, handleEditCurrent, handleDeletePerfil,
        handleCreateModelo, handleCreateFilamento, handleCreateResina,
        handleSaveCotizacion,
    };
};

export const localEffects = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', 'calculadora');
        f.u1('page', 'actualMenu', 'calculadora');
        f.u1('page', 'title', 'Calculadora 3D');
        f.calculadora.getFilamentos();
        f.calculadora.getResinas();
        f.calculadora.getPerfiles();
        f.calculadora.getModelos();
    }, []);
};

