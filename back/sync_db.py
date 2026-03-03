import sys
import os
from dotenv import load_dotenv
load_dotenv()

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.bases.utils import ClassBase

class DBSync(ClassBase):
    def run(self):
        self.create_conexion()
        schema = """
        -- Novedades
        ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS codigo VARCHAR(20) UNIQUE;
        ALTER TABLE cotizaciones_pendientes ADD COLUMN IF NOT EXISTS cotizacion_id uuid REFERENCES cotizaciones(id) ON DELETE SET NULL;
        ALTER TABLE cotizaciones_pendientes ADD COLUMN IF NOT EXISTS material_sugerido VARCHAR(50);
        ALTER TABLE modelos ADD COLUMN IF NOT EXISTS codigo VARCHAR(20) UNIQUE;

        CREATE TABLE IF NOT EXISTS pedidos (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            codigo varchar(20) UNIQUE, -- PED-XXXXXXXX
            cliente_nombre varchar(100), 
            contacto text,
            estado varchar(50) DEFAULT 'creado',
            created_at timestamp DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS pedido_items (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            pedido_id uuid REFERENCES pedidos(id) ON DELETE CASCADE,
            cotizacion_id uuid REFERENCES cotizaciones(id),
            cantidad int DEFAULT 1,
            notas text
        );

        CREATE TABLE IF NOT EXISTS pedido_comentarios (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            pedido_id uuid REFERENCES pedidos(id) ON DELETE CASCADE,
            is_admin boolean DEFAULT false,
            comentario text,
            is_status_update boolean DEFAULT false,
            new_status varchar(50),
            created_at timestamp DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS pedido_archivos (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            comentario_id uuid REFERENCES pedido_comentarios(id) ON DELETE CASCADE,
            archivo_url text
        );
        """
        for stmt in schema.split(';'):
            if stmt.strip():
                try:
                    self.conexion.ejecutar(stmt.strip())
                except Exception as e:
                    print(f"Error executing statement: {stmt.strip()}\\n{e}")
        self.conexion.commit()
        self.close_conexion()
        print("Schema sync ran successfully.")

if __name__ == "__main__":
    DBSync().run()
