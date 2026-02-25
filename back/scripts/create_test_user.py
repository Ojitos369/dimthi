import uuid
import sys
import os

# Añadir el directorio actual al path para las importaciones de core
sys.path.append(os.path.join(os.path.dirname(__file__)))

from core.utils.security import make_password
from core.conf.settings import db_data, ce, prod_mode
from ojitos369_postgres_db.postgres_db import ConexionPostgreSQL

def create_test_user():
    db = ConexionPostgreSQL(db_data, ce=ce, send_error=prod_mode, parameter_indicator=':')
    
    # Verificar si el usuario ya existe
    res = db.consulta_asociativa("SELECT * FROM usuarios WHERE usuario = 'test'")
    if res.empty:
        user_id = uuid.uuid4().hex
        db.ejecutar(
            "INSERT INTO usuarios (id, usuario, password, nombre) VALUES (:id, :usuario, :password, :nombre)", 
            {'id': user_id, 'usuario': 'test', 'password': make_password('test'), 'nombre': 'Test User'}
        )
        db.commit()
        print("Usuario 'test' creado exitosamente.")
    else:
        print("El usuario 'test' ya existe.")
    
    db.close()

if __name__ == "__main__":
    create_test_user()
