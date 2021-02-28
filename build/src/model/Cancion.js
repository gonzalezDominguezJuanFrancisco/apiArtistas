"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canciones = exports.cancionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.cancionSchema = new mongoose_1.Schema({
    nombre: { type: String },
    duracion: { type: Number },
    grupo: { type: String },
    album: { type: String },
    spotify: { type: Number },
    youtube: { type: Number },
    fechaSalida: { type: Date },
    top50: { type: Boolean }
}, {
    collection: 'canciones'
});
exports.Canciones = mongoose_1.model('canciones', exports.cancionSchema);
