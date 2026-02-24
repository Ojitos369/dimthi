from fastapi import APIRouter, Request
from .api import GetMaquinas, SaveMaquina, DeleteMaquina

router = APIRouter()


@router.get("/get_maquinas/")
async def get_maquinas(request: Request):
    r = await GetMaquinas(request=request).run()
    return r


@router.post("/save_maquina")
async def save_maquina(request: Request):
    r = await SaveMaquina(request=request).run()
    return r


@router.delete("/delete_maquina")
async def delete_maquina(request: Request):
    r = await DeleteMaquina(request=request).run()
    return r

