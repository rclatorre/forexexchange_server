//=======
// Puerto
//=======
process.env.PORT = process.env.PORT || 3000;

//========
// Entorno
//========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======
// Vencimiento del token
//=======
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '1d';
process.env.CADUCIDAD_TOKEN_REGISTRO = '24h';
process.env.CADUCIDAD_TOKEN_RECUPERACION = '5m';


//=======
// Seed del token
//=======
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-seed-es-de-divisa-2020';

//=============
// URL DB Mongo
//=============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb+srv://test:6hCw7oy5w9e0CMqo@cluster0.nkdudmn.mongodb.net/divisa_forexexchange?authSource=admin'; //&replicaSet=Cluster0-shard-0&readPreference=primary&ssl=true
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//===========================
// Google reCaptcha secretKey
//===========================
if (process.env.NODE_ENV === 'dev') {
    // locahost creado para pruebas
    process.env.RECAPTCHA_KEY = process.env.RECAPTCHA_KEY || '6Ld2TlEUAAAAAEya_4M61SyASZkkPitsnuuKV_xT'; //Recaptcha de desarrollo por defecto, apunta a localhost
} else {
    // Con pm2 se le asigna valor en pm2config.json
    process.env.RECAPTCHA_KEY  = process.env.RECAPTCHA_KEY;
}

//==================
// Google cliente id
//==================
process.env.CLIENT_ID = process.env.CLIENT_ID || '138552712854-ula9ge8ud9n7l4mh1dq8jnvfn2tnp1kk.apps.googleusercontent.com';

//==============================================================================
// URL Front para cuando se envie el correo de recuperacion y se coloque el link
//==============================================================================
process.env.URLFront = process.env.URLFront || 'http://localhost:8100';

//==============================================================================
//Configuracion de cliente email, se usa en los envio de correo electronico PUG
//==============================================================================
process.env.emailMessageFrom = process.env.emailMessageFrom || "admin@forexexchange.pe";
process.env.emailTransportHost = process.env.emailTransportHost || "c1332387.ferozo.com"; //"email-smtp.us-east-1.amazonaws.com"; //"c2450977.ferozo.com";
process.env.emailTransportPort =process.env.emailTransportPort ||  465; 
process.env.emailTransportSecure =process.env.emailTransportSecure ||  true; 
process.env.emailTransportAuthType = process.env.emailTransportAuthType || "login"; 
process.env.emailTransportAuthTUser = process.env.emailTransportAuthTUser || "admin@forexexchange.pe"
process.env.emailTransportAuthTPass = process.env.emailTransportAuthTPass || "Rbrtltrr@1"; //"BNKa/Z6skPcWkgFT9XK2VtK+zgzWNtiMBI44ZHCli6Tb"; // "Oporto12qa2022";
process.env.emailTransportTlsRejectUnauthorized =process.env.emailTransportTlsRejectUnauthorized ||  false;
process.env.emailViewsRoot = process.env.emailViewsRoot || "server/services/email/templates/";

//=============================================
//Configuracion de certificado digital servidor
//=============================================
process.env.serverOptionsKey = process.env.serverOptionsKey || '/etc/letsencrypt/live/divisaxone.com/privkey.pem';
process.env.serverOptionsCert = process.env.serverOptionsCert || '/etc/letsencrypt/live/divisaxone.com/fullchain.pem';


//=============================================
//Configuracion de integracion con cuantoestaeldolar.pe
//=============================================
process.env.ACUANTOESTAELDOLAR_URL_BASE = process.env.ACUANTOESTAELDOLAR_URL_BASE || 'https://api.cuantoestaeldolar.pe/Api/Dolar';
process.env.ACUANTOESTAELDOLAR_USUARIO = process.env.ACUANTOESTAELDOLAR_USUARIO || 'update@forex.......com.pe';
process.env.ACUANTOESTAELDOLAR_PASSWORD = process.env.ACUANTOESTAELDOLAR_PASSWORD || 'Qaxxxxxx';

