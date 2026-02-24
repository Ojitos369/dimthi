from fastapi import APIRouter, Request
from .api import GetPerfiles, SavePerfil, DeletePerfil

router = APIRouter()


@router.get("/get_perfiles/")
async def get_perfiles(request: Request):
    r = await GetPerfiles(request=request).run()
    return r


@router.post("/save_perfil")
async def save_perfil(request: Request):
    r = await SavePerfil(request=request).run()
    return r


@router.delete("/delete_perfil")
async def delete_perfil(request: Request):
    r = await DeletePerfil(request=request).run()
    return r
