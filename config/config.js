// descripcion: esta es la configuracion de la base de datos mysql, y el servidor express
const mysql = require('mysql');

var connection;

connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'ferremas',
    port: 3306
});

connection.connect(function(err) {
    if (err) console.log(err);
});
    
module.exports = connection;   