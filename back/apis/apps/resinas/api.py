from core.bases.apis import NoSession, BaseApi


class GetResinas(NoSession, BaseApi):
    def main(self):
        self.show_me()
        self.get_filtros()
        query = """
        SELECT *
        FROM resinas
        WHERE 1=1
        {0}
        ORDER BY nombre
        """.format(self.filtros)
        resinas = self.conexion.consulta_asociativa(query, self.query_data)
        self.response = {"data": self.d2d(resinas)}

    def get_filtros(self):
        self.filtros = ""
        self.query_data = {}

        nombre = self.data.get("nombre", None)
        if nombre:
            nombre = nombre.strip().lower()
            self.filtros += "AND LOWER(nombre) LIKE :nombre\n"
            self.query_data["nombre"] = f"%{nombre}%"

        marca = self.data.get("marca", None)
        if marca:
            marca = marca.strip().lower()
            self.filtros += "AND LOWER(marca) LIKE :marca\n"
            self.query_data["marca"] = f"%{marca}%"


class SaveResina(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id_resina = self.data.get("id", None)
        self.existe = bool(id_resina)

        if not id_resina:
            id_resina = self.get_id()

        resina = {
            "id": id_resina,
            "nombre": self.data["nombre"],
            "color": self.data.get("color", None),
            "marca": self.data.get("marca", None),
            "peso_kg": self.data.get("peso_kg", 1),
            "precio_kg": self.data["precio_kg"],
        }

        if not self.existe:
            query = """
            INSERT INTO resinas (id, nombre, color, marca, peso_kg, precio_kg)
            VALUES (:id, :nombre, :color, :marca, :peso_kg, :precio_kg)
            """
        else:
            query = """
            UPDATE resinas
            SET nombre = :nombre,
                color = :color,
                marca = :marca,
                peso_kg = :peso_kg,
                precio_kg = :precio_kg
            WHERE id = :id
            """

        if not self.conexion.ejecutar(query, resina):
            self.conexion.rollback()
            raise self.MYE("Error al guardar la resina")
        self.conexion.commit()
        self.response = {"id": id_resina}


class DeleteResina(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id = self.data["id"]
        query = """
        DELETE FROM resinas
        WHERE id = :id
        """
        if not self.conexion.ejecutar(query, {"id": id}):
            self.conexion.rollback()
            raise self.MYE("Error al eliminar la resina")
        self.conexion.commit()
        self.response = {"id": id}
