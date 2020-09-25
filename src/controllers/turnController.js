const Turno = require('../models/turnModel');
const _ =require('underscore');

class TurnoController {

    static async create(req , res){
       
        //console.log(req.body);
        
        let body = req.body;
        let turno = new Turno({
            name: body.name,
            tipoTurno: body.tipoTurno,
            doctor: body.doctor,
            doctorEmail: body.doctorEmail,
            fecha: body.fecha,
            user: req.cliente.id
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
    
    static async ObtenerTurnosDoctores(req, res) {
        
      // let correo = 'gabrielestebansalvatore@gmail.com'	
        await Turno.find({doctorEmail: req.params.email})
        
            .exec((err, turnos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Turno.countDocuments((err, conteo) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        turnos,
                        cuantos: conteo
                    })
                })
            });
       
    };   

    static async ObtenerTurnos(req, res) {
        
        await Turno.find({user: req.cliente.id})
        
            .exec((err, turnos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Turno.countDocuments((err, conteo) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        turnos,
                        cuantos: conteo
                    })
                })
            });
        /*try {
            //sort cambia el orde de creación
            const turnos = await Turno.find({ creador: req.cliente.id }).sort({ creado: -1 });
            res.json({ turnos });
        } catch (error) {
            //console.log(error);
            res.status(500).send('Hubo un error');
        }*/
    };   

    static async ObtenerTurnosClientes(req, res) {
       
        await Turno.find()
            .exec((err, turnos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Turno.countDocuments((err, conteo) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        turnos,
                        cuantos: conteo
                    })
                })
            });
        /*try {
            //sort cambia el orde de creación
            const turnos = await Turno.find({ creador: req.cliente.id }).sort({ creado: -1 });
            res.json({ turnos });
        } catch (error) {
            //console.log(error);
            res.status(500).send('Hubo un error');
        }*/
    };   
    static async ObtenerTurnosClientesAdmin(req, res) {
        await Turno.find()
            .exec((err, turnos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Turno.countDocuments((err, conteo) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        turnos,
                        cuantos: conteo
                    })
                })
            });
    };   


    static async updateTurno(req, res){

        //console.log("body",req.body);
        //console.log("id",req.params);
        //let id = req.params.id; / REVISAR POR QUÉ no LLEGA EL id POR params.id//
        let id = req.body.id;
        let body = _.pick(req.body, ['name','doctor','tipoTurno','fecha','hora',{/* 'creador'*/}]);

        // revisar el ID 
        let turno = await Turno.findById(id);
        console.log("turno",turno);
        // verificar el creador del proyecto
        /*if(turno.creador.toString() !== req.cliente.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }*/

        // si el proyecto existe o no
        if(!turno) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        await Turno.findOneAndUpdate(id,body,(err,turnoDB)=>{
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
        try {

        //revisar el ID 
        let turno = await Turno.findById(req.params.id);

        // si el proyecto existe o no
        if(!turno) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        // verificar el creador del turno
        /*if(turno.creador.toString() !== req.cliente.id ) {
            return res.status(401).json({msg: 'No Autorizado'});
        }*/

        await Turno.findOneAndRemove({ _id : req.params.id })
        res.json({ msg: 'Turno eliminado '})
           
        } catch (error) {
            console.log(error);
            res.status(500).send('Error en el servidor')
        }
    }

}

module.exports = TurnoController;
