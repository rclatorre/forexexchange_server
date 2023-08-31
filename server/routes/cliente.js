const express = require('express');
const Cliente = require('../models/cliente'); //Mayuscula pq desde aqui crearemos instancias con new....
const _ = require('underscore');

const AyudaDB = require('../helpers/ayudaDB');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const Usuario = require('../models/usuario');
const log = require('../models/log');

const app = express();

// -------
// Metodos
// -------

//Mostrar todos los clientes 
app.get('/cliente', [verificaToken, verificaAdmin_Role], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
 
    Cliente.find({})
        .sort('nombre primerApellido segundoApellido')
        .populate('tipoDocumentoIdentidad', 'descripcion')
        .populate('usuarioAsociado', 'nombre email')
        .populate('paisDeOrigen', 'descripcion')
        .exec((err, clientes) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                clientes
            });

        });
});

//Mostrar cliente por id
app.get('/cliente/obtener/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Cliente.findById(id)
        .populate('usuarioAsociado', 'nombre email')
        .populate('tipoDocumentoIdentidad', 'descripcion')
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

            res.json({
                ok: true,
                cliente: clienteDB
            });
        });


});
 

//Mostrar cliente por id de usuario
app.get('/cliente/usuario/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Cliente.find({ usuarioAsociado: id })
        .populate('tipoDocumentoIdentidad', 'descripcion')
        .populate('ocupacion', 'descripcion')
        .populate('funcionPublica', 'codigo descripcion')
        .populate('paisDeOrigen', '')
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

            res.json({
                ok: true,
                cliente: clienteDB
            });
        });


});

// Buscar (Utilizada desde Divisa para modificar datos de cliente)
// app.post('/cliente/buscar/:termino?', verificaToken, (req, res) => {
app.post('/cliente/buscar', verificaToken, (req, res) => {

    // let termino = req.params.termino;
    let termino = req.body.termino || '';
    let buscarEmpresa = req.body.buscarEmpresa || 'N';
    let regex = new RegExp(termino, 'i');

    Cliente.find({
        $or: [
            {
                nombre: regex
            },
            {
                primerApellido: regex
            },
            {
                email: regex
            },
            {
                numeroDocumentoIdentidad: regex
            }, 
        ]
    })
        .populate('tipoDocumentoIdentidad', 'codigo descripcion')
        .populate('usuarioAsociado', 'role estado suspendido')
        .exec(async(err, clientes) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({ ok: false,
                    err
                });
            }

            clientes = clientes.filter( cliente => cliente.usuarioAsociado.role=='USER_ROLE')

            //Agrega empresas
            if ( buscarEmpresa=='S' ) {
                clientes = await Promise.all(clientes.map( async(cliente) => {
                    let empresas = await AyudaDB.obtenerEmpresasCliente(cliente._id);
                    empresas = empresas.map( empresa => {
                        let {razonSocial} = empresa;
                        empresa={emp: razonSocial}
                        return empresa;
                    });
                    empresas = JSON.stringify(empresas);
                    empresas = empresas==='[]' ? '' : empresas;
    
                    cliente = {...cliente._doc, empresas}
                    return cliente
                }))
    
            }

            // if (termino) {
            //     clientes = clientes.filter( cliente => 
            //         cliente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            //         cliente.primerApellido.toLowerCase().includes(termino.toLowerCase()) ||
            //         cliente.segundoApellido.toLowerCase().includes(termino.toLowerCase()) ||
            //         cliente.numeroDocumentoIdentidad?.toLowerCase().includes(termino.toLowerCase()) ||
            //         cliente.email.toLowerCase().includes(termino.toLowerCase()) ||
            //         cliente.empresas.toLowerCase().includes(termino.toLowerCase()) 
                    
            //         )
            // }
            
            res.json({
                ok: true,
                clientes
            });
        })
});

// Crear cliente
app.post('/cliente/crear', verificaToken, (req, res) => {
    let body = req.body;
    body.usuario = req.usuario;

    // Crea objeto cliente con las propiedades y metodos definidos en Cliente
    let cliente = new Cliente({
        usuarioAsociado: body.usuario._id,
        nombre: body.nombre,
        email: body.email,
        primerApellido: body.primerApellido,
        segundoApellido: body.segundoApellido,
        telefono: body.telefono,
        paisDeOrigen: body.paisDeOrigen_id,
        tipoDocumentoIdentidad: body.tipoDocumentoIdentidad_id,
        numeroDocumentoIdentidad: body.numeroDocumentoIdentidad,
        fechaNacimiento: body.fechaNacimiento
    });

    //console.log(cliente);
    // Llama al metodo de grabacion
    cliente.save((err, clienteDB) => {
        if (err) {
            //console.log(err);
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

        // status 200 no es necesario, va por defecto
        res.json({
            ok: true,
            cliente: clienteDB
        });
    });

});

//Modificar cliente
app.put('/cliente/modificar/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    //Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
    Cliente.findById(id, (err, clienteDB) => {
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
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        // Completa valores para grabar
        // clienteDB.nombre = body.nombre;
        // clienteDB.primerApellido = body.primerApellido;
        // clienteDB.segundoApellido = body.segundoApellido;
        clienteDB.tipoDocumentoIdentidad = body.tipoDocumentoIdentidad_id;
        clienteDB.numeroDocumentoIdentidad = body.numeroDocumentoIdentidad;
        clienteDB.fechaNacimiento = body.fechaNacimiento;
        clienteDB.telefono = body.telefono;
        clienteDB.paisDeOrigen = body.paisDeOrigen_id;

        //console.log(clienteDB);

        // Graba
        clienteDB.save((err, clienteGuardado) => {
            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cliente: clienteGuardado
            });
        });
    });



});

//Modificar cliente como Administrador
app.put('/cliente/modificar/admin/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;


    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    //Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
    Cliente.findById(id, async (err, clienteDB) =>  {
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
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        let tipoDocumentoIdentidad = await AyudaDB.obtenerTabla(body.tipoDocumentoIdentidad_codigo)

        // Completa valores para grabar
        clienteDB.nombre = body.nombre;
        clienteDB.primerApellido = body.primerApellido;
        clienteDB.segundoApellido = body.segundoApellido;
        clienteDB.tipoDocumentoIdentidad = tipoDocumentoIdentidad
        clienteDB.numeroDocumentoIdentidad = body.numeroDocumentoIdentidad;
        clienteDB.telefono = body.telefono;
        clienteDB.usarCuentasBancariasInactivas = body.usarcuentasbancariasinactivas;
        // clienteDB.fechaNacimiento = body.fechaNacimiento;
        // clienteDB.paisDeOrigen = body.paisDeOrigen_id;

        //console.log(clienteDB);

        // Graba
        clienteDB.save((err, clienteGuardado) => {
            if (err) {
                // 500 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Usuario.findById(clienteGuardado.usuarioAsociado, (err, usuarioDB) => {
                if (err) {
                    // 500 bad request
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                usuarioDB.nombre = clienteGuardado.nombre
                usuarioDB.save((err, usuarioGuardado) => {
                    if (err) {
                        // 500 bad request
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        cliente: clienteGuardado
                    });
                });
            });
        });
    });



});

// ---------------
// Borrar cliente
// ---------------
app.delete('/cliente/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Cliente.findById(id, (err, clienteDB) => {
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

        clienteDB.activo = false;

        clienteDB.save((err, clienteDB) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cliente: clienteDB,
                message: 'Cliente inactivado'
            });
        });

    });

});

module.exports = app;