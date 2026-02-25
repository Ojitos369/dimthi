from core.bases.apis import NoSession, BaseApi

class GetCompras(NoSession, BaseApi):
    def main(self):
        self.show_me()
        self.get_filtros()
        query = """
        SELECT c.*,
            cot.costo_total as cotizacion_costo_total,
            cot.precio_final as cotizacion_precio_final
        FROM compras c
        LEFT JOIN cotizaciones cot ON c.cotizacion_id = cot.id
        WHERE 1=1
        {0}
        ORDER BY c.created_at DESC
        """.format(self.filtros)
        compras = self.conexion.consulta_asociativa(query, self.query_data)
        self.response = {"data": self.d2d(compras)}

    def get_filtros(self):
        self.filtros = ""
        self.query_data = {}

        cotizacion_id = self.data.get("cotizacion_id", None)
        if cotizacion_id:
            self.filtros += "AND c.cotizacion_id = :cotizacion_id\n"
            self.query_data["cotizacion_id"] = cotizacion_id

class SaveCompra(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id_compra = self.data.get("id", None)
        self.existe = bool(id_compra)

        if not id_compra:
            id_compra = self.get_id()

        compra = {
            "id": id_compra,
            "cotizacion_id": self.data.get("cotizacion_id", None),
            "cantidad": self.data.get("cantidad", 1),
            "usuario": self.data.get("usuario", None),
            "comentario": self.data.get("comentario", None),
            "nombre": self.data.get("nombre", None),
        }

        if not self.existe:
            query = """
            INSERT INTO compras (id, cotizacion_id, cantidad, usuario, comentario, nombre)
            VALUES (:id, :cotizacion_id, :cantidad, :usuario, :comentario, :nombre)
            """
        else:
            query = """
            UPDATE compras
            SET cotizacion_id = :cotizacion_id,
                cantidad = :cantidad,
                usuario = :usuario,
                comentario = :comentario,
                nombre = :nombre
            WHERE id = :id
            """

        if not self.conexion.ejecutar(query, compra):
            self.conexion.rollback()
            raise self.MYE("Error al guardar la compra")
        self.conexion.commit()
        self.response = {"id": id_compra}

class DeleteCompra(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id = self.data["id"]
        query = "DELETE FROM compras WHERE id = :id"
        if not self.conexion.ejecutar(query, {"id": id}):
            self.conexion.rollback()
            raise self.MYE("Error al eliminar la compra")
        self.conexion.commit()
        self.response = {"id": id}
