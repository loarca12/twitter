'user strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowingSchema = Schema({
    username: String,
    
    
    followings: [{
        username: String
    }]
})

module.exports = mongoose.model('following', FollowingSchema);