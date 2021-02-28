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
const Miembro_1 = require("../model/Miembro");
const Cancion_1 = require("../model/Cancion");
const database_1 = require("../database/database");
class GrupoRoutes {
    constructor() {
        this.getGrupos = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
        this.getCanciones = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield Cancion_1.Canciones.find();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getMiembros = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield Miembro_1.Miembros.find();
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getGrupo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
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
                            id: id
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
        this.getMiembro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { grupo, nombre } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const g = yield Miembro_1.Miembros.findOne({
                    grupo: grupo,
                    nombre: nombre
                });
                res.json(g);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getCancion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { grupo, nombre } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const g = yield Cancion_1.Canciones.findOne({
                    nombre: nombre,
                    grupo: grupo
                });
                res.json(g);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.postGrupo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, nombre, grupo, activo, oyentesSpotify, oyentesYoutube, genero, fechaCreacion } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                id: id,
                nombre: nombre,
                grupo: Boolean(grupo),
                activo: Boolean(activo),
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
        this.postMiembro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { grupo, nombre, puesto, fechaNacimiento, fundador, actual } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                grupo: grupo,
                nombre: nombre,
                puesto: puesto,
                fechaNacimiento: fechaNacimiento,
                fundador: Boolean(fundador),
                actual: Boolean(actual)
            };
            const oSchema = new Miembro_1.Miembros(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.postCancion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre, duracion, grupo, album, spotify, youtube, fechaSalida, top50 } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                nombre: nombre,
                duracion: duracion,
                grupo: grupo,
                album: album,
                spotify: spotify,
                youtube: youtube,
                fechaSalida: fechaSalida,
                top50: Boolean(top50)
            };
            const oSchema = new Cancion_1.Canciones(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.updateGrupo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { nombre, grupo, activo, oyentesSpotify, oyentesYoutube, genero, fechaCreacion } = req.body;
            yield database_1.db.conectarBD();
            yield Grupo_1.Grupos.findOneAndUpdate({
                id: id
            }, {
                id: id,
                nombre: nombre,
                grupo: Boolean(grupo),
                activo: Boolean(activo),
                oyentesSpotify: oyentesSpotify,
                oyentesYoutube: oyentesYoutube,
                genero: genero,
                fechaCreacion: fechaCreacion
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.updateMiembro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { grupo, nombre } = req.params;
            const { puesto, fechaNacimiento, fundador, actual } = req.body;
            yield database_1.db.conectarBD();
            yield Miembro_1.Miembros.findOneAndUpdate({
                grupo: grupo,
                nombre: nombre
            }, {
                grupo: grupo,
                nombre: nombre,
                puesto: puesto,
                fechaNacimiento: fechaNacimiento,
                fundador: Boolean(fundador),
                actual: Boolean(actual)
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.updateCancion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { grupo, nombre } = req.params;
            const { duracion, album, spotify, youtube, fechaSalida, top50 } = req.body;
            yield database_1.db.conectarBD();
            yield Miembro_1.Miembros.findOneAndUpdate({
                grupo: grupo,
                nombre: nombre
            }, {
                nombre: nombre,
                duracion: duracion,
                grupo: grupo,
                album: album,
                spotify: spotify,
                youtube: youtube,
                fechaSalida: fechaSalida,
                top50: Boolean(top50)
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.deleteGrupo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.db.conectarBD();
            yield Grupo_1.Grupos.findOneAndDelete({
                id: id
            }, (err, doc) => {
                if (err)
                    console.log(err);
                else {
                    if (doc == null) {
                        res.send(`No encontrado`);
                    }
                    else {
                        res.send('Borrado correcto: ' + doc);
                    }
                }
            });
            database_1.db.desconectarBD();
        });
        this.deleteMiembro = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { grupo, nombre } = req.params;
            yield database_1.db.conectarBD();
            yield Miembro_1.Miembros.findOneAndDelete({
                grupo: grupo,
                nombre: nombre
            }, (err, doc) => {
                if (err)
                    console.log(err);
                else {
                    if (doc == null) {
                        res.send(`No encontrado`);
                    }
                    else {
                        res.send('Borrado correcto: ' + doc);
                    }
                }
            });
            database_1.db.desconectarBD();
        });
        this.deleteCancion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { grupo, nombre } = req.params;
            yield database_1.db.conectarBD();
            yield Cancion_1.Canciones.findOneAndDelete({
                grupo: grupo,
                nombre: nombre
            }, (err, doc) => {
                if (err)
                    console.log(err);
                else {
                    if (doc == null) {
                        res.send(`No encontrado`);
                    }
                    else {
                        res.send('Borrado correcto: ' + doc);
                    }
                }
            });
            database_1.db.desconectarBD();
        });
        this.getDuraciones = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                        $project: {
                            _id: 0,
                            "name": "$nombre",
                            "data": "$canciones.duracion"
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
        this.getFechaS = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                        $addFields: {
                            canciones: {
                                $map: {
                                    input: "$canciones",
                                    in: {
                                        $mergeObjects: [
                                            "$$this",
                                            {
                                                $dateToParts: {
                                                    date: "$$this.fechaSalida"
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    {
                        $unwind: {
                            path: "$canciones"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "name": "$canciones.year",
                            "1": "$nombre"
                        }
                    },
                    {
                        $group: {
                            _id: "$name",
                            "data": {
                                $push: {
                                    "name": "$1"
                                }
                            }
                        }
                    },
                    {
                        $unwind: {
                            path: "$data"
                        }
                    },
                    {
                        $group: {
                            _id: { "name": "$_id", "data": "$data.name" },
                            "1": { $sum: 1 }
                        }
                    },
                    {
                        $group: {
                            _id: "$_id.name",
                            "data": {
                                $push: {
                                    "name": "$_id.data",
                                    "value": "$1"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "name": "$_id",
                            "data": 1
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
        this.getEdades = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield Grupo_1.Grupos.aggregate([
                    {
                        $lookup: {
                            from: 'miembros',
                            localField: 'nombre',
                            foreignField: 'grupo',
                            as: "miembros"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "categories": "$nombre",
                            "fe": "$miembros.fechaNacimiento"
                        }
                    },
                    {
                        $unwind: {
                            path: "$fe"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "categories": 1,
                            "fe2": { $trunc: {
                                    $divide: [{ $subtract: [new Date(), "$fe"] }, 31536000000]
                                }
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$categories",
                            "min": { $min: "$fe2" },
                            "max": { $max: "$fe2" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "name": "$_id",
                            "data": [["$min", "$max"]]
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
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/getGrupos', this.getGrupos);
        this._router.get('/getMiembros', this.getMiembros);
        this._router.get('/getCanciones', this.getCanciones);
        this._router.get('/getGrupos', this.getGrupos);
        this._router.get('/getGrupo/:id', this.getGrupo);
        this._router.get('/getMiembro/:grupo&:nombre', this.getMiembro);
        this._router.get('/getCancion/:grupo&:nombre', this.getCancion);
        this._router.post('/postGrupo', this.postGrupo),
            this._router.post('/postMiembro', this.postMiembro),
            this._router.post('/postCancion', this.postCancion),
            this._router.post('/updateGrupo/:id', this.updateGrupo),
            this._router.post('/updateMiembro/:grupo&:nombre', this.updateMiembro),
            this._router.post('/updateCancion/:grupo&:nombre', this.updateCancion),
            this._router.delete('/deleteGrupo/:id', this.deleteGrupo),
            this._router.delete('/deleteMiembro/:grupo&:nombre', this.deleteMiembro),
            this._router.delete('/deleteCancion/:grupo&:nombre', this.deleteCancion),
            this._router.get('/getDuraciones', this.getDuraciones),
            this._router.get('/getFechaS', this.getFechaS),
            this._router.get('/getEdades', this.getEdades);
    }
}
const obj = new GrupoRoutes();
obj.misRutas();
exports.grupoRoutes = obj.router;
