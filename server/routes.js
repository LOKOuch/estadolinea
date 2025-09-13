const express = require('express');
const router = express.Router();
const pool = require('./database');

// Obtener establecimientos con líneas
router.get('/establecimientos', async (req, res) => {
    try {
        const estab = await pool.query(`
            SELECT e.*, json_agg(l.*) AS lineas
            FROM establecimientos e
            LEFT JOIN lineas l ON e.id = l.id_establecimiento
            GROUP BY e.id
        `);
        res.json(estab.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Historial de línea
router.get('/historial/:id_linea', async (req, res) => {
    const { id_linea } = req.params;
    try {
        const historial = await pool.query(`
            SELECT estado, latencia, fecha_hora
            FROM historial
            WHERE id_linea = $1
            ORDER BY fecha_hora DESC
            LIMIT 50
        `, [id_linea]);
        res.json(historial.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
