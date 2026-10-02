require("dotenv").config();

const express = require("express");
const cors = require("cors");

const conectarDB = require("./config/database");

const experienciaRoutes = require("./routes/experiencia.routes");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());


// Conectar MongoDB
conectarDB();


// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de hojas de vida funcionando"
    });
});


// Rutas de experiencias
app.use("/api/experiencias", experienciaRoutes);


// Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "API Hojas de Vida",
            version: "1.0.0",
            description: "API CRUD para gestionar experiencias profesionales"
        },

        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },

    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);


// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`);
});