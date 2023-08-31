const express = require('express');
const TipoTabla = require('../models/tipoTabla'); //Mayuscula pq desde aqui crearemos instancias con new....
const Tabla = require('../models/tabla'); //Mayuscula pq desde aqui crearemos instancias con new....
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();


// -------
// Metodos
// -------

//Mostrar todas las tablas segun el tipo
app.get('/tabla/tipo/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Tabla.find({ tipoTabla: id })
        .sort('descripcion')
        .exec((err, tablas) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                tablas
            });

        });
});

//Mostrar todas las tablas segun el codigo de tabla
// verificaToken,
app.get('/tabla/codigotipo/:codigo', (req, res) => {
    let codigo = req.params.codigo;

    //    let regex = new RegExp(codigo, 'i');

    TipoTabla.find({ codigo: codigo })
        .exec((err, tipoTabla) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (tipoTabla.length === 0) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Tabla.find({ tipoTabla: tipoTabla[0]._id, activo: true })
                .sort('descripcion')
                .exec((err, tablas) => {
                    if (err) {
                        // 400 bad request
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        tablas
                    });

                });



        })


});

app.get('/tabla/codigopadre/:codigo/:padre', (req, res) => {
    let codigo = req.params.codigo;
    let padre = req.params.padre;

    //    let regex = new RegExp(codigo, 'i');

    TipoTabla.find({ codigo: codigo })
        .exec((err, tipoTabla) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (tipoTabla.length === 0) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Tabla.find({ tipoTabla: tipoTabla[0]._id, tablaPadre: padre, activo: true })
                .sort('descripcion')
                .exec((err, tablas) => {
                    if (err) {
                        // 400 bad request
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        tablas
                    });

                });



        })


});

//Mostrar tabla por id
app.get('/tabla/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Tabla.findById(id, (err, tablaDB) => {
        if (err) {
            // 400 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tablaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Tabla no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            tabla: tablaDB
        });
    });


});

//Crear tabla 
app.post('/tabla', verificaToken, (req, res) => {
    let body = req.body;

    // Crea objeto tabla con las propiedades y metodos definidos en Usuario
    let tabla = new Tabla({
        codigo: body.codigo,
        descripcion: body.descripcion,
        tipoTabla: body.tipoTabla_id,
        valorUno: body.valorUno,
        activo: true
    });

    // Llama al metodo de grabacion
    tabla.save((err, tablaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tablaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // status 200 no es necesario, va por defecto
        res.json({
            ok: true,
            tabla: tablaDB
        });
    });

});

//Modificar tabla
app.put('/tabla/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    Tabla.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, tablaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tablaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            tabla: tablaDB
        });
    });


});

//Borrar tabla 
app.delete('/tabla/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Tabla.findByIdAndRemove(id, (err, tablaDB) => {
        if (err) {
            // 400 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tablaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Tabla no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Tabla borrada'
        });

    });

});

