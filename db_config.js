const mysql = require('mysql');

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',    // Cambia esto si tu base de datos está en otro host
    user: 'root',         // Tu usuario de MySQL
    password: '', // Tu contraseña de MySQL
    database: 'sensores'  // La base de datos que creaste
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = db;

