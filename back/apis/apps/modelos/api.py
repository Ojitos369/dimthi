import os
import shutil
import re
import cloudscraper
import uuid
from core.conf.settings import MEDIA_DIR
from core.bases.apis import NoSession, BaseApi


class GetModelos(NoSession, BaseApi):
    def main(self):
        self.show_me()
        self.get_filtros()
        query = """
        SELECT m.*,
            (SELECT json_agg(json_build_object('id', am.id, 'archivo_url', am.archivo_url)) FROM (SELECT id, archivo_url FROM archivos_modelos am2 WHERE am2.modelo_id = m.id ORDER BY am2.created_at DESC LIMIT 5) am) as archivos,
            (SELECT COUNT(*) FROM archivos_modelos am WHERE am.modelo_id = m.id) as num_archivos,
            COALESCE((SELECT MIN(COALESCE(c.precio_final, c.costo_total)) FROM cotizaciones c JOIN cotizacion_modelos cm ON c.id = cm.cotizacion_id WHERE cm.modelo_id = m.id), 0) as precio_minimo,
            (SELECT COALESCE(SUM(cmp.cantidad), 0) FROM cotizacion_modelos_pendientes cmp JOIN cotizaciones_pendientes cp ON cmp.cotizacion_pdte_id = cp.id WHERE cmp.modelo_id = m.id AND cp.estado = 'pendiente') as cotizaciones_pendientes
        FROM modelos m
        WHERE 1=1
        {0}
        ORDER BY m.created_at DESC
        """.format(self.filtros)
        modelos = self.conexion.consulta_asociativa(query, self.query_data)
        self.response = {"data": self.d2d(modelos)}

    def get_filtros(self):
        self.filtros = ""
        self.query_data = {}

        nombre = self.data.get("nombre", None)
        if nombre:
            nombre = nombre.strip().lower()
            self.filtros += """
            AND (
                LOWER(m.nombre) LIKE :nombre 
                OR CAST(m.id AS TEXT) LIKE :nombre 
                OR EXISTS (
                    SELECT 1 
                    FROM cotizacion_modelos cm_search 
                    JOIN cotizaciones c_search ON c_search.id = cm_search.cotizacion_id 
                    WHERE cm_search.modelo_id = m.id AND c_search.codigo ILIKE :nombre
                )
            )
            """
            self.query_data["nombre"] = f"%{nombre}%"

        id_modelo = self.data.get("id", None)
        if id_modelo:
            self.filtros += "AND CAST(m.id AS TEXT) LIKE :id\n"
            self.query_data["id"] = f"{id_modelo}%"
            
        codigo = self.data.get("codigo", None)
        if codigo:
            self.filtros += "AND m.codigo ILIKE :codigo\n"
            self.query_data["codigo"] = f"{codigo}" # Exact match for code
        
        catalogo = self.data.get("catalogo", False)
        # Si es vista catálogo (no admin)
        # Si se busca por código, se permite ver modelos privados.
        # Si no se busca por código, se obligan a que solo salgan públicos y validados.
        if catalogo and str(catalogo).lower() == 'true':
            if not codigo: # Only apply public/validated filter if no specific code is searched
                self.filtros += "AND m.estatus_privacidad = 'publico'\n"
                self.filtros += "AND m.estatus_validacion = 'validado'\n"
            
        estatus_privacidad = self.data.get("estatus_privacidad", None)
        if estatus_privacidad:
            self.filtros += "AND m.estatus_privacidad = :estatus_privacidad\n"
            self.query_data["estatus_privacidad"] = estatus_privacidad
            
        estatus_validacion = self.data.get("estatus_validacion", None)
        if estatus_validacion:
            self.filtros += "AND m.estatus_validacion = :estatus_validacion\n"
            self.query_data["estatus_validacion"] = estatus_validacion


