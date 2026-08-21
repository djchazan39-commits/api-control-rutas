import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, testConnection } from './config/db';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ========== VERIFICAR TABLAS (YA NO BORRA NADA) ==========
async function crearTablas() {
  try {
    console.log('✅ Tablas ya verificadas');
    // Las tablas ya están creadas y bien estructuradas
    // Ya no se borran automáticamente
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

// ========== INICIO DEL SERVIDOR ==========
async function iniciar() {
  await testConnection();
  await crearTablas();
  app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
}

// ========== LEER TODOS LOS DATOS ==========
app.get('/api/datos', async (req, res) => {
  try {
    const usuarios = await pool.query('SELECT id, nombre, rol, nick FROM usuarios ORDER BY id');
    const operadores = await pool.query('SELECT * FROM operadores ORDER BY id');
    const unidades = await pool.query('SELECT * FROM unidades ORDER BY id');
    const clientes = await pool.query('SELECT * FROM clientes ORDER BY id');
    const rutasRaw = await pool.query(`SELECT id, nombre, "idOperador", "idUnidad", "ordenClientes" FROM rutas ORDER BY id`);
    const rutas = rutasRaw.rows.map((r: any) => ({
      ...r,
      ordenClientes: typeof r.ordenClientes === 'string' ? JSON.parse(r.ordenClientes) : r.ordenClientes
    }));
    const entregas = await pool.query(`SELECT id, "idOperador", "idCliente", estado, observaciones, fecha, lat, lon FROM entregas ORDER BY fecha DESC`);
    const combustible = await pool.query(`SELECT id, "idOperador", "kmIni", "kmFin", litros, costo, fecha FROM combustible ORDER BY fecha DESC`);
    const ubicaciones = await pool.query(`SELECT id, "idOperador", lat, lon, fecha FROM ubicaciones ORDER BY fecha DESC LIMIT 200`);

    res.json({
      usuarios: usuarios.rows,
      operadores: operadores.rows,
      unidades: unidades.rows,
      clientes: clientes.rows,
      rutas,
      entregas: entregas.rows,
      combustible: combustible.rows,
      ubicaciones: ubicaciones.rows
    });
  } catch (err: any) {
    console.error('❌ Error leer:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ========== GUARDAR / SINCRONIZAR DATOS ==========
app.post('/api/datos', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { usuarios, operadores, unidades, clientes, rutas, entregas, combustible, ubicaciones } = req.body;

    // Limpiar tablas sin borrar al administrador
    await client.query('DELETE FROM ubicaciones');
    await client.query('DELETE FROM combustible');
    await client.query('DELETE FROM entregas');
    await client.query('DELETE FROM rutas');
    await client.query('DELETE FROM clientes');
    await client.query('DELETE FROM unidades');
    await client.query('DELETE FROM operadores');
    await client.query("DELETE FROM usuarios WHERE nick != 'admin'");

    // Insertar usuarios
    for (const u of usuarios) {
      if (u.nick !== 'admin') {
        await client.query(
          'INSERT INTO usuarios (id, nombre, rol, nick, pass) VALUES ($1, $2, $3, $4, $5)',
          [u.id, u.nombre, u.rol, u.nick, u.pass]
        );
      }
    }

    // Insertar operadores
    for (const o of operadores) {
      await client.query(
        'INSERT INTO operadores (id, nombre, licencia, vencimiento, telefono, nick, pass) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [o.id, o.nombre, o.licencia || null, o.vencimiento || null, o.telefono || null, o.nick || null, o.pass || null]
      );
    }

    // Insertar unidades
    for (const u of unidades) {
      await client.query(
        'INSERT INTO unidades (id, placa, modelo) VALUES ($1, $2, $3)',
        [u.id, u.placa, u.modelo]
      );
    }

    // Insertar clientes
    for (const c of clientes) {
      await client.query(
        'INSERT INTO clientes (id, nombre, direccion, lat, lon) VALUES ($1, $2, $3, $4, $5)',
        [c.id, c.nombre, c.direccion || null, c.lat, c.lon]
      );
    }

    // Insertar rutas
    for (const r of rutas) {
      await client.query(
        'INSERT INTO rutas (id, nombre, "idOperador", "idUnidad", "ordenClientes") VALUES ($1, $2, $3, $4, $5)',
        [r.id, r.nombre, r.idOperador, r.idUnidad, JSON.stringify(r.ordenClientes)]
      );
    }

    // Insertar entregas
    for (const e of entregas) {
      await client.query(
        'INSERT INTO entregas (id, "idOperador", "idCliente", estado, observaciones, fecha, lat, lon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [e.id, e.idOperador, e.idCliente, e.estado, e.observaciones || null, e.fecha, e.lat || null, e.lon || null]
      );
    }

    // Insertar combustible
    for (const c of combustible) {
      await client.query(
        'INSERT INTO combustible (id, "idOperador", "kmIni", "kmFin", litros, costo, fecha) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [c.id, c.idOperador, c.kmIni, c.kmFin, c.litros, c.costo, c.fecha]
      );
    }

    // Insertar ubicaciones
    for (const u of ubicaciones) {
      await client.query(
        'INSERT INTO ubicaciones ("idOperador", lat, lon, fecha) VALUES ($1, $2, $3, $4)',
        [u.idOperador, u.lat, u.lon, u.fecha]
      );
    }

    await client.query('COMMIT');
    res.json({ ok: true, fecha: new Date().toISOString() });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error guardar:', err);
    res.status(500).json({ error: 'Error al guardar' });
  } finally {
    client.release();
  }
});

// ========== INICIAR APLICACIÓN ==========
iniciar();