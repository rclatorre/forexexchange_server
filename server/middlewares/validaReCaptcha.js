/*
Revisado        : 05/02/2020
Nota Revision   : Aclarar uso de verificaTokenImg
*/
const axios = require('axios');

// =====================
// Valida reCaptcha de Google
// =====================
let validaReCaptcha = (req, res, next) => {
    let secretKey = process.env.RECAPTCHA_KEY; //"6Ld2TlEUAAAAAEya_4M61SyASZkkPitsnuuKV_xT"; // localhost
    let urlEncodedData = '';

    // console.log("CAPTCHA middleware activated");
    // console.log("req.body", req.body);
    // console.log('node_env',process.env.NODE_ENV);

    //Bypass al recaptcha cuando se envia desde Divisa
    if (req.body.bpsRcptPS == 'tknbsps1') {
        urlEncodedData = '';
    } else {

        if (process.env.NODE_ENV !=='dev'){
            urlEncodedData = 'secret='+ secretKey+'&response=' + req.body.captchaResponse + '&remoteip=' + req.connection.remoteAddress;
        } else {
    
            if (req.body.captchaResponse) {
                urlEncodedData = 'secret='+ secretKey+'&response=' + req.body.captchaResponse + '&remoteip=' + req.connection.remoteAddress;
            } else {
                urlEncodedData = '';
            }
        }

    }


    //console.log(urlEncodedData);

    if (urlEncodedData !=='') {
        
        axios.post('https://www.google.com/recaptcha/api/siteverify', urlEncodedData, {
    
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
    
        }).then((resp) => {
    
            if(resp.data.success){
                next();
                // console.log('success');
            } else {
                // console.log('No seuccess', resp.data);
                res.status(401).send({message: 'No bots!'});
            }
    
        }).catch((err) => {
            console.log(err);
            res.status(401).send({message: 'No bots!'});
        });

    } else {
            next();
            //console.log('success');
    }





}


module.exports = {
    validaReCaptcha
}