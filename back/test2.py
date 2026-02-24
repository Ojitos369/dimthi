import sys
import asyncio
import copy

import psycopg2
from apis.apps.maquinas.api import GetMaquinas

async def test():
    class DummyRequest:
        query_params = {}
        headers = {"authorization": "demo"}
        cookies = {}
        client = type("Client", (), {"host": "127.0.0.1"})

    req = DummyRequest()
    api = GetMaquinas(request=req)
    try:
        from core.conf.settings import db_data
        # If the local script can't connect to production IP, redirect it to local docker manually
        local_db = copy.deepcopy(db_data)
        local_db['host'] = "127.0.0.1"
        local_db['port'] = 5438
        
        from ojitos369_postgres_db.postgres_db import ConexionPostgreSQL
        from core.conf.settings import ce, prod_mode
        api.close_conexion()
        api.conexion = ConexionPostgreSQL(local_db, ce=ce, send_error=prod_mode, parameter_indicator=':')
        api.conexion.raise_error = True
        
        res = await api.run()
        print("SUCCESS:", res)
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    asyncio.run(test())
