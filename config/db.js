import mysql from "mysql2/promise";
import doenv from "dotenv";
doenv.config();

// Create the connection pool. The pool-specific settings are the defaults
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
});

export default connection;
