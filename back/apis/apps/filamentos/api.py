from core.bases.apis import NoSession, BaseApi


class GetFilamentos(NoSession, BaseApi):
    def main(self):
        self.show_me()
        self.get_filtros()
        query = """
        SELECT *
        FROM filamentos
        WHERE 1=1
        {0}
        ORDER BY nombre
        """.format(self.filtros)
        filamentos = self.conexion.consulta_asociativa(query, self.query_data)
        self.response = {"data": self.d2d(filamentos)}

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


class SaveFilamento(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id_filamento = self.data.get("id", None)
        self.existe = bool(id_filamento)

        if not id_filamento:
            id_filamento = self.get_id()

        filamento = {
            "id": id_filamento,
            "nombre": self.data["nombre"],
            "color": self.data.get("color", None),
            "marca": self.data.get("marca", None),
            "peso_kg": self.data.get("peso_kg", 1),
            "precio_kg": self.data["precio_kg"],
            "link_compra": self.data.get("link_compra", None),
        }

        if not self.existe:
            query = """
            INSERT INTO filamentos (id, nombre, color, marca, peso_kg, precio_kg, link_compra)
            VALUES (:id, :nombre, :color, :marca, :peso_kg, :precio_kg, :link_compra)
            """
        else:
            query = """
            UPDATE filamentos
            SET nombre = :nombre,
                color = :color,
                marca = :marca,
                peso_kg = :peso_kg,
                precio_kg = :precio_kg,
                link_compra = :link_compra
            WHERE id = :id
            """

        if not self.conexion.ejecutar(query, filamento):
            self.conexion.rollback()
            raise self.MYE("Error al guardar el filamento")
        self.conexion.commit()
        self.response = {"id": id_filamento}


class DeleteFilamento(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id = self.data["id"]
        query = """
        DELETE FROM filamentos
        WHERE id = :id
        """
        if not self.conexion.ejecutar(query, {"id": id}):
            self.conexion.rollback()
            raise self.MYE("Error al eliminar el filamento")
        self.conexion.commit()
        self.response = {"id": id}
