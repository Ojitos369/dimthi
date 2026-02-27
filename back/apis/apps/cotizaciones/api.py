from core.bases.apis import NoSession, BaseApi


class GetCotizaciones(NoSession, BaseApi):
    def main(self):
        self.show_me()
        self.get_filtros()
        query = """
        SELECT c.id, c.perfil_costo_id, c.costo_total, c.consto_material, c.consto_luz, c.consto_desgaste, c.consto_mano_obra, c.consto_gastos_generales, c.consto_margen_utilidad, c.created_at, c.comentarios, c.precio_final, c.nombre, c.snapshot_data, c.codigo,
            pc.nombre as perfil_nombre,
            (
                SELECT json_agg(json_build_object(
                    'id', m.id, 
                    'nombre', m.nombre, 
                    'link', m.link,
                    'archivos', (SELECT json_agg(json_build_object('id', am.id, 'archivo_url', am.archivo_url)) FROM (SELECT id, archivo_url FROM archivos_modelos am2 WHERE am2.modelo_id = m.id ORDER BY am2.created_at DESC LIMIT 5) am)
                ))
                FROM cotizacion_modelos cm
                JOIN modelos m ON cm.modelo_id = m.id
                WHERE cm.cotizacion_id = c.id
            ) as modelos
        FROM cotizaciones c
        LEFT JOIN perfiles_costos pc ON c.perfil_costo_id = pc.id
        WHERE 1=1
        {0}
        ORDER BY c.created_at DESC
        """.format(self.filtros)
        cotizaciones = self.conexion.consulta_asociativa(query, self.query_data)
        
        datos = self.d2d(cotizaciones)
        for row in datos:
            if not row.get("modelos"):
                row["modelos"] = []
                
        self.response = {"data": datos}

    def get_filtros(self):
        self.filtros = ""
        self.query_data = {}

        modelo_id = self.data.get("modelo_id", None)
        if modelo_id:
            self.filtros += "AND EXISTS (SELECT 1 FROM cotizacion_modelos cm WHERE cm.cotizacion_id = c.id AND cm.modelo_id = :modelo_id)\n"
            self.query_data["modelo_id"] = modelo_id

        perfil_id = self.data.get("perfil_costo_id", None)
        if perfil_id:
            self.filtros += "AND c.perfil_costo_id = :perfil_costo_id\n"
            self.query_data["perfil_costo_id"] = perfil_id


class SaveCotizacion(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id_cotizacion = self.data.get("id", None)
        self.existe = bool(id_cotizacion)

        if not id_cotizacion:
            id_cotizacion = self.get_id()

        cotizacion = {
            "id": id_cotizacion,
            "perfil_costo_id": self.data.get("perfil_costo_id", None),
            "costo_total": self.data.get("costo_total", 0),
            "consto_material": self.data.get("consto_material", 0),
            "consto_luz": self.data.get("consto_luz", 0),
            "consto_desgaste": self.data.get("consto_desgaste", 0),
            "consto_mano_obra": self.data.get("consto_mano_obra", 0),
            "consto_gastos_generales": self.data.get("consto_gastos_generales", 0),
            "consto_margen_utilidad": self.data.get("consto_margen_utilidad", 0),
            "comentarios": self.data.get("comentarios", None),
            "precio_final": self.data.get("precio_final", 0),
            "nombre": self.data.get("nombre", None),
            "snapshot_data": self.data.get("snapshot_data", None),
            "codigo": self.data.get("codigo", None)
        }

        if not self.existe:
            if not cotizacion["codigo"]:
                cotizacion["codigo"] = f"COT-{id_cotizacion[:8].upper()}"
            query = """
            INSERT INTO cotizaciones
            (id, perfil_costo_id, costo_total, consto_material,
             consto_luz, consto_desgaste, consto_mano_obra, consto_gastos_generales, consto_margen_utilidad, comentarios, precio_final, nombre, snapshot_data, codigo)
            VALUES
            (:id, :perfil_costo_id, :costo_total, :consto_material,
             :consto_luz, :consto_desgaste, :consto_mano_obra, :consto_gastos_generales, :consto_margen_utilidad, :comentarios, :precio_final, :nombre, :snapshot_data, :codigo)
            """
        else:
            if not cotizacion["codigo"]:
                # Obtener codigo actual
                curr_query = "SELECT codigo FROM cotizaciones WHERE id = :id"
                res_curr = self.conexion.consulta_asociativa(curr_query, {"id": id_cotizacion})
                if not res_curr.empty and res_curr.iloc[0]["codigo"]:
                    cotizacion["codigo"] = res_curr.iloc[0]["codigo"]
                else:
                    cotizacion["codigo"] = f"COT-{id_cotizacion[:8].upper()}"
                    
            query = """
            UPDATE cotizaciones
            SET perfil_costo_id = :perfil_costo_id,
                costo_total = :costo_total,
                consto_material = :consto_material,
                consto_luz = :consto_luz,
                consto_desgaste = :consto_desgaste,
                consto_mano_obra = :consto_mano_obra,
                consto_gastos_generales = :consto_gastos_generales,
                consto_margen_utilidad = :consto_margen_utilidad,
                comentarios = :comentarios,
                precio_final = :precio_final,
                nombre = :nombre,
                snapshot_data = :snapshot_data,
                codigo = :codigo
            WHERE id = :id
            """

        if not self.conexion.ejecutar(query, cotizacion):
            self.conexion.rollback()
            raise self.MYE("Error al guardar la cotización")
            
        # Actualizar modelos asociados
        query_del_modelos = "DELETE FROM cotizacion_modelos WHERE cotizacion_id = :id"
        self.conexion.ejecutar(query_del_modelos, {"id": id_cotizacion})
        
        modelos = self.data.get("modelos", [])
        if modelos:
            query_mod = "INSERT INTO cotizacion_modelos (id, cotizacion_id, modelo_id) VALUES (:id, :cotizacion_id, :modelo_id)"
            for m_id in modelos:
                self.conexion.ejecutar(query_mod, {"id": self.get_id(), "cotizacion_id": id_cotizacion, "modelo_id": m_id})

        self.conexion.commit()
        self.response = {"id": id_cotizacion, "codigo": cotizacion["codigo"]}

class DeleteCotizacion(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id = self.data["id"]
        query = """
        DELETE FROM cotizaciones
        WHERE id = :id
        """
        if not self.conexion.ejecutar(query, {"id": id}):
            self.conexion.rollback()
            raise self.MYE("Error al eliminar la cotización")
        self.conexion.commit()
        self.response = {"id": id}
