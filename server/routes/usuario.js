const express = require('express');
const Configuracion = require('../models/configuracion'); //Mayuscula pq desde aqui crearemos instancias con new....
const Usuario = require('../models/usuario'); //Mayuscula pq desde aqui crearemos instancias con new....
const Cliente = require('../models/cliente'); //Mayuscula pq desde aqui crearemos instancias con new....
const Tabla = require('../models/tabla'); //Mayuscula pq desde aqui crearemos instancias con new....
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const Email = require('email-templates');

const { verificaToken, verificaAdmin_Role, verificaTokenRegistro, verificaTokenCambioPassword } = require('../middlewares/autenticacion');
const { validaReCaptcha } = require('../middlewares/validaReCaptcha');


const app = express();

// const email = new Email({
//     message: {
//         from: 'mensajeria.smtp@primesoft.com.pe',
//     },
//     // send: true,
//     transport: {
//         host: 'rlatorre.ferozo.com',
//         port: 465,
//         secure: true,
//         auth: {
//             type: 'login',
//             user: 'mensajeria.smtp@primesoft.com.pe',
//             pass: 'Eelcpcep1qa'
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     },
//     views: {
//         options: {
//             extension: 'pug',
//         },
//         // root: 'server/services/email/templates/registro/',
//         root: 'server/services/email/templates/',
//     },
//     i18n: {
//         locales: ['en', 'es'],
//         directory: 'server/assets/i18n',
//     }
// });

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

// ---
// GET: Obtener los  usuarios
// --- 
app.get('/usuario', verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.collection.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
})

// ---
// GET: Obtener los  usuarios
// ---
app.get('/usuario/id/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


})

// ---
// GET: Obtiene datos del usuario, solo si el token es valido
// --- 
app.get('/usuario/token', verificaToken, (req, res) => {

    res.json({
        ok: true,
        usuario: req.usuario
    });

})

