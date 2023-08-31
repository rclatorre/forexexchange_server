const express = require('express');
const Empresa = require('../models/empresa'); //Mayuscula pq desde aqui crearemos instancias con new....
const Cliente = require('../models/cliente'); //Mayuscula pq desde aqui crearemos instancias con new....
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

// -------
// Metodos
// -------

//Mostrar todas las cuentas
app.get('/empresa', [verificaToken], verificaAdmin_Role, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Empresa.find({})
        .skip(desde)
        .limit(15)
        // .sort('nombre primerApellido segundoApellido')
        // .populate('tipoDocumentoIdentidad', 'descripcion')
        // .populate('usuarioAsociado', 'nombre email')
        // .populate('paisDeOrigen', 'descripcion')
        .exec((err, empresas) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresas
            });

        });
});

//Mostrar empresa por id, valida que la empresa pertenesca al usuario logeado
app.get('/empresa/obtener/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let id_usuario = req.usuario._id;

    Empresa.findById(id, '_id ruc razonSocial direccion telefono nombreRep primerApellidoRep segundoApellidoRep tipoDocumentoIdentidadRep numeroDocumentoIdentidadRep clienteAsociado')
        // .populate('usuarioAsociado', 'nombre email')
        // .populate('tipoDocumentoIdentidad', 'descripcion')
        .exec((err, empresaDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!empresaDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Empresa no encontrada'
                    }
                });
            }


            // El cliente asociado a esta empresa debe pertenecer al usuario logeado
            Cliente.findById(empresaDB.clienteAsociado)
                .exec((err, clienteDB) => {
                    if (err) {
                        // 400 bad request
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    if (!clienteDB) {
                        // 400 bad request
                        return res.status(400).json({
                            ok: false,
                            err: {
                                message: 'Cliente no encontrado'
                            }
                        });
                    }

                    if (clienteDB.usuarioAsociado != id_usuario) {
                        // 400 bad request
                        return res.status(400).json({
                            ok: false,
                            err: {
                                message: 'Acceso denegado'
                            },
                            clienteDB,
                            id_usuario
                        });
                    }

                    empresa = {
                        _id: empresaDB._id, 
                        ruc: empresaDB.ruc, 
                        razonSocial: empresaDB.razonSocial, 
                        direccion: empresaDB.direccion, 
                        telefono: empresaDB.telefono, 
                        nombreRep: empresaDB.nombreRep, 
                        primerApellidoRep: empresaDB.primerApellidoRep, 
                        segundoApellidoRep: empresaDB.segundoApellidoRep, 
                        tipoDocumentoIdentidadRep: {
                            _id: empresaDB.tipoDocumentoIdentidadRep,
                            codigo: '',
                            descripcion: ''
                        }, 
                        numeroDocumentoIdentidadRep: empresaDB.numeroDocumentoIdentidadRep 
                    };

                    res.json({
                        ok: true,
                        Empresa: empresa
                    });

                });


        });


});


//Mostrar empresas del cliente asociado al usuario logeado
app.get('/empresa/cliente', verificaToken, (req, res) => {
    let id_usuario = req.usuario._id;

    Cliente.find({ usuarioAsociado: id_usuario })
        .exec((err, clienteDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!clienteDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Cliente no encontrado'
                    }
                });
            }

            //console.log(clienteDB);

            Empresa.find({ clienteAsociado: clienteDB[0]._id }, 'ruc razonSocial direccion telefono')
                // .populate('tipoDocumentoIdentidad', 'descripcion')
                .exec((err, empresas) => {
                    if (err) {
                        // 400 bad request
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        empresas
                    });
                })
        });


});

