import { Schema, model } from 'mongoose'

export const cancionSchema = new Schema({
    nombre: {type: String},
    duracion: {type: Number},
    grupo: {type: String},
    album: {type: String},
    spotify: {type: Number},
    youtube: {type: Number},
    fechaSalida: {type: Date},
    top50: {type: Boolean}
}, {
  collection: 'canciones'
})

export const Canciones = model('canciones', cancionSchema)