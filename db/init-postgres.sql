CREATE TABLE IF NOT EXISTS establecimientos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    ris TEXT,
    latitud REAL,
    longitud REAL
);

CREATE TABLE IF NOT EXISTS lineas (
    id_linea SERIAL PRIMARY KEY,
    id_establecimiento TEXT NOT NULL REFERENCES establecimientos(id),
    proveedor TEXT NOT NULL,
    numero_linea TEXT,
    ip_publica TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS historial (
    id SERIAL PRIMARY KEY,
    id_linea INT NOT NULL REFERENCES lineas(id_linea),
    estado TEXT NOT NULL,
    latencia INT,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO establecimientos (id, nombre, ris, latitud, longitud) VALUES
('010001','C.M.I. RÍMAC','RIMAC',-12.0344098,-77.0335686),
('010003','C.S CIUDAD Y CAMPO','RIMAC',-12.0242161,-77.0283684);

INSERT INTO lineas (id_establecimiento, proveedor, numero_linea, ip_publica) VALUES
('010001','FIBER PRO',NULL,'181.233.26.142'),
('010003','FIBER PRO',NULL,'201.218.159.210');
