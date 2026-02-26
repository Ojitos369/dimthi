from core.bases.apis import NoSession, BaseApi

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
                'archivos', (SELECT json_agg(json_build_object('id', am.id, 'archivo_url', am.archivo_url)) FROM (SELECT id, archivo_url FROM archivos_modelos am2 WHERE am2.modelo_id = m.id ORDER BY am2.created_at DESC LIMIT 5) am)
            )) 
            FROM cotizacion_modelos_pendientes cmp
            JOIN modelos m ON cmp.modelo_id = m.id
            WHERE cmp.cotizacion_pdte_id = cp.id) as modelos_data
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
        INSERT INTO cotizaciones_pendientes (id, nombre, comentarios)
        VALUES (:id, :nombre, :comentarios)
        """
        if not self.conexion.ejecutar(query_cabecera, {"id": id_pendiente, "nombre": nombre, "comentarios": comentarios}):
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
        self.response = {"id": id_pendiente}


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
