const express = require('express');
const CuentaBancaria = require('../models/cuentaBancaria'); //Mayuscula pq desde aqui crearemos instancias con new....
const Cliente = require('../models/cliente'); //Mayuscula pq desde aqui crearemos instancias con new....
const Tabla = require('../models/tabla'); //Mayuscula pq desde aqui crearemos instancias con new....
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

// -------
// Metodos
// -------

//Mostrar todas
app.get('/cuentaBancaria', [verificaToken], verificaAdmin_Role, (req, res) => {

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

//Mostrar por id, valida que la empresa pertenesca al usuario logeado
app.get('/cuentaBancaria/obtener/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let id_usuario = req.usuario._id;

    CuentaBancaria.findById(id)
        .populate('empresa', 'ruc razonSocial')
        .populate('banco', 'codigo descripcion')
        .populate('moneda', 'codigo descripcion')
        .populate('tipoDeCuenta', 'codigo descripcion')
        .exec((err, cuentaBancariaDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!cuentaBancariaDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Cuenta no encontrada'
                    }
                });
            }


            // El cliente asociado a esta empresa debe pertenecer al usuario logeado
            Cliente.findById(cuentaBancariaDB.cliente)
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
                            }
                        });
                    }


                    res.json({
                        ok: true,
                        CuentaBancaria: cuentaBancariaDB
                    });

                });


        });


});


//Mostrar cuentas del cliente asociado al usuario logeado y enmpresa
app.get('/cuentaBancaria/cliente/empresa/:empresa', verificaToken, (req, res) => {
    let id_usuario = req.usuario._id;
    let empresa_id = req.params.empresa;

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

            CuentaBancaria.find({ cliente: clienteDB[0]._id, empresa: empresa_id }, 'empresa banco moneda tipoDeCuenta numeroDeCuenta numeroDeCCI default activo')
                .populate('empresa', 'ruc razonSocial')
                .populate('banco', 'codigo descripcion valorUno')
                .populate('moneda', 'codigo descripcion')
                .populate('tipoDeCuenta', 'codigo descripcion')
                .exec((err, cuentasBancarias) => {
                    if (err) {
                        // 400 bad request
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        cuentasBancarias
                    });
                })



        });


});

//Mostrar cuentas del cliente asociado al usuario logeado 
app.get('/cuentaBancaria/cliente', verificaToken, (req, res) => {
    let id_usuario = req.usuario._id;
    
    // console.log('/cuentaBancaria/cliente - Usuario conectado', req.usuario);

    Cliente.find({ usuarioAsociado: id_usuario })
        .exec((err, clienteDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!clienteDB[0]) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Cliente no encontrado'
                    }
                });
            }

            // console.log('/cuentaBancaria/cliente - Cliente asociado al usuario conectado', clienteDB);

            // Cuenta que no son de empresa (es decir las personales)
            CuentaBancaria.find({ cliente: clienteDB[0]._id, empresa: null }, 'empresa banco moneda tipoDeCuenta numeroDeCuenta numeroDeCCI default activo')
                .populate('empresa', 'ruc razonSocial ')
                .populate('banco', 'codigo descripcion valorUno')
                .populate('moneda', 'codigo descripcion')
                .populate('tipoDeCuenta', 'codigo descripcion')
                .sort([
                    ["empresa", 1],
                    ["banco", 1],
                    ["moneda", 1]
                ])
                .exec((err, cuentasBancarias) => {
                    if (err) {
                        // 400 bad request
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        cuentasBancarias
                    });
                })



        });


});

