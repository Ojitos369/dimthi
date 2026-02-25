ALTER TABLE modelos ADD COLUMN link varchar(500);

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
