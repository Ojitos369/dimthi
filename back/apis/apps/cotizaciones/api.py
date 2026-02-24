from core.bases.apis import NoSession, BaseApi


class GetCotizaciones(NoSession, BaseApi):
    def main(self):
        self.show_me()
        self.get_filtros()
        query = """
        SELECT c.*,
            m.nombre as modelo_nombre,
            pc.nombre as perfil_nombre
        FROM cotizaciones c
        LEFT JOIN modelos m ON c.modelo_id = m.id
        LEFT JOIN perfiles_costos pc ON c.perfil_costo_id = pc.id
        WHERE 1=1
        {0}
        ORDER BY c.created_at DESC
        """.format(self.filtros)
        cotizaciones = self.conexion.consulta_asociativa(query, self.query_data)
        self.response = {"data": self.d2d(cotizaciones)}

    def get_filtros(self):
        self.filtros = ""
        self.query_data = {}

        modelo_id = self.data.get("modelo_id", None)
        if modelo_id:
            self.filtros += "AND c.modelo_id = :modelo_id\n"
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
            "modelo_id": self.data.get("modelo_id", None),
            "perfil_costo_id": self.data.get("perfil_costo_id", None),
            "costo_total": self.data.get("costo_total", 0),
            "consto_material": self.data.get("consto_material", 0),
            "consto_luz": self.data.get("consto_luz", 0),
            "consto_desgaste": self.data.get("consto_desgaste", 0),
            "consto_mano_obra": self.data.get("consto_mano_obra", 0),
            "consto_gastos_generales": self.data.get("consto_gastos_generales", 0),
            "consto_margen_utilidad": self.data.get("consto_margen_utilidad", 0),
        }

        if not self.existe:
            query = """
            INSERT INTO cotizaciones
            (id, modelo_id, perfil_costo_id, costo_total, consto_material,
             consto_luz, consto_desgaste, consto_mano_obra, consto_gastos_generales, consto_margen_utilidad)
            VALUES
            (:id, :modelo_id, :perfil_costo_id, :costo_total, :consto_material,
             :consto_luz, :consto_desgaste, :consto_mano_obra, :consto_gastos_generales, :consto_margen_utilidad)
            """
        else:
            query = """
            UPDATE cotizaciones
            SET modelo_id = :modelo_id,
                perfil_costo_id = :perfil_costo_id,
                costo_total = :costo_total,
                consto_material = :consto_material,
                consto_luz = :consto_luz,
                consto_desgaste = :consto_desgaste,
                consto_mano_obra = :consto_mano_obra,
                consto_gastos_generales = :consto_gastos_generales,
                consto_margen_utilidad = :consto_margen_utilidad
            WHERE id = :id
            """

        if not self.conexion.ejecutar(query, cotizacion):
            self.conexion.rollback()
            raise self.MYE("Error al guardar la cotización")
        self.conexion.commit()
        self.response = {"id": id_cotizacion}


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
