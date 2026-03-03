from fastapi import APIRouter, Request
from apis.apps.pedidos.api import (
    GenerarPedido,
    GetPedidos,
    AddPedidoComentario,
    UpdatePedidoStatus,
)

router = APIRouter()

@router.post("/generar_pedido")
async def generar_pedido(request: Request):
    return await GenerarPedido(request=request).run()

@router.get("/get_pedidos")
async def get_pedidos(request: Request):
    return await GetPedidos(request=request).run()

@router.post("/add_pedido_comentario")
async def add_comentario(request: Request):
    return await AddPedidoComentario(request=request).run()

@router.post("/update_pedido_status")
async def update_estatus(request: Request):
    return await UpdatePedidoStatus(request=request).run()
