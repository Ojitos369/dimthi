from core.bases.apis import NoSession, BaseApi


class GetModelos(NoSession, BaseApi):
    def main(self):
        self.show_me()
        self.get_filtros()
        query = """
        SELECT m.*,
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
        }

        if not self.existe:
            query = """
            INSERT INTO modelos (id, nombre, descripcion)
            VALUES (:id, :nombre, :descripcion)
            """
        else:
            query = """
            UPDATE modelos
            SET nombre = :nombre,
                descripcion = :descripcion
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