// Crear empresa
app.post('/empresa/crear', verificaToken, (req, res) => {
    let body = req.body;
    let id_usuario = req.usuario._id;


    // Buscamos Cliente asociado al usuario conectado para obtener su ID
    Cliente.find({ usuarioAsociado: id_usuario })
        .exec((err, clienteDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!clienteDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Cliente no encontrado'
                    }
                });
            }


            // Validamos que no exista ya un RUC igual para el mismo cliente
            Empresa.find({ clienteAsociado: clienteDB[0]._id, ruc: body.ruc })
                .exec((err, empresaDB) => {
                    if (err) {
                        // 400 bad request
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    if (empresaDB[0]) {
                        // 400 bad request
                        return res.status(400).json({
                            ok: false,
                            err: {
                                message: 'El RUC ya esta registrado ',
                                empresa: empresaDB
                            }
                        });
                    }


                    // Crea objeto empresa con las propiedades y metodos definidos en Empresa
                    let empresa = new Empresa({
                        ruc: body.ruc,
                        razonSocial: body.razonSocial,
                        telefono: body.telefono,
                        direccion: body.direccion,
                        clienteAsociado: clienteDB[0]._id,
                        tipoDocumentoIdentidadRep: body.tipoDocumentoIdentidadRep,
                        numeroDocumentoIdentidadRep: body.numeroDocumentoIdentidadRep,
                        nombreRep: body.nombreRep,
                        primerApellidoRep: body.primerApellidoRep,
                        segundoApellidoRep: body.segundoApellidoRep
                    });

                    // Llama al metodo de grabacion
                    empresa.save((err, empresaDB) => {
                        if (err) {
                            // 500 bad request
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        }

                        if (!empresaDB) {
                            // 400 bad request
                            return res.status(400).json({
                                ok: false,
                                err
                            });
                        }

                        // status 200 no es necesario, va por defecto
                        res.json({
                            ok: true,
                            empresa: empresaDB
                        });
                    });

                });



        });
});

//Modificar empresa 
app.put('/empresa/actualizar/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    //Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
    Empresa.findById(id, (err, empresaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!empresaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        // Completa valores para grabar
        empresaDB.ruc = body.ruc;
        empresaDB.razonSocial = body.razonSocial;
        empresaDB.telefono = body.telefono;
        empresaDB.direccion = body.direccion;
        empresaDB.nombreRep = body.nombreRep;
        empresaDB.primerApellidoRep = body.primerApellidoRep;
        empresaDB.segundoApellidoRep = body.segundoApellidoRep;
        empresaDB.tipoDocumentoIdentidadRep = body.tipoDocumentoIdentidadRep;
        empresaDB.numeroDocumentoIdentidadRep = body.numeroDocumentoIdentidadRep;
 
        // Graba
        empresaDB.save((err, empresaGuardado) => {
            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresa: empresaGuardado
            });
        });
    });



 });

 //Modificar empresa como Administrador
 app.put('/empresa/actualizarAdmin/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    //Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
    Empresa.findById(id, (err, empresaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!empresaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        // Completa valores para grabar
        empresaDB.ruc = body.ruc;
        empresaDB.razonSocial = body.razonSocial;
        // empresaDB.telefono = body.telefono;
        // empresaDB.direccion = body.direccion;
        // empresaDB.nombreRep = body.nombreRep;
        // empresaDB.primerApellidoRep = body.primerApellidoRep;
        // empresaDB.segundoApellidoRep = body.segundoApellidoRep;
        // empresaDB.tipoDocumentoIdentidadRep = body.tipoDocumentoIdentidadRep;
        // empresaDB.numeroDocumentoIdentidadRep = body.numeroDocumentoIdentidadRep;
 
        // Graba
        empresaDB.save((err, empresaGuardado) => {
            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresa: empresaGuardado
            });
        });
    });



 });

// // ---------------
// // Borrar cliente
// // ---------------
// app.delete('/cliente/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
//     let id = req.params.id;

//     Cliente.findById(id, (err, clienteDB) => {
//         if (err) {
//             // 400 bad request
//             return res.status(500).json({
//                 ok: false,
//                 err
//             });
//         }

//         if (!clienteDB) {
//             // 400 bad request
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Cliente no encontrado'
//                 }
//             });
//         }

//         clienteDB.activo = false;

//         clienteDB.save((err, clienteDB) => {
//             if (err) {
//                 // 400 bad request
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 });
//             }

//             res.json({
//                 ok: true,
//                 cliente: clienteDB,
//                 message: 'Cliente inactivado'
//             });
//         });

//     });

// });


module.exports = app;