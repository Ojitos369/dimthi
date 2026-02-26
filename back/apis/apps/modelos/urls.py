from fastapi import APIRouter, Request
from .api import GetModelos, GetModelo, SaveModelo, DeleteModelo, SaveModeloArchivo, DeleteModeloArchivo, ExtractMakerworld, DownloadModeloArchivoFromUrl, SaveModeloArchivoLink, CheckModelLinkExists, GetEstatusModelos

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


@router.post("/save_modelo_archivo")
async def save_modelo_archivo(request: Request):
    r = await SaveModeloArchivo(request=request).run()
    return r


@router.delete("/delete_modelo_archivo")
async def delete_modelo_archivo(request: Request):
    r = await DeleteModeloArchivo(request=request).run()
    return r

@router.post("/extract_makerworld")
async def extract_makerworld(request: Request):
    r = await ExtractMakerworld(request=request).run()
    return r

@router.post("/download_modelo_archivo_from_url")
async def download_modelo_archivo_from_url(request: Request):
    r = await DownloadModeloArchivoFromUrl(request=request).run()
    return r

@router.post("/save_modelo_archivo_link")
async def save_modelo_archivo_link(request: Request):
    r = await SaveModeloArchivoLink(request=request).run()
    return r

@router.get("/check_model_link_exists")
async def check_model_link_exists(request: Request):
    r = await CheckModelLinkExists(request=request).run()
    return r

@router.get("/get_estatus_modelos")
async def get_estatus_modelos(request: Request):
    r = await GetEstatusModelos(request=request).run()
    return r
