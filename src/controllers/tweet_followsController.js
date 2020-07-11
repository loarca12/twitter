'use strict'

var Tweet = require("../models/tweets.model");
var User = require("../models/user.model");
var Follower = require("../models/follower.model");
var Following = require("../models/following.model");


function add_tweet(req, res, fact) {

    var owner = req.user.username;
    fact.splice(0, 1);
    var descripcion = fact.join(" ");

   
    if (descripcion) {

        Tweet.findOneAndUpdate({ username: owner }, { $push: { tweets: { description: descripcion } } }, { new: true }, (err, updateTweet) => {

            if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
            if (!updateTweet) return res.status(404).send({ error: "No se ha podido agregar el tweet" });
            if (updateTweet) {

                User.findOneAndUpdate({ username: owner }, { $inc: { "no_tweets": 1 } }, { new: true }, (err, tweetInc) => {

                    if (err) return res.status(500).send({ error: "No se ha podido realizar esta peticion.." });
                    if (!tweetInc) return res.status(404).send({ error: "No se ha podido agregar el tweet" });
                    if (tweetInc) return res.status(200).send({ tweet: updateTweet });

                });
            }

        });

    } else {
        return res.status(500).send({ error: "Por favor envia los campos necesarios" });
    }

}


function delete_tweet(req, res, fact) {

    var owner = req.user.username;
    var tweetId = fact[1];

    
    if (tweetId) {
        Tweet.findOne({ 'tweets._id': tweetId }, { new: true }, (err, tweetFinded) => {
            if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
            if (!tweetFinded) return res.status(404).send({ error: "No se ha encontrado el tweet" });
            if (tweetFinded) {

                Tweet.findOneAndUpdate({ username: owner }, { $pull: { tweets: { _id: tweetId } } }, { new: true }, (err, deleteTweet) => {

                    if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion.." });
                    if (!deleteTweet) return res.status(404).send({ error: "No se ha podido eliminar el tweet" });
                    if (deleteTweet) {

                        User.findOneAndUpdate({ username: owner }, { $inc: { "no_tweets": -1 } }, { new: true }, (err, tweetInc) => {

                            if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                            if (!tweetInc) return res.status(404).send({ error: "No se ha podido decrementar los tweets" });
                            if (tweetInc) return res.status(200).send({ tweetEliminado: deleteTweet });

                        });
                    }

                });

            }
        });

    } else {
        return res.status(500).send({ error: "Por favor envia los campos necesarios" });
    }


}

function edit_tweet(req, res, fact) {

    var owner = req.user.username;
    var tweetId = fact[1];
    fact.splice(0, 2);
    var descripcion = fact.join(" ");

   
    if (descripcion) {

        Tweet.findOneAndUpdate({ username: owner, 'tweets._id': tweetId }, { "$set": { "tweets.$.description": descripcion } }, { new: true }, (err, updateTweet) => {


            if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
            if (!updateTweet) return res.status(404).send({ error: "No se ha podido editar el tweet" });
            if (updateTweet) return res.status(200).send({ tweets: updateTweet });

        });

    } else {
        return res.status(500).send({ error: "Por favor envia los campos necesarios" });
    }

}


function view_tweet(req, res, fact) {

    var nickname = fact[1];

   
    if (nickname) {

        Tweet.findOne({ username: nickname }, (err, tweets) => {

            if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
            if (!tweets) return res.status(404).send({ error: "No existe el usuario" });
            if (tweets) return res.status(200).send({ tweetActualizado: tweets });

        });

    } else {

        return res.status(500).send({ error: "Por favor envia los campos necesarios" });

    }

}


