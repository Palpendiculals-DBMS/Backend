const { Client } = require("pg");

console.log(process.env.DB_URL);
const client = new Client({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

client.connect();
module.exports = client;