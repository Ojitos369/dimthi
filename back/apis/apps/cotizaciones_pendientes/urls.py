from fastapi import APIRouter, Request
from .api import GetPendientes, SavePendiente, ResolvePendiente, SaveArchivoPendiente, GetPendienteByCodigo

router = APIRouter()

@router.post("/get_pendientes")
async def get_pendientes(request: Request):
    r = await GetPendientes(request=request).run()
    return r

@router.post("/save_pendiente")
async def save_pendiente(request: Request):
    r = await SavePendiente(request=request).run()
    return r

@router.post("/resolve_pendiente")
async def resolve_pendiente(request: Request):
    r = await ResolvePendiente(request=request).run()
    return r

@router.post("/save_archivo_pendiente")
async def save_archivo_pendiente(request: Request):
    r = await SaveArchivoPendiente(request=request).run()
    return r

@router.post("/get_pendiente_by_codigo")
async def get_pendiente_by_codigo(request: Request):
    r = await GetPendienteByCodigo(request=request).run()
    return r
