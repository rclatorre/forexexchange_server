const express = require('express');
const axios = require('axios');
var FormData = require('form-data');
const Cotizacion = require('../models/cotizacion'); //Mayuscula pq desde aqui crearemos instancias con new....
const _ = require('underscore');
const Log = require('../helpers/log');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const { number_format } = require('../helpers/redondeo');

const app = express();

// -------
// Metodos
// -------

//Mostrar cotizacion por termino p.e.: USD/EUR
//verificaToken,
// Buscar
//verificaToken,
app.get('/cotizacion/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Cotizacion.find({ codigo: regex })
        .exec((err, cotizacion) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!cotizacion) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                cotizacion
            });
        })
});

//Cotizacion en dos variables compra y venta
app.get('/cotizacion/buscarCV/:de/:a', [verificaToken, verificaAdmin_Role], (req, res) => {

    let termino = req.params.de+req.params.a;
    let regex = new RegExp(termino, 'i');

    Cotizacion.find({ codigo: regex })
        .exec((err, cotizacionDeA) => {
            if (err) {
                // 400 bad request
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!cotizacionDeA) {
                // 400 bad request
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            termino = req.params.a+req.params.de;
            regex = new RegExp(termino, 'i');
            Cotizacion.find({ codigo: regex })
            .exec((err, cotizacionADe) => {
                if (err) {
                    // 400 bad request
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
    
                if (!cotizacionADe) {
                    // 400 bad request
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
    

                res.json({
                    ok: true,
                    compra: cotizacionDeA[0].cotizacion,
                    venta: cotizacionADe[0].cotizacion
                });
            })


        })
});


//Actualizar cotizaciones
//,
app.post('/cotizacion/actualiza', [verificaToken, verificaAdmin_Role], async(req, res) => {
    let body = req.body;
    let usuario = req.usuario;
    /*
    var arr = [{ name: 'Star Wars' }, { name: 'The Empire Strikes Back' }];
    Movies.insertMany(arr, function(error, docs) {});
    */

    //var arr = [{ codigo: 'USD/EUR', cotizacion: '0.8125' }, { codigo: 'The Empire Strikes Back' }];


    await Cotizacion.deleteMany({}, (err, cotizacionDB) => {

    });

    Log.actualizaLog('ActualizaCotizacionEnviandoCotizacion', usuario._id, JSON.stringify(body));

    // Busca y actualiza
    // new: true -> Se usa para devolver el nuevo registro
    // runValidators: true -> Ejecuta las validaciones definidas en Mongo
    Cotizacion.insertMany(body, (err, cotizacionDB) => {
        if (err) {
            // 500 bad request
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!cotizacionDB) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        // console.log('Cotizacion actualizada: ', cotizacionDB)        
        Log.actualizaLog('ActualizaCotizacionRespuestaSatisfactoria', usuario._id, JSON.stringify(cotizacionDB));

        integracionCuantoEstaElDolar(cotizacionDB, usuario); //Actualiza plataforma cuantoestaeldolar.pe

        res.json({
            ok: true,
            cotizacion: cotizacionDB
        });
    });


});

/*
Integracion con cuantoestaeldolar.pe
*/
let integracionCuantoEstaElDolar = ( cotizacionDB, usuario ) => {

    let url_base = process.env.ACUANTOESTAELDOLAR_URL_BASE;
    let token = ""; 
    let email = process.env.ACUANTOESTAELDOLAR_USUARIO;
    let password = process.env.ACUANTOESTAELDOLAR_PASSWORD;
    let venta = cotizacionDB[0].codigo == 'PENUSD' ? cotizacionDB[0].cotizacion : cotizacionDB[1].cotizacion;
    let compra = cotizacionDB[0].codigo == 'USDPEN' ? cotizacionDB[0].cotizacion : cotizacionDB[1].cotizacion;
    var dataJSON = {compra: compra, venta: venta};
    var auth = new FormData();
    var data = new FormData();
    let config = {};

    // axios.defaults.baseURL = url_base; 

    // Autenticacion
    auth.append('email', email);
    auth.append('password', password);
        config = {
            method: 'post',
            url: 'https://api.cuantoestaeldolar.pe/Api/Dolar/auth',
            headers: { 
                ...auth.getHeaders()
            },
            data : auth
        };
        axios(config)
        .then(res1 => {

            Log.actualizaLog('AutenticacionAcuantoestaeldolarRespuestaSatisfactoria', usuario._id, JSON.stringify(res1.data));      
            token = res1.data.token;
        
            setTimeout(() => {
                
                // Actualizacion de cotizacion
                data.append('compra', compra);
                data.append('venta', venta);
            
                config = {
                    method: 'post',
                    url: 'https://api.cuantoestaeldolar.pe/Api/Dolar/actualizar',
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded', 
                        'Authorization': `Bearer ${token}`,
                        ...data.getHeaders()
                    },
                    data : data
                };

                Log.actualizaLog('ActualizaCotizacionAcuantoestaeldolarEnviandoCotizacion', usuario._id, JSON.stringify(dataJSON));

                axios(config)
                .then(res1 => {
                    Log.actualizaLog('ActualizaCotizacionAcuantoestaeldolarRespuestaSatisfactoria', usuario._id, JSON.stringify(res1.data));
            
                }).catch((e) => { 
                    Log.actualizaLog('ActualizaCotizacionAcuantoestaeldolarRespuestaConError', usuario._id, JSON.stringify(e));            
                });
                
            }
            , 10000)


        }).catch((e) => {            
            Log.actualizaLog('AutenticacionAcuantoestaeldolarRespuestaConError', usuario._id, JSON.stringify(e));            
        });        
       
        
    



}

module.exports = app;