'use strict'

var express = require('express');
var api = express.Router();
var userController = require('../controllers/user.Controller');
var md_auth = require('../middlewares/authenticated');


api.post('/commands', md_auth.ensureAuth, userController.commands);

module.exports = api;

