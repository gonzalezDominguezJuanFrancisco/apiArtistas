import { Schema, model } from 'mongoose'

export const miembroSchema = new Schema({
    _id: {type: String},
    grupo: {type: String},
    nombre: {type: String},
    puesto: {type: Array},
    fechaNacimiento: {type: Date},
    fundador: {type:Boolean},
    actual: {type: Boolean}
}, {
  collection: 'miembros'
})

export const Miembros = model('miembros', miembroSchema)