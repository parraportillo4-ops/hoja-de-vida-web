const express = require("express");

const {
    obtenerExperiencias,
    obtenerExperienciasPorHoja,
    obtenerExperiencia,
    crearExperiencia,
    actualizarExperiencia,
    eliminarExperiencia
} = require("../controllers/experiencia.controller");

const router = express.Router();

/**
 * @swagger
 * /api/experiencias:
 *   get:
 *     summary: Obtener todas las experiencias
 *     tags:
 *       - Experiencias
 *     responses:
 *       200:
 *         description: Lista de experiencias
 */
router.get("/", obtenerExperiencias);


/**
 * @swagger
 * /api/experiencias/hoja/{hojaVida}:
 *   get:
 *     summary: Obtener experiencias de una hoja de vida
 *     tags:
 *       - Experiencias
 *     parameters:
 *       - in: path
 *         name: hojaVida
 *         required: true
 *         schema:
 *           type: string
 *           enum: [jhon, laura, samuel, lucia]
 *     responses:
 *       200:
 *         description: Experiencias encontradas
 */
router.get("/hoja/:hojaVida", obtenerExperienciasPorHoja);


/**
 * @swagger
 * /api/experiencias/{id}:
 *   get:
 *     summary: Obtener una experiencia por ID
 *     tags:
 *       - Experiencias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la experiencia (el _id que genera MongoDB)
 *     responses:
 *       200:
 *         description: Experiencia encontrada
 *       404:
 *         description: Experiencia no encontrada
 */
router.get("/:id", obtenerExperiencia);


/**
 * @swagger
 * /api/experiencias:
 *   post:
 *     summary: Crea una nueva experiencia laboral
 *     tags: [Experiencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hojaVida:
 *                 type: string
 *               empresa:
 *                 type: string
 *               cargo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *               actual:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Experiencia creada exitosamente
 *       400:
 *         description: Error en los datos enviados
 */
router.post("/", crearExperiencia);

/**
 * @swagger
 * /api/experiencias/{id}:
 *   put:
 *     summary: Actualizar una experiencia
 *     tags:
 *       - Experiencias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la experiencia a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hojaVida:
 *                 type: string
 *                 example: jhon
 *               empresa:
 *                 type: string
 *                 example: Nueva Empresa S.A.S
 *               cargo:
 *                 type: string
 *                 example: Desarrollador Junior
 *               descripcion:
 *                 type: string
 *                 example: Nuevas funciones asignadas.
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-01"
 *               actual:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Experiencia actualizada
 *       404:
 *         description: Experiencia no encontrada
 */
router.put("/:id", actualizarExperiencia);

/**
 * @swagger
 * /api/experiencias/{id}:
 *   delete:
 *     summary: Eliminar una experiencia
 *     tags:
 *       - Experiencias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la experiencia a eliminar
 *     responses:
 *       200:
 *         description: Experiencia eliminada correctamente
 *       404:
 *         description: Experiencia no encontrada
 */
router.delete("/:id", eliminarExperiencia);

module.exports = router;