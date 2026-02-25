from core.bases.apis import NoSession, BaseApi


class GetPerfiles(NoSession, BaseApi):
    def main(self):
        self.show_me()
        self.get_filtros()
        query = """
        SELECT pc.*,
            f.nombre as filamento_nombre,
            f.color as filamento_color,
            f.marca as filamento_marca,
            f.precio_kg as filamento_precio_kg,
            r.nombre as resina_nombre,
            r.color as resina_color,
            r.marca as resina_marca,
            r.precio_kg as resina_precio_kg,
            m.nombre as maquina_nombre,
            m.tipo as maquina_tipo
        FROM perfiles_costos pc
        LEFT JOIN filamentos f ON pc.filamento_id = f.id
        LEFT JOIN resinas r ON pc.resina_id = r.id
        LEFT JOIN maquinas m ON pc.maquina_id = m.id
        WHERE 1=1
        {0}
        ORDER BY pc.created_at DESC
        """.format(self.filtros)
        perfiles = self.conexion.consulta_asociativa(query, self.query_data)
        self.response = {"data": self.d2d(perfiles)}

    def get_filtros(self):
        self.filtros = ""
        self.query_data = {}

        nombre = self.data.get("nombre", None)
        if nombre:
            nombre = nombre.strip().lower()
            self.filtros += "AND LOWER(pc.nombre) LIKE :nombre\n"
            self.query_data["nombre"] = f"%{nombre}%"

        id_perfil = self.data.get("id", None)
        if id_perfil:
            self.filtros += "AND pc.id = :id\n"
            self.query_data["id"] = id_perfil


class SavePerfil(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id_perfil = self.data.get("id", None)
        self.existe = bool(id_perfil)

        if not id_perfil:
            id_perfil = self.get_id()

        perfil = {
            "id": id_perfil,
            "nombre": self.data["nombre"],
            "tipo_material": self.data.get("tipo_material", "filamento"),
            "filamento_id": self.data.get("filamento_id", None),
            "resina_id": self.data.get("resina_id", None),
            "maquina_id": self.data.get("maquina_id", None),
            "luz_kw": self.data.get("luz_kw", 0),
            "desgaste_impresora": self.data.get("desgaste_impresora", 0),
            "mano_obra": self.data.get("mano_obra", 0),
            "gastos_generales": self.data.get("gastos_generales", 0),
            "margen_utilidad": self.data.get("margen_utilidad", 20),
        }

        if not self.existe:
            query = """
            INSERT INTO perfiles_costos
            (id, nombre, tipo_material, filamento_id, resina_id, maquina_id, luz_kw, desgaste_impresora, mano_obra, gastos_generales, margen_utilidad)
            VALUES
            (:id, :nombre, :tipo_material, :filamento_id, :resina_id, :maquina_id, :luz_kw, :desgaste_impresora, :mano_obra, :gastos_generales, :margen_utilidad)
            """
        else:
            query = """
            UPDATE perfiles_costos
            SET nombre = :nombre,
                tipo_material = :tipo_material,
                filamento_id = :filamento_id,
                resina_id = :resina_id,
                maquina_id = :maquina_id,
                luz_kw = :luz_kw,
                desgaste_impresora = :desgaste_impresora,
                mano_obra = :mano_obra,
                gastos_generales = :gastos_generales,
                margen_utilidad = :margen_utilidad
            WHERE id = :id
            """

        if not self.conexion.ejecutar(query, perfil):
            self.conexion.rollback()
            raise self.MYE("Error al guardar el perfil de costos")
        self.conexion.commit()
        self.response = {"id": id_perfil}


class DeletePerfil(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id = self.data["id"]
        query = """
        DELETE FROM perfiles_costos
        WHERE id = :id
        """
        if not self.conexion.ejecutar(query, {"id": id}):
            self.conexion.rollback()
            raise self.MYE("Error al eliminar el perfil")
        self.conexion.commit()
        self.response = {"id": id}
