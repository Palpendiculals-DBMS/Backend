let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2june2002',
  database: 'YangForm'
});

connection.connect();

module.exports = connection;