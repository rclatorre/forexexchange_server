const express = require('express');
const Cliente = require('../models/cliente'); 
const Usuario = require('../models/usuario'); 
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

// Inicializa
app.put('/utilitarios/inicializa', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    //Inicializa usuarios
    if (body.seccion === 'usuarios') {

        Usuario.deleteMany( { email: {$ne: 'admin@divisassac.com'}}, (err) => {
                if (err) {
                    // 400 bad request
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
    
                res.json({
                    ok: true
                });
            });
            
    }

    if (body.seccion === 'clientes') {

        Cliente.deleteMany( { email: {$ne: 'admin@divisassac.com'}}, (err) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true
            });
        })
    }


});




module.exports = app;