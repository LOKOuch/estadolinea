const { exec } = require('child_process');
const pool = require('../server/database');

async function pingLinea(ip) {
    return new Promise(resolve => {
        const start = Date.now();
        exec(`ping -n 1 ${ip}`, (error) => {
            const latencia = Date.now() - start;
            const estado = error ? 'offline' : 'online';
            resolve({ estado, latencia });
        });
    });
}

async function actualizarEstado() {
    const lineas = await pool.query('SELECT id_linea, ip_publica FROM lineas');
    for (const linea of lineas.rows) {
        const { estado, latencia } = await pingLinea(linea.ip_publica);
        const last = await pool.query(`
            SELECT estado FROM historial
            WHERE id_linea = $1
            ORDER BY fecha_hora DESC
            LIMIT 1
        `, [linea.id_linea]);
        if (!last.rows[0] || last.rows[0].estado !== estado) {
            await pool.query(`
                INSERT INTO historial (id_linea, estado, latencia)
                VALUES ($1,$2,$3)
            `, [linea.id_linea, estado, latencia]);
            console.log(`Linea ${linea.id_linea} cambió a ${estado}`);
        }
    }
}

setInterval(actualizarEstado, 30000);
actualizarEstado();
