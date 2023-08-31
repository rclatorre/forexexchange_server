/*
Revisado        : 05/02/2020
Nota Revision   : Aclarar uso de verificaTokenImg
*/
const Usuario = require('../models/usuario'); //Mayuscula pq desde aqui crearemos instancias con new....

const jwt = require('jsonwebtoken');

// =====================
// Verifica token
// Carga usuario decodificado del token en req.usuario
// =====================
let verificaToken = (req, res, next) => {
    let token = req.get('x-token');

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {

        if (err) {
            // 401 no autorizado
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }



//        req.usuario = decoded.usuario; //Coloca usuario en req para que sea usado luego de la llamada al middleware
//        next(); // Hace que se ejecute todo lo demas despues de llamar al middleware




        Usuario.findById(decoded.usuario._id, 'role suspendido')
        .exec((err, usuarioCns) => {
            
            if (err) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
             
 
            if (!usuarioCns?.suspendido) {
                req.usuario = decoded.usuario; //Coloca usuario en req para que sea usado luego de la llamada al middleware
                next(); // Hace que se ejecute todo lo demas despues de llamar al middleware
                return;
            } else {
                // 401 no autorizado
                return res.json({
                    ok: false,
                    err: {
                        message: 'Cuenta suspendida'
                    }
                });
            }
           
    
        });


    });
}

// =====================
// Verifica token opcional
// Carga usuario decodificado del token en req.usuario si es que el token es valido
// Si no hay token tambien es valido ya que este modo es opcional y sirve para identificar clientes validos o nuevos clientes
// =====================
let verificaTokenOpcional = (req, res, next) => {
    let token = req.get('x-token');

    if (!token) {
        // usuario nuevo en proceso de registro
        next(); // Hace que se ejecute todo lo demas despues de llamar al middleware
        return;

    } else {
        // usuario registrado
        jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
    
            if (err) {
                // 401 no autorizado
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'Token no valido'
                    }
                });
            }
    
    
    
    //        req.usuario = decoded.usuario; //Coloca usuario en req para que sea usado luego de la llamada al middleware
    //        next(); // Hace que se ejecute todo lo demas despues de llamar al middleware
    
    
    
    
            Usuario.findById(decoded.usuario._id, 'role suspendido')
            .exec((err, usuarioCns) => {
                
                if (err) {
                    // 400 bad request
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                
                
    
                if (!usuarioCns.suspendido) {
                    req.usuario = decoded.usuario; //Coloca usuario en req para que sea usado luego de la llamada al middleware
                    next(); // Hace que se ejecute todo lo demas despues de llamar al middleware
                    return;
                } else {
                    // 401 no autorizado
                    return res.json({
                        ok: false,
                        err: {
                            message: 'Cuenta suspendida'
                        }
                    });
                }
               
        
            });
    
    
        });

    }
}

// =====================
// Verifica AdminRole
// =====================
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    // if (usuario.role === 'ADMIN_ROLE') {
    //     next(); // Hace que se ejecute todo lo demas despues de llamar al middleware
    //     return;
    // } else {
    //     // 401 no autorizado
    //     return res.json({
    //         ok: false,
    //         err: {
    //             message: 'Rol no autorizado'
    //         }
    //     });
    // }

    Usuario.findById(usuario._id, 'role')
    .exec((err, usuarioCns) => {
        
        if (err) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuarioCns.role === 'ADMIN_ROLE') {
            next(); // Hace que se ejecute todo lo demas despues de llamar al middleware
            return;
        } else {
            // 401 no autorizado
            return res.json({
                ok: false,
                err: {
                    message: 'Rol no autorizado'
                }
            });
        }
       

    });











}


// =====================
// Verifica token para imagen 
// Cuando se tiene que acceder desde una url
// =====================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            // 401 no autorizado
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario; //Coloca usuario en req para que sea usado luego de la llamada al middleware
        next(); // Hace que se ejecute todo lo demas despues de llamar al middleware

    });
}


// =====================
// Verifica token registro
// Carga usuario decodificado del token en req.usuario
// =====================
let verificaTokenRegistro = (req, res, next) => {
    let token = req.params.token; //req.get('x-token');

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {

        if (err) {
            // 401 no autorizado
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        //console.log(decoded);
        req.cliente = decoded.cliente; //Coloca cliente en req para que sea usado luego de la llamada al middleware

        next(); // Hace que se ejecute todo lo demas despues de llamar al middleware

    });
}

// =====================
// Verifica token cambio password
// Carga usuario decodificado del token en req.usuario
// =====================
let verificaTokenCambioPassword = (req, res, next) => {
    let token = req.params.token; //req.get('x-token');

    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {

        if (err) {
            // 401 no autorizado
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario; //Coloca cliente en req para que sea usado luego de la llamada al middleware

        next(); // Hace que se ejecute todo lo demas despues de llamar al middleware

    });
}


module.exports = {
    verificaToken,
    verificaTokenOpcional,
    verificaTokenRegistro,
    verificaTokenCambioPassword,
    verificaAdmin_Role,
    verificaTokenImg
}