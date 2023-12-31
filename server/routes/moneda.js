const express = require('express');
const Tabla = require('../models/tabla'); //Mayuscula pq desde aqui crearemos instancias con new....
const Moneda = require('../models/moneda'); //Mayuscula pq desde aqui crearemos instancias con new....
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

// -------
// Metodos
// -------

//Mostrar todas las monedas 
// verificaToken
app.get('/moneda', (req, res) => {

    Moneda.find({})
        .sort('descripcion')
        .populate('pais', 'descripcion valorUno')
        .exec((err, monedas) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                monedas
            });

        });
});

//Mostrar todas las monedas 
// verificaToken
app.get('/moneda/codigo/:codigo', (req, res) => {
    let codigo = req.params.codigo;

    Moneda.find({ codigo: codigo })
        .sort('descripcion')
        .populate('pais', 'codigo descripcion valorUno')
        .exec((err, monedas) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                monedas
            });

        });
});

//Mostrar moneda por id
app.get('/moneda/obtener/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Moneda.findById(id, (err, monedaDB) => {
        if (err) {
            // 400 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!monedaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Moneda no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            moneda: monedaDB
        });
    });


});

//Crear moneda
app.post('/moneda', verificaToken, (req, res) => {
    let body = req.body;

    // Crea objeto tabla con las propiedades y metodos definidos en Usuario
    let moneda = new Moneda({
        codigo: body.codigo,
        descripcion: body.descripcion,
        pais: body.pais_id
    });

    // Llama al metodo de grabacion
    moneda.save((err, monedaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!monedaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // status 200 no es necesario, va por defecto
        res.json({
            ok: true,
            moneda: monedaDB
        });
    });

});

//Modificar moneda
app.put('/moneda/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    Moneda.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, monedaDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!monedaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            moneda: monedaDB
        });
    });


});

//Borrar moneda 
app.delete('/moneda/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Moneda.findByIdAndRemove(id, (err, monedaDB) => {
        if (err) {
            // 400 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!monedaDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Moneda no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Moneda borrada'
        });

    });

});


//Inicializar monedas
app.post('/monedaInit/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    if (id !== 'pcsSpcl2020') return;

    var monedas = [{
            "codigo": "USD",
            "descripcion": "Dólares",
            "pais": "Paises_EU"
        },
        {
            "codigo": "PEN",
            "descripcion": "Soles",
            "pais": "Paises_Peru"
        }
    ];


    const promise = new Promise((resolve, reject) => {
        monedas.forEach(function(moneda, indice, array) {
            Tabla.find({ codigo: moneda.pais }, (err, tablaDB) => {
                if (err) {
                    console.log(err);
                    reject(new Error('Error desconocido'));
                }

                if (!tablaDB) {
                    reject(new Error('tabla no encontrada'));
                }

                if (tablaDB) {
                    moneda.pais = tablaDB[0]._id;

                    Moneda.insertMany(moneda, function(err, monedaDB) {
                        if (err) {
                            // 400 bad request
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        }

                        if (!monedaDB) {
                            // 400 bad request
                            return res.status(400).json({
                                ok: false,
                                err: {
                                    message: 'Moneda no encontrada'
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