//Second Branch

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
};

// Obtener medicamentos con sus fases (GET) - si
app.get('/api/MedEnsayo/:nombreEntidad', async(req, res) => {
    try {
        // Conexión a la base de datos
        const pool = await sql.connect(dbConfig);
        // Ejecución de la consulta almacenada sp_obtener_listado_medicamentos en la base de datos
        const result = await pool.request().execute('sp_GetEnsayosXMed');
        // Envío de la respuesta en formato JSON
        res.json(result.recordset);

    } catch (err) {
        // En caso de error, se envía un mensaje con el error
        res.status(500).send(err.message);
    }
});

// Obtener entidad reguladora (GET) - si
app.get('/api/EntidadReg/:nombreEntidad', async(req, res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetEntReguladora');
        res.json(result.recordset);

    }catch(err){
        res.status(500).send(err.message);
    }
});


// Obtener Eventos Adversos por Medicamento (GET) - no
app.get('/api/EvenAdvMed/:nombreMedicamento', async (req, res) => {
    try {
        // Obtiene el parámetro desde la URL
        const { nombreMedicamento } = req.params;

        // Conexión a la base de datos
        const pool = await sql.connect(dbConfig);

        // Ejecución del procedimiento almacenado con el parámetro
        const result = await pool.request()
            .input('nombreMedicamento', sql.NVarChar, nombreMedicamento)
            .execute('sp_GetEvAdversXMed');

        // Envío de la respuesta en formato JSON
        res.json(result.recordset);

    } catch (err) {
        // En caso de error, se envía un mensaje con el error
        console.error("Error en el servidor:", err.message);
        res.status(500).send(err.message);
    }
});



// Obtener inspector por entidad reguladora - no
app.get('/api/InspcEntd/:nombreMedicamento', async(res) => {
    try {
        const { nombreEntidad } = req.params;  // Obtiene el parámetro desde la URL
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('nombreEntidad', sql.NVarChar, nombreEntidad) // Pasa el parámetro al SP
            .execute('sp_GetInsXEntReguladora');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Obtener medicamentos por inspeccion - si
app.get('/api/MedInsp', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetInsXMed');
        res.json(result.recordset);

    } catch(err){
        res.status(500).send(err.message);
    }
});

// Obtener medicamentos por lotes - si
app.get('/api/LoteMed', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const  result = await pool.request().execute('sp_GetLotsXMed');
        res.json(result.recordset);
    } catch (err){
        res.status(500).send(err.message);
    }
});

// Obtener medicacmentos - no
app.get('/api/Meds', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetMed');
        res.json(result.recordset);
    } catch (err){
        res.status(500).send(err.message);
    }
});

// Obtener proveedor de medicamentos - no
app.get('/api/MedsProv/:nombreProveedor', async(res) =>{
    try{
        const { nombreProveedor } = req.params;  // Obtiene el parámetro desde la URL
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
        .input('nombreProveedor', sql.NVarChar(100), nombreProveedor) // Pasa el parámetro al SP
        .execute('sp_GetMedXProv');
        res.json(result.recordset);
    } catch(err){
        console.error("Error en el servidor:", err.message);
        res.status(500).send(err.message);
    }
});

// Obtener listado de proveedores - no
app.get('/api/Provd', async(res) =>{
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetProv');
        res.json(result.recordset);
    } catch(err){
        res.status(500).send(err.message);
    }
});