function follow(req, res, fact) {

    
    var owner = req.user.username;
    var nickname = fact[1];

    
    if (nickname) {
        if (owner == nickname) {
            return res.status(200).send({ error: "Esta opcion no es valida" });
        } else {
            Following.findOne({ username: owner, 'followings.username': nickname }, (err, followingUser) => {

                if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                if (followingUser) return res.status(404).send({ error: "Ya sigues a este usuario" });
                if (!followingUser) {

                    User.findOne({ username: nickname }, (err, findUser) => {

                        if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                        if (!findUser) return res.status(404).send({ error: "El usuario que quieres seguir no existe" });
                        if (findUser) {

                            Following.findOneAndUpdate({ username: owner }, { $push: { followings: { username: nickname } } }, { new: true }, (err, updateFollowing) => {

                                if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                                if (!updateFollowing) return res.status(404).send({ error: "No has podido seguir al usuario" });
                                if (updateFollowing) {

                                    User.findOneAndUpdate({ username: owner }, { $inc: { "no_following": 1 } }, { new: true }, (err, followingInc) => {

                                        if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                                        if (!followingInc) return res.status(404).send({ error: "No se ha podido agregar el usuario" });
                                        if (followingInc) {

                                            Follower.findOneAndUpdate({ username: nickname }, { $push: { followers: { username: owner } } }, { new: true }, (err, updateFollower) => {

                                                if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                                                if (!updateFollower) return res.status(404).send({ error: "No se ha podido agregar al seguidor" });
                                                if (updateFollower) {
                                                    User.findOneAndUpdate({ username: nickname }, { $inc: { "no_followers": 1 } }, { new: true }, (err, followerInc) => {

                                                        if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                                                        if (!followerInc) return res.status(404).send({ error: "No se ha podido aumentar los seguidores" });
                                                        if (followerInc) return res.status(200).send({ followings: updateFollowing });
                                                    });
                                                }

                                            });

                                        }

                                    });
                                }

                            })

                        }

                    })
                }

            })
        }
    } else {
        return res.status(500).send({ error: "por favor llena los campos" });
    }
}

function unfollow(req, res, fact) {

    
    var owner = req.user.username;
    var nickname = fact[1];

    
    if (nickname) {
        if (owner == nickname) {
            return res.status(200).send({ error: "Esta opcion no es valida" });
        } else {
            Following.findOne({ username: owner, 'followings.username': nickname }, (err, followingUser) => {

                if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                if (!followingUser) return res.status(404).send({ error: "No puedes dejar de seguir a alguien que no sigues" });
                if (followingUser) {

                    User.findOne({ username: nickname }, (err, findUser) => {

                        if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                        if (!findUser) return res.status(404).send({ error: "El usuario que quieres seguir no existe" });
                        if (findUser) {

                            Following.findOneAndUpdate({ username: owner }, { $pull: { followings: { username: nickname } } }, { new: true }, (err, updateFollowing) => {

                                if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion"});
                                if (!updateFollowing) return res.status(404).send({ error: "No se ha podido dejar de seguir al usuario"});
                                if (updateFollowing) {

                                    User.findOneAndUpdate({ username: owner }, { $inc: { "no_following": -1 } }, (err, followingInc) => {

                                        if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion"});
                                        if (!followingInc) return res.status(404).send({ error: "No se ha podido dejar de seguir al usuario" });
                                        if (followingInc) {

                                            Follower.findOneAndUpdate({ username: nickname }, { $pull: { followers: { username: owner } } }, (err, updateFollower) => {

                                                if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                                                if (!updateFollower) return res.status(404).send({ error: "No has podido dejar de seguir al usuario" });
                                                if (updateFollower) {
                                                    User.findOneAndUpdate({ username: nickname }, { $inc: { "no_followers": -1 } }, (err, followerInc) => {

                                                        if (err) return res.status(500).send({ error: "No se pudo realizar esta peticion" });
                                                        if (!followerInc) return res.status(404).send({ error: "No se ha podido decrementar los seguidos" });
                                                        if (followerInc) return res.status(200).send({ followings: updateFollowing });
                                                    });
                                                }

                                            });

                                        }

                                    });
                                }

                            });

                        }

                    });
                }

            });
        }
    } else {
        return res.status(500).send({ error: "Por favor envia los campos necesarios" });
    }
}




module.exports = {
    add_tweet,
    delete_tweet,
    edit_tweet,
    view_tweet,
    follow,
    unfollow
}