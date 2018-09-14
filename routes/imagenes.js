var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');
// ---------------------------------------------------------------------------
// Rutas para acceder a la imagen de un hospital, usuario o medico
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    // Usar la libreria path ayuda a tener un path relativo a donde uno se encuentre
    // de una forma mas sencilla
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    // Compruebo la existencia de la imagen
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImage);
    }

});
// ---------------------------------------------------------------------------
module.exports = app;