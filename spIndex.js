const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a SQL Server
const sql = require('mssql');
const dbConfig = {
    user: 'sqladmin',
    password: 'Admin123',
    server: '34.136.224.59',
    database: 'MEDICAMENTOS',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
}

// Obtener listado de medicamentos (GET)
app.get('/api/Medicamentos', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_obtener_listado_medicamentos');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Obtener listado de medicamentos con tipo, proveedor y nivel de riesgo tipificados (GET)
app.get('/api/MedicamentosDetallados', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_obtener_medicamentos_con_detalles');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// API para insertar un medicamento (POST)
app.post('/api/medicamento', async (req, res) => {
    const { id_proveedor, id_tipomedicamento, med_nombre, med_descripcion, med_nivel_riesgo, med_estado } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query`EXEC sp_insertar_medicamento @id_proveedor = ${id_proveedor}, @id_tipomedicamento = ${id_tipomedicamento}, @med_nombre = ${med_nombre}, @med_descripcion = ${med_descripcion}, @med_nivel_riesgo = ${med_nivel_riesgo}, @med_estado = ${med_estado}`;
        res.status(200).send('Medicamento insertado correctamente');
    } catch (err) {
        res.status(500).send('Error al insertar medicamento: ' + err.message);
    }
});

// API para insertar una inspección (POST)
app.post('/api/inspeccion', async (req, res) => {
    const { id_med, id_lote, id_proveedor, id_entidadreguladora, ins_fecha, ins_requisitos, ins_observaciones } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query`EXEC sp_insertar_inspeccion @id_med = ${id_med}, @id_lote = ${id_lote}, @id_proveedor = ${id_proveedor}, @id_entidadreguladora = ${id_entidadreguladora}, @ins_fecha = ${ins_fecha}, @ins_requisitos = ${ins_requisitos}, @ins_observaciones = ${ins_observaciones}`;
        res.status(200).send('Inspección insertada correctamente');
    } catch (err) {
        res.status(500).send('Error al insertar inspección: ' + err.message);
    }
});

// API para insertar un evento adverso (POST)
app.post('/api/evento-adverso', async (req, res) => {
    const { id_evento, id_medicamento, id_tipo_evento, ev_fecha_report, ev_gravedad, ev_resultado } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query`EXEC sp_insertar_evento_adverso @id_evento = ${id_evento}, @id_medicamento = ${id_medicamento}, @id_tipo_evento = ${id_tipo_evento}, @ev_fecha_report = ${ev_fecha_report}, @ev_gravedad = ${ev_gravedad}, @ev_resultado = ${ev_resultado}`;
        res.status(200).send('Evento adverso insertado correctamente');
    } catch (err) {
        res.status(500).send('Error al insertar evento adverso: ' + err.message);
    }
});

// API para insertar un ensayo clínico (POST)
app.post('/api/ensayo-clinico', async (req, res) => {
    const { id_med, ens_fase, ens_poblacion_objetivo, ens_eficacia_observada, ens_estado } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query`EXEC sp_insertar_ensayo_clinico @id_med = ${id_med}, @ens_fase = ${ens_fase}, @ens_poblacion_objetivo = ${ens_poblacion_objetivo}, @ens_eficacia_observada = ${ens_eficacia_observada}, @ens_estado = ${ens_estado}`;
        res.status(200).send('Ensayo clínico insertado correctamente');
    } catch (err) {
        res.status(500).send('Error al insertar ensayo clínico: ' + err.message);
    }
});

// API para insertar un lote de medicamento (POST)
app.post('/api/lote-medicamento', async (req, res) => {
    const { id_medicamento, lot_fecha_fabricacion, lot_fecha_vencimiento, lot_cantidad_producida, lot_estado } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query`EXEC sp_insertar_lote_medicamento @id_medicamento = ${id_medicamento}, @lot_fecha_fabricacion = ${lot_fecha_fabricacion}, @lot_fecha_vencimiento = ${lot_fecha_vencimiento}, @lot_cantidad_producida = ${lot_cantidad_producida}, @lot_estado = ${lot_estado}`;
        res.status(200).send('Lote de medicamento insertado correctamente');
    } catch (err) {
        res.status(500).send('Error al insertar lote de medicamento: ' + err.message);
    }
});

// API para insertar un proveedor (POST)
app.post('/api/proveedor', async (req, res) => {
    const { prov_nombre, prov_ubicacion, prov_calidad, prov_historial } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query`EXEC sp_insertar_proveedor @prov_nombre = ${prov_nombre}, @prov_ubicacion = ${prov_ubicacion}, @prov_calidad = ${prov_calidad}, @prov_historial = ${prov_historial}`;
        res.status(200).send('Proveedor insertado correctamente');
    } catch (err) {
        res.status(500).send('Error al insertar proveedor: ' + err.message);
    }
});

// API para insertar un tipo de medicamento (POST)
app.post('/api/tipo-medicamento', async (req, res) => {
    const { tipom_nombre, tipom_descripcion, tipom_estado } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query`EXEC sp_insertar_tipo_medicamento @tipom_nombre = ${tipom_nombre}, @tipom_descripcion = ${tipom_descripcion}, @tipom_estado = ${tipom_estado}`;
        res.status(200).send('Tipo de medicamento insertado correctamente');
    } catch (err) {
        res.status(500).send('Error al insertar tipo de medicamento: ' + err.message);
    }
});

// API para insertar un tipo de evento (POST)
app.post('/api/tipo-evento', async (req, res) => {
    const { nombre_evento, descripcion_evento } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request().query`EXEC sp_insertar_tipo_evento @nombre_evento = ${nombre_evento}, @descripcion_evento = ${descripcion_evento}`;
        res.status(200).send('Tipo de evento insertado correctamente');
    } catch (err) {
        res.status(500).send('Error al insertar tipo de evento: ' + err.message);
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
