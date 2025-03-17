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

// Obtener medicamentos con sus fases (GET)
app.get('/api/MedEnsayo', async(req, res) => {
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

// Obtener entidad reguladora (GET)
app.get('/api/EntidadReg', async(req, res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetEntReguladora');
        res.json(result.recordset);

    }catch(err){
        res.status(500).send(err.message);
    }
});

// Obtener Evento Adversos por Medicamentos
app.get('/api/EvenAdvMed', async(req, res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetEvAdversXMed');
        res.json(result.recordset);
    } catch (err){
        res.status(500).send(err.message);
    }
});

// Obtener inspector por entidad reguladora
app.get('/api/InspcEntd', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetInsXEntReguladora');
        res.json(result.recordset);
    } catch(err){
        res.status(500).send(err.message);
    }

});

// Obtener medicamentos por inspeccion
app.get('/api/MedInsp', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetInsXMed');
        res.json(result.recordset);

    } catch(err){
        res.status(500).send(err.message);
    }
});

// Obtener medicamentos por lotes
app.get('/api/LoteMed', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const  result = await pool.request().execute('sp_GetLotsXMed');
        res.json(result.recordset);
    } catch (err){
        res.status(500).send(err.message);
    }
});

// Obtener medicacmentos
app.get('/api/Meds', async(res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetMed');
        res.json(result.recordset);
    } catch (err){
        res.status(500).send(err.message);
    }
});

// Obtener proveedor de medicamentos
app.get('/api/MedsProv', async(res) =>{
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetMedXProv');
        res.json(result.recordset);
    } catch(err){
        res.status(500).send(err.message);
    }
});

// Obtener listado de proveedores
app.get('/api/Provd', async(res) =>{
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().execute('sp_GetProv');
        res.json(result.recordset);
    } catch(err){
        res.status(500).send(err.message);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });