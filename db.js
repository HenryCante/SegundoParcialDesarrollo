const sql = require("mssql");

const config = {
    user: "usr_DesaWebDevUMG",
    password: "!ngGuast@360",
    server: "svr-sql-ctezo.southcentralus.cloudapp.azure.com",
    database: "db_DesaWebDevUMG",
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error("Error en la conexión:", err);
        throw err;
    }
}

module.exports = { sql, getConnection };
