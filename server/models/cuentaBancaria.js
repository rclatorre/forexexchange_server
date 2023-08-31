var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const Tabla = require('./tabla');
const Empresa = require('./empresa');
const Cliente = require('./cliente');
const Moneda = require('./moneda');

var cuentaBancariaSchema = new Schema({

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
    tipoPropiedadCuenta: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [true, 'El tipo de propiedad de cuenta es necesario'],
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Tipo de propiedad de cuenta invalido'
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
        },

    },
    banco: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [true, 'El banco es necesario'],
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Metodo de pago invalido'
        }
    },
    moneda: {
        type: Schema.Types.ObjectId,
        ref: 'Moneda',
        required: [true, 'La moneda es necesaria'],
        validate: {
            validator: async function(v) {
                return await Moneda.findById(v, (err, rec) => rec !== null)
            },
            message: 'Moneda invalida'
        }
    },
    tipoDeCuenta: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [true, 'El tipo de cuenta es necesario'],
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Metodo de pago invalido'
        }
    },
    numeroDeCuenta: {
        type: String,
        required: [true, 'El numero de cuenta es necesario'],
    },
    numeroDeCCI: {
        type: String,
        required: [false, 'El numero de CCI es necesario'],
    },
    activo: { type: Boolean },
    default: { type: Boolean }

});

// clienteSchema.index({
//     clieneAsociado: 1,
//     tipoDocumentoIdentidad: 1,
//     numeroDocumentoIdentidad: 1,
// }, {
//     unique: true,
// });

// Cambio de mensajes para las validaciones de duplicados
cuentaBancariaSchema.plugin(uniqueValidator, { message: 'Error, este valor {PATH} debe ser unico.' });
cuentaBancariaSchema.plugin(deepPopulate); //, options /* more on options below */

module.exports = mongoose.model('CuentaBancaria', cuentaBancariaSchema);