class GetModelo(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id = self.data["id"]
        query = """
        SELECT m.*
        FROM modelos m
        WHERE m.id = :id
        """
        modelo = self.conexion.consulta_asociativa(query, {"id": id})
        if modelo.empty:
            raise self.MYE("Modelo no encontrado")

        modelo_data = self.d2d(modelo)[0]

        # Get archivos
        query_archivos = """
        SELECT * FROM archivos_modelos
        WHERE modelo_id = :modelo_id
        ORDER BY created_at DESC
        """
        archivos = self.conexion.consulta_asociativa(query_archivos, {"modelo_id": id})
        modelo_data["archivos"] = self.d2d(archivos)

        # Get cotizaciones
        query_cotizaciones = """
        SELECT c.*, pc.nombre as perfil_nombre,
               (
                 SELECT json_agg(json_build_object('id', mr.id, 'nombre', mr.nombre))
                 FROM cotizacion_modelos cmr
                 JOIN modelos mr ON cmr.modelo_id = mr.id
                 WHERE cmr.cotizacion_id = c.id AND mr.id != :modelo_id
               ) as modelos_relacionados
        FROM cotizaciones c
        LEFT JOIN perfiles_costos pc ON c.perfil_costo_id = pc.id
        JOIN cotizacion_modelos cm ON c.id = cm.cotizacion_id
        WHERE cm.modelo_id = :modelo_id
        ORDER BY c.created_at DESC
        """
        cotizaciones = self.conexion.consulta_asociativa(query_cotizaciones, {"modelo_id": id})
        modelo_data["cotizaciones"] = self.d2d(cotizaciones)

        self.response = {"data": modelo_data}


class SaveModelo(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id_modelo = self.data.get("id", None)

        if not id_modelo:
            id_modelo = self.get_id()

        link_val = self.data.get("link", None)
        
        # Si tiene link es publico, si no es privado
        # Si tiene link se considera validado de una vez
        estatus_privacidad = self.data.get("estatus_privacidad", "publico" if link_val else "privado")
        default_validacion = "validado" if link_val else "pendiente"
        estatus_validacion = self.data.get("estatus_validacion", default_validacion)
        
        # Generar código si es modelo privado (sin link)
        codigo = None
        if estatus_privacidad == 'privado':
            # Verificar si ya tiene código
            curr_query = "SELECT codigo FROM modelos WHERE id = :id"
            try:
                res_curr = self.conexion.consulta_asociativa(curr_query, {"id": id_modelo})
                if not res_curr.empty and res_curr.iloc[0]["codigo"]:
                    codigo = res_curr.iloc[0]["codigo"]
                else:
                    codigo = f"MOD-{id_modelo[:8].upper()}"
            except Exception:
                codigo = f"MOD-{id_modelo[:8].upper()}"

        modelo = {
            "id": id_modelo,
            "nombre": self.data["nombre"],
            "descripcion": self.data.get("descripcion", None),
            "link": link_val,
            "estatus_privacidad": estatus_privacidad,
            "estatus_validacion": estatus_validacion,
            "codigo": codigo
        }

        query = """
        INSERT INTO modelos (id, nombre, descripcion, link, estatus_privacidad, estatus_validacion, codigo)
        VALUES (:id, :nombre, :descripcion, :link, :estatus_privacidad, :estatus_validacion, :codigo)
        ON CONFLICT (id) DO UPDATE
        SET nombre = EXCLUDED.nombre,
            descripcion = EXCLUDED.descripcion,
            link = EXCLUDED.link,
            estatus_privacidad = EXCLUDED.estatus_privacidad,
            estatus_validacion = EXCLUDED.estatus_validacion,
            codigo = EXCLUDED.codigo
        """

        if not self.conexion.ejecutar(query, modelo):
            self.conexion.rollback()
            raise self.MYE("Error al guardar el modelo")
        self.conexion.commit()
        self.response = {"id": id_modelo, "codigo": codigo}

class CheckModelLinkExists(NoSession, BaseApi):
    def main(self):
        self.show_me()
        link = self.data.get("link", None)
        if not link:
            self.response = {"exists": False}
            return
            
        query = "SELECT id, nombre FROM modelos WHERE link = :link LIMIT 1"
        res = self.conexion.consulta_asociativa(query, {"link": link})
        
        if res.empty:
            self.response = {"exists": False}
        else:
            self.response = {
                "exists": True, 
                "nombre": res.iloc[0]["nombre"],
                "id": str(res.iloc[0]["id"])
            }

class GetEstatusModelos(NoSession, BaseApi):
    def main(self):
        self.show_me()
        query = """
        SELECT 
            SUM(CASE WHEN estatus_validacion = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
            SUM(CASE WHEN estatus_validacion = 'validado' THEN 1 ELSE 0 END) as validados,
            SUM(CASE WHEN estatus_privacidad = 'publico' THEN 1 ELSE 0 END) as publicos,
            SUM(CASE WHEN estatus_privacidad = 'privado' THEN 1 ELSE 0 END) as privados,
            COUNT(*) as total
        FROM modelos
        """
        res = self.conexion.consulta_asociativa(query)
        if res.empty:
            data = {"pendientes": 0, "validados": 0, "publicos": 0, "privados": 0, "total": 0}
        else:
            data = self.d2d(res)[0]
        self.response = {"data": data}


class DeleteModelo(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id = self.data["id"]

        # Delete archivos first
        query_archivos = "DELETE FROM archivos_modelos WHERE modelo_id = :id"
        self.conexion.ejecutar(query_archivos, {"id": id})

        # Delete cotizaciones
        query_cotizaciones = "DELETE FROM cotizacion_modelos WHERE modelo_id = :id"
        self.conexion.ejecutar(query_cotizaciones, {"id": id})

        query = "DELETE FROM modelos WHERE id = :id"
        if not self.conexion.ejecutar(query, {"id": id}):
            self.conexion.rollback()
            raise self.MYE("Error al eliminar el modelo")
        self.conexion.commit()
        self.response = {"id": id}


class SaveModeloArchivo(NoSession, BaseApi):
    def main(self):
        self.show_me()
        modelo_id = self.data.get("modelo_id")
        file = self.data.get("file")
        if not modelo_id or not file:
            raise self.MYE("Faltan datos")

        query_insert = "INSERT INTO modelos (id, nombre, descripcion, link) VALUES (:id, 'Nuevo Modelo', '', '') ON CONFLICT (id) DO NOTHING"
        self.conexion.ejecutar(query_insert, {"id": modelo_id})

        folder_path = os.path.join(MEDIA_DIR, "modelos", str(modelo_id))
        os.makedirs(folder_path, exist_ok=True)
        
        filename = file.filename
        file_path = os.path.join(folder_path, filename)
        
        contents = file.file.read()
        with open(file_path, 'wb') as f:
            f.write(contents)
            
        archivo_url = f"modelos/{modelo_id}/{filename}"
        
        id_archivo = self.get_id()
        query = """
        INSERT INTO archivos_modelos (id, modelo_id, archivo_url)
        VALUES (:id, :modelo_id, :archivo_url)
        """
        self.conexion.ejecutar(query, {"id": id_archivo, "modelo_id": modelo_id, "archivo_url": archivo_url})
        self.conexion.commit()
        
        self.response = {"id": id_archivo, "url": archivo_url}

class SaveModeloArchivoLink(NoSession, BaseApi):
    def main(self):
        self.show_me()
        modelo_id = self.data.get("modelo_id")
        url = self.data.get("url")
        if not modelo_id or not url:
            raise self.MYE("Faltan datos")
            
        query_insert = "INSERT INTO modelos (id, nombre, descripcion, link) VALUES (:id, 'Nuevo Modelo', '', '') ON CONFLICT (id) DO NOTHING"
        self.conexion.ejecutar(query_insert, {"id": modelo_id})

        id_archivo = self.get_id()
        query = """
        INSERT INTO archivos_modelos (id, modelo_id, archivo_url)
        VALUES (:id, :modelo_id, :archivo_url)
        """
        self.conexion.ejecutar(query, {"id": id_archivo, "modelo_id": modelo_id, "archivo_url": url})
        self.conexion.commit()
        
        self.response = {"id": id_archivo, "url": url}


class DeleteModeloArchivo(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id_archivo = self.data.get("id")
        
        query_get = "SELECT archivo_url FROM archivos_modelos WHERE id = :id"
        res = self.conexion.consulta_asociativa(query_get, {"id": id_archivo})
        if not res.empty:
            archivo_url = res.iloc[0]["archivo_url"]
            file_path = os.path.join(MEDIA_DIR, archivo_url)
            if os.path.exists(file_path):
                os.remove(file_path)
                
        query = "DELETE FROM archivos_modelos WHERE id = :id"
        self.conexion.ejecutar(query, {"id": id_archivo})
        self.conexion.commit()
        self.response = {"id": id_archivo}

class ExtractMakerworld(NoSession, BaseApi):
    def main(self):
        self.show_me()
        url = self.data.get("url")
        if not url:
            raise self.MYE("Se requiere un URL de Makerworld")

        scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False})
        
        try:
            res = scraper.get(url, timeout=15)
            html = res.text
        except Exception as e:
            raise self.MYE(f"Error al conectar con Makerworld: {str(e)}")

        match_title = re.search(r'<meta\s+(?:property|name)=[\'"]og:title[\'"]\s+content=[\'"](.*?)[\'"]', html, re.IGNORECASE)
        if not match_title:
            match_title = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
        titulo = match_title.group(1).split('-')[0].strip() if match_title else "Modelo Extraído"

        match_desc = re.search(r'<meta\s+(?:property|name)=[\'"]og:description[\'"]\s+content=[\'"](.*?)[\'"]', html, re.IGNORECASE)
        if not match_desc:
            # Fallback a description de Makerworld específica o general
            match_desc = re.search(r'\"description\":\s*\"(.*?)\"', html)
            
        descripcion = match_desc.group(1).strip() if match_desc else "Sin descripción contenida"
        # decodificar caracteres unicode y html
        descripcion = descripcion.replace('\\u0026', '&').replace('\\u003e', '>').replace('\\u003c', '<').replace('\\n', '<br>').replace('\\\"', '"')
        if len(descripcion) > 2000:
            descripcion = descripcion[:1997] + "..."

        # Intentar obtener og:image
        imagenes = []
        og_images = re.findall(r'<meta\s+(?:property|name)=[\'"]og:image[\'"]\s+content=[\'"](.*?)[\'"]', html, re.IGNORECASE)
        if og_images:
            imagenes.extend(og_images)
            
        # Fallback a todas las imágenes de Makerworld si no hay og:image (o para sacar más)
        imagenes_matches = re.findall(r'https://[^\"]*makerworld\.bblmw\.com[^\"]*\.webp', html)
        if not imagenes_matches:
            imagenes_matches = re.findall(r'https://[^\"]*makerworld\.bblmw\.com[^\"]*\.jpg', html)
        if not imagenes_matches:
            imagenes_matches = re.findall(r'https://[^\"]*makerworld\.bblmw\.com[^\"]*\.png', html)
            
        imagenes.extend(imagenes_matches)
        
        # Limpiar y limitar
        imagenes = list(set(imagenes))
        if len(imagenes) > 10:
            imagenes = imagenes[:10]
            
        self.response = {
            "nombre": titulo,
            "descripcion": descripcion,
            "imagenes": imagenes
        }

class DownloadModeloArchivoFromUrl(NoSession, BaseApi):
    def main(self):
        self.show_me()
        modelo_id = self.data.get("modelo_id")
        url = self.data.get("url")
        if not modelo_id or not url:
            raise self.MYE("Faltan datos")

        query_insert = "INSERT INTO modelos (id, nombre, descripcion, link) VALUES (:id, 'Nuevo Modelo', '', '') ON CONFLICT (id) DO NOTHING"
        self.conexion.ejecutar(query_insert, {"id": modelo_id})

        folder_path = os.path.join(MEDIA_DIR, "modelos", str(modelo_id))
        os.makedirs(folder_path, exist_ok=True)
        
        scraper = cloudscraper.create_scraper(browser={'browser': 'chrome', 'platform': 'windows', 'mobile': False})
        res = scraper.get(url)
        if res.status_code != 200:
            raise self.MYE("Error al descargar imagen")
            
        filename = f"{uuid.uuid4().hex}.webp"
        file_path = os.path.join(folder_path, filename)
        
        with open(file_path, 'wb') as f:
            f.write(res.content)
            
        archivo_url = f"modelos/{modelo_id}/{filename}"
        id_archivo = self.get_id()
        query = "INSERT INTO archivos_modelos (id, modelo_id, archivo_url) VALUES (:id, :modelo_id, :archivo_url)"
        self.conexion.ejecutar(query, {"id": id_archivo, "modelo_id": modelo_id, "archivo_url": archivo_url})
        self.conexion.commit()
        
        self.response = {"id": id_archivo, "url": archivo_url}
