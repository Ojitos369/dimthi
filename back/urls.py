from fastapi import Request, FastAPI, APIRouter
from fastapi.responses import HTMLResponse
from apis.urls import apis, media
from apis.apps.maquinas import urls as maquinas_urls
from apis.auth import urls as auth_urls
# from apis.apps.tickets import urls as tickets_urls
from apis.apps.cotizaciones_pendientes import urls as pendientes_urls
from core.conf.settings import MEDIA_DIR

urls_router = APIRouter()

urls_router.include_router(apis, prefix="/api")
urls_router.include_router(media, prefix="/media")
urls_router.include_router(maquinas_urls.router, prefix="/api/maquinas")
urls_router.include_router(auth_urls.router, prefix="/api/auth")
# urls_router.include_router(tickets_urls, prefix="/api/tickets")
urls_router.include_router(pendientes_urls.router, prefix="/api/cotizaciones_pendientes")

# ---------   INDEX   ---------
@urls_router.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    with open(f"{MEDIA_DIR}/dist/index.html") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

# ---------   404   ---------
def add_404_handler(app: FastAPI):
    @app.exception_handler(404)
    async def custom_404_handler(request: Request, exc):
        with open(f"{MEDIA_DIR}/pages/p404.html") as f:
            html_content = f.read()
        return HTMLResponse(content=html_content, status_code=404)

