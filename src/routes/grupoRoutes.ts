import { Request, Response, Router } from 'express'
import { Grupos } from '../model/Grupo'
import { Miembros } from '../model/Miembro'
import { Canciones } from '../model/Cancion'
import { db } from '../database/database'

class GrupoRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getGrupos = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Grupos.aggregate([
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
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getCanciones = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Canciones.find()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getMiembros = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Miembros.find()
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getGrupo = async (req:Request, res: Response) => {
        const { id } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Grupos.aggregate([
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
                        id:id
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getMiembro = async (req:Request, res: Response) => {
        const { grupo, nombre } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const g = await Miembros.findOne({
                grupo: grupo,
                nombre: nombre
            })
            res.json(g)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getCancion = async (req:Request, res: Response) => {
        const { grupo, nombre } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const g = await Canciones.findOne({
                nombre: nombre,
                grupo: grupo
            })
            res.json(g)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private postGrupo = async (req: Request, res: Response) => {
        const { id, nombre, grupo, activo, oyentesSpotify, oyentesYoutube, genero, fechaCreacion } = req.body
        await db.conectarBD()
        const dSchema={
            id: id,
            nombre: nombre,
            grupo: Boolean(grupo),
            activo: Boolean(activo),
            oyentesSpotify: oyentesSpotify,
            oyentesYoutube: oyentesYoutube,
            genero: genero,
            fechaCreacion: fechaCreacion
        }
        const oSchema = new Grupos(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: ' + err)) 
        await db.desconectarBD()
    }

    private postMiembro = async (req: Request, res: Response) => {
        const { grupo, nombre, puesto, fechaNacimiento, fundador, actual } = req.body
        await db.conectarBD()
        const dSchema={
            grupo: grupo,
            nombre: nombre,
            puesto: puesto,
            fechaNacimiento: fechaNacimiento,
            fundador: Boolean(fundador),
            actual: Boolean(actual)
        }
        const oSchema = new Miembros(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: ' + err)) 
        await db.desconectarBD()
    }

    private postCancion = async (req: Request, res: Response) => {
        const { nombre, duracion, grupo, album, spotify, youtube, fechaSalida, top50 } = req.body
        await db.conectarBD()
        const dSchema={
            nombre: nombre,
            duracion: duracion,
            grupo: grupo,
            album: album,
            spotify: spotify,
            youtube: youtube,
            fechaSalida: fechaSalida,
            top50: Boolean(top50)
        }
        const oSchema = new Canciones(dSchema)
        await oSchema.save()
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: ' + err)) 
        await db.desconectarBD()
    }

    private updateGrupo = async (req: Request, res: Response) => {
        const { id } =req.params
        const { nombre, grupo, activo, oyentesSpotify, oyentesYoutube, genero, fechaCreacion } = req.body
        await db.conectarBD()
        await Grupos.findOneAndUpdate({
            id: id
        },
        {
            id: id,
            nombre: nombre,
            grupo: Boolean(grupo),
            activo: Boolean(activo),
            oyentesSpotify: oyentesSpotify,
            oyentesYoutube: oyentesYoutube,
            genero: genero,
            fechaCreacion: fechaCreacion
        },
        {
            new:true,
            runValidators:true
        }
        )
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private updateMiembro = async (req: Request, res: Response) => {
        const { grupo, nombre } = req.params
        const { puesto, fechaNacimiento, fundador, actual } = req.body
        await db.conectarBD()
        await Miembros.findOneAndUpdate({
            grupo: grupo,
            nombre: nombre
        },
        {
            grupo: grupo,
            nombre: nombre,
            puesto: puesto,
            fechaNacimiento: fechaNacimiento,
            fundador: Boolean(fundador),
            actual: Boolean(actual)
        },
        {
            new:true,
            runValidators:true
        }
        )
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private updateCancion = async (req: Request, res: Response) => {
        const { grupo, nombre } = req.params
        const { duracion, album, spotify, youtube, fechaSalida, top50 } = req.body
        await db.conectarBD()
        await Miembros.findOneAndUpdate({
            grupo: grupo,
            nombre: nombre
        },
        {
            nombre: nombre,
            duracion: duracion,
            grupo: grupo,
            album: album,
            spotify: spotify,
            youtube: youtube,
            fechaSalida: fechaSalida,
            top50: Boolean(top50)
        },
        {
            new:true,
            runValidators:true
        }
        )
            .then( (doc) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private deleteGrupo = async (req: Request, res: Response) => {
        const { id } = req.params
        await db.conectarBD()
        await Grupos.findOneAndDelete(
            {
                id: id
            }, 
            (err: any, doc) => {
                if(err) console.log(err)
                else{
                    if (doc == null) {
                        res.send(`No encontrado`)
                    }else {
                        res.send('Borrado correcto: '+ doc)
                    }
                }
            })
        db.desconectarBD()
    }

    private deleteMiembro = async (req: Request, res: Response) => {
        const { grupo, nombre } = req.params
        await db.conectarBD()
        await Miembros.findOneAndDelete(
            {
                grupo: grupo,
                nombre: nombre
            }, 
            (err: any, doc) => {
                if(err) console.log(err)
                else{
                    if (doc == null) {
                        res.send(`No encontrado`)
                    }else {
                        res.send('Borrado correcto: '+ doc)
                    }
                }
            })
        db.desconectarBD()
    }

    private deleteCancion = async (req: Request, res: Response) => {
        const { grupo, nombre } = req.params
        await db.conectarBD()
        await Canciones.findOneAndDelete(
            {
                grupo: grupo,
                nombre: nombre
            }, 
            (err: any, doc) => {
                if(err) console.log(err)
                else{
                    if (doc == null) {
                        res.send(`No encontrado`)
                    }else {
                        res.send('Borrado correcto: '+ doc)
                    }
                }
            })
        db.desconectarBD()
    }

    private getDuraciones = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Grupos.aggregate([
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
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getFechaS = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Grupos.aggregate([
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
                        _id: {"name": "$_id", "data": "$data.name"},
                        "1": {$sum: 1}
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
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getEdades = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Grupos.aggregate([
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
                        "fe2": {$trunc: {
                            $divide: [{$subtract: [new Date(), "$fe"]}, 31536000000]}
                        }
                    }
                },
                {
                    $group: {
                        _id: "$categories",
                        "min": {$min: "$fe2"},
                        "max": {$max: "$fe2"}
                    }
                },
                {
                    $project: {
                        _id: 0,
                        "name": "$_id",
                        "data": [["$min", "$max"]]
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    misRutas(){
        this._router.get('/getGrupos', this.getGrupos)
        this._router.get('/getMiembros', this.getMiembros)
        this._router.get('/getCanciones', this.getCanciones)
        this._router.get('/getGrupo/:id', this.getGrupo)
        this._router.get('/getMiembro/:grupo&:nombre', this.getMiembro)
        this._router.get('/getCancion/:grupo&:nombre', this.getCancion)
        this._router.post('/postGrupo', this.postGrupo),
        this._router.post('/postMiembro', this.postMiembro),
        this._router.post('/postCancion', this.postCancion),
        this._router.put('/updateGrupo/:id', this.updateGrupo),
        this._router.put('/updateMiembro/:grupo&:nombre', this.updateMiembro),
        this._router.put('/updateCancion/:grupo&:nombre', this.updateCancion),
        this._router.delete('/deleteGrupo/:id', this.deleteGrupo),
        this._router.delete('/deleteMiembro/:grupo&:nombre', this.deleteMiembro),
        this._router.delete('/deleteCancion/:grupo&:nombre', this.deleteCancion),
        this._router.get('/getDuraciones', this.getDuraciones),
        this._router.get('/getFechaS', this.getFechaS),
        this._router.get('/getEdades', this.getEdades)
    }
}
const obj = new GrupoRoutes()
obj.misRutas()
export const grupoRoutes = obj.router