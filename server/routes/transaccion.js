const express = require('express');
const Transaccion = require('../models/transaccion'); //Mayuscula pq desde aqui crearemos instancias con new....
const Configuracion = require('../models/configuracion'); //Mayuscula pq desde aqui crearemos instancias con new....
const Tabla = require('../models/tabla'); //Mayuscula pq desde aqui crearemos instancias con new....
const Moneda = require('../models/moneda');
const Cliente = require('../models/cliente');
const Cotizacion = require('../models/cotizacion');
const CambioPreferencial = require('../models/cambioPreferencial');
const CuentaBancaria = require('../models/cuentaBancaria');
const CuentaBancariaPropia = require('../models/cuentaBancariaPropia');
const _ = require('underscore');
const { verificaToken, verificaTokenOpcional, verificaAdmin_Role } = require('../middlewares/autenticacion');
const Email = require('email-templates');
const moment = require('moment');

const AyudaDB = require('../helpers/ayudaDB');
const HelperMath = require('../helpers/redondeo');
const Log = require('../helpers/log');


const app = express();

// app.locals.moment = require('moment');

var fs = require('fs');
const { stringify } = require('querystring');
const log = require('../models/log');

// Configueacion de servidor de correo
// = new Email({});
// const email = null; 


//Variables de entorno que se configuran desde config.js y se definen en el archivo pm2config.json (para DigitalOcean), si fuese heroku se deben crear dentro de heroku
const email = new Email({
    message: {
        from: process.env.emailMessageFrom, //"mensajeria.smtp@primesoft.com.pe",
    },
    // send: true,
    transport: {
        host: process.env.emailTransportHost, //"rlatorre.ferozo.com",
        port: process.env.emailTransportPort, //465
        secure: process.env.emailTransportSecure, //true
        auth: {
            type: process.env.emailTransportAuthType, //'login'
            user: process.env.emailTransportAuthTUser, //'mensajeria.smtp@primesoft.com.pe'
            pass: process.env.emailTransportAuthTPass //'Eelcpcep1qa'
        },
        tls: {
            rejectUnauthorized: process.env.emailTransportTlsRejectUnauthorized //false
        }
    },
    views: {
        options: {
            extension: 'pug',
        },
        //root: 'server/services/email/templates/transacciones/',
        //root: '../services/email/templates/transacciones/',
        //root: __dirname + '/../services/email/templates/transacciones/',
        // root: process.env.NODE_ENV === 'dev' ? 'server/services/email/templates/transacciones/' : '/root/projects/server/divisa/server/services/email/templates/transacciones/',
        root: process.env.emailViewsRoot, //'server/services/email/templates/' : '/root/projects/server/divisa/server/services/email/templates/'
    },
    i18n: {
        // locales: ['en', 'es'],
        // directory: 'server/assets/i18n',
    }
});

  
// -------
// Metodos
// -------

