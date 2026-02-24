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