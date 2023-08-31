var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const Tabla = require('./tabla');
const Cliente = require('./cliente');

var empresaSchema = new Schema({
    ruc: { type: String, required: [true, 'El RUC es necesario'] },
    razonSocial: { type: String, required: [true, 'La razon social es necesaria'] },
    telefono: { type: String },
    direccion: { type: String, required: [true, 'La direccion es necesaria'] },
    clienteAsociado: {
        type: Schema.Types.ObjectId,
        required: [true, 'El cliente es necesario'],
        ref: 'Cliente',
        validate: {
            validator: async function(v) {
                return await Cliente.findById(v, (err, rec) => rec !== null)
            },
            message: 'Cliente invalido'
        }
    },
    nombreRep: { type: String, required: [true, 'El nombre es necesario'] },
    primerApellidoRep: { type: String, required: [false] }, //, 'El primer apellido es necesario'
    segundoApellidoRep: { type: String, required: [false] },
    tipoDocumentoIdentidadRep: {
        type: Schema.Types.ObjectId,
        ref: 'Tabla',
        required: [false], //, 'El tipo de documento de identidad es necesario'
        validate: {
            validator: async function(v) {
                return await Tabla.findById(v, (err, rec) => rec !== null)
            },
            message: 'Tipo de Documento de Identidad invalido'
        }
    },
    numeroDocumentoIdentidadRep: { type: String, required: [false] }, //, 'El numero de documento de identidad es necesario'
    activo: { type: Boolean }
});

// clienteSchema.index({
//     clieneAsociado: 1,
//     tipoDocumentoIdentidad: 1,
//     numeroDocumentoIdentidad: 1,
// }, {
//     unique: true,
// });

// Cambio de mensajes para las validaciones de duplicados
empresaSchema.plugin(uniqueValidator, { message: 'Error, este valor {PATH} debe ser unico.' });

module.exports = mongoose.model('Empresa', empresaSchema);