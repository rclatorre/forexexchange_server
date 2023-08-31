var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const Cliente = require('./cliente');
const Usuario = require('./usuario');
const Moneda = require('./moneda');

var cambioPreferencialSchema = new Schema({
    fechaRegistro: { type: Date },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'El cliente es necesario'], 
        validate: {
            validator: async function(v) {
                return await Cliente.findById(v, (err, rec) => rec !== null)
            },
            message: 'El cliente es invalido'
        }
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        validate: {
            validator: async function(v) {
                return await Usuario.findById(v, (err, rec) => rec !== null)
            },
            message: 'Usuario invalido'
        }
    },
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
    cotizacion: { type: String, required: [true, 'La cotizacion es necesaria'] },
    codigo: { type: String, required: [true, 'La combinacion origen destino OOO/DDD es necesaria'] },

    activo: { type: Boolean }
});

// Cambio de mensajes para las validaciones de duplicados
cambioPreferencialSchema.plugin(uniqueValidator, { message: 'Error, este valor {PATH} debe ser unico.' });

module.exports = mongoose.model('CambioPreferencial', cambioPreferencialSchema);