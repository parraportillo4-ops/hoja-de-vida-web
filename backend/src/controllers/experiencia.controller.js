const Experiencia = require("../models/Experiencia");

// GET - Obtener todas
const obtenerExperiencias = async (req, res) => {
    try {
        const experiencias = await Experiencia.find();

        res.status(200).json(experiencias);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener experiencias",
            error: error.message
        });
    }
};


// GET - Obtener experiencias de una hoja de vida
const obtenerExperienciasPorHoja = async (req, res) => {
    try {
        const { hojaVida } = req.params;

        const experiencias = await Experiencia.find({
            hojaVida: hojaVida
        });

        res.status(200).json(experiencias);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener experiencias",
            error: error.message
        });
    }
};


// GET - Obtener una experiencia
const obtenerExperiencia = async (req, res) => {
    try {
        const experiencia = await Experiencia.findById(req.params.id);

        if (!experiencia) {
            return res.status(404).json({
                mensaje: "Experiencia no encontrada"
            });
        }

        res.status(200).json(experiencia);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener experiencia",
            error: error.message
        });
    }
};


// POST - Crear
const crearExperiencia = async (req, res) => {
    try {
        const nuevaExperiencia = new Experiencia(req.body);

        const experienciaGuardada = await nuevaExperiencia.save();

        res.status(201).json(experienciaGuardada);
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al crear experiencia",
            error: error.message
        });
    }
};


// PUT - Actualizar
const actualizarExperiencia = async (req, res) => {
    try {
        const experiencia = await Experiencia.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!experiencia) {
            return res.status(404).json({
                mensaje: "Experiencia no encontrada"
            });
        }

        res.status(200).json(experiencia);
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al actualizar experiencia",
            error: error.message
        });
    }
};


// DELETE - Eliminar
const eliminarExperiencia = async (req, res) => {
    try {
        const experiencia = await Experiencia.findByIdAndDelete(
            req.params.id
        );

        if (!experiencia) {
            return res.status(404).json({
                mensaje: "Experiencia no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Experiencia eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar experiencia",
            error: error.message
        });
    }
};


module.exports = {
    obtenerExperiencias,
    obtenerExperienciasPorHoja,
    obtenerExperiencia,
    crearExperiencia,
    actualizarExperiencia,
    eliminarExperiencia
};