'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TweetSchema = Schema({
    username: String,
    
    
    tweets: [{
        description: String
    }]
})

module.exports = mongoose.model('tweet', TweetSchema);
