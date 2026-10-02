const mongoose = require("mongoose");

const experienciaSchema = new mongoose.Schema(
    {
        hojaVida: {
            type: String,
            required: true,
            enum: ["jhon", "laura", "samuel", "lucia"]
        },

        empresa: {
            type: String,
            required: true,
            trim: true
        },

        cargo: {
            type: String,
            required: true,
            trim: true
        },

        descripcion: {
            type: String,
            required: true,
            trim: true
        },

        duracion: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Experiencia", experienciaSchema);