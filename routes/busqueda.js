var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ---------------------------------------------------------------------------
// Busqueda por colecciones individuales
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    // tabla a buscar
    var tabla = req.params.tabla;

    // El objeto a buscar se busca en el url
    var busqueda = req.params.busqueda;

    // Se crea una expresion regular para que la busqueda
    // sea insensible a las mayusculas
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son usuarios, medicos, hospitales',
                error: { message: 'Tipo de tabla/colección no valido' }
            })
            break;
    }
    promesa.then(respuesta => {
        res.status(200).json({
            ok: true,
            //--> Se pone corchete para que lo cargue con el valor correspondiente
            // es una nueva propiedad de javascript que se llama propiedades de objetos
            // computadas
            [tabla]: respuesta
        });
    })

});
// ---------------------------------------------------------------------------
// Busqueda general
app.get('/todo/:busqueda', (req, res, next) => {

    // El objeto a buscar se busca en el url
    var busqueda = req.params.busqueda;

    // Se crea una expresion regular para que la busqueda
    // sea insensible a las mayusculas
    var regex = new RegExp(busqueda, 'i');

    // Envia un arreglo de promesas y devuelve las respuestas en un arreglo tambien
    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                Usuario: respuestas[2]
            });
        })

});
// Funcion asincrona para buscar hospitales
function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            })
    });
}

// Funcion asincrona para buscar hospitales
function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });

    });
}

// Funcion asincrona para buscar hospitales
function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email rol ')
            // El or se utiliza para buscar en varias columnas del documento
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al buscar usuario', err);
                } else {
                    resolve(usuarios);
                }
            });

    });
}
// ---------------------------------------------------------------------------
module.exports = app;