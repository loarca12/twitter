'use strict'

var mongoose = require('mongoose');
var app = require('./app');

mongoose.Promise = global.Promise 
mongoose.connect('mongodb://localhost:27017/twitter2016450', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() =>{
    console.log('Conexion a la base de datos correctamente');
    app.set('port', process.env.PORT || 3050);
    app.listen(app.get('port'),()=>{
        console.log(`El servidor esta corriendo : ${app.get('port')}`);
    })
}).catch(err => console.error(err));