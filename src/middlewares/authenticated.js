'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');


var secret = 'pass';

exports.ensureAuth = function(req, res, next ){
    
    var params = req.body;
    var fact = params.commands.split(" ");
    var string = fact[0];

    if (!req.headers.authorization) {
        if (string === "register") {
            next();
        } else if (string === "login") {
            next()
        } else {
            return res.status(403).send({ message: "la peticion no tiene la cabecera de autenticacion" });
        }
    } else {
        var token = req.headers.authorization.replace(/['"]+/g, "");

        try {
            var payload = jwt.decode(token, secret);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({ message: "El token ha expirado" });
            }
        } catch (error) {
            return res.status(404).send({ message: "El token no es valido" });
        }

        req.user = payload;
        next();
    }
};
