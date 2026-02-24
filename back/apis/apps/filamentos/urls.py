from fastapi import APIRouter, Request
from .api import GetFilamentos, SaveFilamento, DeleteFilamento

router = APIRouter()


@router.get("/get_filamentos/")
async def get_filamentos(request: Request):
    r = await GetFilamentos(request=request).run()
    return r


@router.post("/save_filamento")
async def save_filamento(request: Request):
    r = await SaveFilamento(request=request).run()
    return r


@router.delete("/delete_filamento")
async def delete_filamento(request: Request):
    r = await DeleteFilamento(request=request).run()
    return r