// Crear 
app.post('/cuentaBancaria/crear', verificaToken, (req, res) => {
    let body = req.body;
    let id_usuario = req.usuario._id;
    let tipoPropiedadCuentaCodigo;


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

            // Crea objeto empresa con las propiedades y metodos definidos en Empresa
            let cuentaBancaria = new CuentaBancaria({
                cliente: clienteDB[0]._id,
                banco: body.banco_id,
                moneda: body.moneda_id,
                tipoDeCuenta: body.tipoDeCuenta_id,
                numeroDeCuenta: body.numeroDeCuenta,
                numeroDeCCI: body.numeroDeCCI,
                tipoPropiedadCuenta: '',
                activo: true,
                default: true
            });

            // Cargar tipo propiedad de cuenta ,propia o empresa
            // Puede venir - o un id de empresa, si viene id se graba empresa sino se entiende que es de la misma persona
            if (body.empresa_id && body.empresa_id !== '-') {
                cuentaBancaria.empresa = body.empresa_id;
                // Tabla.find({ codigo: 'CuentaEmpresa' })
                //     .exec((err, tablaDB) => {
                //         cuentaBancaria.tipoPropiedadCuenta = tablaDB._id;
                //     });
                tipoPropiedadCuentaCodigo = 'CuentaEmpresa';
            } else {
                // Tabla.find({ codigo: 'CuentaPropia' })
                //     .exec((err, tablaDB) => {
                //         cuentaBancaria.tipoPropiedadCuenta = tablaDB._id;
                //     });
                tipoPropiedadCuentaCodigo = 'CuentaPropia';
            }


            Tabla.find({ codigo: tipoPropiedadCuentaCodigo })
                .exec((err, tablaDB) => {
                    if (err) {
                        // 500 bad request
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    cuentaBancaria.tipoPropiedadCuenta = tablaDB[0]._id;

                    CuentaBancaria.updateMany({ cliente: clienteDB[0]._id, empresa: cuentaBancaria.empresa, moneda: body.moneda_id }, { $set: { default: false } }, { "multi": true }, (err, writeResult) => {
                        if (err) {
                            // 500 bad request
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        }




                        // Llama al metodo de grabacion
                        cuentaBancaria.save((err, cuentaBancariaDB) => {
                            if (err) {
                                // 500 bad request
                                return res.status(500).json({
                                    ok: false,
                                    err
                                });
                            }

                            if (!cuentaBancariaDB) {
                                // 400 bad request
                                return res.status(400).json({
                                    ok: false,
                                    err
                                });
                            }

                            // status 200 no es necesario, va por defecto
                            res.json({
                                ok: true,
                                cuentaBancaria: cuentaBancariaDB
                            });
                        });







                    });

                });










            // cuentaBancaria.find({
            //     cliente: clienteDB[0]._id,
            //     moneda: body.moneda_id

            // }).forEach(function(e, i) {
            //     e.default = false;
            //     cuentaBancaria.save(e);
            // });



            //CuentaBancaria.findOneAndUpdate({ cliente: clienteDB[0]._id, moneda: body.moneda_id }, { $set: { default: false } }, { "multi": true });






        });
});
 
//Modificar default
app.put('/cuentaBancaria/default/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    //Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
    CuentaBancaria.findById(id, (err, cuentaBancariaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cuentaBancariaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }


        // Completa valores para grabar
        cuentaBancariaDB.default = body.default;

        // Graba
        cuentaBancariaDB.save((err, cuentaBancariaGuardada) => {
            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            // En el caso de colocar default a esta cuenta, las otras cuentas de la misma moneda (y empresa) cambian a false
            if (body.default) {

                CuentaBancaria.updateMany({ _id: {$ne: cuentaBancariaGuardada._id}, cliente: cuentaBancariaGuardada.cliente,  empresa: cuentaBancariaGuardada.empresa, moneda: cuentaBancariaGuardada.moneda }, { $set: { default: false } }, { "multi": true }, (err, writeResult) => {

                    console.log(writeResult);     

                    res.json({
                        ok: true,
                        cuentaBancaria: cuentaBancariaDB
                    });


                });

            } else {
                res.json({
                    ok: true,
                    cuentaBancaria: cuentaBancariaDB
                });
            }
                    
        })


    });


});

//Modificar activa
app.put('/cuentaBancaria/activa/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    
    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    //Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
    CuentaBancaria.findById(id, (err, cuentaBancariaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cuentaBancariaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

            // Completa valores para grabar
        cuentaBancariaDB.activo = body.activo;

        if (!body.activo) cuentaBancariaDB.default = false;

        // Graba
        cuentaBancariaDB.save((err, cuentaBancariaGuardada) => {
            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                cuentaBancaria: cuentaBancariaDB
            });
                    
        })


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

//Modificar cuenta bancaria
app.put('/cuentaBancaria/actualizar/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    //Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
    CuentaBancaria.findById(id, (err, cuentaBancariaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cuentaBancariaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        // Completa valores para grabar
        cuentaBancariaDB.banco = body.banco_id,
        cuentaBancariaDB.moneda = body.moneda_id,
        cuentaBancariaDB.tipoDeCuenta = body.tipoDeCuenta_id,
        cuentaBancariaDB.numeroDeCuenta= body.numeroDeCuenta,
        cuentaBancariaDB.numeroDeCCI= body.numeroDeCCI,

        // Graba
        cuentaBancariaDB.save((err, cuentaBancariaGuardado) => {
            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cuentaBancariua: cuentaBancariaGuardado
            });
        });
    });



 });

 //Modificar CCI de cuenta bancaria
app.put('/cuentaBancaria/actualizarCuenta/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    console.log(body);

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    //Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
    CuentaBancaria.findById(id, (err, cuentaBancariaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cuentaBancariaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }
        
        console.log(cuentaBancariaDB);
        
        // Completa valores para grabar
        cuentaBancariaDB.numeroDeCCI = body.numeroDeCCI;
        cuentaBancariaDB.numeroDeCuenta = body.numeroDeCuenta;

        console.log(cuentaBancariaDB);

        // Graba
        cuentaBancariaDB.save((err, cuentaBancariaGuardado) => {
            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cuentaBancariua: cuentaBancariaGuardado
            });
        });
    });



 });
module.exports = app;