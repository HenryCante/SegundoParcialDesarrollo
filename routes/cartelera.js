const express = require("express");
const router = express.Router();
const { getConnection, sql } = require("../db");

/**
 * @swagger
 * components:
 *   schemas:
 *     Pelicula:
 *       type: object
 *       required:
 *         - imdbID
 *         - Title
 *         - Year
 *         - Type
 *       properties:
 *         imdbID:
 *           type: string
 *           description: ID de IMDB
 *         Title:
 *           type: string
 *           description: Título de la película
 *         Year:
 *           type: string
 *           description: Año de lanzamiento
 *         Type:
 *           type: string
 *           description: Género
 *         Poster:
 *           type: string
 *           description: URL del póster
 *         Estado:
 *           type: boolean
 *           description: Estado activo/inactivo
 *         description:
 *           type: string
 *           description: Descripción de la película
 *         Ubication:
 *           type: string
 *           description: Ubicación del cine
 */

/**
 * @swagger
 * /cartelera:
 *   post:
 *     summary: Inserta una nueva película en la cartelera
 *     tags: [Cartelera]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pelicula'
 *     responses:
 *       200:
 *         description: Registro insertado correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", async (req, res) => {
    const { imdbID, Title, Year, Type, Poster, Estado, description, Ubication } = req.body;

    if (!imdbID || !Title || !Year || !Type) {
        return res.status(400).json({ codError: "400", msgRespuesta: "Datos inválidos" });
    }

    try {
        const pool = await getConnection();
        await pool.request()
            .input("imdbID", sql.VarChar, imdbID)
            .input("Title", sql.VarChar, Title)
            .input("Year", sql.VarChar, Year)
            .input("Type", sql.VarChar, Type)
            .input("Poster", sql.VarChar, Poster)
            .input("Estado", sql.Bit, Estado)
            .input("description", sql.VarChar, description)
            .input("Ubication", sql.VarChar, Ubication)
            .query(`
                INSERT INTO Cartelera (imdbID, Title, Year, Type, Poster, Estado, description, Ubication)
                VALUES (@imdbID, @Title, @Year, @Type, @Poster, @Estado, @description, @Ubication)
            `);

        res.status(200).json({ codError: "200", msgRespuesta: "Registro Insertado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ codError: "500", msgRespuesta: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /cartelera:
 *   get:
 *     summary: Obtiene todas las películas de la cartelera
 *     tags: [Cartelera]
 *     responses:
 *       200:
 *         description: Lista de películas
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM Cartelera");
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ codError: "500", msgRespuesta: "Error interno del servidor" });
    }
});

/**
 * @swagger
 * /cartelera:
 *   put:
 *     summary: Actualiza una película existente por imdbID (QueryString)
 *     tags: [Cartelera]
 *     parameters:
 *       - in: query
 *         name: imdbID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la película a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pelicula'
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente
 *       400:
 *         description: Solicitud inválida
 *       404:
 *         description: Registro no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/", async (req, res) => {
    const imdbID = req.query.imdbID;
    const { Title, Year, Type, Poster, Estado, description, Ubication } = req.body;

    if (!imdbID || !Title || !Year || !Type) {
        return res.status(400).json({ codError: "400", msgRespuesta: "Solicitud inválida" });
    }

    try {
        const pool = await getConnection();

        // Verificar si el registro existe
        const existing = await pool.request()
            .input("imdbID", sql.VarChar, imdbID)
            .query("SELECT * FROM Cartelera WHERE imdbID = @imdbID");

        if (existing.recordset.length === 0) {
            return res.status(404).json({ codError: "404", msgRespuesta: "Registro no encontrado" });
        }

        // Actualizar registro
        await pool.request()
            .input("imdbID", sql.VarChar, imdbID)
            .input("Title", sql.VarChar, Title)
            .input("Year", sql.VarChar, Year)
            .input("Type", sql.VarChar, Type)
            .input("Poster", sql.VarChar, Poster)
            .input("Estado", sql.Bit, Estado)
            .input("description", sql.VarChar, description)
            .input("Ubication", sql.VarChar, Ubication)
            .query(`
                UPDATE Cartelera
                SET Title=@Title, Year=@Year, Type=@Type, Poster=@Poster,
                    Estado=@Estado, description=@description, Ubication=@Ubication
                WHERE imdbID=@imdbID
            `);

        res.status(200).json({ codError: "200", msgRespuesta: "Registro Actualizado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ codError: "500", msgRespuesta: "Error interno del servidor" });
    }
});

module.exports = router;
