-- postgresql
/* 
dr rm -f dimt-dbl && \
dr run --name dimt-dbl -d \
    -e POSTGRES_DB=dimt \
    -e POSTGRES_USER=dimt \
    -e POSTGRES_PASSWORD=dimt \
    -e TZ=America/Mexico_City \
    -p 5438:5432 \
    postgres

docker exec -it dimt-dbl psql -U dimt -d dimt

export DB_HOST="localhost"
export DB_USER="dimt"
export DB_PASSWORD="dimt"
export DB_NAME="dimt"
export DB_PORT="5438"

*/


CREATE TABLE maquinas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar(100) NOT NULL,
    tipo varchar(10) NOT NULL DEFAULT 'fdm',  -- 'fdm' o 'sla'
    marca varchar(50),
    power_kw decimal(10,4) DEFAULT 0,
    dep_hr decimal(10,4) DEFAULT 0,
    cons_hr decimal(10,4) DEFAULT 0,
    lcd_hr decimal(10,4) DEFAULT 0,
    fep_hr decimal(10,4) DEFAULT 0,
    ipa_per_print decimal(10,4) DEFAULT 0,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE filamentos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar(50),
    color varchar(50),
    marca varchar(50),
    peso_kg decimal(10,2),
    precio_kg decimal(10,2)
);


CREATE TABLE resinas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar(50) NOT NULL,
    color varchar(50),
    marca varchar(50),
    peso_kg decimal(10,2),
    precio_kg decimal(10,2)
);


CREATE TABLE perfiles_costos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar(50) NOT NULL,
    filamento_id uuid REFERENCES filamentos(id),
    resina_id uuid REFERENCES resinas(id),
    maquina_id uuid REFERENCES maquinas(id),
    luz_kw decimal(10,2),
    desgaste_impresora decimal(10,2),
    mano_obra decimal(10,2),
    gastos_generales decimal(10,2),
    margen_utilidad decimal(10,2),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_filamento FOREIGN KEY (filamento_id) REFERENCES filamentos(id),
    CONSTRAINT fk_resina FOREIGN KEY (resina_id) REFERENCES resinas(id)
);


CREATE TABLE modelos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar(50) NOT NULL,
    descripcion text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE archivos_modelos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    modelo_id uuid REFERENCES modelos(id),
    archivo_url text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_modelo FOREIGN KEY (modelo_id) REFERENCES modelos(id)
);

CREATE TABLE cotizaciones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    modelo_id uuid REFERENCES modelos(id),
    perfil_costo_id uuid REFERENCES perfiles_costos(id),
    costo_total decimal(10,2),
    consto_material decimal(10,2),
    consto_luz decimal(10,2),
    consto_desgaste decimal(10,2),
    consto_mano_obra decimal(10,2),
    consto_gastos_generales decimal(10,2),
    consto_margen_utilidad decimal(10,2),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_modelo FOREIGN KEY (modelo_id) REFERENCES modelos(id),
    CONSTRAINT fk_perfil_costo FOREIGN KEY (perfil_costo_id) REFERENCES perfiles_costos(id)
);

INSERT INTO maquinas (nombre, tipo, marca, power_kw, dep_hr, cons_hr, lcd_hr, fep_hr, ipa_per_print) VALUES
    ('Ender 3 V3 KE',     'fdm', 'Creality',  0.15,   1.20, 0.30, 0,    0,    0),
    ('Photon Mono 4K',    'sla', 'Anycubic',  0.045,  1.00, 0,    0.40, 1.50, 0.02);


ALTER TABLE modelos ADD COLUMN link varchar(500);
ALTER TABLE modelos ADD COLUMN IF NOT EXISTS estatus_privacidad VARCHAR(20) DEFAULT 'publico';
ALTER TABLE modelos ADD COLUMN IF NOT EXISTS estatus_validacion VARCHAR(20) DEFAULT 'validado';
ALTER TABLE cotizaciones DROP CONSTRAINT IF EXISTS fk_modelo;
ALTER TABLE cotizaciones DROP COLUMN IF EXISTS modelo_id;
ALTER TABLE cotizaciones ADD COLUMN comentarios text;
ALTER TABLE cotizaciones ADD COLUMN precio_final decimal(10,2);

CREATE TABLE cotizacion_modelos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cotizacion_id uuid REFERENCES cotizaciones(id) ON DELETE CASCADE,
    modelo_id uuid REFERENCES modelos(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cotizacion FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id),
    CONSTRAINT fk_modelo_cotizacion FOREIGN KEY (modelo_id) REFERENCES modelos(id)
);

CREATE TABLE compras (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cotizacion_id uuid REFERENCES cotizaciones(id) ON DELETE SET NULL,
    cantidad integer NOT NULL DEFAULT 1,
    usuario varchar(100),
    comentario text,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cotizacion_compra FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id)
);

ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS nombre VARCHAR(255);
ALTER TABLE compras ADD COLUMN IF NOT EXISTS nombre VARCHAR(255);


ALTER TABLE filamentos ADD COLUMN IF NOT EXISTS link_compra VARCHAR(500);
ALTER TABLE resinas ADD COLUMN IF NOT EXISTS link_compra VARCHAR(500);


ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS snapshot_data TEXT;


CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(50) PRIMARY KEY,
    usuario VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    nombre VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);


ALTER TABLE perfiles_costos ADD COLUMN IF NOT EXISTS tipo_material VARCHAR(20) DEFAULT 'filamento';

CREATE TABLE cotizaciones_pendientes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar(100), -- Identificador del cliente u orden
    comentarios text,
    estado varchar(20) DEFAULT 'pendiente', -- pendiente, resuelta
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cotizacion_modelos_pendientes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cotizacion_pdte_id uuid REFERENCES cotizaciones_pendientes(id) ON DELETE CASCADE,
    modelo_id uuid REFERENCES modelos(id) ON DELETE CASCADE,
    cantidad integer DEFAULT 1,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);


-- -------------------   NUEVOS CAMBIOS AGREGAR DEBAJO   -------------------

ALTER TABLE filamentos ALTER COLUMN link_compra TYPE TEXT;
ALTER TABLE resinas ALTER COLUMN link_compra TYPE TEXT;

CREATE TABLE IF NOT EXISTS archivos_cotizaciones_pendientes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cotizacion_pdte_id uuid REFERENCES cotizaciones_pendientes(id) ON DELETE CASCADE,
    archivo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
