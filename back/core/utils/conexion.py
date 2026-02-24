import re
from ojitos369_postgres_db.postgres_db import ConexionPostgreSQL

# :nombre  ->  %(nombre)s   (evita ::tipo con lookbehind)
_PARAM_NAMED = re.compile(r'(?<!:):([A-Za-z_][A-Za-z0-9_]*)')

class MyDBConexion(ConexionPostgreSQL):
    # ---------- helpers ----------
    def _extract_params(self, args, kwargs):
        # 1) params=...
        if 'params' in kwargs and isinstance(kwargs['params'], (dict, list, tuple, set)):
            return kwargs['params']
        # 2) primer posicional como params
        if args and isinstance(args[0], (dict, list, tuple, set)):
            return args[0]
        # 3) kwargs sueltos (opcional): junta si no hay params explícitos
        if 'params' not in kwargs and not args:
            control = {'params', 'page', 'limit', 'offset', 'orderby'}
            maybe = {k: v for k, v in kwargs.items() if k not in control}
            if maybe:
                return maybe
        return None

    def _replace(self, query: str) -> str:
        return _PARAM_NAMED.sub(lambda m: f"%({m.group(1)})s", query)

    def _prep(self, query, *args, **kwargs):
        q = self._replace(query)
        p = self._extract_params(args, kwargs)

        # El padre usa self.query/self.params:
        self.query = q
        if p is not None:
            self.params = p

        return q, p

    # ---------- overrides ----------
    def consulta(self, query, *args, **kwargs):
        q, p = self._prep(query, *args, **kwargs)
        if p is not None:
            return super().consulta(q, p, **kwargs)
        else:
            return super().consulta(q, *args, **kwargs)

    def ejecutar_funcion(self, query, *args, **kwargs):
        q, p = self._prep(query, *args, **kwargs)
        if p is not None:
            return super().ejecutar_funcion(q, p, **kwargs)
        else:
            return super().ejecutar_funcion(q, *args, **kwargs)

    def consulta_asociativa(self, query, *args, **kwargs):
        q, p = self._prep(query, *args, **kwargs)
        if p is not None:
            return super().consulta_asociativa(q, p, **kwargs)
        else:
            return super().consulta_asociativa(q, *args, **kwargs)

    def ejecutar(self, query, *args, **kwargs):
        q, p = self._prep(query, *args, **kwargs)
        if p is not None:
            return super().ejecutar(q, p, **kwargs)
        else:
            return super().ejecutar(q, *args, **kwargs)

    def ejecutar_multiple(self, query, *args, **kwargs):
        q, p = self._prep(query, *args, **kwargs)
        if p is not None:
            return super().ejecutar_multiple(q, p, **kwargs)
        else:
            return super().ejecutar_multiple(q, *args, **kwargs)

    def paginador(self, query, *args, **kwargs):
        q, p = self._prep(query, *args, **kwargs)
        if p is not None:
            return super().paginador(q, p, **kwargs)
        else:
            return super().paginador(q, *args, **kwargs)
