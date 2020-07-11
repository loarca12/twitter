'use strict'

var User = require("../models/user.model");
var jwt = require("../services/jwt");
var bcrypt = require("bcrypt-nodejs");
var Tweet = require("../models/tweets.model");
var tweet_followsController = require("../controllers/tweet_followsController");
var Follower = require("../models/follower.model");
var Following = require("../models/following.model");





function commands(req, res) {

    var params = req.body;
    var fact = params.commands.split(" ");
    var string = fact[0];

    switch (string) {
        case "register":
            register(req, res, fact);
            break
        case "login":
            login(req, res, fact);
            break
            //console.log('23232');
        case "add_tweet":
            tweet_followsController.add_tweet(req, res, fact);
            break
        case "delete_tweet":
            tweet_followsController.delete_tweet(req, res, fact);
            break
        case "edit_tweet":
            tweet_followsController.edit_tweet(req, res, fact);
            break
        case "view_tweet":
            tweet_followsController.view_tweet(req, res, fact);
            break
        case "follow":
            tweet_followsController.follow(req, res, fact);
            break
        case "unfollow":
            tweet_followsController.unfollow(req, res, fact);
            break
        case "profile":
            profile(req, res, fact);
            break
        // 
        //
    }
}

function register(req, res, fact) {

    var user = new User();
    var tweet = new Tweet();
    var follower = new Follower();
    var following = new Following();

    if (fact[1] && fact[2] && fact[3] && fact[4]) {

        user.name = fact[1]
        user.email = fact[2]
        user.username = fact[3]
        user.password = fact[4]

        User.find({ username: user.username }).exec((err, users) => {

            if (err) return res.status(500).send({ message: "Error al hacer la peticion" });
            if (users && users.length >= 1) {
                return res.status(200).send({ message: "Este usuario ya existe" });
            } else {
                bcrypt.hash(user.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ message: "Error en la peticion al guardar" });
                        if (usuarioGuardado) {
                            tweet.username = user.username
                            tweet.tweets = []
                            tweet.save((err, saved) => {
                                if (err) return res.status(500).send({ message: "Error no se ha podido generar tweets" });
                                if (!saved) return res.status(400).send({ message: "No se ha podido crear tweets" });
                            })
                            follower.username = user.username
                            follower.followers = []
                            follower.save((err, saved) => {
                                if (err) return res.status(500).send({ message: "Error no se ha podido generar followers" });
                                if (!saved) return res.status(400).send({ message: "No se ha podido crear followers" });
                            })
                            following.username = user.username
                            following.followings = []
                            following.save((err, saved) => {
                                if (err) return res.status(500).send({ message: "Error no se hapodido generar followings" });
                                if (!saved) return res.status(400).send({ message: "No se ha podido crear followings" });
                            })
                            return res.status(200).send({ user: usuarioGuardado });
                        } else {
                            return res.status(200).send({ message: "No se pudo registar el usuario" });
                        }
                    });
                });
            }

        });

    } else {
        return res.status(500).send({ message: "Por favor ingrese todos los datos en la linea de comandos" });
    }
}


function login(req, res, fact) {

    var username = fact[1];
    var email = fact[1];
    var password = fact[2];

    if (fact[3]) {
        var gettoken = fact[3].toLowerCase() == "true" ? true : false
    } else {
        return res.status(500).send({ message: "Por favor de generar (true) en la linea de comandos" });
    }

    User.findOne({ $or: [{ username: username, }, { email: email, }] }, (err, usuario) => {
        if (err) return res.status(500).send({ message: "Error en la peticion" })
        if (usuario) {
            bcrypt.compare(password, usuario.password, (err, check) => {
                if (check) {
                    if (gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(usuario)
                        })
                    }
                    else {

                        return res.status(200).send({ error: "El comando que ingreso no es valido" });
                    }
                }
                else {
                    return res.status(404).send({ message: "No se ha encontrado al usuario" });
                }
            });
        }
        else {
            return res.status(500).send({ message: "No has podido ingresar vuelve a intentarlo" });
        }
    });

}



function profile(req, res, fact) {

    var nickname = fact[1];


    if (nickname) {

        User.findOne({ username: nickname }, (err, user) => {

            if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
            if (!user) return res.status(404).send({ error: "No existe el usuario" });
            if (user) {
                Tweet.findOne({ username: nickname }, (err, tweets) => {
                    if (err) return res.status(500).send({ error: "No se pudo realizar la peticion" });
                    if (!tweets) return res.status(404).send({ error: "no se han encontrado los tweets" });
                    if (tweets) {
                        user.password = undefined
                        tweets.username = undefined
                        return res.status(200).send({ profile: user, tweets });


                    }
                });

            }
        });

    } else {

        return res.status(500).send({ error: "No has enviado el campo necesario" });

    }
}


module.exports = {
    commands

}
