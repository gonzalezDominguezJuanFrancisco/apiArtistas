import { Schema, model } from 'mongoose'

const grupoSchema = new Schema({
    id: {type: String, unique:true},
    nombre: {type: String, unique:true},
    grupo: {type: Boolean},
    activo: {type: Boolean},
    oyentesSpotify: {type: Number},
    oyentesYoutube: {type: Number},
    genero: {type: Array},
    fechaCreacion: {type: Date}
},{
    collection: 'artistas'
})

export const Grupos = model('grupos', grupoSchema)