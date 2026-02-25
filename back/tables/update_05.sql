
CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(50) PRIMARY KEY,
    usuario VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    nombre VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