// Insertar Ensayo Clínico (POST) - NO
app.post('/api/EnsayoClinico', async (req, res) => {
    try {
        const { id_med, ens_fase, ens_poblacion_objetivo, ens_eficacia_observada, ens_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_med', sql.Int, id_med)
            .input('ens_fase', sql.NVarChar, ens_fase)
            .input('ens_poblacion_objetivo', sql.NVarChar, ens_poblacion_objetivo)
            .input('ens_eficacia_observada', sql.Decimal(5, 2), ens_eficacia_observada)
            .input('ens_estado', sql.Bit, ens_estado)
            .execute('sp_PostEnsClc');
        res.json({ Message: 'Ensayo Clínico inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Entidad Reguladora (POST)
app.post('/api/EntidadReguladora', async (req, res) => {
    try {
        const { ent_nombre, ent_pais, ent_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('ent_nombre', sql.NVarChar, ent_nombre)
            .input('ent_pais', sql.NVarChar, ent_pais)
            .input('ent_estado', sql.Bit, ent_estado)
            .execute('sp_PostEnt');
        res.json({ Message: 'Entidad Reguladora inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Evento Adverso (POST)
app.post('/api/EventosAdversos', async (req, res) => {
    try {
        const { id_tipo_evento, ev_fecha_reporte, id_gravedad, ev_resultado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_tipo_evento', sql.Int, id_tipo_evento)
            .input('ev_fecha_reporte', sql.Date, ev_fecha_reporte)
            .input('id_gravedad', sql.Int, id_gravedad)
            .input('ev_resultado', sql.Text, ev_resultado)
            .execute('sp_PostEvenAd');
        res.json({ Message: 'Evento Adverso inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Inspección (POST)
app.post('/api/Inspeccion', async (req, res) => {
    try {
        const { id_med, id_lote, id_proveedor, id_entidadreguladora, ins_fecha, ins_requisitos, ins_observaciones } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_med', sql.Int, id_med)
            .input('id_lote', sql.Int, id_lote)
            .input('id_proveedor', sql.Int, id_proveedor)
            .input('id_entidadreguladora', sql.Int, id_entidadreguladora)
            .input('ins_fecha', sql.Date, ins_fecha)
            .input('ins_requisitos', sql.Text, ins_requisitos)
            .input('ins_observaciones', sql.Text, ins_observaciones)
            .execute('sp_PostINS');
        res.json({ Message: 'Inspección inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Inspector (POST)
app.post('/api/Inspector', async (req, res) => {
    try {
        const { id_entidadreguladora, inspec_nombre, inspec_apellido, inspec_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_entidadreguladora', sql.Int, id_entidadreguladora)
            .input('inspec_nombre', sql.NVarChar, inspec_nombre)
            .input('inspec_apellido', sql.NVarChar, inspec_apellido)
            .input('inspec_estado', sql.Bit, inspec_estado)
            .execute('sp_PostInspector');
        res.json({ Message: 'Inspector inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Lote de Medicamento (POST)
app.post('/api/LoteMedicamento', async (req, res) => {
    try {
        const { id_med, lot_fecha_fabricacion, lot_fecha_vencimiento, lot_cantidad_producida, lot_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_med', sql.Int, id_med)
            .input('lot_fecha_fabricacion', sql.Date, lot_fecha_fabricacion)
            .input('lot_fecha_vencimiento', sql.Date, lot_fecha_vencimiento)
            .input('lot_cantidad_producida', sql.Int, lot_cantidad_producida)
            .input('lot_estado', sql.Bit, lot_estado)
            .execute('sp_PostLots');
        res.json({ Message: 'Lote de Medicamento inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Medicamento (POST)
app.post('/api/Medicamento', async (req, res) => {
    try {
        const { id_proveedor, id_tipo_medicamento, med_nombre, med_descripcion, med_nivel_riesgo, med_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id_proveedor', sql.Int, id_proveedor)
            .input('id_tipo_medicamento', sql.Int, id_tipo_medicamento)
            .input('med_nombre', sql.NVarChar, med_nombre)
            .input('med_descripcion', sql.NVarChar, med_descripcion)
            .input('med_nivel_riesgo', sql.TinyInt, med_nivel_riesgo)
            .input('med_estado', sql.Bit, med_estado)
            .execute('sp_PostMed');
        res.json({ Message: 'Medicamento inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Proveedor (POST)
app.post('/api/Proveedor', async (req, res) => {
    try {
        const { pro_nombre, pro_ubicacion, pro_historial, pro_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('pro_nombre', sql.NVarChar, pro_nombre)
            .input('pro_ubicacion', sql.NVarChar, pro_ubicacion)
            .input('pro_historial', sql.Text, pro_historial)
            .input('pro_estado', sql.Bit, pro_estado)
            .execute('sp_PostProv');
        res.json({ Message: 'Proveedor inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Insertar Tipo Medicamento (POST)
app.post('/api/TipoMedicamento', async (req, res) => {
    try {
        const { tipom_nombre, tipom_descripcion, tipom_estado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('tipom_nombre', sql.NVarChar, tipom_nombre)
            .input('tipom_descripcion', sql.NVarChar, tipom_descripcion)
            .input('tipom_estado', sql.Bit, tipom_estado)
            .execute('sp_PostTpoMed');
        res.json({ Message: 'Tipo Medicamento inserted successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Ensayo Clínico (SET)
app.post('/api/SetEnsayoClinicoEstado', async (req, res) => {
    try {
        const { idEnsayo, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idEnsayo', sql.Int, idEnsayo)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetEnsClcEST');
        res.json({ Message: 'Ensayo Clínico estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Entidad Reguladora (SET)
app.post('/api/SetEntidadReguladoraEstado', async (req, res) => {
    try {
        const { idEntidad, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idEntidad', sql.Int, idEntidad)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetEntReguladoraEST');
        res.json({ Message: 'Entidad Reguladora estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Inspector (SET)
app.post('/api/SetInspectorEstado', async (req, res) => {
    try {
        const { idInspector, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idInspector', sql.Int, idInspector)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetInsEST');
        res.json({ Message: 'Inspector estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Lote (SET)
app.post('/api/SetLoteEstado', async (req, res) => {
    try {
        const { idLote, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idLote', sql.Int, idLote)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetLotEST');
        res.json({ Message: 'Lote estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Medicamento (SET)
app.post('/api/SetMedicamentoEstado', async (req, res) => {
    try {
        const { idMedicamento, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idMedicamento', sql.Int, idMedicamento)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetMedEST');
        res.json({ Message: 'Medicamento estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Proveedor (SET)
app.post('/api/SetProveedorEstado', async (req, res) => {
    try {
        const { idProveedor, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idProveedor', sql.Int, idProveedor)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetProvEST');
        res.json({ Message: 'Proveedor estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar estado de Tipo Medicamento (SET)
app.post('/api/SetTipoMedicamentoEstado', async (req, res) => {
    try {
        const { idTipoMedicamento, nuevoEstado } = req.body;
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('idTipoMedicamento', sql.Int, idTipoMedicamento)
            .input('nuevoEstado', sql.Bit, nuevoEstado)
            .execute('sp_SetTipoMedEST');
        res.json({ Message: 'Tipo Medicamento estado updated successfully' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
