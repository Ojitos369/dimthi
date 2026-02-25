from .api import GetCompras, SaveCompra, DeleteCompra
from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/get_compras")
async def get_compras(request: Request):
    r = await GetCompras(request=request).run()
    return r

@router.post("/save_compra")
async def save_compra(request: Request):
    r = await SaveCompra(request=request).run()
    return r

@router.delete("/delete_compra")
async def delete_compra(request: Request):
    r = await DeleteCompra(request=request).run()
    return r
