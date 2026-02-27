from core.bases.apis import NoSession, BaseApi
import os
from core.conf.settings import MEDIA_DIR

class GetPendientes(NoSession, BaseApi):
    def main(self):
        self.show_me()
        
        estado = self.data.get("estado", "pendiente")
        
        query = """
        SELECT cp.*,
            (SELECT json_agg(json_build_object(
                'modelo_id', cmp.modelo_id, 
                'cantidad', cmp.cantidad,
                'nombre_modelo', m.nombre,
                'descripcion_modelo', m.descripcion,
                'link_modelo', m.link,
                'archivos', (SELECT json_agg(json_build_object('id', am.id, 'archivo_url', am.archivo_url)) FROM (SELECT id, archivo_url FROM archivos_modelos am2 WHERE am2.modelo_id = m.id ORDER BY am2.created_at DESC LIMIT 5) am)
            )) 
            FROM cotizacion_modelos_pendientes cmp
            JOIN modelos m ON cmp.modelo_id = m.id
            WHERE cmp.cotizacion_pdte_id = cp.id) as modelos_data,
            (SELECT json_agg(json_build_object(
                'id', acp.id,
                'archivo_url', acp.archivo_url
            ))
            FROM archivos_cotizaciones_pendientes acp
            WHERE acp.cotizacion_pdte_id = cp.id) as archivos_adjuntos
        FROM cotizaciones_pendientes cp
        WHERE cp.estado = :estado
        ORDER BY cp.created_at DESC
        """
        pendientes = self.conexion.consulta_asociativa(query, {"estado": estado})
        self.response = {"data": self.d2d(pendientes)}

class SavePendiente(NoSession, BaseApi):
    def main(self):
        self.show_me()
        
        nombre = self.data.get("nombre", "Cliente Web")
        comentarios = self.data.get("comentarios", "")
        modelos_ids = self.data.get("modelos_ids", [])  # list of dicts: [{'id': 'uuid', 'cantidad': 1}]
        
        if not modelos_ids:
            raise self.MYE("No hay modelos para cotizar")
            
        id_pendiente = self.get_id()
        
        query_cabecera = """
        INSERT INTO cotizaciones_pendientes (id, nombre, comentarios, codigo)
        VALUES (:id, :nombre, :comentarios, :codigo)
        """
        codigo = f"CP-{id_pendiente[:8].upper()}"
        if not self.conexion.ejecutar(query_cabecera, {"id": id_pendiente, "nombre": nombre, "comentarios": comentarios, "codigo": codigo}):
            self.conexion.rollback()
            raise self.MYE("Error al guardar solicitud de cotización")
            
        for mod in modelos_ids:
            query_mod = """
            INSERT INTO cotizacion_modelos_pendientes (id, cotizacion_pdte_id, modelo_id, cantidad)
            VALUES (:id, :pdte_id, :modelo_id, :cantidad)
            """
            self.conexion.ejecutar(query_mod, {
                "id": self.get_id(),
                "pdte_id": id_pendiente,
                "modelo_id": mod.get("id"),
                "cantidad": mod.get("cantidad", 1)
            })
            
        self.conexion.commit()
        self.response = {"id": id_pendiente, "codigo": codigo}

class GetPendienteByCodigo(NoSession, BaseApi):
    def main(self):
        self.show_me()
        
        codigo = self.data.get("codigo")
        if not codigo:
            raise self.MYE("Falta el código de seguimiento")
            
        query = """
        SELECT cp.*,
            (SELECT json_agg(json_build_object(
                'modelo_id', cmp.modelo_id, 
                'cantidad', cmp.cantidad,
                'nombre_modelo', m.nombre,
                'descripcion_modelo', m.descripcion,
                'link_modelo', m.link,
                'archivos', (SELECT json_agg(json_build_object('id', am.id, 'archivo_url', am.archivo_url)) FROM (SELECT id, archivo_url FROM archivos_modelos am2 WHERE am2.modelo_id = m.id ORDER BY am2.created_at DESC LIMIT 5) am)
            )) 
            FROM cotizacion_modelos_pendientes cmp
            JOIN modelos m ON cmp.modelo_id = m.id
            WHERE cmp.cotizacion_pdte_id = cp.id) as modelos_data,
            (SELECT json_agg(json_build_object(
                'id', acp.id,
                'archivo_url', acp.archivo_url
            ))
            FROM archivos_cotizaciones_pendientes acp
            WHERE acp.cotizacion_pdte_id = cp.id) as archivos_adjuntos
        FROM cotizaciones_pendientes cp
        WHERE cp.codigo = :codigo
        """
        pendiente = self.conexion.consulta_asociativa(query, {"codigo": codigo})
        
        if pendiente.empty:
            raise self.MYE("No se encontró ninguna cotización con ese código")
            
        self.response = {"data": self.d2d(pendiente)[0]}


class ResolvePendiente(NoSession, BaseApi):
    def main(self):
        self.show_me()
        
        id_pendiente = self.data.get("id")
        nuevo_estado = self.data.get("estado", "resuelta")
        
        if not id_pendiente:
            raise self.MYE("Falta el ID")
            
        query = "UPDATE cotizaciones_pendientes SET estado = :estado WHERE id = :id"
        if not self.conexion.ejecutar(query, {"id": id_pendiente, "estado": nuevo_estado}):
            self.conexion.rollback()
            raise self.MYE("Error al actualizar la solicitud")
            
        self.conexion.commit()
        self.response = {"id": id_pendiente}


class SaveArchivoPendiente(NoSession, BaseApi):
    def main(self):
        self.show_me()
        cotizacion_pdte_id = self.data.get("cotizacion_pdte_id")
        file = self.data.get("file")
        if not cotizacion_pdte_id or not file:
            raise self.MYE("Faltan datos")

        folder_path = os.path.join(MEDIA_DIR, "cotizaciones_pendientes", str(cotizacion_pdte_id))
        os.makedirs(folder_path, exist_ok=True)
        
        filename = file.filename
        file_path = os.path.join(folder_path, filename)
        
        contents = file.file.read()
        with open(file_path, 'wb') as f:
            f.write(contents)
            
        archivo_url = f"cotizaciones_pendientes/{cotizacion_pdte_id}/{filename}"
        
        id_archivo = self.get_id()
        query = """
        INSERT INTO archivos_cotizaciones_pendientes (id, cotizacion_pdte_id, archivo_url)
        VALUES (:id, :cotizacion_pdte_id, :archivo_url)
        """
        self.conexion.ejecutar(query, {"id": id_archivo, "cotizacion_pdte_id": cotizacion_pdte_id, "archivo_url": archivo_url})
        self.conexion.commit()
        
        self.response = {"id": id_archivo, "url": archivo_url}
