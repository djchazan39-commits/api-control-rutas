import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, testConnection } from './config/db';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

const ADMIN_NICK = 'admin';
const ADMIN_PASS = 'admin1530';

// ========== LEER DATOS ==========
app.get('/api/datos', async (req, res) => {
  try {
    const usuarios = await pool.query('SELECT id, nombre, rol, nick, pass FROM usuarios ORDER BY id');
    const operadores = await pool.query('SELECT * FROM operadores ORDER BY id');
    const unidades = await pool.query('SELECT * FROM unidades ORDER BY id');
    const clientes = await pool.query('SELECT * FROM clientes ORDER BY id');
    const rutasRaw = await pool.query(`SELECT id, nombre, "idOperador", "idUnidad", "ordenClientes" FROM rutas ORDER BY id`);
    const rutas = rutasRaw.rows.map((r: any) => ({
      ...r,
      ordenClientes: typeof r.ordenClientes === 'string' ? JSON.parse(r.ordenClientes) : r.ordenClientes
    }));
    const entregas = await pool.query(`SELECT id, "idOperador", "idCliente", estado, observaciones, fecha, lat, lon FROM entregas ORDER BY fecha DESC`);
    const combustible = await pool.query(`SELECT id, "idOperador", "kmIni", "kmFin", litros, "costo", fecha FROM combustible ORDER BY fecha DESC`);
    const ubicaciones = await pool.query(`SELECT id, "idOperador", lat, lon, fecha FROM ubicaciones ORDER BY fecha DESC LIMIT 200`);
    
    // ✅ Asegurar administrador con contraseña correcta
    let listaUsuarios = usuarios.rows.map((u: any) => 
      u.nick === ADMIN_NICK ? { ...u, pass: ADMIN_PASS } : u
    );
    
    if (!listaUsuarios.find((u: any) => u.nick === ADMIN_NICK)) {
      listaUsuarios.unshift({ id: 1, nombre: 'Administrador', rol: 'administrador', nick: ADMIN_NICK, pass: ADMIN_PASS });
    }
    
    res.json({
      usuarios: listaUsuarios,
      operadores: operadores.rows,
      unidades: unidades.rows,
      clientes: clientes.rows,
      rutas,
      entregas: entregas.rows,
      combustible: combustible.rows,
      ubicaciones: ubicaciones.rows
    });
  } catch (err: any) {
    console.error('❌ Error LEER:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ========== GUARDAR DATOS ==========
app.post('/api/datos', async (req, res) => {
  try {
    const { usuarios, operadores, unidades, clientes, rutas, entregas, ubicaciones } = req.body;
    
    console.log("📥 RECIBIDO — Usuarios:", usuarios?.length);
    
    // ✅ Limpiar tablas (MENOS USUARIOS — NUNCA SE BORRAN)
    await pool.query('DELETE FROM ubicaciones');
    await pool.query('DELETE FROM combustible');
    await pool.query('DELETE FROM entregas');
    await pool.query('DELETE FROM rutas');
    await pool.query('DELETE FROM clientes');
    await pool.query('DELETE FROM unidades');
    await pool.query('DELETE FROM operadores');
    
    // ✅ ASEGURAR QUE EXISTA EL ADMINISTRADOR
    await pool.query(
      `INSERT INTO usuarios (id, nombre, rol, nick, pass) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (nick) DO UPDATE SET pass = $5`,
      [1, 'Administrador', 'administrador', ADMIN_NICK, ADMIN_PASS]
    );

    // ✅ INSERTAR O ACTUALIZAR USUARIOS — USANDO nick COMO LLAVE ÚNICA
    for (const u of usuarios) {
      if (u.nick !== ADMIN_NICK) {
        try {
          await pool.query(
            `INSERT INTO usuarios (id, nombre, rol, nick, pass) 
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (nick) DO UPDATE 
             SET nombre = $2, rol = $3, pass = $5, id = $1`,
            [u.id, u.nombre, u.rol, u.nick, u.pass || '']
          );
          console.log("✅ USUARIO GUARDADO:", u.nick, "ID:", u.id);
        } catch (e: any) {
          console.log("⚠️ ERROR AL GUARDAR", u.nick, ":", e.message);
        }
      }
    }

    // ✅ Insertar operadores
    for (const o of operadores) {
      await pool.query(
        `INSERT INTO operadores (id, nombre, licencia, vencimiento, telefono, nick, pass) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE 
         SET nombre = $2, licencia = $3, vencimiento = $4, telefono = $5, nick = $6, pass = $7`,
        [o.id, o.nombre, o.licencia || null, o.vencimiento || null, o.telefono || null, o.nick || null, o.pass || null]
      );
    }

    // ✅ Insertar unidades
    for (const u of unidades) {
      await pool.query(
        `INSERT INTO unidades (id, placa, modelo, capacidad) VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET placa = $2, modelo = $3, capacidad = $4`,
        [u.id, u.placa, u.modelo, u.capacidad || null]
      );
    }

    // ✅ Insertar clientes
    for (const c of clientes) {
      await pool.query(
        `INSERT INTO clientes (id, nombre, direccion, lat, lon) VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET nombre = $2, direccion = $3, lat = $4, lon = $5`,
        [c.id, c.nombre, c.direccion || null, c.latitud || c.lat || null, c.longitud || c.lon || null]
      );
    }

    // ✅ Insertar rutas
    for (const r of rutas) {
      await pool.query(
        `INSERT INTO rutas (id, nombre, "idOperador", "idUnidad", "ordenClientes") 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE 
         SET nombre = $2, "idOperador" = $3, "idUnidad" = $4, "ordenClientes" = $5`,
        [r.id, r.nombre, r.operadorId || r.idOperador || null, r.idUnidad || null, JSON.stringify(r.ordenClientes || [])]
      );
    }

    console.log("✅ ✅ TODO GUARDADO — Total usuarios guardados:", usuarios?.length);
    res.json({ ok: true, usuariosGuardados: usuarios?.length });
  } catch (err: any) {
    console.error('❌ ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ========== INICIAR SERVIDOR ==========
async function iniciar() {
  try {
    console.log("🔄 Conectando a PostgreSQL...");
    await testConnection();
    console.log("✅ Conectado a PostgreSQL correctamente");
    const PUERTO = parseInt(process.env.PORT || "10000", 10);
    app.listen(PUERTO, '0.0.0.0', () => {
      console.log(`🚀 Servidor CORRIENDO en puerto ${PUERTO}`);
    });
  } catch (err: any) {
    console.error('❌ ERROR:', err.message);
    process.exit(1);
  }
}

iniciar();