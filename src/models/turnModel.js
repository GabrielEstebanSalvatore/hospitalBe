const mongoose= require('mongoose');
const Schema = mongoose.Schema;

let turnosValidos ={
    values:['TURNO', 'EMERGENCIA', 'INTERNACION'],
    message:'{VALUE} no es un rol válido'
}

let turnoSchema = new Schema ({
    name:{
        type: String,
        required: [true, 'El nombre es necesario'],
        trim:true
    },
    doctor:{
        type: String,
        default: '-',
        //required: [true, 'El nombre del doctor necesario']
    },
    doctorEmail:{
        type: String,
        //default: '-',
        //required: [true, 'El nombre del doctor necesario']
    },
    tipoTurno:{
        type: String,
        default: 'TURNO',
        //enum:turnosValidos,
        //required: [true, 'El turno es necesario']
    },
    fecha:{
        type: Date,
        required: [true, 'La fecha es necesaria'],
        default: Date.now
    },
    user:{type:String},
    creador: {
        type: mongoose.Schema.Types.ObjectId,    
        ref: 'Cliente'
    }

})

module.exports = mongoose.model('Turno', turnoSchema);