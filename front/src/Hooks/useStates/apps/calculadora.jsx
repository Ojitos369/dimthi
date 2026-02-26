export const calculadora = props => {
    const { miAxios, u1, u2 } = props;

    // ---- FILAMENTOS ----
    const getFilamentos = () => {
        miAxios.get('apps/filamentos/get_filamentos/')
        .then(res => {
            u1("calculadora", "filamentos", res.data.data);
        })
        .catch(err => { console.log(err); });
    }

    const saveFilamento = (data, callback) => {
        miAxios.post('apps/filamentos/save_filamento', data)
        .then(res => {
            getFilamentos();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const deleteFilamento = (id, callback) => {
        miAxios.delete('apps/filamentos/delete_filamento', { params: { id } })
        .then(res => {
            getFilamentos();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    // ---- RESINAS ----
    const getResinas = () => {
        miAxios.get('apps/resinas/get_resinas/')
        .then(res => {
            u1("calculadora", "resinas", res.data.data);
        })
        .catch(err => { console.log(err); });
    }

    const saveResina = (data, callback) => {
        miAxios.post('apps/resinas/save_resina', data)
        .then(res => {
            getResinas();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const deleteResina = (id, callback) => {
        miAxios.delete('apps/resinas/delete_resina', { params: { id } })
        .then(res => {
            getResinas();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    // ---- PERFILES DE COSTOS ----
    const getPerfiles = () => {
        miAxios.get('apps/perfiles_costos/get_perfiles/')
        .then(res => {
            u1("calculadora", "perfiles", res.data.data);
        })
        .catch(err => { console.log(err); });
    }

    const savePerfil = (data, callback) => {
        miAxios.post('apps/perfiles_costos/save_perfil', data)
        .then(res => {
            getPerfiles();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const deletePerfil = (id, callback) => {
        miAxios.delete('apps/perfiles_costos/delete_perfil', { params: { id } })
        .then(res => {
            getPerfiles();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    // ---- COTIZACIONES ----
    const getCotizaciones = () => {
        miAxios.get('apps/cotizaciones/get_cotizaciones/')
        .then(res => {
            u1("calculadora", "cotizaciones", res.data.data);
        })
        .catch(err => { console.log(err); });
    }

    const saveCotizacion = (data, callback) => {
        miAxios.post('apps/cotizaciones/save_cotizacion', data)
        .then(res => {
            getCotizaciones();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const deleteCotizacion = (id, callback) => {
        miAxios.delete('apps/cotizaciones/delete_cotizacion', { params: { id } })
        .then(res => {
            getCotizaciones();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    // ---- MODELOS ----
    const getModelos = (params = {}) => {
        miAxios.get('apps/modelos/get_modelos/', { params })
        .then(res => {
            u1("calculadora", "modelos", res.data.data);
        })
        .catch(err => { console.log(err); });
    }

    const getEstatusModelos = () => {
        miAxios.get('apps/modelos/get_estatus_modelos')
        .then(res => {
            u1("calculadora", "estatusModelos", res.data.data);
        })
        .catch(err => { console.log(err); });
    }

    const getModelo = (id, callback) => {
        miAxios.get('apps/modelos/get_modelo', { params: { id } })
        .then(res => {
            u1("calculadora", "modeloActual", res.data.data);
            if (callback) callback(res.data.data);
        })
        .catch(err => { console.log(err); });
    }

    const saveModelo = (data, callback) => {
        miAxios.post('apps/modelos/save_modelo', data)
        .then(res => {
            getModelos();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const deleteModelo = (id, callback) => {
        miAxios.delete('apps/modelos/delete_modelo', { params: { id } })
        .then(res => {
            getModelos();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const checkModelLinkExists = (link, callback) => {
        miAxios.get('apps/modelos/check_model_link_exists', { params: { link } })
        .then(res => {
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const saveModeloArchivo = (formData, callback) => {
        miAxios.post('apps/modelos/save_modelo_archivo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const deleteModeloArchivo = (id, callback) => {
        miAxios.delete('apps/modelos/delete_modelo_archivo', { params: { id } })
        .then(res => {
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const extractMakerworld = (url, callback) => {
        miAxios.post('apps/modelos/extract_makerworld', { url })
        .then(res => {
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const saveModeloArchivoLink = (modelo_id, url, callback) => {
        miAxios.post('apps/modelos/save_modelo_archivo_link', { modelo_id, url })
        .then(res => {
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const downloadModeloArchivoFromUrl = (modelo_id, url, callback) => {
        miAxios.post('apps/modelos/download_modelo_archivo_from_url', { modelo_id, url })
        .then(res => {
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    // ---- MAQUINAS ----
    const getMaquinas = () => {
        miAxios.get('apps/maquinas/get_maquinas/')
        .then(res => {
            u1("calculadora", "maquinas", res.data.data);
        })
        .catch(err => { console.log(err); });
    }

    const saveMaquina = (data, callback) => {
        miAxios.post('apps/maquinas/save_maquina', data)
        .then(res => {
            getMaquinas();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const deleteMaquina = (id, callback) => {
        miAxios.delete('apps/maquinas/delete_maquina', { params: { id } })
        .then(res => {
            getMaquinas();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const getCompras = () => {
        miAxios.get('apps/compras/get_compras/')
        .then(res => {
            u1("calculadora", "compras", res.data.data);
        })
        .catch(err => { console.log(err); });
    }

    const saveCompra = (data, callback) => {
        miAxios.post('apps/compras/save_compra', data)
        .then(res => {
            getCompras();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const deleteCompra = (id, callback) => {
        miAxios.delete('apps/compras/delete_compra', { params: { id } })
        .then(res => {
            getCompras();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    // ---- COTIZACIONES PENDIENTES ----
    const getPendientes = (estado = 'pendiente') => {
        miAxios.post('apps/cotizaciones_pendientes/get_pendientes', { estado })
        .then(res => {
            u1("calculadora", "pendientes", res.data.data);
        })
        .catch(err => { console.log(err); });
    }

    const savePendiente = (data, callback) => {
        miAxios.post('apps/cotizaciones_pendientes/save_pendiente', data)
        .then(res => {
            getPendientes();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const resolvePendiente = (data, callback) => {
        miAxios.post('apps/cotizaciones_pendientes/resolve_pendiente', data)
        .then(res => {
            getPendientes();
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    const saveArchivoPendiente = (formData, callback) => {
        miAxios.post('apps/cotizaciones_pendientes/save_archivo_pendiente', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    }

    return {
        getFilamentos, saveFilamento, deleteFilamento,
        getResinas, saveResina, deleteResina,
        getPerfiles, savePerfil, deletePerfil,
        getCotizaciones, saveCotizacion, deleteCotizacion,
        getModelos, getModelo, saveModelo, deleteModelo, checkModelLinkExists, getEstatusModelos,
        saveModeloArchivo, deleteModeloArchivo, extractMakerworld, downloadModeloArchivoFromUrl, saveModeloArchivoLink,
        getMaquinas, saveMaquina, deleteMaquina,
        getCompras, saveCompra, deleteCompra,
        getPendientes, savePendiente, resolvePendiente, saveArchivoPendiente,
    }
}

