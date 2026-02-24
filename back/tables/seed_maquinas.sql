-- Seed default printers (run after init.sql)
-- These are the printers that were previously hardcoded in the calculator

INSERT INTO maquinas (nombre, tipo, marca, power_kw, dep_hr, cons_hr, lcd_hr, fep_hr, ipa_per_print) VALUES
    ('Ender 3 V3 KE',     'fdm', 'Creality',  0.15,   1.20, 0.30, 0,    0,    0),
    ('Photon Mono 4K',    'sla', 'Anycubic',  0.045,  1.00, 0,    0.40, 1.50, 0.02);
