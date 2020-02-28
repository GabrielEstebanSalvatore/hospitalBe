const Turno = require('../models/turnos');
const _ =require('underscore');
const { validationResult } = require('express-validator');


class TurnoController {

    static async create(req , res){

        let body = req.body;
        let turno = new Turno({
            name: body.name,
            tipoTurno: body.tipoTurno,
            doctor: body.doctor,
            fecha: body.fecha,
            hora: body.hora
    
        });
         
        await turno.save((err, turnoDB)=>{
        
            if (err){
            return res.status(400).json({
                ok: false,
                err
            })

            }else {
                res.status(201).json({
                    ok: true,
                    turno: turnoDB
                })
            }
         });
    };
    

    static async ObtenerTurnos(req, res) {

        try {
            //sort cambia el orde de creación
            const turnos = await Turno.find({ creador: req.cliente.id }).sort({ creado: -1 });
            res.json({ turnos });
        } catch (error) {
            //console.log(error);
            res.status(500).send('Hubo un error');
        }
    };   

    static async updateTurno(req, res){

        
        let id = req.params.id;
        let body = _.pick(req.body, ['name','doctor','tipoTurno','fecha','hora', 'creador']);

        // revisar el ID 
        let turno = await Turno.findById(req.params.id);

        // verificar el creador del proyecto
        if(turno.creador.toString() !== req.cliente.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        // si el proyecto existe o no
        if(!turno) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        await Turno.findByIdAndUpdate(id,body,(err,turnoDB)=>{
            if (err){
                return res.status(400).json({
                   ok: false,
                   err
           })
            }else {
               res.status(200).json({
                   ok: true,
                   turno:{
                        message: `El turno de ${turnoDB.name} fue actualizado`
                   } 
               })
           }
        })    
    };

    static async eliminarTurno(req,res){
        const id = req.params.id;

        //revisar el ID 
        let turno = await Turno.findById(req.params.id);

        // si el proyecto existe o no
        if(!turno) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        // verificar el creador del turno
        if(turno.creador.toString() !== req.cliente.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }

        await Turno.findByIdAndDelete(id,(err,turnoDB)=>{
            if (err){
                return res.status(500).json({
                   ok: false,
                   err
           })
            }else {
               res.status(200).json({
                   ok: true,
                   turno:{
                        message: `El turno de ${turnoDB.name} fue eliminado`
                   } 
               })
           }
        })
    }

}

module.exports = TurnoController;

/*
try {
            // revisar el ID 
            let turno = await Turno.findById(req.params.id);
            const id = req.params.id;
            // si el turno existe o no
            if(!turno) {
                return res.status(404).json({msg: 'turno no encontrado'})
            }
    
            // verificar el creador del turno
            if(turno.creador.toString() !== req.usuario.id ) {
                return res.status(401).json({msg: 'No Autorizado'});
            }
    
            // Eliminar el turno
            await Turno.findByIdAndDelete({id});
            res.json({ msg: 'Turno eliminado '})
    
        } catch (error) {
            //onsole.log(error);
            res.status(500).send('Error en el servidor')
        }*/