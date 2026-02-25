from fastapi import APIRouter

from .filamentos.urls import router as filamentos_router
from .resinas.urls import router as resinas_router
from .perfiles_costos.urls import router as perfiles_costos_router
from .cotizaciones.urls import router as cotizaciones_router
from .modelos.urls import router as modelos_router
from .maquinas.urls import router as maquinas_router
from .compras.urls import router as compras_router

router = APIRouter()

router.include_router(filamentos_router, prefix="/filamentos")
router.include_router(resinas_router, prefix="/resinas")
router.include_router(perfiles_costos_router, prefix="/perfiles_costos")
router.include_router(cotizaciones_router, prefix="/cotizaciones")
router.include_router(modelos_router, prefix="/modelos")
router.include_router(maquinas_router, prefix="/maquinas")
router.include_router(compras_router, prefix="/compras")
