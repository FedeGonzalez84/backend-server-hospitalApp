var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
// =====================================================================
// Verificar token
// =====================================================================
exports.verificaToken = function(req, res, next) {
    // si se recibe por url
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        // Almacena en esta variable, los datos del usuario
        req.usuario = decoded.usuario;
        next();

    });
}