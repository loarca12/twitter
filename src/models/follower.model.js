'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowerSchema = Schema({
    username: String,
    
    
    followers: [{
        username: String,
    }]
})

module.exports = mongoose.model('follower', FollowerSchema);