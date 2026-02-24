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
    const getModelos = () => {
        miAxios.get('apps/modelos/get_modelos/')
        .then(res => {
            u1("calculadora", "modelos", res.data.data);
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

    return {
        getFilamentos, saveFilamento, deleteFilamento,
        getResinas, saveResina, deleteResina,
        getPerfiles, savePerfil, deletePerfil,
        getCotizaciones, saveCotizacion, deleteCotizacion,
        getModelos, getModelo, saveModelo, deleteModelo,
    }
}
