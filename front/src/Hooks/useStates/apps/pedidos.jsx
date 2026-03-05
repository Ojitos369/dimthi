export const pedidos = props => {
    const { miAxios, u1, u2 } = props;

    const getPedidos = (params = {}, callback) => {
        miAxios.get('apps/pedidos/get_pedidos', { params })
        .then(res => {
            if (callback) callback(res.data.data);
            else u1("pedidos", "lista", res.data.data);
        })
        .catch(err => { console.log(err); });
    };

    const generarPedido = (data, callback) => {
        miAxios.post('apps/pedidos/generar_pedido', data)
        .then(res => {
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    };

    const addPedidoComentario = (formData, callback, errorCallback) => {
        miAxios.post('apps/pedidos/add_pedido_comentario', formData)
        .then(res => {
            if (callback) callback(res.data);
        })
        .catch(err => { 
            console.log(err); 
            if (errorCallback) errorCallback(err);
        });
    };

    const updatePedidoStatus = (data, callback) => {
        miAxios.post('apps/pedidos/update_pedido_status', data)
        .then(res => {
            if (callback) callback(res.data);
        })
        .catch(err => { console.log(err); });
    };

    return {
        getPedidos, generarPedido, addPedidoComentario, updatePedidoStatus
    }
}
