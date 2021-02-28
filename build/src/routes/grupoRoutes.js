"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.grupoRoutes = void 0;
const express_1 = require("express");
const Grupo_1 = require("../model/Grupo");
const database_1 = require("../database/database");
class GrupoRoutes {
    constructor() {
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield Grupo_1.Grupos.aggregate([
                    {
                        $lookup: {
                            from: 'canciones',
                            localField: 'nombre',
                            foreignField: 'grupo',
                            as: "canciones"
                        }
                    },
                    {
                        $lookup: {
                            from: 'miembros',
                            localField: 'nombre',
                            foreignField: 'grupo',
                            as: "miembros"
                        },
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getNombre = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield Grupo_1.Grupos.aggregate([
                    {
                        $lookup: {
                            from: 'canciones',
                            localField: 'nombre',
                            foreignField: 'grupo',
                            as: "canciones"
                        }
                    },
                    {
                        $lookup: {
                            from: 'miembros',
                            localField: 'nombre',
                            foreignField: 'grupo',
                            as: "miembros"
                        },
                    },
                    {
                        $match: {
                            nombre: nombre
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre, grupo, activo, oyentesSpotify, oyentesYoutube, genero, fechaCreacion } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                nombre: nombre,
                grupo: grupo,
                activo: activo,
                oyentesSpotify: oyentesSpotify,
                oyentesYoutube: oyentesYoutube,
                genero: genero,
                fechaCreacion: fechaCreacion
            };
            const oSchema = new Grupo_1.Grupos(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.put = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const { grupo, activo, oyentesSpotify, oyentesYoutube, genero, fechaCreacion } = req.body;
            yield database_1.db.conectarBD();
            yield Grupo_1.Grupos.findOneAndUpdate({ nombre: nombre }, {
                nombre: nombre,
                grupo: grupo,
                activo: activo,
                oyentesSpotify: oyentesSpotify,
                oyentesYoutube: oyentesYoutube,
                genero: genero,
                fechaCreacion: fechaCreacion
            }, {
                new: true,
                runValidators: true
            })
                .then((docu) => {
                if (docu == null) {
                    console.log('El triangulo que desea modificar no existe');
                    res.json({ "Error": "No existe: " + nombre });
                }
                else {
                    console.log('Modificado Correctamente: ' + docu);
                    res.json(docu);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            database_1.db.desconectarBD();
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombreg } = req.params;
            yield database_1.db.conectarBD();
            yield Grupo_1.Grupos.findOneAndDelete({ nombre: nombreg })
                .then((doc) => {
                console.log(doc);
            });
            database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/', this.get);
        this._router.get('/get2/:nombre', this.getNombre);
        this._router.post('/post', this.post);
        this._router.put('/put/:nombre', this.put);
        this._router.delete('/delete/:nombreg', this.delete);
    }
}
const obj = new GrupoRoutes();
obj.misRutas();
exports.grupoRoutes = obj.router;
