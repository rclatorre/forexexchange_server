var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const Tabla = require('./tabla');
const Moneda = require('./moneda');

var cuentaBancariaPropiaSchema = new Schema({

    banco: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [true, 'El banco es necesario'],
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Banco invalido'
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
            message: 'Tipo de cuenta invalido'
        }
    },
    numeroDeCuenta: {
        type: String,
        required: [true, 'El numero de cuenta es necesario'],
    },
    numeroDeCCI: {
        type: String,
        required: [true, 'El numero de CCI es necesario'],
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
cuentaBancariaPropiaSchema.plugin(uniqueValidator, { message: 'Error, este valor {PATH} debe ser unico.' });

module.exports = mongoose.model('CuentaBancariaPropia', cuentaBancariaPropiaSchema);