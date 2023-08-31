const Log = require('../models/log'); //Mayuscula pq desde aqui crearemos instancias con new....

/*
Actualiza log de control
*/
const actualizaLog = (accion, usuario, valor) => {

    return new Promise(resolve => {

        let log = new Log({
            accion: accion,
            usuario: usuario,
            valor: valor
        });
    
        log.save((err, logDB) => {
            if (err) {
                // 500 bad request 
                console.log(err);
                resolve({
                    ok: false,
                    err
                })
            }
    
            resolve({
                ok: true,
                logDB
            })
    
    
        }
        )    

    });
}

/*
Obtiene log de control
*/
const obtieneLog = (id) => {

    return new Promise((resolve, reject) => {

        Log.findById(id)
            .exec((err, logDB) => {
                if (err) {
                    console.log('obtieneLog', new Date().toLocaleTimeString(), `id: ${id}`, err)
                    // 400 bad request   
                    reject({
                        ok: false,
                        err
                    });
                }
                resolve({
                    ok: true,
                    logDB
                });
            });
      
        })    

}


exports.actualizaLog= actualizaLog;
exports.obtieneLog= obtieneLog;
