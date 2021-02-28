"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grupos = void 0;
const mongoose_1 = require("mongoose");
const grupoSchema = new mongoose_1.Schema({
    id: { type: String, unique: true },
    nombre: { type: String, unique: true },
    grupo: { type: Boolean },
    activo: { type: Boolean },
    oyentesSpotify: { type: Number },
    oyentesYoutube: { type: Number },
    genero: { type: Array },
    fechaCreacion: { type: Date }
}, {
    collection: 'artistas'
});
exports.Grupos = mongoose_1.model('grupos', grupoSchema);