// ----
// GET : Verifica email
// ----
// [verificaToken, verificaAdmin_Role]
app.get('/usuario/verificaEmail/:email', (req, res) => {

    let email = req.params.email;

    Usuario.find({ email: email }, (err, usuarioDB) => {
        if (err) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

// ----
// GET : Verifica cuenta activa
// ----
// [verificaToken, verificaAdmin_Role]
app.get('/usuario/verificaCuentaActiva/:id', (req, res) => {

    let id = req.params.id;

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        let usuarioreturn = {
            estado: usuarioDB.estado
        }

        res.json({
            ok: true,
            usuario: usuarioreturn
        });
    });

});
// ----
// GET : Activa cuenta
// ----
// [verificaToken, verificaAdmin_Role]
app.get('/usuario/verifica/:token', verificaTokenRegistro, (req, res) => {
    //console.log('validacion ok', req.cliente);

    let id = req.cliente.usuarioAsociado;
    let cambiaEstado = {
        estado: true
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {
        if (err) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        // Genera un nuevo token y retorna ok, usuario y token
        // process.env.SEED_TOKEN se creo en heroku
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        //console.log('token generado', token);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});

// ----
// GET : Activa cuenta Admin
// ----
app.post('/usuario/cambiaEstado/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        usuarioDB.estado = !usuarioDB.estado

        usuarioDB.save(async(err, usuarioDB) => {
            if (err) {
                //console.log(err);
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        })
    })

});

// ----
// GET : Suspende o reactiva cuenta suspendida Admin
// ----
app.post('/usuario/suspendeCuenta/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        usuarioDB.suspendido = !usuarioDB.suspendido

        usuarioDB.save(async(err, usuarioDB) => {
            if (err) {
                //console.log(err);
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        })
    })

});

// ----
// GET : Verifica token para cambio de password
// ----
// [verificaToken, verificaAdmin_Role]
app.get('/usuario/verificaTokenCambioPassword/:token', verificaTokenCambioPassword, (req, res) => {
    //console.log('validacion ok', req.usuario);

    let id = req.usuario._id;
//    let cambiaEstado = {
//        estado: true
//    };
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        // Genera un nuevo token y retorna ok, usuario y token
        // process.env.SEED_TOKEN se creo en heroku
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        //console.log('token generado', token);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});

// ----
// POST : Cambiar password
// ----
// [verificaToken, verificaAdmin_Role]
app.post('/usuario/cambiarPassword/:token', [validaReCaptcha, verificaTokenCambioPassword], (req, res) => {
    //console.log('validacion ok', req.cliente);

    let id = req.usuario._id;
    let cambiaPassword = {
        password: bcrypt.hashSync(req.body.password, 10),
    };
    Usuario.findByIdAndUpdate(id, cambiaPassword, { new: true }, (err, usuarioDB) => {
        if (err) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }
  
        if (!usuarioDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        // Genera un nuevo token y retorna ok, usuario y token
        // process.env.SEED_TOKEN se creo en heroku
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

        //console.log('token generado', token);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});



// ----
// POST: Creacion de usuario
// ----
// [verificaToken, verificaAdmin_Role]
app.post('/usuario/crear', validaReCaptcha, (req, res) => {
    
    let body = req.body.usuario;

    // Crea objeto usuario con las propiedades y metodos definidos en Usuario
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: 'USER_ROLE'
    });

    // Llama al metodo de grabacion
    usuario.save(async(err, usuarioDB) => {
        if (err) {
            //console.log(err);
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        let cliente = new Cliente({
            usuarioAsociado: usuarioDB._id,
            nombre: capitalizeWords(body.cliente.nombre),
            email: body.cliente.email
        });

        if (body.cliente.primerApellido) cliente.primerApellido = capitalizeWords(body.cliente.primerApellido);
        if (body.cliente.segundoApellido) cliente.segundoApellido = capitalizeWords(body.cliente.segundoApellido);
        if (body.cliente.telefono) cliente.telefono = body.cliente.telefono;
        if (body.cliente.paisDeOrigen_id === undefined) {
            pais = await obtenerTabla('Paises_PE');
            cliente.paisDeOrigen = pais._id;
        } 
        else {
            cliente.paisDeOrigen = body.cliente.paisDeOrigen_id;
        }
        if (body.cliente.tipoDocumentoIdentidad_id === undefined) {
            tipoDocumentoIdentidad = await obtenerTabla('TipoDocumentoIdentidad_DNI');
            cliente.tipoDocumentoIdentidad = tipoDocumentoIdentidad._id;
        } else {
            cliente.tipoDocumentoIdentidad = body.cliente.tipoDocumentoIdentidad_id;
        }
        if (body.cliente.numeroDocumentoIdentidad !== undefined) cliente.numeroDocumentoIdentidad = body.cliente.numeroDocumentoIdentidad;
        if (body.cliente.fechaNacimiento !== undefined) cliente.fechaNacimiento = body.cliente.fechaNacimiento;

        //console.log('cliente',cliente);

        // Llama al metodo de grabacion
        cliente.save((err, clienteDB) => {

            if (err) {
                console.log(err);
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!clienteDB) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // Enviar email
            enviarEmailActivacion(clienteDB);

            // Genera un nuevo token y retorna ok, usuario y token
            // process.env.SEED_TOKEN se creo en heroku
            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN });

            // status 200 no es necesario, va por defecto
            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            });
 
        });


    });

});

// ---
// PUT: Actualiza datos del usuario
// ---
// Pick se usa para indicar los atributos actualizables
app.put('/usuario/actualizar', [validaReCaptcha, verificaToken], (req, res) => {

    let id = req.usuario._id;
    // let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    let usuario_u = {nombre: req.body.usuario.nombre};
    Usuario.findByIdAndUpdate(id, usuario_u, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            console.log(err);
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        Cliente.find({usuarioAsociado: id})
        .exec((err, clienteDB) => {
            if (err) {
                console.log(err);
                // 400 bad request
                return res.status(400).json({
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
            
            id_cliente = clienteDB[0]._id;
            // clienteDB[0].nombre = req.body.nombre;
            // clienteDB[0].primerApellido = req.body.primerApellido;
            // clienteDB[0].segundoApellido = req.body.segundoApellido;
            // clienteDB[0].segundoApellido = req.body.segundoApellido;
            // clienteDB[0].telefono = req.body.telefono;
            // clienteDB[0].paisDeOr = req.body.paisDeOr;
            // clienteDB[0].tipoDocu = req.body.tipoDocu;
            // clienteDB[0].numeroDo = req.body.numeroDo;
            // clienteDB[0].fechaNacimiento = req.body.fechaNacimiento; 
            cliente = {
                nombre: capitalizeWords(req.body.usuario.cliente.nombre),
                primerApellido: capitalizeWords(req.body.usuario.cliente.primerApellido),
                segundoApellido: capitalizeWords(req.body.usuario.cliente.segundoApellido),
                telefono: req.body.usuario.cliente.telefono,
                paisDeOrigen: req.body.usuario.cliente.paisDeOrigen_id,
                tipoDocumentoIdentidad: req.body.usuario.cliente.tipoDocumentoIdentidad_id,
                numeroDocumentoIdentidad: req.body.usuario.cliente.numeroDocumentoIdentidad,
                fechaNacimiento: req.body.usuario.cliente.fechaNacimiento,
            }
            Cliente.findByIdAndUpdate(id_cliente, cliente, { new: true, runValidators: true }, (err, clienteDB) => {
                     
                if (err) {
                    // 500 bad request 
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!clienteDB) {
                    // 400 bad request 
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    cliente: clienteDB
                });

            });

        });

    });

})

// ------
// DELETE
// ------
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    //            Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {
        if (err) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

})

// Reenvia correo de activacion
app.get('/usuario/reenviarActivacion', [verificaToken], (req, res) => {
    let id = req.usuario._id;
        
    Cliente.find({usuarioAsociado: id})
    .exec((err, clienteDB) => {
        if (err) {
            console.log(err);
            // 400 bad request
            return res.status(400).json({
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
        
       enviarEmailActivacion(clienteDB[0]);

        res.json({
            ok: true,
            cliente: clienteDB
        });


    });

})

// Solicita recuperacion de clave
app.post('/usuario/recuperaPassword', (req, res) => {
    let email = req.body.email;
    
    Usuario.find({email: email})
    .exec((err, usuarioDB) => {
        if (err) {
            console.log(err);
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        if (!usuarioDB[0]) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Correo electrónico no encontrado'
                }
            });
        }
        
       enviarEmailRecuperacionClave(usuarioDB[0]);

        res.json({
            ok: true
        });

    });

})

/*
Datos de la empresa
*/
let getConfiguracion = async() => {
    let configuracion = await Configuracion.find();
    return configuracion[0];
}

/*
Obtiene valor de tabla
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
Enviar email de activacion de cuenta
*/
let enviarEmailActivacion = async(cliente) => {
    let configuracion = await getConfiguracion();

    // Genera un token interno para la activacion del nuevo usuario
    let token = jwt.sign({
        cliente: cliente
    }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN_REGISTRO });

    let enlace = process.env.URLFront + `/#/activacion/${token}`;


    let datosEmail = {
        razonSocial: configuracion.razonSocial,
        nombreComercial: configuracion.nombreComercial,
        rutaLogotipos: configuracion.rutaLogotipos,
        direccion: configuracion.direccion,       
        emailTransacciones: configuracion.emailTransacciones,
        telefono: configuracion.telefono,
        urlPlataforma: configuracion.urlPlataforma,
        nombre: cliente.nombre,
        enlace: enlace
    };

    email.send({
            template: 'registro/verificacion',
            message: {
                to: cliente.email
            },
            locals: {
                locale: 'en',
                datosEmail
                // razonSocial: configuracion.razonSocial,
                // nombreComercial: configuracion.nombreComercial,
                // rutaLogotipos: configuracion.rutaLogotipos,
                // nombre: cliente.nombre,
                // enlace: enlace
            }
        })
        .then(console.log)
        .catch(console.error);


}

/*
Enviar email de recuperacion de clave
*/
let enviarEmailRecuperacionClave = async(usuario) => {
    let configuracion = await getConfiguracion();

    // Genera un token interno para la recuperacion del nuevo usuario
    let token = jwt.sign({
        usuario: usuario
    }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN_RECUPERACION });

    let enlace = process.env.URLFront + `/#/cambioPassword/${token}`;
    
    let datosEmail = {
        razonSocial: configuracion.razonSocial,
        nombreComercial: configuracion.nombreComercial,
        rutaLogotipos: configuracion.rutaLogotipos,
        direccion: configuracion.direccion,        
        emailTransacciones: configuracion.emailTransacciones,
        telefono: configuracion.telefono,
        urlPlataforma: configuracion.urlPlataforma,
        nombre: usuario.nombre,
        enlace: enlace
    };

    email.send({
            template: 'usuario/recuperaPassword',
            message: {
                to: usuario.email
            },
            locals: {
                locale: 'en',
                datosEmail
            }
        })
        .then()
        .catch(console.error);


}
// async function enviarEmail(cliente) {
//     let configuracion = await getConfiguracion();

//     // Genera un token interno para la activacion del nuevo usuario
//     let token = jwt.sign({
//         cliente: cliente
//     }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN_REGISTRO });

//     let enlace = process.env.URLFront + `/#/activacion/${token}`;

//     email.send({
//             template: 'verificacion',
//             message: {
//                 to: cliente.email
//             },
//             locals: {
//                 locale: 'en',
//                 razonSocial: configuracion.razonSocial,
//                 nombre: cliente.nombre,
//                 enlace: enlace
//             }
//         })
//         .then(console.log)
//         .catch(console.error);
// }


let capitalizeWords = (string) => {
    return string.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};






module.exports = app;