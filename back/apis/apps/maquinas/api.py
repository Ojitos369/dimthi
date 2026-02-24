from core.bases.apis import NoSession, BaseApi


class GetMaquinas(NoSession, BaseApi):
    def main(self):
        self.show_me()
        self.get_filtros()
        query = """
        SELECT *
        FROM maquinas
        WHERE 1=1
        {0}
        ORDER BY tipo, nombre
        """.format(self.filtros)
        maquinas = self.conexion.consulta_asociativa(query, self.query_data)
        self.response = {"data": self.d2d(maquinas)}

    def get_filtros(self):
        self.filtros = ""
        self.query_data = {}

        nombre = self.data.get("nombre", None)
        if nombre:
            nombre = nombre.strip().lower()
            self.filtros += "AND LOWER(nombre) LIKE :nombre\n"
            self.query_data["nombre"] = f"%{nombre}%"

        tipo = self.data.get("tipo", None)
        if tipo:
            self.filtros += "AND tipo = :tipo\n"
            self.query_data["tipo"] = tipo


class SaveMaquina(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id_maquina = self.data.get("id", None)
        self.existe = bool(id_maquina)

        if not id_maquina:
            id_maquina = self.get_id()

        maquina = {
            "id": id_maquina,
            "nombre": self.data["nombre"],
            "tipo": self.data.get("tipo", "fdm"),
            "marca": self.data.get("marca", None),
            "power_kw": self.data.get("power_kw", 0),
            "dep_hr": self.data.get("dep_hr", 0),
            "cons_hr": self.data.get("cons_hr", 0),
            "lcd_hr": self.data.get("lcd_hr", 0),
            "fep_hr": self.data.get("fep_hr", 0),
            "ipa_per_print": self.data.get("ipa_per_print", 0),
        }

        if not self.existe:
            query = """
            INSERT INTO maquinas (id, nombre, tipo, marca, power_kw, dep_hr, cons_hr, lcd_hr, fep_hr, ipa_per_print)
            VALUES (:id, :nombre, :tipo, :marca, :power_kw, :dep_hr, :cons_hr, :lcd_hr, :fep_hr, :ipa_per_print)
            """
        else:
            query = """
            UPDATE maquinas
            SET nombre = :nombre,
                tipo = :tipo,
                marca = :marca,
                power_kw = :power_kw,
                dep_hr = :dep_hr,
                cons_hr = :cons_hr,
                lcd_hr = :lcd_hr,
                fep_hr = :fep_hr,
                ipa_per_print = :ipa_per_print
            WHERE id = :id
            """

        if not self.conexion.ejecutar(query, maquina):
            self.conexion.rollback()
            raise self.MYE("Error al guardar la máquina")
        self.conexion.commit()
        self.response = {"id": id_maquina}


class DeleteMaquina(NoSession, BaseApi):
    def main(self):
        self.show_me()
        id = self.data["id"]
        query = """
        DELETE FROM maquinas
        WHERE id = :id
        """
        if not self.conexion.ejecutar(query, {"id": id}):
            self.conexion.rollback()
            raise self.MYE("Error al eliminar la máquina")
        self.conexion.commit()
        self.response = {"id": id}