/*
    Mostrar todas las transacciones en proceso del usuario logeado
    ------------------------------------------------------------
*/
app.get('/transaccion/obtener/enproceso', verificaToken, async(req, res) => {
    let id = req.params.id;
    let estado;
    let configuracion;
    let usuario = req.usuario._id;

    estado = await obtenerTabla('EstadoTransaccionEnCurso'); //Ref del estado en curso para filtrar
    configuracion = await getConfiguracion(); //Informacion de la empresa

    Transaccion.find({ usuarioCliente: usuario, estadoDeTransaccion: estado._id })
        .populate({ path: 'monedaDe', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate({ path: 'monedaA', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate('metodoDePago', 'codigo descripcion valorUno')
        .populate('opcionEntrega', 'codigo descripcion valorUno')
        .populate('ciudadEstablecimientoRecojo', 'codigo descripcion valorUno')
        .populate('establecimientoRecojo', 'codigo descripcion valorUno')
        .populate('estadoDeTransaccion', 'codigo descripcion valorUno')
        .populate('usuarioCliente', 'nombre email')
        .populate({
            path: 'cliente',
            populate: [
                { path: 'paisDeOrigen', select: 'codigo descripcion valorUno' },
                { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
            ]
        })
        .populate('empresa', 'ruc razonSocial telefono direccion')
        .populate({
            path: 'transferencia.cuentaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .sort({ fechaRegistro: 'descending' })
        .exec((err, transaccionDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Transaccion no encontrada'
                    }
                });
            }

            transaccionDB = transaccionDB.map((item) => {
                return {...item._doc, ruc: configuracion.ruc, razonSocial: configuracion.razonSocial}
            })

            res.json({
                ok: true,
                transaccion: transaccionDB
            });
        });


});

/*
    Mostrar todas las transaccion del usuario logeado
    -------------------------------------------------
*/
app.get('/transaccion/obtener/historial', verificaToken, async(req, res) => {
    let id = req.params.id;
    let estado;
    let usuario = req.usuario._id;

    estado = await obtenerTabla('EstadoTransaccionEnCurso');
    // , estadoDeTransaccion: estado._id
    Transaccion.find({ usuarioCliente: usuario })
        .populate({ path: 'monedaDe', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate({ path: 'monedaA', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate('metodoDePago', 'codigo descripcion valorUno')
        .populate('opcionEntrega', 'codigo descripcion valorUno')
        .populate('ciudadEstablecimientoRecojo', 'codigo descripcion valorUno')
        .populate('establecimientoRecojo', 'codigo descripcion valorUno')
        .populate('estadoDeTransaccion', 'codigo descripcion valorUno')
        .populate('usuarioCliente', 'nombre email')
        .populate({
            path: 'cliente',
            populate: [
                { path: 'paisDeOrigen', select: 'codigo descripcion valorUno' },
                { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
            ]
        })
        .populate('empresa', 'ruc razonSocial telefono direccion')
        .populate({
            path: 'transferencia.cuentaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .sort({ fechaRegistro: 'descending' })
        .exec((err, transaccionDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Transaccion no encontrada'
                    }
                });
            }
 
            res.json({
                ok: true,
                transaccion: transaccionDB
            });
        });

 
});

//Mostrar todas las transaccion para el control de operaciones
app.get('/transaccion/obtener/all', verificaToken, async(req, res) => {
    // Parametros del GET
    let query = req.query;
        // Correcion de fechas para cubrir desde las 00 horas del inicio hasta las 23 horas del fin
    if (query.fechaRegistroIni) query.fechaRegistroIni=query.fechaRegistroIni.substring(0, 10)+'T00:00:00.000-05:00';
    if (query.fechaRegistroFin) query.fechaRegistroFin=query.fechaRegistroFin.substring(0, 10)+'T23:59:59.000-05:00';

    
    // Filtro para mongodb, otros filtros que no se puedan realizar se hacen con filter antes de retornar los resultados
    let filter = {};
    // Agrega filtros si fueron enviados desde el cliente
    if (query.fechaRegistroIni && !query.fechaRegistroFin){

        filter.$and =  [ 
            { fechaRegistro: { $gte: query.fechaRegistroIni } } 
            ];
    } 
    if (query.fechaRegistroFin && query.fechaRegistroIni){
        filter.$and =  [ 
            { fechaRegistro: { $gte: query.fechaRegistroIni } }, 
            { fechaRegistro: { $lte: query.fechaRegistroFin } } 
            ];
    } 
    if (query.estadoDeTransaccion){
        filter.estadoDeTransaccion =query.estadoDeTransaccion;
    }
    

    Transaccion.find(filter)
        .populate({ path: 'monedaDe', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate({ path: 'monedaA', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate('metodoDePago', 'codigo descripcion valorUno')
        .populate('opcionEntrega', 'codigo descripcion valorUno')
        .populate('origenDeFondos', 'codigo descripcion valorUno')
        .populate('ciudadEstablecimientoRecojo', 'codigo descripcion valorUno')
        .populate('establecimientoRecojo', 'codigo descripcion valorUno')
        .populate('estadoDeTransaccion', 'codigo descripcion valorUno')
        .populate('usuarioCliente', 'nombre email')
        .populate({
            path: 'cliente',
            populate: [
                { path: 'paisDeOrigen', select: 'codigo descripcion valorUno' },
                { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
            ]
        })
        .populate('empresa', 'ruc razonSocial telefono direccion')
        .populate({
            path: 'transferencia.cuentaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .sort({ fechaRegistro: 'descending' })
        .exec((err, transaccionDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Transaccion no encontrada'
                    }
                });
            }

            // Filtros adicionales que no se pueden hacer en mongodb        
            transaccionDB = transaccionDB.filter(function (a) {
                let valor; 
                 
                 
                valor = a;

                // Filtramos por nombre
                if (query.nombre){
                    valor = a.cliente.nombre.toLowerCase().indexOf(query.nombre.toLowerCase()) > -1;
                }

                // Filtramos por apellido paterno
                if (query.nombre && !valor){
                    valor = a.cliente.primerApellido.toLowerCase().indexOf(query.nombre.toLowerCase()) > -1;
                }

                // Filtramos por apellido materno
                if (query.nombre && !valor){
                    valor = a.cliente.segundoApellido.toLowerCase().indexOf(query.nombre.toLowerCase()) > -1;
                }

                // Filtramos por email
                if (query.email){
                    valor = a.cliente.email.toLowerCase().indexOf(query.email.toLowerCase()) > -1;
                }
 
                // Filtramos por doc id
                if (query.numeroDocumentoIdentidad){
                    valor = a.cliente.numeroDocumentoIdentidad.toLowerCase().indexOf(query.numeroDocumentoIdentidad.toLowerCase()) > -1;
                }
                
                return valor;
            });
            
            res.json({
                ok: true,
                transaccion: transaccionDB
            });
        });


});

//Mostrar todas las transaccion en proceso que tiene fecha de transferencia informada
app.get('/transaccion/obtener/encursocontrol', [verificaToken, verificaAdmin_Role], async(req, res) => {
    let id = req.params.id;
    let estado;
    let usuario = req.usuario._id;

    estado = await obtenerTabla('EstadoTransaccionEnCurso');
    // console.log(estado);

    Transaccion.find({ estadoDeTransaccion: estado._id, "transferencia.fechaTransferenciaCliente": { $exists: true } })
        .sort({ fechaTransferenciaCliente: 'descending' })
        // Transaccion.find({})
        //     .sort({ fechaRegistro: 'descending' })
        .populate({ path: 'monedaDe', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate({ path: 'monedaA', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate('metodoDePago', 'codigo descripcion valorUno')
        .populate('opcionEntrega', 'codigo descripcion valorUno')
        .populate('ciudadEstablecimientoRecojo', 'codigo descripcion valorUno')
        .populate('establecimientoRecojo', 'codigo descripcion valorUno')
        .populate('estadoDeTransaccion', 'codigo descripcion valorUno')
        .populate('usuarioCliente', 'nombre email')
        .populate({
            path: 'cliente',
            populate: [
                { path: 'paisDeOrigen', select: 'codigo descripcion valorUno' },
                { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
            ]
        })
        .populate('empresa', 'ruc razonSocial telefono direccion')
        .populate({
            path: 'transferencia.cuentaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .populate({
            path: 'transferencia.tipoTransferenciaCliente', select: 'codigo descripcion valorUno'
        })
        .populate({
            path: 'transferencia.tipoTransferenciaPropia', select: 'codigo descripcion valorUno'
        })
        .exec((err, transaccionDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Transaccion no encontrada'
                    }
                });
            }

            res.json({
                ok: true,
                transaccion: transaccionDB
            });
        });


});

//Query para sincronizar con Divisa las transacciones en proceso 
app.post('/transaccion/sincronizar/encursocontrol', [verificaToken, verificaAdmin_Role], async(req, res) => {
    let estado;
    let usuario = req.usuario._id;
    let id = req.body.id;

    const fechaInicial = new Date();
    fechaInicial.setDate(fechaInicial.getDate() - 3);
    const fechaFinal = new Date();

    estado = await obtenerTabla('EstadoTransaccionEnCurso');

    if (id) {
        filtro=[{
            _id: id
        }]
    } else {
        filtro=[
            { estadoDeTransaccion: estado._id},
            // { $and: [{fechaTransferenciaCliente: {$gte: new Date(fechaInicial)}},{fechaTransferenciaCliente: {$lt: new Date(fechaFinal)}}] },
            // { $and: [{fechaCancelacion: {$gte: new Date(fechaInicial)}},{fechaCancelacion: {$lt: new Date(fechaFinal)}}] }
        ]
    }


    //Transaccion.find({ estadoDeTransaccion: estado._id, "transferencia.fechaTransferenciaCliente": { $exists: true } })
    Transaccion.find()
        .or(filtro)
        .sort({ fechaTransferenciaCliente: 'descending' })
        .populate({ path: 'monedaDe', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate({ path: 'monedaA', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate('metodoDePago', 'codigo descripcion valorUno')
        .populate('opcionEntrega', 'codigo descripcion valorUno')
        .populate('ciudadEstablecimientoRecojo', 'codigo descripcion valorUno')
        .populate('establecimientoRecojo', 'codigo descripcion valorUno')
        .populate('estadoDeTransaccion', 'codigo descripcion valorUno')
        .populate('usuarioCliente', 'nombre email')
        .populate({
            path: 'cliente',
            populate: [
                { path: 'paisDeOrigen', select: 'codigo descripcion valorUno' },
                { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' },
                { path: 'funcionPublica', select: 'codigo descripcion'},
                { path: 'ocupacion', select: 'codigo descripcion'}
            ]
        })
        .populate('empresa', 'ruc razonSocial telefono direccion nombreRep primerApellidoRep segundoApellidoRep tipoDocumentoIdentidadRep numeroDocumentoIdentidadRep')
        .populate({
            path: 'empresa',
            populate: [
                { path: 'tipoDocumentoIdentidadRep', select: 'codigo descripcion' },
            ]
        })
        .populate({
            path: 'transferencia.cuentaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .populate({
            path: 'transferencia.tipoTransferenciaCliente', select: 'codigo descripcion valorUno'
        })
        .populate({
            path: 'transferencia.tipoTransferenciaPropia', select: 'codigo descripcion valorUno'
        })
        .populate('origenDeFondos', 'codigo descripcion valorUno')
        .populate('destinoTransaccion', 'codigo descripcion valorUno')
        .exec((err, transaccionDB) => {

            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Transaccion no encontrada'
                    }
                });
            }

            res.json({
                ok: true,
                transaccion: transaccionDB
            });
        });


});

//Cambiar estado transaccion
app.post('/transaccion/actualiza/estado', [verificaToken, verificaAdmin_Role], async(req, res) => {

    let body = req.body;
    let id = body._id;
    let estado = await obtenerTabla(body.estadoDeTransaccion);

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo


    // { transferencia: { numeroOperacionOrigen: operacion }
    Transaccion.findById(id)
        .exec((err, transaccionDB) => {

            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Valores a actualizar, numero de operacion bancaria, fecha actual y estado
            // transaccionDB.fechaCancelacion = Date.now();
            transaccionDB.estadoDeTransaccion = estado;

            transaccionDB.populate({
                    path: 'monedaDe',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'monedaA',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'cliente',
                    populate: [
                        { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
                    ]
                })
                .populate('empresa')
                .execPopulate();

            // Llama al metodo de grabacion
            transaccionDB.save((err, transaccionDB) => {

                if (err) {
                    // 500 bad request 
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!transaccionDB) {
                    // 400 bad request 
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }


                //Enviar email para informar la cancelacion
                // enviarEmailCancelacion(transaccionDB);

                Transaccion.findById(id)
                    .exec((err, transaccionDB) => {

                        res.json({
                            ok: true,
                            transaccion: transaccionDB
                        });

                    });
            });
        });
});

//Mostrar transaccion por id
app.get('/transaccion/obtener/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Transaccion.findById(id)
        .populate({ path: 'monedaDe', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate({ path: 'monedaA', populate: { path: 'pais', select: 'codigo descripcion valorUno' } })
        .populate('metodoDePago', 'codigo descripcion valorUno')
        .populate('opcionEntrega', 'codigo descripcion valorUno')
        .populate('ciudadEstablecimientoRecojo', 'codigo descripcion valorUno')
        .populate('establecimientoRecojo', 'codigo descripcion valorUno')
        .populate('estadoDeTransaccion', 'codigo descripcion valorUno')
        .populate('usuarioCliente', 'nombre email')
        .populate({
            path: 'cliente',
            populate: [
                { path: 'paisDeOrigen', select: 'codigo descripcion valorUno' },
                { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
            ]
        })
        .populate('empresa', 'ruc razonSocial telefono direccion')
        .populate({
            path: 'transferencia.cuentaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaDestino',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .populate({
            path: 'transferencia.cuentaPropiaOrigen',
            populate: [
                { path: 'banco', select: 'codigo descripcion valorUno' },
                { path: 'moneda', select: 'codigo descripcion' },
                { path: 'tipoDeCuenta', select: 'codigo descripcion' },
            ]
        })
        .exec((err, transaccionDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Transaccion no encontrada'
                    }
                });
            }

            res.json({
                ok: true,
                transaccion: transaccionDB
            });
        });


});

/*
    Iniciar Transaccion
    -------------------
    Uso: 
    Cuando el usuario le da al boton CAMBIAR AHORA se registra un Log con la cotizacion de ese momento y se devuelve al cliente el id de dicho log
    Cuando el usuario finaliza la transaccion se envia este id de log
    El  valor del log sirve para verificar que los valores no hayan sido modificados en el cliente y se trate de registrar una transaccion fraudelenta

    Se llama desde:
    Funcion identificacion() y countdownFinished() en transaction.page.ts

    Que hace:
    Recibe en codigoDeA algo como USDPEN o PENUSD
    Obtiene la cotizacion general para la combinacion USDPEN/PENUSD y si hay una cotizacion preferencial valida para un cliente registrado toma dicho valor
    Genera un registro en el Log
    Retorna dicho Log al cliente para que su id sea utilizado al finalizar la transaccion y se valide que los valores sean los mismos

*/
app.post('/transaccion/iniciarTransaccion/:codigoDeA', verificaTokenOpcional, async(req, res) => {
    let codigoDeA = req.params.codigoDeA;
    let configuracion = await getConfiguracion();
    let usuario_admin = await AyudaDB.obtenerUsuario(configuracion.emailTransacciones);

    // Cotizacion general
    let cotizacion = await obtenerCotizacion(codigoDeA);

    // Si es un usuario autenticado verificamos si hay cotizacion preferencial asignada
    if (req.usuario) {
        let cliente = await obtenerCliente(req.usuario._id);
        let cotizacionPreferencial = await obtenerCotizacionPreferencial(codigoDeA, cliente._id);

        if (cotizacionPreferencial) {
            cotizacion = cotizacionPreferencial;
        } 

    }  

    // Guarda en Log una traza de la transaccion para verificarla despues cuando se finaliza la operacion desde el cliente
    let valores = {
        codigoDeA,
        cotizacion
    };

    let resultado = await Log.actualizaLog('InicioTransaccionUsuario', usuario_admin._id, JSON.stringify(valores));  
    
    if (resultado.ok) {

        return res.status(200).json({
            ok: true,
            log: resultado.logDB
        });

    } else {
        return res.status(500).json({
            ok: false,
            err: log.err
        });
    }

});

/*
    Registrar Transaccion
    ---------------------
    Uso:
    Se usa para registrar una transaccion nueva

    Se llama desde:
    Funcion  finish() al momento de que el usuario coloca la transaccion

    Que hace:
    Recibe como parametro el id del log para poder validar cotizaciones no alteradas
    Registra la transaccion y retorna al cliente los resultados para que sean visualizados por el usuario

*/
app.post('/transaccion/registrar/:id', verificaToken, async(req, res) => {
    let id = req.params.id;
    let usuario=req.usuario;
    let body = req.body;
    let $this_principal = this;
    let tipoTransferenciaCliente = await obtenerTabla('TipoTransferenciaMismoBanco');
    let tipoTransferenciaPropia = await obtenerTabla('TipoTransferenciaMismoBanco');
    let cliente = await obtenerCliente(usuario._id);

    try {

        //Bloqueo de registro de transacciones ante una eventual necesidad de no permitir a nadie dicha accion
        if ( false ) {
            throw new Error('No se pudo registrar transaccion. Intentelo en un momento.');
        } 

        /*
        Verificacion de consistencia entre tipos de cambio que viene del cliente contra lo almacenado en el log del servidor
        */
        let resultado = await Log.obtieneLog(id);
        
        if (!resultado.ok) {
            throw new Error(`No se pudo registrar transaccion. Usuario: ${usuario.email} - Log ( ${id ? id : 'no definidio'} ) no encontrado. Intentelo en un momento.`);
        }

        let valor = JSON.parse(resultado.logDB.valor);        
        
        if (body.codigoDeA === 'USDPEN') {
            let cantidadACalculada = body.cantidadDe * valor.cotizacion;
            cantidadACalculada = Number(cantidadACalculada.toFixed(2))

            if ( 
                (
                body.codigoDeA !== valor.codigoDeA || 
                body.cotizacion !== valor.cotizacion || 
                // cantidadACalculada !== body.cantidadA
                Math.abs(cantidadACalculada - body.cantidadA) > 1
                )
            ) {
                let msg='';    
                msg=`Usuario: ${usuario.email} - IDLog: ${id ? id : 'no definidio'} - body: ${body.codigoDeA ? body.codigoDeA : ''} / ${body.cotizacion ? body.cotizacion : ''} / ${body.cantidadDe ? cantidadACalculada : ''} valor: ${valor.codigoDeA ? valor.codigoDeA : ''} / ${valor.cotizacion ? valor.cotizacion : ''} / ${body.cantidadA ? body.cantidadA : ''}`;
                throw new Error(`No se pudo registrar transaccion. Datos diferentes (${msg}) Intentelo en un momento.`);
                }

        } else {

            if ( 
                (
                body.codigoDeA !== valor.codigoDeA || 
                body.cotizacion !== valor.cotizacion || 
                ( Math.abs(body.cantidadDe - (body.cantidadA * valor.cotizacion)) > 1)
                )
            ) {
                let msg='';    
                msg=`Usuario: ${usuario.email} - IDLog: ${id ? id : 'no definidio'} - body: ${body.codigoDeA ? body.codigoDeA : ''} / ${body.cotizacion ? body.cotizacion : ''} / ${body.cantidadDe ? body.cantidadDe : ''} valor: ${valor.codigoDeA ? valor.codigoDeA : ''} / ${valor.cotizacion ? valor.cotizacion : ''} / ${body.cantidadA ? body.cantidadA * valor.cotizacion : ''}`;
                throw new Error(`No se pudo registrar transaccion. Datos diferentes (${msg}) Intentelo en un momento.`);
                }

        }

        /*
        Verificacion de cantidad minima
        */       
        if (body.codigoDeA === 'USDPEN') {
            if ( Math.abs(body.cantidadDe) < 100 ) {
                let msg='';    
                msg=`Usuario: ${usuario.email} - IDLog: ${id ? id : 'no definidio'} - body: ${body.codigoDeA ? body.codigoDeA : ''} / ${body.cantidadDe ? body.cantidadDe : ''} `;
                throw new Error(`No se pudo registrar transaccion. Datos diferentes (${msg}) Intentelo en un momento.`);
            }
        }
        if (body.codigoDeA === 'PENUSD') {
            if ( Math.abs(body.cantidadA) < 100 ) {
                let msg='';    
                msg=`Usuario: ${usuario.email} - IDLog: ${id ? id : 'no definidio'} - body: ${body.codigoDeA ? body.codigoDeA : ''} / ${body.cantidadA ? body.cantidadA : ''} `;
                throw new Error(`No se pudo registrar transaccion. Datos diferentes (${msg}) Intentelo en un momento.`);
            }
        }

        // Iniciando almacenamiento
        await CuentaBancaria.findById(body.transferencia.cuentaOrigen_id)
            .then(async(resp) => {
                let transaccion = {
                    monedaDe: {
                        _id: body.monedaDe_id
                    },
                    transferencia: {
                        cuentaOrigen: {
                            banco: {
                                _id: resp.banco._id
                            }
                        }
                    }
                }
                
                let cuentaBancoDestinoPropio = await getCuentaBancoDestinoPropio(transaccion, cliente); // Requiere transaccion{transferencia{cuentaOrigen{banco{._id y {transaccion{monedaDe{_id

                if (!cuentaBancoDestinoPropio) {
                    throw new Error('No se pudo identificar una cuenta propia');
                }

            })

        let transaccion = new Transaccion({
            fechaRegistro: Date.now(),
            monedaDe: body.monedaDe_id,
            monedaA: body.monedaA_id,
            codigoDeA: body.codigoDeA,
            cotizacion: body.cotizacion,
            cantidadDe: body.cantidadDe,
            cantidadA: body.cantidadA,
            metodoDePago: body.metodoDePago_id,
            opcionEntrega: body.opcionEntrega_id,
            ciudadEstablecimientoRecojo: body.ciudadEstablecimientoRecojo_id,
            establecimientoRecojo: body.establecimientoRecojo_id,
            destinoTransaccion: body.destinoTransaccion_id,
            transferencia: {
                cuentaOrigen: body.transferencia.cuentaOrigen_id,
                cuentaDestino: body.transferencia.cuentaDestino_id,
                tipoTransferenciaCliente: tipoTransferenciaCliente,
                tipoTransferenciaPropia: tipoTransferenciaPropia,
                // fechaTransferenciaCliente: Date.now(),
                numeroOperacionOrigen: '-',
            }
        });

        if (body.empresa_id !== '-') {
            transaccion.empresa = body.empresa_id;
        }

        if (body.origenDeFondos_id ) {
            transaccion.origenDeFondos = body.origenDeFondos_id;
        }

        // Traer el primer estado EstadoTransaccionEnCurso por EstadoTransaccionPorAprobar (aun no implementado)
        await obtenerTabla('EstadoTransaccionEnCurso').then(async(resp) => {

            // Id de estado inicial de transaccion
            transaccion.estadoDeTransaccion = resp._id;

            // Asigna id de usuario (del cliente, existe usuario y cliente)
            transaccion.usuarioCliente = req.usuario._id;

            // Obtenemos el cliente asociado al usuario (siempre es 1 a 1)
            await obtenerCliente(req.usuario._id).then((resp) => {


                Cliente.findOne({
                    _id: resp._id
                })
                .then((clienteDB) => {
                    if (body.cliente.ocupacion_id) clienteDB.ocupacion = body.cliente.ocupacion_id;
                    
                    if (body.cliente.funcionPublica_id) clienteDB.funcionPublica = body.cliente.funcionPublica_id;
                    if (body.cliente.cargoFuncionPublica) clienteDB.cargoFuncionPublica = body.cliente.cargoFuncionPublica;
                    if (body.cliente.institucionFuncionPublica) clienteDB.institucionFuncionPublica = body.cliente.institucionFuncionPublica;

                    // Graba cliente
                    clienteDB
                        .save()
                        .then((clienteDB) => {

                            if (clienteDB === null) {
                                throw new Error('Cliente no encontrado al trata de actualizar DJ');
                            }

                            // Asignamos id de cliente a la transaccion
                            transaccion.cliente = resp;

                            // Llama al metodo de grabacion
                            transaccion.save((err, transaccionDB) => {

                                if (err) {
                                    // 500 bad request 
                                    console.log(err);
                                    return res.status(500).json({
                                        ok: false,
                                        err
                                    });
                                }

                                if (!transaccionDB) {
                                    // 400 bad request 
                                    return res.status(400).json({
                                        ok: false,
                                        err
                                    });
                                }

                                // Obtiene la cuenta origen para buscar la cuenta propia en la que debe realizar la transferencia el cliente
                                transaccionDB
                                    .populate({
                                        path: 'transferencia.cuentaOrigen',
                                        populate: [
                                            { path: 'banco', select: 'codigo descripcion valorUno' },
                                            { path: 'moneda', select: 'codigo descripcion' },
                                            { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                                            { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                                        ]
                                    })
                                    .populate({
                                        path: 'transferencia.cuentaDestino',
                                        populate: [
                                            { path: 'banco', select: 'codigo descripcion valorUno' },
                                            { path: 'moneda', select: 'codigo descripcion' },
                                            { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                                            { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                                        ]
                                    })
                                    .execPopulate()
                                    .then(async function(transaccionDB) {

                                        // Obtiene cuenta propia en donde debe transferir el cliente
                                        let cuentaBancoDestinoPropio = await getCuentaBancoDestinoPropio(transaccionDB, cliente);
                                        let cuentaBancoOrigenPropio = await getCuentaBancoOrigenPropio(transaccionDB);

                                        
                                        if (transaccionDB.transferencia.cuentaOrigen.banco._id.equals(cuentaBancoDestinoPropio.banco)) {
                                            tipoTransferenciaCliente = await obtenerTabla('TipoTransferenciaMismoBanco');
                                            // console.log('Transferencia cliente. Mismo Banco');
                                        } else {
                                            tipoTransferenciaCliente = await obtenerTabla('TipoTransferenciaInterbancaria');
                                            // console.log('Transferencia cliente. Interbancaria');
                                        }
                                        
                                        if (transaccionDB.transferencia.cuentaDestino.banco._id.equals(cuentaBancoOrigenPropio.banco)) {
                                            tipoTransferenciaPropia = await obtenerTabla('TipoTransferenciaMismoBanco');
                                            // console.log('Transferencia propia. Mismo Banco');
                                        } else {
                                            tipoTransferenciaPropia = await obtenerTabla('TipoTransferenciaInterbancaria');
                                            // console.log('Transferencia propia. Interbancaria');
                                        }

                                        // Buscamos la transaccion para cargarle luego el id de banco propio y grabarlo
                                        Transaccion.findOne({
                                                _id: transaccionDB._id
                                            })
                                            .then((transaccionDB) => {
                                                
                                                // Asigna id de cuenta de banco propio
                                                transaccionDB.transferencia.cuentaPropiaDestino = cuentaBancoDestinoPropio._id;
                                                transaccionDB.transferencia.cuentaPropiaOrigen = cuentaBancoOrigenPropio._id;
                                                transaccionDB.transferencia.tipoTransferenciaCliente = tipoTransferenciaCliente._id;
                                                transaccionDB.transferencia.tipoTransferenciaPropia = tipoTransferenciaPropia._id;

                                                // Graba transaccion con el banco propio asignado
                                                transaccionDB
                                                    .save()
                                                    .then((transaccionDB) => {

                                                        if (transaccionDB === null) {
                                                            throw new Error('Transaccion no encontrada al trata de actualizar cuentaPropia');
                                                        }

                                                        // Obtiene transaccion guardada con todos sus populates para enviarla al cliente
                                                        transaccionDB
                                                            .populate({
                                                                path: 'monedaDe',
                                                                populate: [
                                                                    { path: 'pais', select: 'codigo descripcion valorUno' },
                                                                ]
                                                            })
                                                            .populate({
                                                                path: 'monedaA',
                                                                populate: [
                                                                    { path: 'pais', select: 'codigo descripcion valorUno' },
                                                                ]
                                                            })
                                                            .populate({
                                                                path: 'transferencia.cuentaOrigen',
                                                                populate: [
                                                                    { path: 'banco', select: 'codigo descripcion valorUno' },
                                                                    { path: 'moneda', select: 'codigo descripcion' },
                                                                    { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                                                                    { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                                                                ]
                                                            })
                                                            .populate({
                                                                path: 'transferencia.cuentaDestino',
                                                                populate: [
                                                                    { path: 'banco', select: 'codigo descripcion valorUno' },
                                                                    { path: 'moneda', select: 'codigo descripcion' },
                                                                    { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                                                                    { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                                                                ]
                                                            })
                                                            .populate({
                                                                path: 'transferencia.cuentaPropiaDestino',
                                                                populate: [
                                                                    { path: 'banco', select: 'codigo descripcion valorUno' },
                                                                    { path: 'moneda', select: 'codigo descripcion' },
                                                                    { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                                                                ]
                                                            })
                                                            .populate({
                                                                path: 'transferencia.tipoTransferenciaCliente',
                                                                select: 'codigo descripcion valorUno'
                                                            })
                                                            .populate({
                                                                path: 'transferencia.tipoTransferenciaPropia',
                                                                select: 'codigo descripcion valorUno'
                                                            })
                                                            .populate({
                                                                path: 'cliente',
                                                                populate: [
                                                                    { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' },
                                                                    { path: 'ocupacion', select: 'codigo descripcion' },
                                                                    { path: 'funcionPublica', select: 'codigo descripcion' }
                                                                ]
                                                            })
                                                            .populate('origenDeFondos')
                                                            .populate('empresa')
                                                            .execPopulate()
                                                            .then(async function(transaccionDB) {


                                                                // Transaccion registrada, envio de email
                                                                //enviarEmailRegistroTransaccion(transaccionDB);

                                                                // status 200 no es necesario, va por defecto
                                                                res.json({
                                                                    ok: true,
                                                                    transaccion: transaccionDB
                                                                });

                                                            });

                                                    }).catch((error) => {
                                                        /*
                                                            Deal with all your errors here with your preferred error handle middleware / method
                                                        */
                                                        res.status(500).json({ message: 'Some Error!' })
                                                        console.log(error);
                                                    });

                                            });

                                    })

                            });



                        }).catch((error) => {
                            /*
                                Deal with all your errors here with your preferred error handle middleware / method
                             */
                            res.status(500).json({ message: 'Some Error!' })
                            console.log(error);
                        });

                });

            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: error.message })
    }


});

/*
    Informar Transaccion Aprobada 
    -----------------------------
    Uso:
    Aun no implementado

    Que hace:

*/
app.put('/transaccion/transaccionAprobada/:id', [verificaToken, verificaAdmin_Role], async(req, res) => {
    let id = req.params.id;
    let estado = await obtenerTabla('EstadoTransaccionEnCurso');
    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo


    // { transferencia: { numeroOperacionOrigen: operacion }
    Transaccion.findById(id)
        .exec((err, transaccionDB) => {

            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Valores a actualizar, numero de operacion informado y fecha de comunicacion
            // transaccionDB.transferencia.fechaTransferenciaCliente = Date.now();
            transaccionDB.estadoDeTransaccion = estado;

            transaccionDB.populate({
                    path: 'monedaDe',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'monedaA',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaOrigen',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                        { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaDestino',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                        { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaPropiaDestino',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                    ]
                })
                .populate({
                    path: 'transferencia.tipoTransferenciaCliente'
                })
                .populate({
                    path: 'transferencia.tipoTransferenciaPropia'
                })
                .populate({
                    path: 'cliente',
                    populate: [
                        { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
                    ]
                })
                .populate('empresa')
                .execPopulate();


            // Llama al metodo de grabacion
            transaccionDB.save((err, transaccionDB) => {

                if (err) {
                    // 500 bad request 
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!transaccionDB) {
                    // 400 bad request 
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                //Enviar email para informar al usuario que su transferencia ha sido recibida
                // Transaccion registrada, envio de email
                enviarEmailRegistroTransaccion(transaccionDB);

                Transaccion.findById(id)
                    .exec((err, transaccionDB) => {
                        res.json({
                            ok: true,
                            transaccion: transaccionDB
                        });
                    });
            });
        });
});

/*
    Informar transferencia del cliente
    ----------------------------------
    Uso:
    Recibe la confirmacion de la transferencia registrada por el cliente 

    Se llama desde:
    transaction.page.ts -> Para confirmar la transferencia desde la seccion ultima transaccion
    history-last.page.ts -> Para confirmar la transferencia desde la consulta de transacciones del usuario
    
    Que hace:
    Registra el numero de operacion bancaria que indica el cliente 
    Envia correo electronico al cliente y al supervisor con la informacion registrada

*/
app.put('/transaccion/transferenciaRealizada/:id/:operacion', verificaToken, async(req, res) => {
    let id = req.params.id;
    let operacion = req.params.operacion;
    let estado = await obtenerTabla('EstadoTransaccionPagada');
    let estadoEnCurso = await obtenerTabla('EstadoTransaccionEnCurso');
    let enviarEmail = false
    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    
    // { transferencia: { numeroOperacionOrigen: operacion }
    Transaccion.findById(id)
        .exec((err, transaccionDB) => {

            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // if ( transaccionDB.estadoDeTransaccion.toString()!==estadoEnCurso._id.toString()) {
            //     // 400 bad request
            //     return res.status(400).json({
            //         ok: false,
            //         err: {
            //             message: "Transaccion finalizada o cancelada, no se puede registrar transferencia."
            //         }
            //     });
            // }


            // Valores a actualizar, numero de operacion informado y fecha de comunicacion
            transaccionDB.transferencia.numeroOperacionOrigen = operacion;
            if ( ! transaccionDB.transferencia.fechaTransferenciaCliente ) {
                enviarEmail = true
                transaccionDB.transferencia.fechaTransferenciaCliente = Date.now();
            }

            // transaccionDB.estadoDeTransaccion = estado;

            transaccionDB.populate({
                    path: 'monedaDe',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'monedaA',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaOrigen',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                        { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaDestino',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                        { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaPropiaDestino',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                    ]
                })
                .populate({
                    path: 'transferencia.tipoTransferenciaCliente'
                })
                .populate({
                    path: 'transferencia.tipoTransferenciaPropia'
                })
                .populate({
                    path: 'cliente',
                    populate: [
                        { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
                    ]
                })
                .populate('empresa')
                .execPopulate();


            // Llama al metodo de grabacion
            transaccionDB.save((err, transaccionDB) => {

                if (err) {
                    // 500 bad request 
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!transaccionDB) {
                    // 400 bad request 
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                //Enviar email para informar al usuario que su transferencia ha sido recibida
                // Transaccion registrada, envio de email
                if (enviarEmail ) enviarEmailTransferenciaCliente(transaccionDB);

                Transaccion.findById(id)
                    .exec((err, transaccionDB) => {
                        res.json({
                            ok: true,
                            transaccion: transaccionDB
                        });
                    });
            });
        });
});

/*
    Informar nuestra transferencia
    ------------------------------
    Uso:
    Recibe la confirmacion de la transferencia propia registrada 

    Se llama desde:
    Divisa, accion notificar al cliente
    
    Que hace:
    Registra el numero de operacion bancaria propia
    Envia correo electronico al cliente y al supervisor con la informacion registrada

*/
app.put('/transaccion/transferenciaPropiaRealizada/:id/:operacion', [verificaToken, verificaAdmin_Role], async(req, res) => {
    let id = req.params.id;
    let operacion = req.params.operacion;
    let estado = await obtenerTabla('EstadoTransaccionFinalizada');
    let enviarEmail = false
    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo


    // { transferencia: { numeroOperacionOrigen: operacion }
    Transaccion.findById(id)
        .exec((err, transaccionDB) => {

            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Valores a actualizar, numero de operacion bancaria, fecha actual y estado
            //Ya nose graban datos, vienen grabados desde el cliente Divisa

            // transaccionDB.transferencia.numeroOperacionPropiaOrigen = operacion;
            // if (!transaccionDB.transferencia.fechaTransferenciaPropia) {
            //     enviarEmail = true
            //     transaccionDB.transferencia.fechaTransferenciaPropia = Date.now();
            //     transaccionDB.estadoDeTransaccion = estado;
            // }

            enviarEmail = true;

            transaccionDB.populate({
                    path: 'monedaDe',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'monedaA',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaOrigen',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                        { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaDestino',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                        { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaPropiaDestino',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                    ]
                })
                .populate({
                    path: 'transferencia.tipoTransferenciaCliente'
                })
                .populate({
                    path: 'transferencia.tipoTransferenciaPropia'
                })                
                .populate({
                    path: 'cliente',
                    populate: [
                        { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
                    ]
                })
                .populate('empresa')
                .execPopulate();

            // Llama al metodo de grabacion
            transaccionDB.save((err, transaccionDB) => {

                if (err) {
                    // 500 bad request 
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!transaccionDB) {
                    // 400 bad request 
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                //Enviar email para informar al usuario que su transferencia ya esta realizada
                if (enviarEmail) enviarEmailTransferenciaPropia(transaccionDB);

                Transaccion.findById(id)
                    .exec((err, transaccionDB) => {

                        res.json({
                            ok: true,
                            transaccion: transaccionDB
                        });

                    });
            });
        });
});

/*
    Cancelar transaccion
    --------------------
*/
app.put('/transaccion/cancelacion/:id/:motivo', verificaToken, async(req, res) => {
    let id = req.params.id;
    let motivo = req.params.motivo;
    let estado = await obtenerTabla('EstadoTransaccionCancelada');
    let estadoEnCurso = await obtenerTabla('EstadoTransaccionEnCurso');
    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo


    // { transferencia: { numeroOperacionOrigen: operacion }
    Transaccion.findById(id)
        .exec((err, transaccionDB) => {

            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            
            // 2023.06.15 Ya no se valida
            // if ( transaccionDB.estadoDeTransaccion.toString()===estadoEnCurso._id.toString() && transaccionDB.transferencia.fechaTransferenciaCliente) {
            //     // 400 bad request
            //     return res.status(400).json({
            //         ok: false,
            //         err: {
            //             message: "Transaccion en curso con transferencia realizada, no se puede cancelar."
            //         }
            //     });
            // }

            // Valores a actualizar, numero de operacion bancaria, fecha actual y estado
            transaccionDB.fechaCancelacion = Date.now();
            transaccionDB.motivoCancelacion = motivo;
            transaccionDB.estadoDeTransaccion = estado;

            transaccionDB.populate({
                    path: 'monedaDe',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'monedaA',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaOrigen',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                        { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaDestino',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                        { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaPropiaDestino',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                    ]
                })
                .populate({
                    path: 'cliente',
                    populate: [
                        { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
                    ]
                })
                .populate('empresa')
                .execPopulate();

            // Llama al metodo de grabacion
            transaccionDB.save((err, transaccionDB) => {

                if (err) {
                    // 500 bad request 
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!transaccionDB) {
                    // 400 bad request 
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                //Enviar email para informar la cancelacion
                // enviarEmailCancelacion(transaccionDB);

                Transaccion.findById(id)
                    .exec((err, transaccionDB) => {

                        res.json({
                            ok: true,
                            transaccion: transaccionDB
                        });

                    });
            });
        });
});

/*
    Habilitar transaccion cancelada
    -------------------------------
    Uso:
    Habilita una transaccion cancelada 

    Se llama desde:
    Divisa, accion habilitar

    Que hace:
    Cambia de estado a EnCurso a la transaccion
*/
app.put('/transaccion/habilitar/:id/:motivo', [verificaToken, verificaAdmin_Role], async(req, res) => {
    let id = req.params.id;
    let motivo = req.params.motivo;
    let estado = await obtenerTabla('EstadoTransaccionEnCurso');
    let estadoCancelada = await obtenerTabla('EstadoTransaccionCancelada');
    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
 

    // { transferencia: { numeroOperacionOrigen: operacion }
    Transaccion.findById(id)
        .exec((err, transaccionDB) => {

            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            
            if ( transaccionDB.estadoDeTransaccion.toString()!==estadoCancelada._id.toString() ) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Transaccion no esta cancelada, no se puede habilitar."
                    }
                });
            }

            // Valores a actualizar, numero de operacion bancaria, fecha actual y estado
            transaccionDB.fechaCancelacion = null;
            transaccionDB.motivoCancelacion = null;
            transaccionDB.estadoDeTransaccion = estado;

            transaccionDB.populate({
                    path: 'monedaDe',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'monedaA',
                    populate: [
                        { path: 'pais', select: 'codigo descripcion valorUno' },
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaOrigen',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                        { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaDestino',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                        { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
                    ]
                })
                .populate({
                    path: 'transferencia.cuentaPropiaDestino',
                    populate: [
                        { path: 'banco', select: 'codigo descripcion valorUno' },
                        { path: 'moneda', select: 'codigo descripcion' },
                        { path: 'tipoDeCuenta', select: 'codigo descripcion' },
                    ]
                })
                .populate({
                    path: 'cliente',
                    populate: [
                        { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
                    ]
                })
                .populate('empresa')
                .execPopulate();

            // Llama al metodo de grabacion
            transaccionDB.save((err, transaccionDB) => {

                if (err) {
                    // 500 bad request 
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!transaccionDB) {
                    // 400 bad request 
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }


                //Enviar email para informar 
                //enviarEmailRegistroTransaccion(transaccionDB);

                Transaccion.findById(id)
                    .exec((err, transaccionDB) => {

                        res.json({
                            ok: true,
                            transaccion: transaccionDB
                        });

                    });
            });
        });
});

/*
    Plantilla base para cuando se presentan una nueva transaccion
    -------------------------------------------------------------
    Uso:
    Retornar datos iniciales cuando un usuario nuevo ingresa a la plataforma

    Se llama desde:
    transaction.pgae.ts

    Que hace:
    Genera un JSON con valores iniciales asi como el tipo de cambio base
*/
app.get('/transaccion/nueva', async(req, res) => {
  
    function obtenerMoneda(codigo) {
        return new Promise((resolve, reject) => { 

            Moneda.find({ codigo: codigo })
                .populate('pais', 'descripcion valorUno')
                .exec((err, moneda) => {
                    if (err) {
                        // 400 bad request
                        reject('Error');
                    }

                    resolve(moneda[0]);
                });
        })
    } 

    let transaccion;

    let monedaDe = await obtenerMoneda('USD');
    let monedaA = await obtenerMoneda('PEN');
    let codigoDeA = 'USDPEN';
    let cotizacion = await obtenerCotizacion(codigoDeA);
    let cantidadDe = 100;
    let cantidadA = 0;
    let metodoDePago = await obtenerTabla('MetodoDePagoTarjeta');
    let opcionEntrega = await obtenerTabla('OpcionEntregaTransferencia');
    let ciudadEstablecimientoRecojo = await obtenerTabla('CiudadEstablecimientoMadrid');
    let establecimientoRecojo = await obtenerTabla('LocalMadridPrincipal');
    let usuarioCliente = '';


    let tipoDocumentoIdentidad = await obtenerTabla('TipoDocumentoIdentidad_DNI');
    let paisOrigen = await obtenerTabla('Paises_PE');

    let cliente = {
        _id: '',
        nombre: '',
        primerApellido: '',
        segundoApellido: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        tipoDocumentoIdentidad: {
            _id: tipoDocumentoIdentidad._id,
            codigo: tipoDocumentoIdentidad.codigo,
            descripcion: tipoDocumentoIdentidad.descripcion
        },
        numeroDocumentoIdentidad: '',
        usuarioAsociado: '',
        paisDeOrigen: {
            _id: paisOrigen._id,
            codigo: paisOrigen.codigo,
            descripcion: paisOrigen.descripcion,
            valorUno: paisOrigen.valorUno
        },
        ocupacion: {
            _id: '',
            codigo: '',
            descripcion: '',
            valorUno: ''
        },
        funcionPublica: {
            _id: '',
            codigo: '',
            descripcion: '',
            valorUno: ''
        },
        cargoFuncionPublica: '',
        institucionFuncionPublica: ''
    };
    let numeroTransaccion = 0;
    let transferencia = {
        cuentaOrigen: {
            _id: '',
            banco: {
                _id: '',
                codigo: '',
                descripcion: '',
                valorUno: ''
            },
            moneda: {
                _id: '',
                codigo: '',
                descripcion: '',
                pais: {
                    _id: '',
                    codigo: '',
                    descripcion: '',
                    valorUno: ''
                },
                __v: 0
            },
            tipoDecuenta: {
                _id: '',
                codigo: '',
                descripcion: ''
            },
            numeroDeCuenta: '',
            numeroDeCCI: ''
        },
        cuentaDestino: {
            _id: '',
            banco: {
                _id: '',
                codigo: '',
                descripcion: '',
                valorUno: ''
            },
            moneda: {
                _id: '',
                codigo: '',
                descripcion: ''
            },
            tipoDecuenta: {
                _id: '',
                codigo: '',
                descripcion: ''
            },
            numeroDeCuenta: '',
            numeroDeCCI: ''
        },
        cuentaPropiaDestino: {
            _id: '',
            banco: {
                _id: '',
                codigo: '',
                descripcion: '',
                valorUno: ''
            },
            moneda: {
                _id: '',
                codigo: '',
                descripcion: ''
            },
            tipoDecuenta: {
                _id: '',
                codigo: '',
                descripcion: ''
            },
            numeroDeCuenta: '',
            numeroDeCCI: ''
        }
    }
    let destinoTransaccion = await obtenerTabla('DestinoTransaccionParaMi');
    let origenDeFondos = {
        _id: '',
        codigo: '',
        descripcion: '',
        valorUno: ''
    };
    let empresa = {
        _id: '-',
        ruc: '-',
        razonSocial: '',
        telefono: '',
        direccion: ''
    }
 
  
    cantidadA = cantidadDe * cotizacion;
    cantidadA = Number(cantidadA.toFixed(2))

    transaccion = {
        monedaDe,
        monedaA,
        codigoDeA,
        cotizacion,
        cantidadDe,
        cantidadA,
        metodoDePago,
        opcionEntrega,
        ciudadEstablecimientoRecojo,
        establecimientoRecojo,
        usuarioCliente,
        cliente,
        numeroTransaccion,
        transferencia,
        destinoTransaccion,
        origenDeFondos,
        empresa
    };

    res.json({
        ok: true,
        transaccion: transaccion
    });

})

/*
    Actualiza transaccion
    Desde Divisa
    --------------------
*/

/*
            monedaDe								varchar(10)   '$.monedaDe.codigo',      
			monedaA									varchar(10)   '$.monedaA.codigo',
			cotizacion								decimal(18,6) '$.cotizacion',      
			cantidadDe								decimal(18,2) '$.cantidadDe',      
			cantidadA								decimal(18,2) '$.cantidadA',

			    metodoDePago							varchar(100)  '$.metodoDePago.codigo',
			    opcionEntrega							varchar(100)  '$.opcionEntrega.codigo',
			    fechaRecogida							datetime	  '$.fechaRecogida',      
			    establecimientoRecojo					varchar(100)  '$.establecimientoRecojo.codigo',

			nombre									varchar(100)  '$.cliente.nombre',
			primerApellido							varchar(100)  '$.cliente.primerApellido',
			segundoApellido							varchar(100)  '$.cliente.segundoApellido',
			email									varchar(100)  '$.cliente.email',
			telefono								varchar(100)  '$.cliente.telefono',
			direccion								varchar(100)  '$.cliente.direccion',

			    paisDeOrigen							varchar(100)  '$.cliente.paisDeOrigen.codigo',

			tipoDocumentoIdentidad					varchar(100)  '$.cliente.tipoDocumentoIdentidad.codigo',
			numeroDocumentoIdentidad				varchar(100)  '$.cliente.numeroDocumentoIdentidad',

    			fechaNacimiento							varchar(100)  '$.cliente.fechaNacimiento',

			estadoDeTransaccion						varchar(100)  '$.estadoDeTransaccion.codigo',

			empresaId								varchar(100)  '$.empresa._id'
			rucEmp									varchar(100)  '$.empresa.ruc',
			razonSocialEmp							varchar(100)  '$.empresa.razonSocial',
			direccionEmp							varchar(100)  '$.empresa.direccion',
    			telefonoEmp								varchar(100)  '$.empresa.telefono',

                tipoDocumentoIdentidadRepLeg			varchar(100)  '$.empresa.tipoDocumentoIdentidadRep.codigo',
                numeroDocumentoIdentidadRepLeg			varchar(100)  '$.empresa.numeroDocumentoIdentidadRep',
                nombreRepLeg							varchar(100)  '$.empresa.nombreRep',
                primerApellidoRepLeg					varchar(100)  '$.empresa.primerApellidoRep',
                segundoApellidoRepLeg					varchar(100)  '$.empresa.segundoApellidoRep',
                funcionPublica							varchar(100)  '$.cliente.funcionPublica.codigo',
                ocupacion								varchar(100)  '$.cliente.ocupacion.codigo',
                origenDeFondos							varchar(100)  '$.origenDeFondos.codigo',

            destinoTransaccion						varchar(100)  '$.destinoTransaccion.codigo',

			cuentaOrigenId							varchar(100)  '$.transferencia.cuentaOrigen._id',	
			cuentaOrigenBanco						varchar(100)  '$.transferencia.cuentaOrigen.banco.codigo',	
			cuentaOrigenTipoDeCuenta				varchar(100)  '$.transferencia.cuentaOrigen.tipoDeCuenta.codigo',	
			cuentaOrigenNumeroDeCuenta				varchar(100)  '$.transferencia.cuentaOrigen.numeroDeCuenta',	
			cuentaOrigenNumeroCCI					varchar(100)  '$.transferencia.cuentaOrigen.numeroDeCCI',	
    			cuentaOrigenTipoPropiedadCuenta			varchar(100)  '$.transferencia.cuentaOrigen.tipoPropiedadCuenta.codigo',	

			cuentaDestinoId							varchar(100)  '$.transferencia.cuentaDestino._id',	
			cuentaDestinoBanco						varchar(100)  '$.transferencia.cuentaDestino.banco.codigo',	
			cuentaDestinoTipoDeCuenta				varchar(100)  '$.transferencia.cuentaDestino.tipoDeCuenta.codigo',	
			cuentaDestinoNumeroDeCuenta				varchar(100)  '$.transferencia.cuentaDestino.numeroDeCuenta',	
			cuentaDestinoNumeroCCI					varchar(100)  '$.transferencia.cuentaDestino.numeroDeCCI',	
	    		cuentaDestinoTipoPropiedadCuenta		varchar(100)  '$.transferencia.cuentaDestino.tipoPropiedadCuenta.codigo',	

			cuentaPropiaOrigenBanco					varchar(100)  '$.transferencia.cuentaPropiaOrigen.banco.codigo',	
			cuentaPropiaOrigenTipoDeCuenta			varchar(100)  '$.transferencia.cuentaPropiaOrigen.tipoDeCuenta.codigo',	
			cuentaPropiaOrigenNumeroDeCuenta		varchar(100)  '$.transferencia.cuentaPropiaOrigen.numeroDeCuenta',	
			cuentaPropiaOrigenNumeroCCI				varchar(100)  '$.transferencia.cuentaPropiaOrigen.numeroDeCCI',	
    			cuentaPropiaOrigenTipoPropiedadCuenta	varchar(100)  '$.transferencia.cuentaPropiaOrigen.tipoPropiedadCuenta.codigo',	

			cuentaPropiaDestinoBanco				varchar(100)  '$.transferencia.cuentaPropiaDestino.banco.codigo',	
			cuentaPropiaDestinoTipoDeCuenta			varchar(100)  '$.transferencia.cuentaPropiaDestino.tipoDeCuenta.codigo',	
			cuentaPropiaDestinoNumeroDeCuenta		varchar(100)  '$.transferencia.cuentaPropiaDestino.numeroDeCuenta',	
			cuentaPropiaDestinoNumeroCCI			varchar(100)  '$.transferencia.cuentaPropiaDestino.numeroDeCCI',	
	    		cuentaPropiaDestinoTipoPropiedadCuenta	varchar(100)  '$.transferencia.cuentaPropiaDestino.tipoPropiedadCuenta.codigo',	

			tipoTransferenciaCliente				varchar(100)  '$.transferencia.tipoTransferenciaCliente.codigo',	
			numeroOperacionOrigen					varchar(100)  '$.transferencia.numeroOperacionOrigen',	
			fechaTransferenciaCliente 				varchar(100)  '$.transferencia.fechaTransferenciaCliente',	

			tipoTransferenciaPropia					varchar(100)  '$.transferencia.tipoTransferenciaPropia.codigo',	
			numeroOperacionPropiaOrigen				varchar(100)  '$.transferencia.numeroOperacionPropiaOrigen',	
			fechaTransferenciaPropia				varchar(100)  '$.transferencia.fechaTransferenciaPropia',	
*/
app.put('/transaccion/actualiza/:id', [verificaToken, verificaAdmin_Role], async(req, res) => {
    let id = req.params.id;
    let body = req.body;

    // console.log('id', id);j
    // console.log('body', body);
    

    let {
            
            monedaDe_codigo,
            monedaA_codigo,
            cotizacion,
            cantidadDe,
            cantidadA,

            clienteId,
            nombre,
            primerApellido,
            segundoApellido,
            email,
            telefono,
            direccion,

            tipoDocumentoIdentidad_codigo,
            numeroDocumentoIdentidad,
            estadoDeTransaccion_codigo,

            empresaId,
            rucEmp,
            razonSocialEmp,
            direccionEmp,

            destinoTransaccion_codigo,

            cuentaOrigenId,
            cuentaOrigenBanco_codigo,
            cuentaOrigenTipoDeCuenta_codigo,
            cuentaOrigenNumeroDeCuenta,
            cuentaOrigenNumeroCCI,

            cuentaDestinoId,
            cuentaDestinoBanco_codigo,
            cuentaDestinoTipoDeCuenta_codigo,
            cuentaDestinoNumeroDeCuenta,
            cuentaDestinoNumeroCCI,
             
            cuentaPropiaOrigenBanco_codigo,
            cuentaPropiaOrigenTipoDeCuenta_codigo,
            cuentaPropiaOrigenNumeroDeCuenta,
            cuentaPropiaOrigenNumeroCCI,
                
            cuentaPropiaDestinoBanco_codigo,
            cuentaPropiaDestinoTipoDeCuenta_codigo,
            cuentaPropiaDestinoNumeroDeCuenta,
            cuentaPropiaDestinoNumeroCCI,

            tipoTransferenciaCliente_codigo,
            numeroOperacionOrigen,
            fechaTransferenciaCliente,

            tipoTransferenciaPropia_codigo,
            numeroOperacionPropiaOrigen,
            fechaTransferenciaPropia,
    } = body;

    // Ids de los codigos recibidos
    let {_id: monedaDe} = await AyudaDB.obtenerMoneda(monedaDe_codigo);
    let {_id: monedaA} = await AyudaDB.obtenerMoneda(monedaA_codigo);
    let codigoDeA = monedaDe+monedaA;
    let {_id: tipoDocumentoIdentidad} = await AyudaDB.obtenerTabla(tipoDocumentoIdentidad_codigo);
    let {_id: estadoDeTransaccion} = await AyudaDB.obtenerTabla(estadoDeTransaccion_codigo);
    let {_id: destinoTransaccion} = await AyudaDB.obtenerTabla(destinoTransaccion_codigo);

    let {_id: cuentaOrigenBanco} = await AyudaDB.obtenerTabla(cuentaOrigenBanco_codigo);
    let {_id: cuentaOrigenTipoDeCuenta} = await AyudaDB.obtenerTabla(cuentaOrigenTipoDeCuenta_codigo);

    let {_id: cuentaDestinoBanco} = await AyudaDB.obtenerTabla(cuentaDestinoBanco_codigo);
    let {_id: cuentaDestinoTipoDeCuenta} = await AyudaDB.obtenerTabla(cuentaDestinoTipoDeCuenta_codigo);

    let {_id: cuentaPropiaOrigenBanco} = await AyudaDB.obtenerTabla(cuentaPropiaOrigenBanco_codigo);
    let {_id: cuentaPropiaOrigenTipoDeCuenta} = await AyudaDB.obtenerTabla(cuentaPropiaOrigenTipoDeCuenta_codigo);

    let {_id: cuentaPropiaDestinoBanco} = await AyudaDB.obtenerTabla(cuentaPropiaDestinoBanco_codigo);
    let {_id: cuentaPropiaDestinoTipoDeCuenta} = await AyudaDB.obtenerTabla(cuentaPropiaDestinoTipoDeCuenta_codigo);

    let {_id: tipoTransferenciaCliente} = await AyudaDB.obtenerTabla(tipoTransferenciaCliente_codigo);
    let {_id: tipoTransferenciaPropia} = await AyudaDB.obtenerTabla(tipoTransferenciaPropia_codigo);

  
    Transaccion.findById(id)
        .exec(async(err, transaccionDB) => {

            if (err) {
                // 500 bad request
                console.log('bar request');
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                console.log('no hay datos');
                return res.status(400).json({
                    ok: false,
                    err: {message: 'No existe la transaccion'}
                });
            }

            
                
        try{

            await AyudaDB.actualizarCliente(clienteId, nombre, primerApellido, segundoApellido, email, telefono, direccion, tipoDocumentoIdentidad, numeroDocumentoIdentidad);
            let {_id: empresa} = rucEmp ? await AyudaDB.actualizarCrearEmpresaCliente(clienteId, empresaId, rucEmp, razonSocialEmp, direccionEmp) : '';
            let {_id: cuentaOrigen} = await AyudaDB.actualizarCrearCuentaCliente(cuentaOrigenId, clienteId, empresa, cuentaOrigenBanco, cuentaOrigenTipoDeCuenta, monedaDe, cuentaOrigenNumeroDeCuenta, cuentaOrigenNumeroCCI);
            let {_id: cuentaDestino} = await AyudaDB.actualizarCrearCuentaCliente(cuentaDestinoId, clienteId, empresa, cuentaDestinoBanco, cuentaDestinoTipoDeCuenta, monedaA, cuentaDestinoNumeroDeCuenta, cuentaDestinoNumeroCCI);

            let {_id: cuentaPropiaOrigen} = await AyudaDB.buscarCuentaPropia(cuentaPropiaOrigenBanco, cuentaPropiaOrigenTipoDeCuenta, monedaA, cuentaPropiaOrigenNumeroDeCuenta, cuentaPropiaOrigenNumeroCCI);
            let {_id: cuentaPropiaDestino} = await AyudaDB.buscarCuentaPropia(cuentaPropiaDestinoBanco, cuentaPropiaDestinoTipoDeCuenta, monedaDe, cuentaPropiaDestinoNumeroDeCuenta, cuentaPropiaDestinoNumeroCCI);
    
        
            // Valores a actualizar
            transaccionDB.monedaDe=monedaDe;
            transaccionDB.monedaA=monedaA;
            transaccionDB.codigoDeA=codigoDeA; 
            transaccionDB.cotizacion=cotizacion;
            transaccionDB.cantidadDe=cantidadDe;
            transaccionDB.cantidadA=cantidadA;
            
            transaccionDB.estadoDeTransaccion=estadoDeTransaccion;
            transaccionDB.empresa=empresa;
            transaccionDB.destinoTransaccion=destinoTransaccion;
            
            transaccionDB.transferencia.cuentaOrigen=cuentaOrigen;
            transaccionDB.transferencia.cuentaDestino=cuentaDestino;
            transaccionDB.transferencia.cuentaPropiaOrigen=cuentaPropiaOrigen;
            transaccionDB.transferencia.cuentaPropiaDestino=cuentaPropiaDestino;

            transaccionDB.transferencia.tipoTransferenciaCliente=tipoTransferenciaCliente;
            transaccionDB.transferencia.numeroOperacionOrigen=numeroOperacionOrigen;
            transaccionDB.transferencia.fechaTransferenciaCliente=fechaTransferenciaCliente ? moment(fechaTransferenciaCliente, 'DD/MM/YYYY HH:mm:ss').toISOString() : fechaTransferenciaCliente;
            
            transaccionDB.transferencia.tipoTransferenciaPropia=tipoTransferenciaPropia;
            transaccionDB.transferencia.numeroOperacionPropiaOrigen=numeroOperacionPropiaOrigen;
            transaccionDB.transferencia.fechaTransferenciaPropia=fechaTransferenciaPropia ? moment(fechaTransferenciaPropia, 'DD/MM/YYYY HH:mm:ss').toISOString() : fechaTransferenciaPropia;
            
            // Llama al metodo de grabacion
            transaccionDB.save((err, transaccionDB) => {

                if (err) {
                    // 500 bad request
                    console.log('bad request al grabar', err); 
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!transaccionDB) {
                    // 400 bad request 
                    console.log('no hay datos al grabar');
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                console.log('success')
                res.json({
                    ok: true,
                    transaccion: transaccionDB
                });

            });
        } catch (error) {
            console.log('Error!!', error);  
            return res.status(400).json({
                ok: false,
                err: {message: error}
            });      
        }


        });

        
   

});

app.put('/transaccion/actualizaDevolucion/:id', [verificaToken, verificaAdmin_Role], async(req, res) => {
    let id = req.params.id;
    let body = req.body;

    let {            
            devolucion,
    } = body;

    let estadoDeTransaccion_codigo=devolucion && devolucion!=='' ? 'EstadoTransaccionReembolsada' : 'EstadoTransaccionEnCurso';
    let estadoDeTransaccion= await AyudaDB.obtenerTabla(estadoDeTransaccion_codigo);
console.log(devolucion);
    Transaccion.findById(id)
        .exec(async(err, transaccionDB) => {

            if (err) {
                // 500 bad request
                console.log('bar request');
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!transaccionDB) {
                // 400 bad request
                console.log('no hay datos');
                return res.status(400).json({
                    ok: false,
                    err: {message: 'No existe la transaccion'}
                });
            }
                        
        try{
        
            // Valores a actualizar
            transaccionDB.estadoDeTransaccion=estadoDeTransaccion;
            transaccionDB.devolucion=devolucion;
            
            console.log(transaccionDB.estadoDeTransaccion);

            // Llama al metodo de grabacion
            transaccionDB.save((err, transaccionDB) => {

                if (err) {
                    // 500 bad request
                    console.log('bad request al grabar', err); 
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!transaccionDB) {
                    // 400 bad request 
                    console.log('no hay datos al grabar');
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                console.log('success')
                res.json({
                    ok: true,
                    transaccion: transaccionDB
                });

            });
        } catch (error) {
            console.log('Error!!', error);  
            return res.status(400).json({
                ok: false,
                err: {message: error}
            });      
        }
        });

        
});

// app.put('/transaccion/actualiza/:id', [verificaToken, verificaAdmin_Role], async(req, res) => {
//     let id = req.params.id;
//     let body = req.body;
//     let {
//                 rucemp,
//             razonsocialemp,
//             direccionemp,
//                 cuentaorigenbanco,
//                 cuentaorigentipodecuenta,
//             cuentaorigennumerodecuenta,
//             cuentaorigennumerocci,
//                 cuentadestinobanco,
//                 cuentadestinotipodecuenta,
//             cuentadestinonumerodecuenta,
//             cuentadestinonumerocci,
//             numerooperacionorigen,
//             fechatransferenciacliente,
//                 cuentapropiaorigenbanco,
//                 cuentapropiaorigentipodecuenta,
//             cuentapropiaorigennumerodecuenta,
//             cuentapropiaorigennumerocci,
//                 cuentapropiadestinobanco,
//                 cuentapropiadestinotipodecuenta,
//             cuentapropiadestinonumerodecuenta,
//             cuentapropiadestinonumerocci,
//             numerooperacionpropiaorigen,
//             fechatransferenciapropia,
//                 estadodetransaccion,
//     } = body;

//     //destinotransaccion
//     //tipotransferenciacliente
//     //tipotransferenciapropia

//     let idcuentaorigenbanco = await obtenerTabla(cuentaorigenbanco);
//     let idcuentaorigentipodecuenta = await obtenerTabla(cuentaorigentipodecuenta);
//     let idcuentadestinobanco = await obtenerTabla(cuentadestinobanco);
//     let idcuentadestinotipodecuenta = await obtenerTabla(cuentadestinotipodecuenta);
//     let idcuentapropiaorigenbanco = await obtenerTabla(cuentapropiaorigenbanco);
//     let idcuentapropiaorigentipodecuenta = await obtenerTabla(cuentapropiaorigentipodecuenta);
//     let idcuentapropiadestinobanco = await obtenerTabla(cuentapropiadestinobanco);
//     let idcuentapropiadestinotipodecuenta = await obtenerTabla(cuentapropiadestinotipodecuenta);
//     let idestadodetransaccion = await obtenerTabla(estadodetransaccion);

//     /*
//             rucemp
//             razonsocialemp
//             direccionemp

//             cuentaorigenbanco
//             cuentaorigentipodecuenta
//             cuentaorigennumerodecuenta
//             cuentaorigennumerocci
//             cuentadestinobanco
//             cuentadestinotipodecuenta
//             cuentadestinonumerodecuenta
//             cuentadestinonumerocci
//             numerooperacionorigen
//             fechatransferenciacliente

//             cuentapropiaorigenbanco
//             cuentapropiaorigentipodecuenta
//             cuentapropiaorigennumerodecuenta
//             cuentapropiaorigennumerocci
//             cuentapropiadestinobanco
//             cuentapropiadestinotipodecuenta
//             cuentapropiadestinonumerodecuenta
//             cuentapropiadestinonumerocci
//             numerooperacionpropiaorigen
//             fechatransferenciapropia
//             estadodetransaccion
//     */
//             Transaccion.findById(id)
//             .exec((err, transaccionDB) => {
    
//                 if (err) {
//                     // 500 bad request
//                     return res.status(500).json({
//                         ok: false,
//                         err
//                     });
//                 }
    
//                 if (!transaccionDB) {
//                     // 400 bad request
//                     return res.status(400).json({
//                         ok: false,
//                         err
//                     });
//                 }
    
                
    
//                 // Valores a actualizar, numero de operacion bancaria, fecha actual y estado
//                 transaccionDB.motivoCancelacion = motivo;
                
//                 cuentaOrigen
//                 cuentaDestino
//                 cuentaPropiaOrigen
//                 cuentaPropiaDestino
    
//                 tipoTransferenciaCliente
//                 tipoTransferenciaPropia
    
//                 numeroOperacionOrigen
//                 numeroOperacionPropiaOrigen
    
//                 fechaTransferenciaCliente
//                 fechaTransferenciaPropia
    
//                 estadoDeTransaccion
    
//                 idcuentaorigenbanco
//                 idcuentaorigentipodecuenta
//                 idcuentadestinobanco
//                 idcuentadestinotipodecuenta
//                 idcuentapropiaorigenbanco
//                 idcuentapropiaorigentipodecuenta
//                 idcuentapropiadestinobanco
//                 idcuentapropiadestinotipodecuenta
//                 idestadodetransaccion
    
//                 transaccionDB
//                     .populate({
//                         path: 'monedaDe',
//                         populate: [
//                             { path: 'pais', select: 'codigo descripcion valorUno' },
//                         ]
//                     })
//                     .populate({
//                         path: 'monedaA',
//                         populate: [
//                             { path: 'pais', select: 'codigo descripcion valorUno' },
//                         ]
//                     })
//                     .populate({
//                         path: 'transferencia.cuentaOrigen',
//                         populate: [
//                             { path: 'banco', select: 'codigo descripcion valorUno' },
//                             { path: 'moneda', select: 'codigo descripcion' },
//                             { path: 'tipoDeCuenta', select: 'codigo descripcion' },
//                             { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
//                         ]
//                     })
//                     .populate({
//                         path: 'transferencia.cuentaDestino',
//                         populate: [
//                             { path: 'banco', select: 'codigo descripcion valorUno' },
//                             { path: 'moneda', select: 'codigo descripcion' },
//                             { path: 'tipoDeCuenta', select: 'codigo descripcion' },
//                             { path: 'tipoPropiedadCuenta', select: 'codigo descripcion' }
//                         ]
//                     })
//                     .populate({
//                         path: 'transferencia.cuentaPropiaDestino',
//                         populate: [
//                             { path: 'banco', select: 'codigo descripcion valorUno' },
//                             { path: 'moneda', select: 'codigo descripcion' },
//                             { path: 'tipoDeCuenta', select: 'codigo descripcion' },
//                         ]
//                     })
//                     .populate({
//                         path: 'cliente',
//                         populate: [
//                             { path: 'tipoDocumentoIdentidad', select: 'codigo descripcion' }
//                         ]
//                     })
//                     .populate('empresa')
//                     .execPopulate();
    
//                 // Llama al metodo de grabacion
//                 transaccionDB.save((err, transaccionDB) => {
    
//                     if (err) {
//                         // 500 bad request 
//                         return res.status(500).json({
//                             ok: false,
//                             err
//                         });
//                     }
    
//                     if (!transaccionDB) {
//                         // 400 bad request 
//                         return res.status(400).json({
//                             ok: false,
//                             err
//                         });
//                     }
    
    
//                     //Enviar email para informar la actualizacion
//                     //enviarEmailCancelacion(transaccionDB);
    
//                     Transaccion.findById(id)
//                         .exec((err, transaccionDB) => {
    
//                             res.json({
//                                 ok: true,
//                                 transaccion: transaccionDB
//                             });
    
//                         });
//                 });
//             });
//     });
    

/*
    Obtiene informacion necesaria para el email de registro de transaccion
    ----------------------------------------------------------------------
    Uso:
    Prepara datos para el envio del correo electronico del registro de la nueva transaccion

    Se llama desde:
    Endpoint de registro de transaccion

    Que hace:
    Prepara informacion que se usa al enviar el email de registro de la nueva transaccion
    Consolida datos de configuracion y de la transaccion registrada

*/
let getInformacionEmailRegistroTransaccion = async(transaccion) => {

    let configuracion = await getConfiguracion();
    let titularDestinoCliente;
    let documentoIdentidadDestinoCliente;

    // Determina el titular de la cuenta de deposito del cliente
    if (transaccion.transferencia.cuentaDestino.tipoPropiedadCuenta.codigo === 'CuentaPropia') {
        titularDestinoCliente = transaccion.cliente.nombre + ' ' + transaccion.cliente.primerApellido + ' ' + transaccion.cliente.segundoApellido;
        documentoIdentidadDestinoCliente = transaccion.cliente.tipoDocumentoIdentidad.descripcion + '-' + transaccion.cliente.numeroDocumentoIdentidad;
    } else {
        titularDestinoCliente = transaccion.empresa.razonSocial;
        documentoIdentidadDestinoCliente = transaccion.empresa.ruc;
    }

    // Variable que se envia a la plantilla de PUG para que muestre datos variables
    let datosEmail = {
        nombreComercial: configuracion.nombreComercial,
        direccion: configuracion.direccion,        
        rutaLogotipos: configuracion.rutaLogotipos,
        emailTransacciones: configuracion.emailTransacciones,
        telefono: configuracion.telefono,
        urlPlataforma: configuracion.urlPlataforma,

        numeroTransaccion: transaccion.numeroTransaccion,
        email: transaccion.cliente.email,
        nombre: transaccion.cliente.nombre,
        
        nombreCompleto: transaccion.cliente.nombre+ ' '+transaccion.cliente.primerApellido+' '+transaccion.cliente.segundoApellido,
        tipoDocumentoIdentidad: transaccion.cliente.tipoDocumentoIdentidad.descripcion,
        numeroDocumentoIdentidad: transaccion.cliente.numeroDocumentoIdentidad,
        ocupacion: transaccion.cliente.ocupacion ? transaccion.cliente.ocupacion.descripcion : '',
        funcionPublica: transaccion.cliente.funcionPublica ? transaccion.cliente.funcionPublica.descripcion : '',
        cargoFuncionPublica:  transaccion.cliente.cargoFuncionPublica ? transaccion.cliente.cargoFuncionPublica : '',
        institucionFuncionPublica: transaccion.cliente.institucionFuncionPublica ? transaccion.cliente.institucionFuncionPublica : '',        

        origenDeFondos: transaccion.origenDeFondos ? transaccion.origenDeFondos.descripcion: '',

        fechaHora: transaccion.fechaRegistro,
        razonSocial: configuracion.razonSocial,
        horarioAtencion: configuracion.textosVariables.horarioAtencion,
        plazoTransaccion: configuracion.textosVariables.plazoTransaccion,
        bancosProvincia: configuracion.textosVariables.bancosProvincia,
        bancoOrigenCliente: transaccion.transferencia.cuentaOrigen.banco.descripcion,
        transferenciaDe: {
            cantidadDe: transaccion.cantidadDe,
            monedaDe: transaccion.monedaDe.descripcion + '('+transaccion.monedaDe.codigo+')',
            bancoDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.banco.descripcion,
            titularDestinoPropio: configuracion.razonSocial,
            documentoIdentidadDestinoPropio: configuracion.ruc,
            tipoDeCuentaDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.tipoDeCuenta.descripcion,
            numeroDeCuentaDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.numeroDeCuenta,
            numeroDeCCIDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.numeroDeCCI,
            mensajeDestinoPropio: 'Confirma la transferencia desde tu panel de control y envia una imagen de la constancia de transferencia a:',
            emailConstancia: configuracion.emailTransacciones,
            tipoTransferenciaDe: transaccion.transferencia.tipoTransferenciaCliente.codigo
        },
        transferenciaA: {
            cantidadA: transaccion.cantidadA,
            monedaA: transaccion.monedaA.descripcion + '('+transaccion.monedaA.codigo+')',
            bancoDestinoCliente: transaccion.transferencia.cuentaDestino.banco.descripcion,
            titularDestinoCliente: titularDestinoCliente,
            documentoIdentidadDestinoCliente: documentoIdentidadDestinoCliente,
            tipoDeCuentaDestinoCliente: transaccion.transferencia.cuentaDestino.tipoDeCuenta.descripcion,
            numeroDeCuentaDestinoCliente: transaccion.transferencia.cuentaDestino.numeroDeCuenta,
            numeroDeCCIDestinoCliente: transaccion.transferencia.cuentaDestino.numeroDeCCI,
            mensajeDestinoCliente: 'Yyyyyyyy',
            tipoTransferenciaA: transaccion.transferencia.tipoTransferenciaPropia.codigo
        },
        enlace: ''
    };

    // if (transaccion.cliente.ocupacion.descripcion) {
    //     datosEmail.ocupacion = transaccion.cliente.ocupacion.descripcion;
    // }

    // if (transaccion.cliente.ocupacion)  datosEmail.funcionPublica = transaccion.cliente.funcionPublica.descripcion;
    // if (transaccion.cliente.cargoFuncionPublica)  datosEmail.cargoFuncionPublica = transaccion.cliente.cargoFuncionPublica;
    // if (transaccion.cliente.institucionFuncionPublica)  datosEmail.institucionFuncionPublica = transaccion.cliente.institucionFuncionPublica;
    // if (transaccion.origenDeFondos)  datosEmail.origenDeFondos = transaccion.origenDeFondos.descripcion;
    



    return datosEmail;
}

/*
    Obtiene informacion necesaria para el email de recepcion de transferencia del cliente
    -------------------------------------------------------------------------------------
    Uso:
    Similar al anterior pero se usa para el envio del email de transferencia del cliente
*/
let getInformacionEmailTransferenciaCliente = async(transaccion) => {

    let configuracion = await getConfiguracion();
    // let cuentaBancoDestinoPropio = await getCuentaBancoDestinoPropio(transaccion);
    let titularDestinoCliente;
    let documentoIdentidadDestinoCliente;

    // Determina el titular de la cuenta de deposito del cliente
    if (transaccion.transferencia.cuentaDestino.tipoPropiedadCuenta.codigo === 'CuentaPropia') {
        titularDestinoCliente = transaccion.cliente.nombre + ' ' + transaccion.cliente.primerApellido + ' ' + transaccion.cliente.segundoApellido;
        documentoIdentidadDestinoCliente = transaccion.cliente.tipoDocumentoIdentidad.descripcion + '-' + transaccion.cliente.numeroDocumentoIdentidad;
    } else {
        titularDestinoCliente = transaccion.empresa.razonSocial;
        documentoIdentidadDestinoCliente = transaccion.empresa.ruc;
    }

    // Variable que se envia a la plantilla de PUG para que muestre datos variables
    let datosEmail = {
        nombreComercial: configuracion.nombreComercial,
        direccion: configuracion.direccion,        
        rutaLogotipos: configuracion.rutaLogotipos,
        emailTransacciones: configuracion.emailTransacciones,
        telefono: configuracion.telefono,
        urlPlataforma: configuracion.urlPlataforma,
        razonSocial: configuracion.razonSocial,
        horarioAtencion: configuracion.textosVariables.horarioAtencion,
        plazoTransaccion: '25', //configuracion.textosVariables.plazoTransaccion,
        bancosProvincia: configuracion.textosVariables.bancosProvincia,

        numeroTransaccion: transaccion.numeroTransaccion,
        email: transaccion.cliente.email,
        nombre: transaccion.cliente.nombre,
        fechaHora: transaccion.transferencia.fechaTransferenciaCliente,
        bancoOrigenCliente: transaccion.transferencia.cuentaOrigen.banco.descripcion,
        transferenciaDe: {
            cantidadDe: transaccion.cantidadDe,
            monedaDe: transaccion.monedaDe.descripcion + '('+transaccion.monedaDe.codigo+')',
            bancoDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.banco.descripcion,
            titularDestinoPropio: configuracion.razonSocial,
            documentoIdentidadDestinoPropio: configuracion.ruc,
            tipoDeCuentaDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.tipoDeCuenta.descripcion,
            numeroDeCuentaDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.numeroDeCuenta,
            numeroDeCCIDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.numeroDeCCI,
            mensajeDestinoPropio: 'Envia.......',
            emailConstancia: configuracion.emailTransacciones,
            numeroOperacionOrigen: transaccion.transferencia.numeroOperacionOrigen,
            tipoTransferenciaDe: transaccion.transferencia.tipoTransferenciaCliente.codigo
        },
        transferenciaA: {
            cantidadA: transaccion.cantidadA,
            monedaA: transaccion.monedaA.descripcion + '('+transaccion.monedaA.codigo+')',
            bancoDestinoCliente: transaccion.transferencia.cuentaDestino.banco.descripcion,
            titularDestinoCliente: titularDestinoCliente,
            documentoIdentidadDestinoCliente: documentoIdentidadDestinoCliente,
            tipoDeCuentaDestinoCliente: transaccion.transferencia.cuentaDestino.tipoDeCuenta.descripcion,
            numeroDeCuentaDestinoCliente: transaccion.transferencia.cuentaDestino.numeroDeCuenta,
            numeroDeCCIDestinoCliente: transaccion.transferencia.cuentaDestino.numeroDeCCI,
            mensajeDestinoCliente: 'Yyyyyyyy',
            tipoTransferenciaA: transaccion.transferencia.tipoTransferenciaPropia.codigo
        },
        enlace: ''
    };

    return datosEmail;
}

/*
    Obtiene informacion necesaria para el email de envio de transferencia propia
    -------------------------------------------------------------------------------------
    Uso:
    Similar al anterior pero se usa para el envio del email de transferencia propia
*/
let getInformacionEmailTransferenciaPropia = async(transaccion) => {

    let configuracion = await getConfiguracion();
    // let cuentaBancoDestinoPropio = await getCuentaBancoDestinoPropio(transaccion);
    let titularDestinoCliente;
    let documentoIdentidadDestinoCliente;

    // Determina el titular de la cuenta de deposito del cliente
    console.log(transaccion.transferencia.cuentaDestino);
    if (transaccion.transferencia.cuentaDestino.tipoPropiedadCuenta.codigo === 'CuentaPropia') {
        titularDestinoCliente = transaccion.cliente.nombre + ' ' + transaccion.cliente.primerApellido + ' ' + transaccion.cliente.segundoApellido;
        documentoIdentidadDestinoCliente = transaccion.cliente.tipoDocumentoIdentidad.descripcion + '-' + transaccion.cliente.numeroDocumentoIdentidad;
    } else {
        titularDestinoCliente = transaccion.empresa.razonSocial;
        documentoIdentidadDestinoCliente = transaccion.empresa.ruc;
    }

    // Variable que se envia a la plantilla de PUG para que muestre datos variables

    let datosEmail = {
        nombreComercial: configuracion.nombreComercial,
        direccion: configuracion.direccion,        
        rutaLogotipos: configuracion.rutaLogotipos,
        emailTransacciones: configuracion.emailTransacciones,
        telefono: configuracion.telefono,
        urlPlataforma: configuracion.urlPlataforma,

        numeroTransaccion: transaccion.numeroTransaccion,
        email: transaccion.cliente.email,
        nombre: transaccion.cliente.nombre,
        fechaHora: transaccion.transferencia.fechaTransferenciaPropia,
        razonSocial: configuracion.razonSocial,
        horarioAtencion: configuracion.textosVariables.horarioAtencion,
        plazoTransaccion: configuracion.textosVariables.plazoTransaccion,
        bancosProvincia: configuracion.textosVariables.bancosProvincia,
        bancoOrigenCliente: transaccion.transferencia.cuentaOrigen.banco.descripcion,
        transferenciaDe: {
            cantidadDe: transaccion.cantidadDe,
            monedaDe: transaccion.monedaDe.descripcion + '('+transaccion.monedaDe.codigo+')',
            bancoDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.banco.descripcion,
            titularDestinoPropio: configuracion.razonSocial,
            documentoIdentidadDestinoPropio: configuracion.ruc,
            tipoDeCuentaDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.tipoDeCuenta.descripcion,
            numeroDeCuentaDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.numeroDeCuenta,
            numeroDeCCIDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.numeroDeCCI,
            mensajeDestinoPropio: 'Envia.......',
            emailConstancia: configuracion.emailTransacciones,
            numeroOperacionOrigen: transaccion.transferencia.numeroOperacionOrigen,
            tipoTransferenciaDe: transaccion.transferencia.tipoTransferenciaCliente.codigo
        },
        transferenciaA: {
            cantidadA: transaccion.cantidadA,
            monedaA: transaccion.monedaA.descripcion + '('+transaccion.monedaA.codigo+')',
            bancoDestinoCliente: transaccion.transferencia.cuentaDestino.banco.descripcion,
            titularDestinoCliente: titularDestinoCliente,
            documentoIdentidadDestinoCliente: documentoIdentidadDestinoCliente,
            tipoDeCuentaDestinoCliente: transaccion.transferencia.cuentaDestino.tipoDeCuenta.descripcion,
            numeroDeCuentaDestinoCliente: transaccion.transferencia.cuentaDestino.numeroDeCuenta,
            numeroDeCCIDestinoCliente: transaccion.transferencia.cuentaDestino.numeroDeCCI,
            mensajeDestinoCliente: 'Yyyyyyyy',
            numeroOperacionPropiaOrigen: transaccion.transferencia.numeroOperacionPropiaOrigen,
            tipoTransferenciaA: transaccion.transferencia.tipoTransferenciaPropia.codigo
        },
        enlace: ''
    };

    return datosEmail;
}

/*
    Obtiene informacion necesaria para el email de cancelacion
    -------------------------------------------------------------------------------------
    Uso:
    Similar al anterior pero se usa para el envio del email de cancelacion del cliente
*/

let getInformacionEmailCancelacion = async(transaccion) => {

    let configuracion = await getConfiguracion();
    // let cuentaBancoDestinoPropio = await getCuentaBancoDestinoPropio(transaccion);
    let titularDestinoCliente;
    let documentoIdentidadDestinoCliente;

    // Determina el titular de la cuenta de deposito del cliente
    if (transaccion.transferencia.cuentaDestino.tipoPropiedadCuenta.codigo === 'CuentaPropia') {
        titularDestinoCliente = transaccion.cliente.nombre + ' ' + transaccion.cliente.primerApellido + ' ' + transaccion.cliente.segundoApellido;
        documentoIdentidadDestinoCliente = transaccion.cliente.tipoDocumentoIdentidad.descripcion + '-' + transaccion.cliente.numeroDocumentoIdentidad;
    } else {
        titularDestinoCliente = transaccion.empresa.razonSocial;
        documentoIdentidadDestinoCliente = transaccion.empresa.ruc;
    }

    // Variable que se envia a la plantilla de PUG para que muestre datos variables

    let datosEmail = {
        nombreComercial: configuracion.nombreComercial,
        direccion: configuracion.direccion,        
        rutaLogotipos: configuracion.rutaLogotipos,
        emailTransacciones: configuracion.emailTransacciones,
        telefono: configuracion.telefono,
        urlPlataforma: configuracion.urlPlataforma,

        numeroTransaccion: transaccion.numeroTransaccion,
        email: transaccion.cliente.email,
        nombre: transaccion.cliente.nombre,
        fechaHora: transaccion.fechaCancelacion,
        motivoCancelacion: transaccion.motivoCancelacion,
        razonSocial: configuracion.razonSocial,
        horarioAtencion: configuracion.textosVariables.horarioAtencion,
        plazoTransaccion: configuracion.textosVariables.plazoTransaccion,
        bancosProvincia: configuracion.textosVariables.bancosProvincia,
        bancoOrigenCliente: transaccion.transferencia.cuentaOrigen.banco.descripcion,
        transferenciaDe: {
            cantidadDe: transaccion.cantidadDe,
            monedaDe: transaccion.monedaDe.descripcion + '('+transaccion.monedaDe.codigo+')',
            bancoDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.banco.descripcion,
            titularDestinoPropio: configuracion.razonSocial,
            documentoIdentidadDestinoPropio: configuracion.ruc,
            tipoDeCuentaDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.tipoDeCuenta.descripcion,
            numeroDeCuentaDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.numeroDeCuenta,
            numeroDeCCIDestinoPropio: transaccion.transferencia.cuentaPropiaDestino.numeroDeCCI,
            mensajeDestinoPropio: 'Envia.......',
            emailConstancia: configuracion.emailTransacciones,
            numeroOperacionOrigen: transaccion.transferencia.numeroOperacionOrigen
        },
        transferenciaA: {
            cantidadA: transaccion.cantidadA,
            monedaA: transaccion.monedaA.descripcion + '('+transaccion.monedaA.codigo+')',
            bancoDestinoCliente: transaccion.transferencia.cuentaDestino.banco.descripcion,
            titularDestinoCliente: titularDestinoCliente,
            documentoIdentidadDestinoCliente: documentoIdentidadDestinoCliente,
            tipoDeCuentaDestinoCliente: transaccion.transferencia.cuentaDestino.tipoDeCuenta.descripcion,
            numeroDeCuentaDestinoCliente: transaccion.transferencia.cuentaDestino.numeroDeCuenta,
            numeroDeCCIDestinoCliente: transaccion.transferencia.cuentaDestino.numeroDeCCI,
            mensajeDestinoCliente: 'Yyyyyyyy',
            numeroOperacionPropiaOrigen: transaccion.transferencia.numeroOperacionPropiaOrigen
        },
        enlace: ''
    };

    return datosEmail;
}


/*
    Datos de la empresa
    -------------------
    Uso:
    Obtiene informacion de la configuracion general
*/
let getConfiguracion = async() => {
    let configuracion = await Configuracion.find();
    return configuracion[0];
}

/*
    Obtenemos nuestra cuenta de banco para indicar al cliente donde debe depositar
    ------------------------------------------------------------------------------
    Uso:
    Obtener datos de nuestra cuenta
 */
let getCuentaBancoDestinoPropio = async(transaccion, cliente) => {
    let banco = transaccion.transferencia.cuentaOrigen.banco._id; // Banco desde el euq transfiere el cliente
    let moneda = transaccion.monedaDe._id;
    console.log(cliente);
    let usarCuentasBancariasInactivas = cliente?.usarCuentasBancariasInactivas ? true : false;
    let activo = usarCuentasBancariasInactivas ? [true, false] : [true];
    console.log(activo);

    // {"breed" : { $in : ["Pitbull", "Great Dane", "Pug"]}}
    // let cuentaBancariaPropiaDB = await CuentaBancariaPropia.find({ banco: banco, moneda: moneda, activo: true });
    let cuentaBancariaPropiaDB = await CuentaBancariaPropia.find({ $and: [
        {banco: banco},
        {moneda: moneda},

        {activo: { $in: activo } },
    ]  
    });
    console.log('cuenta bancaria');
    console.log(cuentaBancariaPropiaDB);

    if (!cuentaBancariaPropiaDB[0]) {
        // console.log('entro a llamar a cuenta bancaria propia predeterminada');

        //Si no encontro una cuenta en el mismo banco del cliente, buscamos cuenta default y activa para la misma moneda del cliente (le pasaremos la CCI)
        let cuentaBancariaPropiaDB = await CuentaBancariaPropia.find({ moneda: moneda, activo: true, default: true });

        if (!cuentaBancariaPropiaDB) {
            throw new Error(`No existe una cuenta bancaria propia disponible para la transaccion`);
        }

        return cuentaBancariaPropiaDB[0];
    }

    return cuentaBancariaPropiaDB[0];

}

/*
    Obtenemos nuestra cuenta de banco para programar la transferencia de nuestro banco
    ----------------------------------------------------------------------------------
    Uso:
    Obtenemos cuenta desde la cual enviaremos el dinero

    Nota: Podria variar al momento de transferir pero no se esta considerando ese cambio
*/
let getCuentaBancoOrigenPropio = async(transaccion) => {
    let banco = transaccion.transferencia.cuentaDestino.banco._id; // Banco en el que desea recibir  el cliente
    let moneda = transaccion.monedaA._id;

    let cuentaBancariaPropiaDB = await CuentaBancariaPropia.find({ banco: banco, moneda: moneda, activo: true });

    if (!cuentaBancariaPropiaDB[0]) {
        //console.log('entro a llamar a cuenta bancaria propia predeterminada');

        //Si no encontro una cuenta en el mismo banco del cliente, buscamos cuenta default y activa para la misma moneda del cliente (le pasaremos la CCI)
        let cuentaBancariaPropiaDB = await CuentaBancariaPropia.find({ moneda: moneda, activo: true, default: true });

        if (!cuentaBancariaPropiaDB) {
            throw new Error(`No existe una cuenta bancaria propia disponible para la transaccion`);
        }

        return cuentaBancariaPropiaDB[0];
    }

    return cuentaBancariaPropiaDB[0];

}

/*
    Enviar email de registro de transaccion
    ---------------------------------------
*/
let enviarEmailRegistroTransaccion = async(transaccion) => {

    // Obtenemos informacion para el correo electronico
    getInformacionEmailRegistroTransaccion(transaccion)
        .then(datosEmail => {

            email.send({
                    template: 'transacciones/transaccion-registrada',
                    message: {
                        to: datosEmail.email,
                        bcc: datosEmail.emailTransacciones
                    },
                    locals: {
                        locale: 'en',
                        datosEmail,
                        moment: require('moment')
                    }
                })
                .then('Email registro enviado: '+datosEmail.email+'-'+datosEmail.numeroTransaccion)
                .catch(console.error);

        })
        .catch(err => console.log(err));
}

/*
    Enviar email de registro de transferencia de cliente
    -----------------------------------------------------
*/
let enviarEmailTransferenciaCliente = async(transaccion) => {

    // Obtenemos informacion para el correo electronico
    getInformacionEmailTransferenciaCliente(transaccion)
        .then(datosEmail => {

            email.send({
                    template: 'transacciones/transaccion-transferencia-cliente',
                    message: {
                        to: datosEmail.email,
                        bcc: datosEmail.emailTransacciones
                    },
                    locals: {
                        locale: 'en',
                        datosEmail,
                        moment: require('moment')
                    }
                })
                .then('Email transferencia cliente enviado: '+datosEmail.email+'-'+datosEmail.numeroTransaccion)
                .catch(console.error);

        })
        .catch(err => console.log(err));
}

/*
    Enviar email de registro de transferencia propia
    ------------------------------------------------
*/
let enviarEmailTransferenciaPropia = async(transaccion) => {

    // Obtenemos informacion para el correo electronico
    getInformacionEmailTransferenciaPropia(transaccion)
        .then(datosEmail => {

            email.send({
                    template: 'transacciones/transaccion-transferencia-propia',
                    message: {
                        to: datosEmail.email,
                        bcc: datosEmail.emailTransacciones
                    },
                    locals: {
                        locale: 'en',
                        datosEmail,
                        moment: require('moment')
                    }
                })
                .then('Email transferencia propia enviado: '+datosEmail.email+'-'+datosEmail.numeroTransaccion)
                .catch(console.error);

        })
        .catch(err => console.log(err));
}

/*
    Enviar email de cancelacion
    ---------------------------
*/
let enviarEmailCancelacion = async(transaccion) => {

    // Obtenemos informacion para el correo electronico
    getInformacionEmailCancelacion(transaccion)
        .then(datosEmail => {

            email.send({
                    template: 'transacciones/transaccion-cancelacion',
                    message: {
                        to: datosEmail.email,
                        bcc: datosEmail.emailTransacciones
                    },
                    locals: {
                        locale: 'en',
                        datosEmail,
                        moment: require('moment')
                    }
                })
                .then('Email cancelacion enviado: '+datosEmail.email+'-'+datosEmail.numeroTransaccion)
                .catch(console.error);

        })
        .catch(err => console.log(err));
}

/*
    Obtiene valor de tabla
    ----------------------

    Nota: Se deberia cambiar por el HelperDB
*/
let obtenerTabla = async(codigo) => {
    return new Promise((resolve, reject) => {

        Tabla.find({ codigo: codigo })
            .exec((err, tabla) => {
                if (err) {
                    // 400 bad request   
                    reject('Error');
                }
                resolve(tabla[0]);
            });
    })
}

/*
    Obtener cliente
    ---------------

    Nota: Se deberia cambiar por el HelperDB
*/
let obtenerCliente = async(usuario) => {
    return new Promise((resolve, reject) => {

        Cliente.find({ usuarioAsociado: usuario })
            .exec((err, cliente) => {
                if (err) {
                    // 400 bad request   
                    reject('Error');
                }

                resolve(cliente[0]);
            });
    })
}

/*
    Obtener cotizacion, clave p.e: PENUSD
    -------------------------------------
*/
let obtenerCotizacion = (codigo) => {
    return new Promise((resolve, reject) => {

        Cotizacion.find({ codigo: codigo })
            .exec((err, cotizacion) => {
                if (err) {
                    // 400 bad request
                    reject('Error');
                }

                if (!cotizacion) {
                    // 400 bad request
                    reject('Error');
                }

                resolve(parseFloat(cotizacion[0].cotizacion));

            })
    })
}


/*
    Obtener cotizacion preferencial, clave p.e: PENUSD
    --------------------------------------------------
*/
let obtenerCotizacionPreferencial = (codigo, cliente_id) => {
    let valor = 0;

    return new Promise((resolve, reject) => {

        CambioPreferencial.find({ codigo: codigo, cliente: cliente_id, activo: true }, "fechaRegistro cotizacion")
        .exec((err, cambioPreferencial) => {
            if (err) {
                // 400 bad request
                //reject('Error');
                //return 0;
            }

            if (!cambioPreferencial) {
                // 400 bad request                    
                //reject('Error');
                //return 0;
            }

            // Filtros adicionales que no se pueden hacer en mongodb        
            cambioPreferencial = cambioPreferencial.filter(function (a) {
                let valor; 
                
                valor = a;


                var now = moment(new Date()); //todays date
                var end = a.fechaRegistro; 
                var duration = moment.duration(now.diff(end));
                var minutes = duration.asMinutes();
                // console.log(moment(now).format(), moment(end).format(), minutes);
                if (minutes > 5 ) valor = null;
                
                return valor;
                
            }); 
            
            if (cambioPreferencial.length > 0) valor=parseFloat(cambioPreferencial[0].cotizacion);

            resolve(valor);
        })


    })
}

module.exports = app;