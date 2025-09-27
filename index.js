const express = require("express");
const app = express();
const carteleraRoutes = require("./routes/cartelera");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(express.json());

// Swagger config
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API Cartelera",
            version: "1.0.0",
            description: "API para gestionar cartelera de películas"
        },
        servers: [
            { url: "http://localhost:3000/api" } 
        ]
    },
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas
app.use("/api/cartelera", carteleraRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
