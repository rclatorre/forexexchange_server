const express = require('express');
const CuentaBancariaPropia = require('../models/cuentaBancariaPropia'); //Mayuscula pq desde aqui crearemos instancias con new....
const Tabla = require('../models/tabla'); //Mayuscula pq desde aqui crearemos instancias con new....
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

// -------
// Metodos
// -------

//Mostrar todas
app.get('/cuentaBancariaPropia', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    CuentaBancariaPropia.find({}, 'empresa banco moneda tipoDeCuenta numeroDeCuenta numeroDeCCI default')
        .populate('banco', 'codigo descripcion valorUno')
        .populate('moneda', 'codigo descripcion')
        .populate('tipoDeCuenta', 'codigo descripcion')
        .skip(desde)
        .limit(15)
        // .sort('nombre primerApellido segundoApellido')
        // .populate('tipoDocumentoIdentidad', 'descripcion')
        // .populate('usuarioAsociado', 'nombre email')
        // .populate('paisDeOrigen', 'descripcion')
        .exec((err, cuentasBancariasPropias) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cuentasBancariasPropias
            });

        });
});

//Mostrar por id, valida que la empresa pertenesca al usuario logeado
app.get('/cuentaBancariaPropia/obtener/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let id_usuario = req.usuario._id;

    CuentaBancariaPropia.findById(id)
        // .populate('usuarioAsociado', 'nombre email')
        // .populate('tipoDocumentoIdentidad', 'descripcion')
        .exec((err, cuentaBancariaPropiaDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!cuentaBancariaPropiaDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Cuenta bancaria no encontrada'
                    }
                });
            }

            res.json({
                ok: true,
                CuentaBancariaPropia: cuentaBancariaPropiaDB
            });


        });


});

// Crear cuenta bancaria propia
app.post('/cuentaBancariaPropia/crear', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;
    let id_usuario = req.usuario._id;

    let cuentaBancariaPropia = new CuentaBancariaPropia({
        banco: body.banco_id,
        moneda: body.moneda_id,
        tipoDeCuenta: body.tipoDeCuenta_id,
        numeroDeCuenta: body.numeroDeCuenta,
        numeroDeCCI: body.numeroDeCCI,
        activo: true,
        default: true
    });

    // Llama al metodo de grabacion
    cuentaBancariaPropia.save((err, cuentaBancariaPropiaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cuentaBancariaPropiaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // status 200 no es necesario, va por defecto
        res.json({
            ok: true,
            cuentaBancariaPropia: cuentaBancariaPropiaDB
        });
    });


});

// //Modificar cliente 
// app.put('/cliente/:id', verificaToken, (req, res) => {
//     let id = req.params.id;
//     let body = req.body;

//     // Busca y actualiza
//     // new: true -> Se usa para devolver el nuevo registro
//     // runValidators: true -> Ejecuta las validaciones definidas en Mongo
//     //Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
//     Cliente.findById(id, (err, clienteDB) => {
//         if (err) {
//             // 500 bad request
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
//                     message: 'El ID no existe'
//                 }
//             });
//         }

//         // Completa valores para grabar
//         clienteDB.nombre = body.nombre;
//         clienteDB.primerApellido = body.primerApellido;
//         clienteDB.segundoApellido = body.segundoApellido;
//         clienteDB.tipoDocumentoIdentidad = body.tipoDocumentoIdentidad_id;
//         clienteDB.numeroDocumentoIdentidad = body.numeroDocumentoIdentidad;

//         // Graba
//         clienteDB.save((err, clienteGuardado) => {
//             if (err) {
//                 // 500 bad request
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 });
//             }

//             res.json({
//                 ok: true,
//                 cliente: clienteGuardado
//             });
//         });
//     });



// });

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