var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    // Refencia al usuario que creo la entrada
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });




module.exports = mongoose.model('Hospital', hospitalSchema);