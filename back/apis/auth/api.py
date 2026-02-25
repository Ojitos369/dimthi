from core.bases.apis import BaseApi, pln
from core.utils.security import check_password

class Login(BaseApi):
    def main(self):
        self.show_me()
        user = self.data.get("usuario")
        password = self.data.get("passwd")
        if not user or not password:
            raise self.MYE("Falta usuario o contraseña")

        usuario = self.conexion.consulta_asociativa("SELECT * FROM usuarios WHERE usuario = :user", {"user": user})
        if usuario.empty:
            raise self.MYE("Usuario no encontrado")
        usuario = usuario.iloc[0].to_dict()

        if not check_password(password, usuario["password"]):
            raise self.MYE("Contraseña incorrecta")

        token = self.get_id()
        # En versión simplificada, pasamos data útil al frontend
        self.response = {
            "user": {
                "id": usuario["id"],
                "usuario": usuario["usuario"],
                "nombre": usuario["nombre"]
            },
            "token": token
        }

    def validate_session(self):
        pass

class ValidateLogin(BaseApi):
    def main(self):
        self.response = {
            "user": {},
            "token": self.token
        }

