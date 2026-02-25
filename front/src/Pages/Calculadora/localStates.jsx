import { useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useStates, createState } from '../../Hooks/useStates';
import style from './styles/index.module.scss';

// --- CONSTANTES (fallback si no hay maquina seleccionada) ---
const defaults = {
    labor: { rate_mxn_hr: 80.00 },
    general: { failure_rate: 0.10 },
    fdm: { power_kw: 0.15, dep_hr: 1.20, cons_hr: 0.30 },
    resin: { power_kw: 0.045, dep_hr: 1.00, lcd_hr: 0.40, fep_hr: 1.50, ipa_per_print: 0.02 },
};

export const localStates = () => {
    const { s, f } = useStates();

    const materialTypeLocal = s.calculadora?.materialType || 'filamento';
    const filamentos = useMemo(() => s.calculadora?.filamentos || [], [s.calculadora?.filamentos]);
    const resinas = useMemo(() => s.calculadora?.resinas || [], [s.calculadora?.resinas]);
    const modelos = useMemo(() => s.calculadora?.modelos || [], [s.calculadora?.modelos]);
    const maquinas = useMemo(() => s.calculadora?.maquinas || [], [s.calculadora?.maquinas]);

    // Maquina seleccionada
    const [selectedMaquinaId, setSelectedMaquinaId] = createState(['calc', 'selectedMaquinaId'], '');
    const selectedMaquina = useMemo(() => maquinas.find(m => m.id === selectedMaquinaId) || null, [maquinas, selectedMaquinaId]);
    const maquinaName = useMemo(() => selectedMaquina?.nombre || (null), [selectedMaquina]);

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
    const logged = useMemo(() => s.auth?.logged, [s.auth?.logged]);

    useEffect(() => {
        if (s.page?.actual === 'calculadora_detallada') {
            setShowDetail(true);
        }
    }, [s.page?.actual]);

    const perfiles = useMemo(() => {
        const allPerfiles = s.calculadora?.perfiles || [];
        return allPerfiles.filter(p => {
            if (materialType === 'filamento') {
                return !!p.filamento_id;
            } else if (materialType === 'resina') {
                return !!p.resina_id;
            }
            return false;
        });
    }, [s.calculadora?.perfiles, materialType]);

    // Filamento/resina seleccionado del catálogo
    const [selectedFilamentoId, setSelectedFilamentoId] = createState(['calc', 'selectedFilamentoId'], '');
    const [selectedResinaId, setSelectedResinaId] = createState(['calc', 'selectedResinaId'], '');

    // Modelos para ligar
    const [selectedModelos, setSelectedModelos] = createState(['calc', 'selectedModelos'], []);
    const [comentarios, setComentarios] = createState(['calc', 'comentarios'], '');
    const [nombreCotizacion, setNombreCotizacion] = createState(['calc', 'nombreCotizacion'], '');
    const [precioFinal, setPrecioFinal] = createState(['calc', 'precioFinal'], 0);
    const [newModeloName, setNewModeloName] = createState(['calc', 'newModeloName'], '');
    const [showNewModelo, setShowNewModelo] = createState(['calc', 'showNewModelo'], false);

    // --- LOCAL STORAGE PERSISTENCE ---
    useEffect(() => {
        const saved = localStorage.getItem('dimt_calculadora_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.timeHours !== undefined) setTimeHours(parsed.timeHours);
                if (parsed.timeMinutes !== undefined) setTimeMinutes(parsed.timeMinutes);
                if (parsed.energyTariff !== undefined) setEnergyTariff(parsed.energyTariff);
                if (parsed.fdmWeightG !== undefined) setFdmWeightG(parsed.fdmWeightG);
                if (parsed.resinVolMl !== undefined) setResinVolMl(parsed.resinVolMl);
                if (parsed.laborMinutes !== undefined) setLaborMinutes(parsed.laborMinutes);
                if (parsed.filamentCost !== undefined) setFilamentCost(parsed.filamentCost);
                if (parsed.resinCost !== undefined) setResinCost(parsed.resinCost);
                if (parsed.ipaCost !== undefined) setIpaCost(parsed.ipaCost);
                if (parsed.marginPercent !== undefined) setMarginPercent(parsed.marginPercent);
                if (parsed.materialType !== undefined) setMaterialType(parsed.materialType);
                if (parsed.selectedMaquinaId !== undefined) setSelectedMaquinaId(parsed.selectedMaquinaId);
                if (parsed.selectedFilamentoId !== undefined) setSelectedFilamentoId(parsed.selectedFilamentoId);
                if (parsed.selectedResinaId !== undefined) setSelectedResinaId(parsed.selectedResinaId);
                if (parsed.activeProfileId !== undefined) setActiveProfileId(parsed.activeProfileId);
            } catch(e) { console.log('Error parsing local storage config'); }
        }
    }, []);

    useEffect(() => {
        const toSave = {
            timeHours, timeMinutes, energyTariff, fdmWeightG, resinVolMl, laborMinutes,
            filamentCost, resinCost, ipaCost, marginPercent, materialType,
            selectedMaquinaId, selectedFilamentoId, selectedResinaId, activeProfileId
        };
        localStorage.setItem('dimt_calculadora_state', JSON.stringify(toSave));
    }, [timeHours, timeMinutes, energyTariff, fdmWeightG, resinVolMl, laborMinutes, filamentCost, resinCost, ipaCost, marginPercent, materialType, selectedMaquinaId, selectedFilamentoId, selectedResinaId, activeProfileId]);

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

    // ---- Cálculos (uses maquina specs if selected, else defaults) ----
    const results = useMemo(() => {
        const totalHours = timeHours + (timeMinutes / 60);
        const labor = (laborMinutes / 60) * defaults.labor.rate_mxn_hr;

        // FDM specs from maquina or defaults
        const fdmSpecs = (selectedMaquina && selectedMaquina.tipo === 'fdm') ? {
            power_kw: parseFloat(selectedMaquina.power_kw) || defaults.fdm.power_kw,
            dep_hr: parseFloat(selectedMaquina.dep_hr) || defaults.fdm.dep_hr,
            cons_hr: parseFloat(selectedMaquina.cons_hr) || defaults.fdm.cons_hr,
        } : defaults.fdm;

        // SLA specs from maquina or defaults
        const slaSpecs = (selectedMaquina && selectedMaquina.tipo === 'sla') ? {
            power_kw: parseFloat(selectedMaquina.power_kw) || defaults.resin.power_kw,
            dep_hr: parseFloat(selectedMaquina.dep_hr) || defaults.resin.dep_hr,
            lcd_hr: parseFloat(selectedMaquina.lcd_hr) || defaults.resin.lcd_hr,
            fep_hr: parseFloat(selectedMaquina.fep_hr) || defaults.resin.fep_hr,
            ipa_per_print: parseFloat(selectedMaquina.ipa_per_print) || defaults.resin.ipa_per_print,
        } : defaults.resin;

        const fdmMat = (fdmWeightG / 1000) * filamentCost;
        const fdmEnergy = totalHours * fdmSpecs.power_kw * energyTariff;
        const fdmMach = totalHours * (fdmSpecs.dep_hr + fdmSpecs.cons_hr);
        const fdmTotalCost = (fdmMat + fdmEnergy + fdmMach + labor) * (1 + defaults.general.failure_rate);
        const fdmPrice = fdmTotalCost / (1 - (marginPercent / 100));
        const fdmProfit = fdmPrice - fdmTotalCost;

        const resinMat = ((resinVolMl / 1000) * resinCost) + (slaSpecs.ipa_per_print * ipaCost);
        const resinEnergy = totalHours * slaSpecs.power_kw * energyTariff;
        const resinMach = totalHours * (slaSpecs.dep_hr + slaSpecs.lcd_hr + slaSpecs.fep_hr);
        const resinTotalCost = (resinMat + resinEnergy + resinMach + labor) * (1 + defaults.general.failure_rate);
        const resinPrice = resinTotalCost / (1 - (marginPercent / 100));
        const resinProfit = resinPrice - resinTotalCost;

        return {
            fdm: { price: fdmPrice, profit: fdmProfit, mat: fdmMat, energy: fdmEnergy, mach: fdmMach },
            resin: { price: resinPrice, profit: resinProfit, mat: resinMat, energy: resinEnergy, mach: resinMach },
            labor,
            chartData: { fdm: [fdmMat, fdmEnergy, fdmMach, labor, fdmProfit], resin: [resinMat, resinEnergy, resinMach, labor, resinProfit] },
        };
    }, [timeHours, timeMinutes, energyTariff, fdmWeightG, resinVolMl, laborMinutes, filamentCost, resinCost, ipaCost, marginPercent, selectedMaquina]);

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
        if (perfil.maquina_id) setSelectedMaquinaId(perfil.maquina_id);
    }, []);

    // ---- Guardar como nuevo perfil ----
    const handleSaveAsNew = useCallback(() => {
        if (!newProfileName.trim()) return;
        const data = {
            nombre: newProfileName,
            tipo_material: materialType,
            filamento_id: selectedFilamentoId || null,
            resina_id: selectedResinaId || null,
            maquina_id: selectedMaquinaId || null,
            luz_kw: energyTariff,
            mano_obra: laborMinutes,
            margen_utilidad: marginPercent,
        };
        f.calculadora.savePerfil(data, (res) => {
            setNewProfileName('');
            setProfileDirty(false);
            if (res.id) setActiveProfileId(res.id);
        });
    }, [newProfileName, selectedFilamentoId, selectedResinaId, selectedMaquinaId, energyTariff, laborMinutes, marginPercent, f.calculadora]);

    // ---- Editar perfil actual ----
    const handleEditCurrent = useCallback(() => {
        if (!activeProfileId) return;
        const data = {
            id: activeProfileId,
            nombre: perfiles.find(p => p.id === activeProfileId)?.nombre || 'Perfil',
            tipo_material: materialType,
            filamento_id: selectedFilamentoId || null,
            resina_id: selectedResinaId || null,
            maquina_id: selectedMaquinaId || null,
            luz_kw: energyTariff,
            mano_obra: laborMinutes,
            margen_utilidad: marginPercent,
        };
        f.calculadora.savePerfil(data, () => setProfileDirty(false));
    }, [activeProfileId, perfiles, selectedFilamentoId, selectedResinaId, selectedMaquinaId, energyTariff, laborMinutes, marginPercent, f.calculadora]);

    const handleDeletePerfil = useCallback((id) => {
        f.calculadora.deletePerfil(id);
        if (activeProfileId === id) { setActiveProfileId(null); setProfileDirty(false); }
    }, [f.calculadora, activeProfileId]);

    // ---- Crear nuevo modelo ----
    const handleCreateModelo = useCallback(() => {
        if (!newModeloName.trim()) return;
        f.calculadora.saveModelo({ nombre: newModeloName }, (res) => {
            if (res.id) setSelectedModelos(prev => Array.from(new Set([...prev, res.id])));
            setNewModeloName('');
            setShowNewModelo(false);
        });
    }, [newModeloName, f.calculadora, setSelectedModelos]);

    // ---- Inline material creation ----
    const [showNewFilamento, setShowNewFilamento] = createState(['calc', 'showNewFilamento'], false);
    const [newFilNombre, setNewFilNombre] = createState(['calc', 'newFilNombre'], '');
    const [newFilColor, setNewFilColor] = createState(['calc', 'newFilColor'], '#7c3aed');
    const [newFilPrecio, setNewFilPrecio] = createState(['calc', 'newFilPrecio'], 300);
    const [showNewResina, setShowNewResina] = createState(['calc', 'showNewResina'], false);
    const [newResNombre, setNewResNombre] = createState(['calc', 'newResNombre'], '');
    const [newResColor, setNewResColor] = createState(['calc', 'newResColor'], '#198754');
    const [newResPrecio, setNewResPrecio] = createState(['calc', 'newResPrecio'], 500);
    const [showNewMaquina, setShowNewMaquina] = createState(['calc', 'showNewMaquina'], false);
    const [newMaqNombre, setNewMaqNombre] = createState(['calc', 'newMaqNombre'], '');

    const handleCreateFilamento = useCallback(() => {
        if (!newFilNombre.trim()) return;
        f.calculadora.saveFilamento({ nombre: newFilNombre, color: newFilColor, precio_kg: newFilPrecio, peso_kg: 1 }, (res) => {
            if (res.id) { handleSelectFilamento(res.id); }
            setNewFilNombre(''); setNewFilColor('#7c3aed'); setNewFilPrecio(300); setShowNewFilamento(false);
        });
    }, [newFilNombre, newFilColor, newFilPrecio, f.calculadora, handleSelectFilamento]);

    const handleCreateResina = useCallback(() => {
        if (!newResNombre.trim()) return;
        f.calculadora.saveResina({ nombre: newResNombre, color: newResColor, precio_kg: newResPrecio, peso_kg: 1 }, (res) => {
            if (res.id) { handleSelectResina(res.id); }
            setNewResNombre(''); setNewResColor('#198754'); setNewResPrecio(500); setShowNewResina(false);
        });
    }, [newResNombre, newResColor, newResPrecio, f.calculadora, handleSelectResina]);

    const handleCreateMaquina = useCallback(() => {
        if (!newMaqNombre.trim()) return;
        const tipoReq = materialType === 'filamento' ? 'fdm' : 'sla';
        f.calculadora.saveMaquina({ nombre: newMaqNombre, tipo: tipoReq, marca: '' }, (res) => {
            if (res.id) { setSelectedMaquinaId(res.id); }
            setNewMaqNombre(''); setShowNewMaquina(false);
        });
    }, [newMaqNombre, materialType, f.calculadora, setSelectedMaquinaId]);

    const handleSaveCotizacion = useCallback(() => {
        const isFilamento = materialType === 'filamento';
        const current = isFilamento ? results.fdm : results.resin;
        const finalP = precioFinal > 0 ? precioFinal : current.price;
        
        const snapshot = {
            materiaL_type: materialType,
            material_id: isFilamento ? selectedFilamentoId : selectedResinaId,
            material_cost: isFilamento ? filamentCost : resinCost,
            machine_id: selectedMaquinaId,
            time_h: timeHours,
            time_m: timeMinutes,
            weight_g: fdmWeightG,
            volume_ml: resinVolMl,
            labor_m: laborMinutes,
            margin_p: marginPercent,
            results: current
        };

        const data = {
            modelos: selectedModelos,
            perfil_id: activeProfileId || null,
            tipo_material: materialType,
            precio_venta: current.price,
            costo_total: current.price - current.profit,
            utilidad: current.profit,
            tiempo_horas: timeHours,
            tiempo_minutos: timeMinutes,
            peso_g: isFilamento ? fdmWeightG : null,
            volumen_ml: !isFilamento ? resinVolMl : null,
            comentarios: comentarios,
            precio_final: finalP,
            nombre: nombreCotizacion,
            snapshot_data: JSON.stringify(snapshot)
        };
        f.calculadora.saveCotizacion(data, () => {
            f.general?.notificacion?.({ mode: 'success', title: 'Cotización', message: 'Cotización guardada correctamente' });
        });
    }, [materialType, results, selectedModelos, activeProfileId, timeHours, timeMinutes, fdmWeightG, resinVolMl, comentarios, precioFinal, f]);

    // Theme logic
    const themeColors = useMemo(() => {
        let baseColorStr = '';
        if (materialType === 'filamento') {
            const fi = filamentos.find(x => x.id === selectedFilamentoId);
            baseColorStr = fi?.color || '#7c3aed';
        } else {
            const re = resinas.find(x => x.id === selectedResinaId);
            baseColorStr = re?.color || '#198754';
        }
        
        const colorsList = baseColorStr.split(',').map(c => c.trim()).filter(c => c.startsWith('#'));
        let solid = materialType === 'filamento' ? '#7c3aed' : '#198754';
        let bg = solid;
        
        if (colorsList.length > 0) {
            solid = colorsList[0];
            bg = solid;
            if (colorsList.length > 1) {
                bg = `linear-gradient(90deg, ${colorsList.join(', ')})`;
            }
        }
        
        const getContrast = (hexcode) => {
            let hex = hexcode.replace('#', '');
            if(hex.length === 3) hex = hex.split('').map(c => c+c).join('');
            const r = parseInt(hex.substr(0, 2), 16) || 0;
            const g = parseInt(hex.substr(2, 2), 16) || 0;
            const b = parseInt(hex.substr(4, 2), 16) || 0;
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? '#111111' : '#ffffff';
        };
        const text = getContrast(solid);

        return { solid, bg, text };
    }, [materialType, selectedFilamentoId, selectedResinaId, filamentos, resinas]);

    useEffect(() => {
        document.documentElement.style.setProperty('--theme-main', themeColors.bg);
        document.documentElement.style.setProperty('--theme-solid', themeColors.solid);
        document.documentElement.style.setProperty('--theme-text', themeColors.text);
    }, [themeColors]);

    const isFilamento = materialType === 'filamento';

    return {
        themeColors, style, results, perfiles, filamentos, resinas, modelos, maquinas,
        timeHours, timeMinutes, energyTariff, fdmWeightG, resinVolMl, laborMinutes,
        filamentCost, resinCost, ipaCost, marginPercent,
        activeProfileId, profileDirty, newProfileName,
        materialType, showDetail, isFilamento, logged,
        selectedModelos, setSelectedModelos, newModeloName, showNewModelo,
        nombreCotizacion, setNombreCotizacion,
        comentarios, precioFinal, setComentarios, setPrecioFinal,
        selectedMaquinaId, setSelectedMaquinaId, selectedMaquina, maquinaName,
        // Inline creation
        showNewFilamento, setShowNewFilamento, newFilNombre, setNewFilNombre, newFilColor, setNewFilColor, newFilPrecio, setNewFilPrecio,
        showNewResina, setShowNewResina, newResNombre, setNewResNombre, newResColor, setNewResColor, newResPrecio, setNewResPrecio,
        showNewMaquina, setShowNewMaquina, newMaqNombre, setNewMaqNombre,
        // Setters
        setTimeHours, setTimeMinutes, setEnergyTariff,
        setFdmWeightG, setResinVolMl, setLaborMinutes,
        setFilamentCost, setResinCost, setIpaCost,
        setMarginPercent, setActiveProfileId, setNewProfileName,
        setNewModeloName, setShowNewModelo,
        // Actions
        toggleMaterialType, toggleDetail, markDirty,
        handleSelectFilamento, handleSelectResina,
        selectProfile, handleSaveAsNew, handleEditCurrent, handleDeletePerfil,
        handleCreateModelo, handleCreateFilamento, handleCreateResina, handleCreateMaquina,
        handleSaveCotizacion,
    };
};

export const localEffects = () => {
    const { f } = useStates();
    const location = useLocation();
    
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const isDetailed = query.get('mode') === 'detailed';
        
        f.u1('page', 'actual', isDetailed ? 'calculadora_detallada' : 'calculadora');
        f.u1('page', 'actualMenu', 'calculadora');
        f.u1('page', 'title', isDetailed ? 'Calculadora Detallada' : 'Calculadora 3D');
        
        f.calculadora.getFilamentos();
        f.calculadora.getResinas();
        f.calculadora.getPerfiles();
        f.calculadora.getModelos();
        f.calculadora.getMaquinas();
    }, [location.search]);
};

