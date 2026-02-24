import sys
import asyncio
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
        res = await api.run()
        print("SUCCESS:", res)
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    asyncio.run(test())
