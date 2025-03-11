const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const PORT = 3001;

// Configuración de la conexión a SQL Server
const sql = require('mssql');
const dbConfig = {
    user: 'sqladmin',
    password: 'DesarrolloWeb1',
    server: '34.136.224.59',
    database: 'MEDICAMENTOS',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },

}

