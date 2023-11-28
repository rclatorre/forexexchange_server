//Carga variables (variables de entorno) y constantes globales
require('./config/config');
 
const cors = require('cors');
const express = require('express');
const socketIO = require('socket.io'); // 01Jun, se agrega
const http = require(process.env.NODE_ENV === 'dev' ? 'http': 'http'); // 08Mar, dev y prod usan http ya que nginx usa un proxypass. 06Jun, agregado por Amil, yo agregue el diferenciador dev
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs'); // 06Jun, agregado por Amil
const app = express();


// Options que se pasa a http, ver comentario siguiente
var options = {};
// 08Mar, ya no se usa porque nginx usa proxypass
// // Opciones para validacion y uso de certificado SSL, solo en produccion
// if (process.env.NODE_ENV === 'dev') {
//     var options = {}; // 06Jun, agregado por mi para tratar de usar en modo local            
// } else {
//     var options = { // 06Jun, agregado por Amil, usa la key de letsencrypt
//         key: fs.readFileSync(process.env.serverOptionsKey), //'/etc/letsencrypt/live/divisassac.com/privkey.pem'
//         cert: fs.readFileSync(process.env.serverOptionsCert) //'/etc/letsencrypt/live/divisassac.com/fullchain.pem'
//     };
// }

let server = http.createServer(options, app); // 06Jun, Amil agrega options

const bodyParser = require('body-parser');

// IO = esta es la comunicacion  del backedn
let io = socketIO(server); // 01Jun, se agrega




app.use(cors({ optionsSuccessStatus: 200})); //06Jun, agregado por Amil
// ,
//     allowedHeaders: [ 'Accept-Version', 'Authorization', 'Credentials', 'Content-Type' ] 

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
// //    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
// //    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//  });


// Configurar cabeceras y cors
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://forexexchange.pe');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
*/
//------------
// Middlewares
//------------
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

//Habilita carpeta public para que pueda ser leida por todos
app.use(express.static(path.resolve(__dirname, '../public')));

// importa todas las rutas 
app.use(require('./routes/index'));

/*app.all('/*', function(req, res, next) {
	console.log("here");
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, *');
  next();
});*/
// { origin: true, credentials: true 


//------------
// Middlewares
//------------
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

//Habilita carpeta public para que pueda ser leida por todos
app.use(express.static(path.resolve(__dirname, '../public')));

// importa todas las rutas 
app.use(require('./routes/index'));




//Conecta con la BD
console.log('process.env.URLDB', process.env.URLDB);
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos online');
});

//Puerto predeterminado, Heroku nos da ese puerto
app.set('port', process.env.PORT || 3000);

//Levanta el servidor
// 01Jun, antes decia app.list......
server.listen(process.env.PORT, () => {
    console.log('NODE_ENV', process.env.NODE_ENV);
    console.log('Escuchando en el puerto', process.env.PORT);
}) 



// // Anterior server.js (anest de que Amil lo cambie)
// //Carga variables y constantes globales
// require('./config/config');

// const cors = require('cors');
// const express = require('express');
// const socketIO = require('socket.io'); // 01Jun, se agrega
// const http = require('http'); // 01Jun, se agrega
// const mongoose = require('mongoose');
// const path = require('path');

// const app = express();
 
// let server = http.createServer(app); // 01Jun, se agrega

// const bodyParser = require('body-parser');

// // IO = esta es la comunicacion  del backedn
// let io = socketIO(server); // 01Jun, se agrega

// app.use(cors({ 
//     origin: true, 
//     credentials: true
// }));
// // ,
// //     allowedHeaders: [ 'Accept-Version', 'Authorization', 'Credentials', 'Content-Type' ] 

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//  });


// //------------
// // Middlewares
// //------------
// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }));

// //parse application/json
// app.use(bodyParser.json());

// //Habilita carpeta public para que pueda ser leida por todos
// app.use(express.static(path.resolve(__dirname, '../public')));

// // importa todas las rutas 
// app.use(require('./routes/index'));


// // Probandp si resuelve problema de CORS
// // Add headers
// app.use(function(req, res, next) {


//     // Website you wish to allow to connect
//     //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
//     // res.setHeader('Access-Control-Allow-Origin', 'http://c1761019.ferozo.com');
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });


// //Conecta con la BD
// mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
//     if (err) throw err;
//     console.log('Base de datos online');
// });

// //Puerto predeterminado, Heroku nos da ese puerto
// app.set('port', process.env.PORT || 3000);

// //Levanta el servidor
// // 01Jun, antes decia app.list......
// server.listen(process.env.PORT, () => {
//     console.log('Escuchando en el puerto', process.env.PORT);
// }) 
