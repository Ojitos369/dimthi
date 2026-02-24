from fastapi import APIRouter, Request
from .api import GetResinas, SaveResina, DeleteResina

router = APIRouter()


@router.get("/get_resinas/")
async def get_resinas(request: Request):
    r = await GetResinas(request=request).run()
    return r


@router.post("/save_resina")
async def save_resina(request: Request):
    r = await SaveResina(request=request).run()
    return r


@router.delete("/delete_resina")
async def delete_resina(request: Request):
    r = await DeleteResina(request=request).run()
    return r
