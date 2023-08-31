const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const uniqueValidator = require('mongoose-unique-validator');
// const deepPopulate = require('mongoose-deep-populate')(mongoose);

const Moneda = require('./moneda');
const Tabla = require('./tabla');
const Usuario = require('./usuario');
const Cliente = require('./cliente');
const CuentaBancaria = require('./cuentaBancaria');
const CuentaBancariaPropia = require('./cuentaBancariaPropia');
const Empresa = require('./empresa');

let Schema = mongoose.Schema;

let transaccionSchema = new Schema({

    monedaDe: {
        type: Schema.Types.ObjectId,
        ref: 'Moneda',
        validate: {
            validator: async function(v) {
                return await Moneda.findById(v, (err, rec) => rec !== null)
            },
            message: 'Moneda origen invalida'
        }
    },
    monedaA: {
        type: Schema.Types.ObjectId,
        ref: 'Moneda',
        validate: {
            validator: async function(v) {
                return await Moneda.findById(v, (err, rec) => rec !== null)
            },
            message: 'Moneda destino invalida'
        }
    },
    codigoDeA: { type: String, required: [true, 'La combinacion origen destino OOO/DDD es necesaria'] },
    cotizacion: { type: String, required: [true, 'La cotizacion es necesaria'] },
    cantidadDe: { type: String, required: [true, 'La cantidad de origen es necesaria'] },
    cantidadA: { type: String, required: [true, 'La cantidad de destino es necesaria'] },

    /*
    Codigo de tabla: MetodoDePagoTarjeta, MetodoDePagoPresencial
    */
    metodoDePago: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [true, 'El metodo de pago es necesario'],
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Metodo de pago invalido'
        }
    },

    /*
    Codigo de tabla: OpcionEntregaPresencial, OpcionEntregaDelivery
    */
    opcionEntrega: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [true, 'La opcion de entrega es necesaria'],
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Opcion de entrega invalida'
        }
    },

    /*
    Codigo de tabla: CiudadEstablecimientoMadrid, .....
    */
    ciudadEstablecimientoRecojo: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [true, 'La ciudad es necesaria'],
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Ciudad invalida'
        }
    },

    /*
    Codigo de tabla: LocalMadridPrincipal, LocalBarcelona
    */
    establecimientoRecojo: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [true, 'El lugar de recojo necesario'],
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Lugar de recojo invalido'
        }
    },

    /*
     En curso / Pagada / Finalizada / Cancelada
     Codigo de tabla: EstadoTransaccionEnCurso, EstadoTransaccionPagada, EstadoTransaccionFinalizada, EstadoTransaccionCancelada
    */
    estadoDeTransaccion: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [true, 'El estado de la transaccion es necesario'],
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Estado de transaccion invalido'
        }
    },

    usuarioCliente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario cliente es necesario'],
        validate: {
            validator: async function(v) {
                return await Usuario.findById(v, (err, rec) => rec !== null)
            },
            message: 'Usuario invalido'
        }
    },

    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'El cliente es necesario'],
        validate: {
            validator: async function(v) {
                return await Cliente.findById(v, (err, rec) => rec !== null)
            },
            message: 'Cliente invalido'
        }
    },

    fechaRegistro: { type: Date },

    destinoTransaccion: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [true, 'El destino de la transaccion es necesario'],
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Destino de transaccion invalido'
        }
    },

    origenDeFondos: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Origen de fondos invalido'
        }
    },

    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        validate: {
            validator: async function(v) {
                return await Empresa.findById(v, (err, rec) => rec !== null)
            },
            message: 'Empresa invalida'
        }
    },


    transferencia: {
        cuentaOrigen: {
            type: Schema.Types.ObjectId,
            ref: 'CuentaBancaria',
            validate: {
                validator: async function(v) {
                    return await CuentaBancaria.findById(v, (err, rec) => rec !== null)
                },
                message: 'Cuenta invalida'
            }
        },
        numeroOperacionOrigen: { type: String },
        cuentaDestino: {
            type: Schema.Types.ObjectId,
            ref: 'CuentaBancaria',
            validate: {
                validator: async function(v) {
                    return await CuentaBancaria.findById(v, (err, rec) => rec !== null)
                },
                message: 'Cuenta invalida'
            }
        },
        numeroOperacionDestino: { type: String },

        cuentaPropiaDestino: {
            type: Schema.Types.ObjectId,
            ref: 'CuentaBancariaPropia',
            validate: {
                validator: async function(v) {
                    return await CuentaBancariaPropia.findById(v, (err, rec) => rec !== null)
                },
                message: 'Cuenta propia destino invalida'
            }
        },
        numeroOperacionPropiaDestino: { type: String },

        cuentaPropiaOrigen: {
            type: Schema.Types.ObjectId,
            ref: 'CuentaBancariaPropia',
            validate: {
                validator: async function(v) {
                    return await CuentaBancariaPropia.findById(v, (err, rec) => rec !== null)
                },
                message: 'Cuenta propia origen invalida'
            }
        },
        numeroOperacionPropiaOrigen: { type: String },
        fechaTransferenciaCliente: { type: Date },
        fechaTransferenciaPropia: { type: Date },
        tipoTransferenciaCliente: {
            type: Schema.Types.ObjectId,
            ref: 'Tabla',
            required: [true, 'El tipo de transferencia del cliente es necesario'],
            validate: {
                validator: async function(v) {
                    return await Tabla.findById(v, (err, rec) => rec !== null)
                },
                message: 'Tipo de transferencia cliente invalido'
            }
        },
        tipoTransferenciaPropia: {
            type: Schema.Types.ObjectId,
            ref: 'Tabla',
            required: [true, 'El tipo de transferencia propia es necesario'],
            validate: {
                validator: async function(v) {
                    return await Tabla.findById(v, (err, rec) => rec !== null)
                },
                message: 'Tipo de transferencia propia invalido'
            }
        }


    },
    devolucion: {type: String},
    fechaCancelacion: { type: Date },
    motivoCancelacion: { type: String }


});
/*
Incrementador
*/
/*
Options
This plugin accepts a series of options.

inc_field: The name of the field to increment. Mandatory, default is _id
id: Id of the sequence. Is mandatory only for scoped sequences but its use is strongly encouraged.
reference_fields: The field to reference for a scoped counter. Optional.
start_seq: The number to start the sequence from. Optional, default 1.
inc_amount: The quantity to increase the counter at each increment. Optional, default 1.
disable_hooks: If true, the counter will not be incremented on saving a new document. Default to false
collection_name: By default the collection name to mantain the status of the counters is counters. You can override it using this option
parallel_hooks: If true, hooks will be registered as parallel. Default to true
*/
transaccionSchema.plugin(AutoIncrement, { inc_field: 'numeroTransaccion', start_seq: 2020 });



// // Inicializa campo created
// transaccionSchema.pre < ITransaccion > ('save', function(next) {
//     this.created = new Date();
//     next();
// })

// // Interface que se usa en postSchema.pre
// interface ITransaccion extends Document {
//     monedaDe: string;
//     monedaA: string;
//     codigoDeA: string;
//     cotizacion: string;
//     cantidadDe: string;
//     cantidadA: Date;
//     metodoDePago: string;
//     establecimientoRecojo: string;
//     fechaRegistro: string;
//     usuario: string;
// }

// Cambio de mensajes para las validaciones de duplicados
transaccionSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
// transaccionSchema.plugin(deepPopulate, {
//     whitelist: ['transferencia.cuentaOrigen', 'transferencia.cuentaOrigen.banco']
// }); //, options /* more on options below */


module.exports = mongoose.model('Transaccion', transaccionSchema);