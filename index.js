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
app.get('/api/Medicamentos', async(req, res) => {
    try {
        // Conexión a la base de datos
        const pool = await sql.connect(dbConfig);
        // Ejecución de la consulta almacenada sp_obtener_listado_medicamentos en la base de datos
        const result = await pool.request().execute('sp_GetMedicamentos');
        // Envío de la respuesta en formato JSON
        res.json(result.recordset);

    } catch (err) {
        // En caso de error, se envía un mensaje con el error
        res.status(500).send(err.message);
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });