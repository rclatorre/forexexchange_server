const express = require('express');
const CambioPreferencial = require('../models/cambioPreferencial'); //Mayuscula pq desde aqui crearemos instancias con new....
const Moneda = require('../models/moneda'); //Mayuscula pq desde aqui crearemos instancias con new....
const Cliente = require('../models/cliente'); //Mayuscula pq desde aqui crearemos instancias con new....
const _ = require('underscore');
const moment = require('moment');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

// -------
// Metodos
// -------

//Mostrar todos  
app.get('/cambioPreferencial', [verificaToken, verificaAdmin_Role], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    CambioPreferencial.find({})
        // .skip(desde)
        // .limit(15)
        .sort('nombre primerApellido segundoApellido')
        .populate('cliente', 'nombre')
        .populate('usuario', 'nombre')
        .exec((err, cambiosPreferenciales) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cambiosPreferenciales
            });

        });
});

// //Mostrar cliente por id
// app.get('/cliente/obtener/:id', verificaToken, (req, res) => {
//     let id = req.params.id;

//     Cliente.findById(id)
//         .populate('usuarioAsociado', 'nombre email')
//         .populate('tipoDocumentoIdentidad', 'descripcion')
//         .exec((err, clienteDB) => {
//             if (err) {
//                 // 400 bad request
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 });
//             }

//             if (!clienteDB) {
//                 // 400 bad request
//                 return res.status(400).json({
//                     ok: false,
//                     err: {
//                         message: 'Cliente no encontrado'
//                     }
//                 });
//             }

//             res.json({
//                 ok: true,
//                 cliente: clienteDB
//             });
//         });


// });

// Buscar
app.get('/cambioPreferencial/buscar', verificaToken, (req, res) => {
    let query = req.query;
   //console.log(query);
    // let regex = new RegExp(termino, 'i');
    //{ nombre: regex }
    CambioPreferencial.find({}, 'fechaRegistro cliente usuario monedaDe monedaA cotizacion activo')
        .populate('usuario', 'nombre ')
        .populate('cliente', 'nombre email primerApellido segundoApellido numeroDocumentoIdentidad')
        .populate('monedaDe', 'codigo descripcion')
        .populate('monedaA', 'codigo descripcion')
        .exec((err, cambiosPreferenciales) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Filtros adicionales que no se pueden hacer en mongodb        
            cambiosPreferenciales = cambiosPreferenciales.filter(function (a) {
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
                if (query.email ){
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
                cambiosPreferenciales
            });
        })
});

// Crear cambio preferencial, solo el perfil administrador
// , verificaAdmin_Role
app.post('/cambioPreferencial/crear', [verificaToken, verificaAdmin_Role], async(req, res) => {
    let body = req.body;
    body.usuario = req.usuario;

    monedaDe = await obtenerMoneda(body.monedaDe); //USD
    monedaA = await obtenerMoneda(body.monedaA); //PEN
    cliente = await obtenerClienteEmail(body.email); //
    cotizacion = eval(body.cotizacion); //
    email = body.email;

    if (!monedaDe) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Especifique la moneda origen'
            }
        });
    }
    
    if (!monedaA) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Especifique la moneda destino'
            }
        });
    }

    if (!cotizacion) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Especifique la cotizacion'
            }
        });
    }

    if (!email) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Especifique el correo electronico del cliente'
            }
        });
    }

    if (!cliente) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Correo electronico no esta registrado'
            }
        });
    }


    // Crea objeto cambio preferencial con las propiedades y metodos definidos en CambioPreferencial
    let cambioPreferencial = new CambioPreferencial({
        fechaRegistro: Date.now(),
        usuario: body.usuario._id,
        cliente: cliente._id,
        monedaDe: monedaDe._id,
        monedaA: monedaA._id,
        cotizacion: cotizacion,
        codigo: monedaDe.codigo+monedaA.codigo,
        activo: true
    });

    // Llama al metodo de grabacion
    cambioPreferencial.save(async(err, cambioPreferencialDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cambioPreferencialDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //console.log('Cambio preferencial: ', cambioPreferencialDB)
        
        //Este resultado debe ser identico al que se obtiene por la funcion buscar (mas arriba) ya que usan la misma interface en ionic
        CambioPreferencial.findById(cambioPreferencialDB._id, 'fechaRegistro cliente usuario monedaDe monedaA cotizacion activo')
        .populate('usuario', 'nombre ')
        .populate('cliente', 'nombre email primerApellido segundoApellido numeroDocumentoIdentidad')
        .populate('monedaDe', 'codigo descripcion')
        .populate('monedaA', 'codigo descripcion')
        .exec((err, cambioPreferencial) => {
            // status 200 no es necesario, va por defecto
            res.json({
                ok: true,
                cambioPreferencial: cambioPreferencial
            });
        })


    });

});



/*
app.post('/cambioPreferencial/crear', [verificaToken, verificaAdmin_Role], async(req, res) => {
    let body = req.body;
    body.usuario = req.usuario;

    monedaDe = await obtenerMoneda(body.monedaDe_id);
    monedaA = await obtenerMoneda(body.monedaA_id);

    // Crea objeto cambio preferencial con las propiedades y metodos definidos en CambioPreferencial
    let cambioPreferencial = new CambioPreferencial({
        fechaRegistro: Date.now(),
        usuario: body.usuario._id,
        cliente: body.cliente_id,
        monedaDe: body.monedaDe_id,
        monedaA: body.monedaA_id,
        cotizacion: body.cotizacion,
        codigo: monedaDe.codigo+monedaA.codigo,
        activo: true
    });

    console.log(cambioPreferencial);

    // Llama al metodo de grabacion
    cambioPreferencial.save(async(err, cambioPreferencialDB) => {
        if (err) {
            console.log(err);
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cambioPreferencialDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //Este resultado debe ser identico al que se obtiene por la funcion buscar (mas arriba) ya que usan la misma interface en ionic
        CambioPreferencial.findById(cambioPreferencialDB._id, 'fechaRegistro cliente usuario monedaDe monedaA cotizacion activo')
        .populate('usuario', 'nombre ')
        .populate('cliente', 'nombre email primerApellido segundoApellido numeroDocumentoIdentidad')
        .populate('monedaDe', 'codigo descripcion')
        .populate('monedaA', 'codigo descripcion')
        .exec((err, cambioPreferencial) => {
            // status 200 no es necesario, va por defecto
            res.json({
                ok: true,
                cambioPreferencial: cambioPreferencial
            });
        })


    });

});
*/


//Mostrar cotizacion por termino p.e.: USD/EUR
//verificaToken,
// Buscar
//verificaToken,
app.get('/cambioPreferencial/obtener/:termino', verificaToken, async(req, res) => {
    let usuario=req.usuario;
    let termino = req.params.termino;

    cliente = await obtenerCliente(usuario._id);

    let regex = new RegExp(termino, 'i');

    CambioPreferencial.find({ codigo: regex, cliente: cliente._id, activo: true }, "fechaRegistro cotizacion")
        .exec((err, cambioPreferencial) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!cambioPreferencial) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
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


            res.json({
                ok: true,
                cambioPreferencial
            });
        })
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

/*
Obtener moneda por codigo
*/
let obtenerMoneda = async(codigo) => {
    return new Promise((resolve, reject) => {

        Moneda.find({ codigo: codigo })
            .exec((err, moneda) => {
                if (err) {
                    // 400 bad request   
                    reject('Error');
                }

                resolve(moneda[0]);
            });
    })
}

/*
Obtener cliente
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
Obtener cliente por email
*/
let obtenerClienteEmail = async(email) => {
    return new Promise((resolve, reject) => {

        Cliente.find({ email: email })
            .exec((err, cliente) => {
                if (err) {
                    // 400 bad request   
                    reject('Error');
                }

                resolve(cliente[0]);
            });
    })
}

module.exports = app;