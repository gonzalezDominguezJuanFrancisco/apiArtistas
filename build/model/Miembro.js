"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miembros = exports.miembroSchema = void 0;
const mongoose_1 = require("mongoose");
exports.miembroSchema = new mongoose_1.Schema({
    grupo: { type: String },
    nombre: { type: String },
    puesto: { type: Array },
    fechaNacimiento: { type: Date },
    fundador: { type: Boolean },
    actual: { type: Boolean }
}, {
    collection: 'miembros'
});
exports.Miembros = mongoose_1.model('miembros', exports.miembroSchema);
