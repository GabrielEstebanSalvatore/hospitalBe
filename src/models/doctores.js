const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let doctorSchema = new Schema({
name:{
    type: String,
    required: [true, 'El nombre es necesario']
},
email: {
    type: String,
    unique:true,
    required: [true, 'El correo es necesario']
},
img: {
    type: String,
    required: false
},
profesion: {
    type: String,
    required: [true, 'La profesión es necesaria']
},
telefono: {
    type: String,
    required: [true, 'El teléfono es necesario']
},
direccion: {
    type: String,
    required: [true, 'La dirección es requerida']
},
estado: {
    type: Boolean,
    default: true
}});

module.exports = mongoose.model('Doctor', doctorSchema);