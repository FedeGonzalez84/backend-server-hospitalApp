// Requires
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

// Para controlar roles validos
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

// Creo los campos del esquema
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'El password es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

// Se le agrega el unique validator
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico ' });

// Exporto para que pueda utilizarse fuera del archivo
module.exports = mongoose.model('Usuario', usuarioSchema);