//Inicializar tablas
app.post('/tablaInit/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    if (id !== 'pcsSpcl2020') return;

    var tablas = [{
            "codigo": "TipoDocumentoIdentidad_DNI",
            "descripcion": "DNI",
            "tipoTabla": "TipoDocumentoIdentidad",
            "activo": true,
            "tablaPadre": ""
        },
        {
            "codigo": "TipoDocumentoIdentidad_PASAPORTE",
            "descripcion": "PASAPORTE",
            "tipoTabla": "TipoDocumentoIdentidad",
            "activo": true
        },
        {
            "codigo": "Paises_España",
            "descripcion": "España",
            "tipoTabla": "Paises",
            "activo": true,
            "valorUno": "es.svg"
        },
        {
            "codigo": "Paises_Peru",
            "descripcion": "Peru",
            "tipoTabla": "Paises",
            "activo": true,
            "valorUno": "pe.svg"
        },
        {
            "codigo": "Paises_EU",
            "descripcion": "Estados Unidos de America",
            "tipoTabla": "Paises",
            "valorUno": "us.svg",
            "activo": true
        },
        {
            "codigo": "Paises_Euro",
            "descripcion": "Zona Euro",
            "tipoTabla": "Paises",
            "valorUno": "eu.svg",
            "activo": false
        },
        {
            "codigo": "MetodoDePagoTarjeta",
            "descripcion": "app.tablas.metododepago.metododepagotarjeta",
            "tipoTabla": "MetodoDePago",
            "valorUno": "card",
            "activo": true
        },
        {
            "codigo": "MetodoDePagoPresencial",
            "descripcion": "app.tablas.metododepago.metododepagopresencial",
            "tipoTabla": "MetodoDePago",
            "valorUno": "walk",
            "activo": true
        },
        {
            "codigo": "LocalMadridPrincipal",
            "descripcion": "Av. El Ejercito 320 Miraflores",
            "tipoTabla": "Establecimiento",
            "valorUno": "",
            "tablaPadre": "CiudadEstablecimientoMadrid",
            "activo": true
        },
        {
            "codigo": "LocalMadrid2",
            "descripcion": "Ovalo Higuereta 212 Miraflores",
            "tipoTabla": "Establecimiento",
            "valorUno": "",
            "tablaPadre": "CiudadEstablecimientoMadrid",
            "activo": true
        },
        {
            "codigo": "EstadoTransaccionEnCurso",
            "descripcion": "En curso",
            "tipoTabla": "EstadoDeTransaccion",
            "valorUno": "",
            "activo": true
        },
        {
            "codigo": "EstadoTransaccionPagada",
            "descripcion": "Transaccion Pagada",
            "tipoTabla": "EstadoDeTransaccion",
            "valorUno": "",
            "activo": true
        },
        {
            "codigo": "EstadoTransaccionFinalizada",
            "descripcion": "Transaccion Finalizada",
            "tipoTabla": "EstadoDeTransaccion",
            "valorUno": "",
            "activo": true
        },
        {
            "codigo": "EstadoTransaccionCancelada",
            "descripcion": "Transaccion Cancelada",
            "tipoTabla": "EstadoDeTransaccion",
            "valorUno": "",
            "activo": true
        },
        {
            "codigo": "CiudadEstablecimientoMadrid",
            "descripcion": "Lima",
            "tipoTabla": "CiudadEstablecimiento",
            "valorUno": "",
            "activo": true
        },
        {
            "codigo": "CiudadEstablecimientoBarcelona",
            "descripcion": "Barcelona",
            "tipoTabla": "CiudadEstablecimiento",
            "valorUno": "",
            "activo": false
        },
        {
            "codigo": "CiudadEstablecimientoSevilla",
            "descripcion": "Sevilla",
            "tipoTabla": "CiudadEstablecimiento",
            "valorUno": "",
            "activo": false
        },
        {
            "codigo": "CiudadEstablecimientoMalaga",
            "descripcion": "Malaga",
            "tipoTabla": "CiudadEstablecimiento",
            "valorUno": "",
            "activo": false
        },
        {
            "codigo": "CiudadEstablecimientoAlicante",
            "descripcion": "Alicante",
            "tipoTabla": "CiudadEstablecimiento",
            "valorUno": "",
            "activo": false
        },
        {
            "codigo": "OpcionEntregaTienda",
            "descripcion": "app.tablas.opcionentrega.opcionentregatienda",
            "tipoTabla": "OpcionesDeEntrega",
            "valorUno": "pin",
            "activo": true
        },
        {
            "codigo": "OpcionEntregaTransferencia",
            "descripcion": "app.tablas.opcionentrega.opcionentregatransferencia",
            "tipoTabla": "OpcionesDeEntrega",
            "valorUno": "car",
            "activo": true
        },
        {
            "codigo": "BancosBCP",
            "descripcion": "BCP",
            "tipoTabla": "Bancos",
            "valorUno": "bcp.png",
            "activo": true
        },
        {
            "codigo": "BancosInterbank",
            "descripcion": "Interbank",
            "tipoTabla": "Bancos",
            "valorUno": "interbank.png",
            "activo": true
        },
        {
            "codigo": "BancosBBVA",
            "descripcion": "BBVA",
            "tipoTabla": "Bancos",
            "valorUno": "bbva.png",
            "activo": true
        },
        {
            "codigo": "TipoCuentaAhorro",
            "descripcion": "Ahorros",
            "tipoTabla": "TipoDeCuenta",
            "valorUno": "",
            "activo": true
        },
        {
            "codigo": "TipoCuentaCorriente",
            "descripcion": "Corriente",
            "tipoTabla": "TipoDeCuenta",
            "valorUno": "",
            "activo": true
        },
        {
            "codigo": "DestinoTransaccionParaMi",
            "descripcion": "app.tablas.destinoTransaccion.paraMi",
            "tipoTabla": "DestinoTransaccion",
            "valorUno": "",
            "activo": true
        },
        {
            "codigo": "DestinoTransaccionParaEmpresa",
            "descripcion": "app.tablas.destinoTransaccion.paraMiEmpresa",
            "tipoTabla": "DestinoTransaccion",
            "valorUno": "",
            "activo": true
        },
        {
            "codigo": "CuentaPropia",
            "descripcion": "Cuenta Propia",
            "tipoTabla": "TipoPropiedadCuenta",
            "valorUno": "",
            "activo": true
        },
        {
            "codigo": "CuentaEmpresa",
            "descripcion": "Cuenta de Empresa",
            "tipoTabla": "TipoPropiedadCuenta",
            "valorUno": "",
            "activo": true
        }
    ];




    const promise = new Promise((resolve, reject) => {


        tablas.forEach(function(tabla, indice, array) {
            TipoTabla.find({ codigo: tabla.tipoTabla }, (err, tipoTablaDB) => {
                if (err) {
                    console.log(err);
                    reject(new Error('Error desconocido'));
                }

                if (!tipoTablaDB) {
                    reject(new Error('Tipo de tabla no encontrada'));
                }

                if (tipoTablaDB) {
                    tabla.tipoTabla = tipoTablaDB[0]._id;

                    Tabla.insertMany(tabla, function(err, tablaDB) {
                        if (err) {
                            // 400 bad request
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        }

                        if (!tablaDB) {
                            // 400 bad request
                            return res.status(400).json({
                                ok: false,
                                err: {
                                    message: 'Tabla no encontrada'
                                }
                            });
                        }


                    });

                }
            })
        })

        setTimeout(
            () => resolve(true),
            // : reject(new Error('Menor a 5')),
            1000
        );
    });

    promise
        .then(tabla => {
            res.json({
                ok: true
            });

        })
        .catch(error => console.error(error));



});

module.exports = app;