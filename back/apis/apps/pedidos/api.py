import random
import string
import os
from core.bases.apis import NoSession, BaseApi
from core.conf.settings import MEDIA_DIR
import uuid

def generate_codigo():
    return "PED-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

class GenerarPedido(NoSession, BaseApi):
    def main(self):
        self.show_me()
        
        cliente_nombre = self.data.get("cliente_nombre")
        contacto = self.data.get("contacto", "")
        cotizaciones = self.data.get("cotizaciones", [])
        
        if not cotizaciones:
            raise self.MYE("El pedido debe contener al menos una cotización.")
            
        codigo = generate_codigo()
        pedido_id = str(uuid.uuid4())
        
        query_pedido = """
        INSERT INTO pedidos (id, codigo, cliente_nombre, contacto) 
        VALUES (:id, :codigo, :cliente_nombre, :contacto)
        """
        if not self.conexion.ejecutar(query_pedido, {
            "id": pedido_id, 
            "codigo": codigo, 
            "cliente_nombre": cliente_nombre,
            "contacto": contacto
        }):
            self.conexion.rollback()
            raise self.MYE("Error al generar el pedido")
            
        query_item = """
        INSERT INTO pedido_items (id, pedido_id, cotizacion_id, cantidad, notas)
        VALUES (:id, :pedido_id, :cotizacion_id, :cantidad, :notas)
        """
        
        for item in cotizaciones:
            self.conexion.ejecutar(query_item, {
                "id": str(uuid.uuid4()),
                "pedido_id": pedido_id,
                "cotizacion_id": item.get("cotizacion_id", item.get("id")),
                "cantidad": item.get("cantidad", 1),
                "notas": item.get("notas", "")
            })
            
        self.conexion.commit()
        self.response = {"codigo": codigo, "id": pedido_id}

class GetPedidos(NoSession, BaseApi):
    def main(self):
        self.show_me()
        
        codigo = self.data.get("codigo", None)
        
        where = ""
        query_data = {}
        if codigo:
            where = "AND p.codigo = :codigo"
            query_data["codigo"] = codigo

        query = f"""
        SELECT 
            p.id, p.codigo, p.cliente_nombre, p.contacto, p.estado, p.created_at,
            (
                SELECT json_agg(json_build_object(
                    'id', pi.id,
                    'cantidad', pi.cantidad,
                    'notas', pi.notas,
                    'cotizacion', (
                        SELECT json_build_object(
                            'id', c.id,
                            'codigo', c.codigo,
                            'nombre', c.nombre,
                            'precio_final', c.precio_final,
                            'comentarios', c.comentarios,
                            'snapshot_data', c.snapshot_data,
                            'modelos', (
                                SELECT json_agg(json_build_object(
                                    'id', m.id, 
                                    'nombre', m.nombre, 
                                    'link', m.link,
                                    'archivos', (SELECT json_agg(json_build_object('id', am.id, 'archivo_url', am.archivo_url)) FROM (SELECT id, archivo_url FROM archivos_modelos am2 WHERE am2.modelo_id = m.id ORDER BY am2.created_at DESC LIMIT 1) am)
                                ))
                                FROM cotizacion_modelos cm
                                JOIN modelos m ON cm.modelo_id = m.id
                                WHERE cm.cotizacion_id = c.id
                            )
                        )
                        FROM cotizaciones c WHERE c.id = pi.cotizacion_id
                    )
                ))
                FROM pedido_items pi
                WHERE pi.pedido_id = p.id
            ) as items,
            (
                SELECT json_agg(json_build_object(
                    'id', pc.id,
                    'is_admin', pc.is_admin,
                    'comentario', pc.comentario,
                    'is_status_update', pc.is_status_update,
                    'new_status', pc.new_status,
                    'created_at', pc.created_at,
                    'archivos', (
                        SELECT json_agg(json_build_object('id', pa.id, 'archivo_url', pa.archivo_url))
                        FROM pedido_archivos pa WHERE pa.comentario_id = pc.id
                    )
                ) ORDER BY pc.created_at ASC)
                FROM pedido_comentarios pc
                WHERE pc.pedido_id = p.id
            ) as comentarios
        FROM pedidos p
        WHERE 1=1 {where}
        ORDER BY p.created_at DESC
        """
        
        res = self.conexion.consulta_asociativa(query, query_data)
        self.response = {"data": self.d2d(res)}

class AddPedidoComentario(NoSession, BaseApi):
    def main(self):
        self.show_me()
        pedido_id = self.data.get("pedido_id")
        comentario = self.data.get("comentario")
        is_admin = self.data.get("is_admin", False)
        
        comentario_id = self.get_id()
        
        query = """
        INSERT INTO pedido_comentarios (id, pedido_id, is_admin, comentario)
        VALUES (:id, :pedido_id, :is_admin, :comentario)
        """
        
        if not self.conexion.ejecutar(query, {
            "id": comentario_id,
            "pedido_id": pedido_id,
            "is_admin": is_admin,
            "comentario": comentario
        }):
            self.conexion.rollback()
            raise self.MYE("Error al guardar comentario")
            
        if hasattr(self, 'form') and self.form:
            archivos = self.form.getlist("archivos")
        else:
            archivos = []
            
        if archivos:
            query_archivos = "INSERT INTO pedido_archivos (id, comentario_id, archivo_url) VALUES (:id, :comentario_id, :archivo_url)"
            for arch in archivos:
                if not getattr(arch, "filename", None):
                    continue
                
                folder_path = os.path.join(MEDIA_DIR, "pedidos", str(pedido_id))
                os.makedirs(folder_path, exist_ok=True)
                
                filename = f"{uuid.uuid4().hex}_{arch.filename}"
                file_path = os.path.join(folder_path, filename)
                
                contents = arch.file.read()
                if isinstance(contents, bytes):
                    pass
                else: 
                    # If using await file.read(), since we are synchronous, starlette SpooledTemporaryFile allows .read() sync
                    pass
                
                with open(file_path, 'wb') as f:
                    f.write(contents)
                    
                archivo_url = f"pedidos/{pedido_id}/{filename}"
                
                self.conexion.ejecutar(query_archivos, {
                    "id": self.get_id(),
                    "comentario_id": comentario_id,
                    "archivo_url": archivo_url
                })
                
        self.conexion.commit()
        self.response = {"id": comentario_id}

class UpdatePedidoStatus(NoSession, BaseApi):
    def main(self):
        self.show_me()
        pedido_id = self.data.get("pedido_id")
        new_status = self.data.get("estado")
        comentario = self.data.get("comentario", "")
        
        comentario_id = self.get_id()
        
        # 1. Add comment to kardex
        query_comment = """
        INSERT INTO pedido_comentarios (id, pedido_id, is_admin, comentario, is_status_update, new_status)
        VALUES (:id, :pedido_id, true, :comentario, true, :new_status)
        """
        self.conexion.ejecutar(query_comment, {
            "id": comentario_id,
            "pedido_id": pedido_id,
            "comentario": comentario,
            "new_status": new_status
        })
        
        # 2. Update status of the original order
        query_update = "UPDATE pedidos SET estado = :estado WHERE id = :pedido_id"
        if not self.conexion.ejecutar(query_update, {"estado": new_status, "pedido_id": pedido_id}):
            self.conexion.rollback()
            raise self.MYE("Error al actualizar estatus")
            
        self.conexion.commit()
        self.response = {"id": pedido_id, "estado": new_status}
