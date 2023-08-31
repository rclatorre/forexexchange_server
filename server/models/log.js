const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const uniqueValidator = require('mongoose-unique-validator');
// const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Usuario = require('./usuario');

let Schema = mongoose.Schema;

let logSchema = new Schema({

    accion: { type: String, required: [true, 'La accion es necesaria'] },
    valor: { type: String, required: [true, 'El valo es necesario'] },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es necesario'],
        validate: {
            validator: async function(v) {
                return await Usuario.findById(v, (err, rec) => rec !== null)
            },
            message: 'Usuario invalido'
        }
    },
    fechaRegistro: { type: Date, default: Date.now()},

});



module.exports = mongoose.model('Log', logSchema);