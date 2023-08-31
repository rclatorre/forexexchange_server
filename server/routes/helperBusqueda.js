const express = require('express');
const Cliente = require('../models/cliente'); //Mayuscula pq desde aqui crearemos instancias con new....
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

// Buscar
app.get('/helperBusqueda', verificaToken, (req, res) => {
    let query = req.query;

    //Busqueda en cliente
    if (query.seccion === 'cliente') {

        let regex = new RegExp(query.nombre, 'i');
        Cliente.find(   { 
                            $or:  [   
                                { nombre: { $regex: regex } },
                                { primerApellido: { $regex: regex } },
                                { email: { $regex: regex } }
                            ]
                        }
                     , "numeroDocumentoIdentidad nombre primerApellido segundoApellido email")
            .exec((err, clientes) => {
                if (err) {
                    // 400 bad request
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
    
                result = [];
                clientes.forEach(function (a) {
                    let valor; 
                     
                    valor = {   _id: a._id,
                                codigo: a.numeroDocumentoIdentidad, 
                                descripcion: a.nombre+' '+a.primerApellido+' '+a.segundoApellido+' | '+a.email,
                                nota: a.email
                            };
    
                    result.push(valor);
    
                })
    
                res.json({
                    ok: true,
                    result
                });
            })

    }

});




module.exports = app;