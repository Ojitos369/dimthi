import uuid
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))
from core.utils.security import make_password
from core.bases.db import create_engine

db = create_engine()
if db.consulta_asociativa("SELECT * FROM usuarios WHERE usuario = 'ojitos369'").empty:
    db.ejecutar(
        "INSERT INTO usuarios (id, usuario, password, nombre) VALUES (:id, :usuario, :password, :nombre)", 
        {'id': uuid.uuid4().hex, 'usuario': 'ojitos369', 'password': make_password('ojitos369'), 'nombre': 'Administrador'}
    )
    db.commit()
    print('User created')
else:
    print('User exists')
