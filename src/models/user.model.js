'use strict'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name : String,
    email: String,
    username: String,
    password: String,
    
    
    no_following: Number,
    no_followers: Number,
    no_tweets: Number
})

module.exports = mongoose.model("user", UserSchema);
