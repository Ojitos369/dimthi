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
            (SELECT COUNT(*) FROM archivos_modelos am WHERE am.modelo_id = m.id) as num_archivos
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
            self.filtros += "AND LOWER(m.nombre) LIKE :nombre\n"
            self.query_data["nombre"] = f"%{nombre}%"

        id_modelo = self.data.get("id", None)
        if id_modelo:
            self.filtros += "AND m.id = :id\n"
            self.query_data["id"] = id_modelo


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
        SELECT c.*, pc.nombre as perfil_nombre
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
        self.existe = bool(id_modelo)

        if not id_modelo:
            id_modelo = self.get_id()

        modelo = {
            "id": id_modelo,
            "nombre": self.data["nombre"],
            "descripcion": self.data.get("descripcion", None),
            "link": self.data.get("link", None),
        }

        if not self.existe:
            query = """
            INSERT INTO modelos (id, nombre, descripcion, link)
            VALUES (:id, :nombre, :descripcion, :link)
            """
        else:
            query = """
            UPDATE modelos
            SET nombre = :nombre,
                descripcion = :descripcion,
                link = :link
            WHERE id = :id
            """

        if not self.conexion.ejecutar(query, modelo):
            self.conexion.rollback()
            raise self.MYE("Error al guardar el modelo")
        self.conexion.commit()
        self.response = {"id": id_modelo}


class DeleteModelo(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id = self.data["id"]

        # Delete archivos first
        query_archivos = "DELETE FROM archivos_modelos WHERE modelo_id = :id"
        self.conexion.ejecutar(query_archivos, {"id": id})

        # Delete cotizaciones
        query_cotizaciones = "DELETE FROM cotizaciones WHERE modelo_id = :id"
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

        match_title = re.search(r'<title>(.*?)</title>', html)
        titulo = match_title.group(1).split('-')[0].strip() if match_title else "Modelo Extraído"

        match_desc = re.search(r'\"description\":\"(.*?)\"', html)
        descripcion = match_desc.group(1).strip() if match_desc else "Sin descripción contenida"
        # decodificar caracteres unicode y html
        descripcion = descripcion.replace('\\u0026', '&').replace('\\u003e', '>').replace('\\u003c', '<').replace('\\n', '<br>').replace('\\\"', '"')
        if len(descripcion) > 2000:
            descripcion = descripcion[:1997] + "..."

        imagenes_matches = re.findall(r'https://[^\"]*makerworld\.bblmw\.com[^\"]*\.webp', html)
        if not imagenes_matches:
            imagenes_matches = re.findall(r'https://[^\"]*makerworld\.bblmw\.com[^\"]*\.jpg', html)
        if not imagenes_matches:
            imagenes_matches = re.findall(r'https://[^\"]*makerworld\.bblmw\.com[^\"]*\.png', html)
            
        imagenes = list(set(imagenes_matches))
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
