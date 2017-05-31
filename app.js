var express = require('express');
var mongoose = require('mongoose');

var setting = require('./config/setting');
var index = require('./routes/index');

var app = express();
var server = app.listen(setting.port);
var io = require('socket.io')(server);

mongoose.Promise = global.Promise;
mongoose.connect(setting.mongodb);
mongoose.connection.on('open', () => {
    console.log('MongoDB Connection Successed!');
});
mongoose.connection.on('error', () => {
    console.log('MongoDB Connection Error!');
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use((req, res, next) => {
    res.io = io;
    next();
});

app.use('/', index);
app.use('/assets/', express.static('./assets'));

console.log('Server running at http://127.0.0.1:' + setting.port + '/');