from fastapi import APIRouter, Request
from .api import GetCotizaciones, SaveCotizacion, DeleteCotizacion

router = APIRouter()


@router.get("/get_cotizaciones/")
async def get_cotizaciones(request: Request):
    r = await GetCotizaciones(request=request).run()
    return r


@router.post("/save_cotizacion")
async def save_cotizacion(request: Request):
    r = await SaveCotizacion(request=request).run()
    return r


@router.delete("/delete_cotizacion")
async def delete_cotizacion(request: Request):
    r = await DeleteCotizacion(request=request).run()
    return r
