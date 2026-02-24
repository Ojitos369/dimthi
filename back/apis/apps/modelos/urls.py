from fastapi import APIRouter, Request
from .api import GetModelos, GetModelo, SaveModelo, DeleteModelo

router = APIRouter()


@router.get("/get_modelos/")
async def get_modelos(request: Request):
    r = await GetModelos(request=request).run()
    return r


@router.get("/get_modelo")
async def get_modelo(request: Request):
    r = await GetModelo(request=request).run()
    return r


@router.post("/save_modelo")
async def save_modelo(request: Request):
    r = await SaveModelo(request=request).run()
    return r


@router.delete("/delete_modelo")
async def delete_modelo(request: Request):
    r = await DeleteModelo(request=request).run()
    return r
